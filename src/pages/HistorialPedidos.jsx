import { useEffect, useState } from "react";
import axios from "axios";

export default function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const usuario = storedUser ? JSON.parse(storedUser) : {};
    const idUsuario = usuario.idUsuario;

    axios
      .get(`/api/pedidos/usuario/${idUsuario}`, {
        headers: { "x-api-key": "lvlupgamer1306" },
      })
      .then((res) => {
        setPedidos(res.data.data || []);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  if (cargando)
    return (
      <div className="container my-5">
        <p>Cargando historial...</p>
      </div>
    );

  if (!pedidos.length)
    return (
      <div className="container my-5">
        <h2>Historial de Pedidos</h2>
        <p>No tienes pedidos registradas hasta ahora.</p>
      </div>
    );

  return (
    <div className="container my-5">
      <h2>Historial de compras</h2>
      <ul className="list-group">
        {pedidos.map((pedido) => (
          <li key={pedido.idPedido} className="list-group-item mb-3">
            <div>
              <strong>Pedido #{pedido.idPedido}</strong> &nbsp;
              <span className="badge bg-secondary">{pedido.estado}</span>
              <br />
              <span>
                <b>Fecha:</b> {new Date(pedido.fechaPedido).toLocaleString()}
              </span>
              <br />
              <span>
                <b>Retiro:</b> {pedido.metodoRetiro ?? "No registrado"}
              </span>
              {" | "}
              <span>
                <b>Pago:</b> {pedido.metodoPago ?? "No registrado"}
              </span>
              <br />
              <span>
                <b>Total pagado:</b> ${pedido.total.toLocaleString("es-CL")}
              </span>
            </div>
            <div className="mt-2">
              <strong>Productos:</strong>
              <ul>
                {pedido.detalles.map((detalle, idx) => (
                  <li key={detalle.idProducto + "-" + idx}>
                    {detalle.cantidad}x Producto #{detalle.idProducto} a&nbsp;
                    ${detalle.precioUnitario.toLocaleString("es-CL")}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
