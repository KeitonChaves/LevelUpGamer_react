import { useState, useEffect } from "react";
import axios from "axios";
import FooterComponent from "../components/FooterComponent";
import "../styles/cardsIndex.css";
import CarruselComponent from "../components/CarruselComponent";

function CardProducto({ producto, onVerMas }) {
  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className="card h-100">
        <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
        <div className="card-body d-flex flex-column">
          <h5>{producto.nombre}</h5>
          <span>{producto.codigo}</span>
          <p>{producto.descripcion}</p>
          <strong>${producto.precio.toLocaleString('es-CL')}</strong>
          <button className="btn btn-primary mt-auto" onClick={() => onVerMas(producto)}>Ver más</button>
        </div>
      </div>
    </div>
  );
}

function ModalProducto({ producto, onClose }) {
  if (!producto) return null;
  return (
    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }} tabIndex="-1" aria-modal="true" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{producto.nombre}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <img src={producto.imagen} className="img-fluid mb-3" alt={producto.nombre} />
            <p>{producto.descripcion}</p>
            <strong>${producto.precio}</strong>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [modalProducto, setModalProducto] = useState(null);
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    // Puedes cambiar el endpoint para traer solo algunos productos destacados por tu lógica
    axios.get("/api/productos/disponibles", {
      headers: { "x-api-key": "lvlupgamer1306" }
    })
      .then(res => {
        // Selecciona los destacados como prefieras, aquí por ejemplo los primeros 8
        const destacados = res.data.data.slice(0, 8).map(p => ({
          ...p,
          imagen: `/api/productos/imagen/${p.idProducto}`
        }));
        setProductosDestacados(destacados);
      })
      .catch(err => {
        setProductosDestacados([]);
      });
  }, []);

  return (
    <>
      {/* Carrusel */}
      <CarruselComponent />

      {/* Sección de productos */}
      <section className="container mt-6 mb-6">
        <h3 className="mb-4">🎮 Productos Destacados</h3>
        <div className="row g-4 justify-content-center">
          {productosDestacados.map(prod => (
            <CardProducto key={prod.idProducto} producto={prod} onVerMas={setModalProducto} />
          ))}
        </div>
      </section>

      {/* Modal */}
      <ModalProducto producto={modalProducto} onClose={() => setModalProducto(null)} />

      {/* Footer */}
      <FooterComponent />
    </>
  );
}
