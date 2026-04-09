import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductoForm() {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    idCategoria: "",
    urlImagen: "",
    activo: true,
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(data.data);
      } catch (error) {
        console.error("Error cargando categorías", error);
      }
    };
    fetchCategorias();

    if (id) {
      const fetchProducto = async () => {
        try {
          const token = localStorage.getItem("token");
          const { data } = await axios.get(`/api/productos/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const prod = data.data;
          setProducto({
            nombre: prod.nombre || "",
            descripcion: prod.descripcion || "",
            precio: prod.precio || 0,
            stock: prod.stock || 0,
            idCategoria: prod?.idCategoria || prod?.categoria?.idCategoria || "",
            urlImagen: prod.urlImagen || "",
            activo: prod.activo ?? true,
          });
        } catch (error) {
          console.error("Error cargando producto", error);
        }
      };
      fetchProducto();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleCategoriaChange = (e) => {
    setProducto((prev) => ({ ...prev, idCategoria: e.target.value }));
  };

  const handleImagenChange = (e) => {
    setImagenFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // 1. Actualizar datos productos (sin imagen)
      await axios.put(`/api/productos/${id}`, producto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // 2. Si hay imagen nueva, actualizar imagen por separado
      if (imagenFile) {
        const formData = new FormData();
        formData.append("imagen", imagenFile);

        await axios.put(`/api/productos/${id}/imagen`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/admin/productos");
    } catch (error) {
      console.error("Error guardando producto", error);
      alert("Ocurrió un error al guardar el producto");
    }
  };

  return (
    <div>
      <h2>{id ? "Editar Producto" : "Nuevo Producto"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input name="nombre" value={producto.nombre} onChange={handleChange} required />
        <br />

        <label>Descripción:</label>
        <textarea name="descripcion" value={producto.descripcion} onChange={handleChange} required />
        <br />

        <label>Precio:</label>
        <input type="number" name="precio" value={producto.precio} onChange={handleChange} required />
        <br />

        <label>Stock:</label>
        <input type="number" name="stock" value={producto.stock} onChange={handleChange} required />
        <br />

        <label>Categoría:</label>
        <select value={producto.idCategoria} onChange={handleCategoriaChange} required>
          <option value="">Seleccione</option>
          {categorias.map((c) => (
            <option key={c.idCategoria} value={c.idCategoria}>
              {c.nombre}
            </option>
          ))}
        </select>
        <br />

        <label>URL Imagen:</label>
        <input name="urlImagen" value={producto.urlImagen} onChange={handleChange} />
        <br />

        <label>Imagen:</label>
        <input type="file" accept="image/*" onChange={handleImagenChange} />
        <br />

        <label>Activo:</label>
        <input
          type="checkbox"
          checked={producto.activo}
          onChange={(e) => setProducto((prev) => ({ ...prev, activo: e.target.checked }))}
        />
        <br />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
