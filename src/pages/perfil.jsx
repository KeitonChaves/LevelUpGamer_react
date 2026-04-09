import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FooterComponent from "../components/FooterComponent";
import axios from "axios";

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    telefono: "",
  });
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [fotoBase64, setFotoBase64] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        Swal.fire({
          icon: "warning",
          title: "No has iniciado sesión",
          text: "Por favor inicia sesión para ver tu perfil",
          confirmButtonColor: "#9b59b6",
        });
        navigate("/login");
        return;
      }
      const userLocal = JSON.parse(storedUser);
      try {
        // ⭐ CORRECCIÓN 1: Agregar /email/ antes del email
        const response = await axios.get(
          `/api/usuarios/email/${userLocal.email}`,
          { headers: { "x-api-key": "lvlupgamer1306" } }
        );
        setUsuario(response.data);
        setFormData({
          nombre: response.data.nombre || "",
          email: response.data.email || "",
          direccion: response.data.direccion || "",
          telefono: response.data.telefono || "",
        });
        localStorage.setItem("user", JSON.stringify(response.data));
        
        // Cargar foto
        const fotoResponse = await axios.get(
          `/api/usuarios/${response.data.idUsuario}/foto`,
          {
            headers: { "x-api-key": "lvlupgamer1306" },
            responseType: "arraybuffer",
          }
        );
        const base64 = btoa(
          new Uint8Array(fotoResponse.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        const contentType = fotoResponse.headers["content-type"];
        setFotoBase64(`data:${contentType};base64,${base64}`);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        setUsuario(userLocal);
        setFormData({
          nombre: userLocal.nombre || "",
          email: userLocal.email || "",
          direccion: userLocal.direccion || "",
          telefono: userLocal.telefono || "",
        });
      }
    };
    fetchUser();
  }, [navigate]);

  const calcularNivel = (puntos) => {
    if (puntos < 100)
      return { nivel: "Bronce", progreso: puntos, siguiente: 100, color: "#CD7F32" };
    if (puntos < 500)
      return { nivel: "Plata", progreso: puntos - 100, siguiente: 500, color: "#C0C0C0" };
    if (puntos < 1000)
      return { nivel: "Oro", progreso: puntos - 500, siguiente: 1000, color: "#FFD700" };
    if (puntos < 2500)
      return { nivel: "Platino", progreso: puntos - 1000, siguiente: 2500, color: "#E5E4E2" };
    return { nivel: "Diamante", progreso: puntos - 2500, siguiente: 5000, color: "#B9F2FF" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    setNuevaFoto(e.target.files[0]);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.email.trim()) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Nombre y correo son obligatorios",
        confirmButtonColor: "#e74c3c",
      });
      return;
    }
    try {
      await axios.put(
        `/api/usuarios/${usuario.idUsuario}`,
        {
          ...usuario,
          nombre: formData.nombre,
          email: formData.email,
          direccion: formData.direccion,
          telefono: formData.telefono,
        },
        { headers: { "x-api-key": "lvlupgamer1306" } }
      );
      
      if (nuevaFoto) {
        const formImage = new FormData();
        formImage.append("foto", nuevaFoto);
        await axios.patch(
          `/api/usuarios/${usuario.idUsuario}/foto`,
          formImage,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-api-key": "lvlupgamer1306",
            },
          }
        );
        
        // Recargar foto
        const fotoResponse = await axios.get(
          `/api/usuarios/${usuario.idUsuario}/foto`,
          {
            headers: { "x-api-key": "lvlupgamer1306" },
            responseType: "arraybuffer",
          }
        );
        const base64 = btoa(
          new Uint8Array(fotoResponse.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        const contentType = fotoResponse.headers["content-type"];
        setFotoBase64(`data:${contentType};base64,${base64}`);
      }
      
      Swal.fire({
        icon: "success",
        title: "¡Perfil actualizado!",
        confirmButtonColor: "#2ecc71",
      });
      
      // ⭐ CORRECCIÓN 2: Agregar /email/ antes del email
      const refreshed = await axios.get(
        `/api/usuarios/email/${usuario.email}`,
        { headers: { "x-api-key": "lvlupgamer1306" } }
      );
      setUsuario(refreshed.data);
      setFormData({
        nombre: refreshed.data.nombre || "",
        email: refreshed.data.email || "",
        direccion: refreshed.data.direccion || "",
        telefono: refreshed.data.telefono || "",
      });
      setNuevaFoto(null);
      setEditMode(false);
      localStorage.setItem("user", JSON.stringify(refreshed.data));
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: error.response?.data || "Intenta más tarde",
      });
    }
  };

  if (!usuario) return null;

  const nivelInfo = calcularNivel(usuario.puntos || 0);
  const porcentajeProgreso = (nivelInfo.progreso / nivelInfo.siguiente) * 100;

  return (
    <>
      <div className="container my-5">
        <div className="row">
          {/* Panel de Gamificación */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-lg border-0 profile-card">
              <div className="card-body text-center">
                <div className="avatar-container mb-3">
                  {usuario && (
                    <img
                      src={fotoBase64 || '/default-avatar.png'}
                      alt="Foto de perfil"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </div>
                <h3 className="fw-bold">{usuario.nombre}</h3>
                <p className="text-muted">{usuario.email}</p>
                <div
                  className="nivel-badge my-3 p-3 rounded"
                  style={{ backgroundColor: nivelInfo.color + "30", border: `2px solid ${nivelInfo.color}` }}
                >
                  <h4 className="mb-1" style={{ color: nivelInfo.color }}>
                    <i className="bi bi-trophy-fill"></i> {nivelInfo.nivel}
                  </h4>
                  <p className="mb-0 fw-bold" style={{ fontSize: "1.5rem" }}>
                    {usuario.puntos || 0} Puntos
                  </p>
                </div>
                <div className="mt-3">
                  <p className="small mb-1">Progreso al siguiente nivel</p>
                  <div className="progress" style={{ height: "20px" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      style={{ width: `${porcentajeProgreso}%`, backgroundColor: nivelInfo.color }}
                    >
                      {Math.round(porcentajeProgreso)}%
                    </div>
                  </div>
                  <p className="small text-muted mt-1">
                    {nivelInfo.progreso} / {nivelInfo.siguiente} puntos
                  </p>
                </div>
                <div className="mt-4 p-3 bg-dark text-white rounded">
                  <p className="small mb-1">Tu código de referido:</p>
                  <h5 className="mb-0 text-success">
                    {usuario.codigoReferido || "LEVELUP" + usuario.nombre.substring(0, 3).toUpperCase()}
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-light mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(usuario.codigoReferido || "LEVELUP");
                      Swal.fire({
                        icon: "success",
                        title: "¡Copiado!",
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    }}
                  >
                    <i className="bi bi-clipboard"></i> Copiar código
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Información y Edición */}
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-gear-fill"></i> Mi Información
                </h4>
                {!editMode && (
                  <button className="btn btn-outline-light btn-sm" onClick={() => setEditMode(true)}>
                    <i className="bi bi-pencil-fill"></i> Editar
                  </button>
                )}
              </div>
              <div className="card-body">
                {!editMode ? (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Nombre completo</label>
                        <p className="form-control-plaintext">{usuario.nombre}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Correo electrónico</label>
                        <p className="form-control-plaintext">{usuario.email}</p>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Dirección</label>
                        <p className="form-control-plaintext">{usuario.direccion || "No especificada"}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Teléfono</label>
                        <p className="form-control-plaintext">{usuario.telefono || "No especificado"}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <form>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Nombre completo</label>
                          <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Correo electrónico</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Dirección</label>
                          <input
                            type="text"
                            className="form-control"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Teléfono</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <label className="form-label fw-bold">Cambiar foto de perfil</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={handleFotoChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-success" onClick={handleSaveChanges}>
                          <i className="bi bi-check-circle"></i> Guardar cambios
                        </button>
                        <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                          <i className="bi bi-x-circle"></i> Cancelar
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Nuevo Panel - Botón Mis Pedidos */}
            <div className="card shadow-lg border-0 mt-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-bag-check-fill"></i> Mis Pedidos
                </h5>
              </div>
              <div className="card-body">
                <button className="btn btn-primary" onClick={() => navigate("/historial")}>
                  <i className="bi bi-bag-check-fill"></i> Ver mis pedidos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
