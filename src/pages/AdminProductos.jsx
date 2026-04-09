import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/productos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductos(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar productos", error);
        setError("No se pudieron cargar los productos");
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const eliminarProducto = async (idProducto) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/productos/${idProducto}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductos(productos.filter((p) => p.idProducto !== idProducto));
      } catch (error) {
        console.error("Error al eliminar producto", error);
        alert("No se pudo eliminar el producto");
      }
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Listado de Productos</h2>
      <Link to="/admin/productos/nuevo" className="btn btn-primary mb-3">
        Agregar Producto
      </Link>
      {/* revisar api productos para add producto */}

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th style={{ width: "150px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.idProducto}>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>${p.precio.toLocaleString("es-CL")}</td>
                <td>{p.stock}</td>
                <td>{p.nombreCategoria}</td>
                <td>
                  <Link
                    to={`/admin/productos/editar/${p.idProducto}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => eliminarProducto(p.idProducto)}
                    className="btn btn-sm btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No hay productos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
