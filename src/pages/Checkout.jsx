import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles/checkout.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalConDescuento, setTotalConDescuento] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // NUEVO: estados para retiro y pago
  const [metodoRetiro, setMetodoRetiro] = useState("retiro"); // retiro/envío
  const [metodoPago, setMetodoPago] = useState("transferencia"); // transferencia/efectivo

  useEffect(() => {
    // Leer carrito desde localStorage
    const guardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(guardado);

    // Leer usuario y calcular descuento DUOC UC de forma segura
    const storedUser = localStorage.getItem("user");
    const correo = storedUser ? JSON.parse(storedUser).email || "" : "";
    const desc = correo.toLowerCase().endsWith("@duocuc.cl") ? 0.2 : 0;
    setDescuento(desc);

    // Calcular totales
    const t = guardado.reduce(
      (acc, item) =>
        acc +
        (item.precio ? Number(item.precio) : 0) *
          (item.cantidad ? Number(item.cantidad) : 0),
      0
    );
    setTotal(t);
    setTotalConDescuento(t - t * desc);

    // Detectar modo oscuro actual
    const temaGuardado = localStorage.getItem("theme");
    setDarkMode(temaGuardado === "dark");

    // Escuchar cambios de tema en body
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains("bg-dark"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const finalizarCompra = () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: "Carrito vacío",
        text: "No hay productos para pagar.",
        icon: "info",
        background: darkMode ? "#2c2c2c" : "#fff",
        color: darkMode ? "#eee" : "#000",
      });
      return;
    }

    // Obtener idUsuario y dirección del usuario
    const storedUser = localStorage.getItem("user");
    const usuario = storedUser ? JSON.parse(storedUser) : {};
    const idUsuario = usuario.idUsuario;
    const direccion = usuario.direccion || "No especificada";

    // Armar objeto PedidoRequest para enviar al backend
    const pedido = {
      idUsuario,
      total: descuento > 0 ? totalConDescuento : total,
      direccion,
      metodoRetiro,   // Nuevo campo
      metodoPago,     // Nuevo campo
      detalles: carrito.map((item) => ({
        idProducto: item.idProducto ?? item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      })),
    };

    // Registrar pedido en backend API /api/pedidos
    axios
      .post("/api/pedidos", pedido, {
        headers: { "x-api-key": "lvlupgamer1306" },
      })
      .then((res) => {
        Swal.fire({
          title: "¡Compra realizada!",
          html: `
            <p>Gracias por tu compra 🛍️</p>
            <p><strong>Total pagado:</strong> $${pedido.total.toLocaleString("es-CL")}</p>
            <p><strong>Método de retiro:</strong> ${metodoRetiro === "retiro" ? "Retiro en tienda" : "Envío a domicilio"}</p>
            <p><strong>Método de pago:</strong> ${metodoPago === "transferencia" ? "Transferencia bancaria" : "Efectivo al retirar"}</p>
            ${descuento > 0 ? "<p class='text-success'>(Descuento DUOCUC aplicado)</p>" : ""}
          `,
          icon: "success",
          confirmButtonText: "Aceptar",
          background: darkMode ? "#2c2c2c" : "#fff",
          color: darkMode ? "#eee" : "#000",
        }).then(() => {
          // Limpiar carrito local
          localStorage.removeItem("carrito");
          setCarrito([]);
          setTotal(0);
          setTotalConDescuento(0);

          // Redirigir al home
          navigate("/");
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error al registrar el pedido",
          text: err.response?.data?.message || "Intenta más tarde",
          background: darkMode ? "#2c2c2c" : "#fff",
          color: darkMode ? "#eee" : "#000",
        });
      });
  };

  if (carrito.length === 0) {
    return (
      <div className={`container my-5 ${darkMode ? "text-light" : "text-dark"}`}>
        <h1>Carrito vacío</h1>
        <p>No hay productos para pagar.</p>
      </div>
    );
  }

  return (
    <div className={`container my-5 ${darkMode ? "text-light" : "text-dark"}`}>
      <h1>Detalle de la compra 🛒</h1>

      {/* Nuevo: Métodos de retiro y pago */}
      <div className="row g-4 mb-3">
        <div className="col-md-6">
          <label className="form-label">Método de retiro</label>
          <select className="form-select" value={metodoRetiro} onChange={e => setMetodoRetiro(e.target.value)}>
            <option value="retiro">Retiro en tienda</option>
            <option value="envio">Envío a domicilio</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Método de pago</label>
          <select className="form-select" value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="efectivo">Efectivo al retirar</option>
          </select>
        </div>
      </div>

      <ul className="list-group mb-3">
        {carrito.map((item) => (
          <li
            key={item.idProducto ?? item.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              darkMode ? "bg-dark text-light border-secondary" : ""
            }`}
          >
            <div className="d-flex align-items-center">
              <img
                src={item.imagen}
                alt={item.nombre}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  marginRight: "15px",
                  borderRadius: "5px",
                }}
              />
              <div>
                <span>{item.nombre}</span>
                <br />
                <small className={`${darkMode ? "text-light" : "text-dark"}`}>
                  Cantidad: {item.cantidad}
                </small>
              </div>
            </div>
            <span className={`${darkMode ? "text-light" : "text-dark"}`}>
              ${(item.precio * item.cantidad).toLocaleString("es-CL")}
            </span>
          </li>
        ))}
      </ul>

      <div className="text-end mb-3">
        <strong>Total: ${total.toLocaleString("es-CL")}</strong>
        {descuento > 0 && (
          <div className="text-success">
            Total con descuento: ${totalConDescuento.toLocaleString("es-CL")}
          </div>
        )}
      </div>

      <div className="text-end">
        <button className="btn btn-success" onClick={finalizarCompra}>
          Finalizar compra
        </button>
      </div>
    </div>
  );
}
