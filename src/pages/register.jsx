import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import "../styles/registrarseForm.css";

export default function RegisterComponent() {
  // Estados locales para nuevos campos agregados
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmContrasena, setConfirmContrasena] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [idRol, setIdRol] = useState("1"); // Ejemplo rol default = 1
  const [codigoReferido, setCodigoReferido] = useState("");
  const [foto, setFoto] = useState(null);

  const validarRegistro = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (
      !nombre ||
      !rut ||
      !email ||
      !direccion ||
      !contrasena ||
      !confirmContrasena ||
      !fechaNacimiento ||
      !idRol ||
      !foto
    ) {
      Swal.fire({
        title: "Error",
        text: "Por favor completa todos los campos obligatorios.",
        icon: "error",
      });
      return;
    }

    if (contrasena !== confirmContrasena) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden.",
        icon: "error",
      });
      return;
    }

    // Preparar FormData
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("rut", rut);
    formData.append("email", email);
    formData.append("direccion", direccion);
    formData.append("contrasena", contrasena);
    formData.append("fechaNacimiento", fechaNacimiento); // yyyy-MM-dd formato string
    formData.append("idRol", idRol);
    formData.append("codigoReferido", codigoReferido);
    formData.append("foto", foto);

    try {
      //
      const response = await axios.post(
        "/api/usuarios/registro",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-key": "lvlupgamer1306",
          },
        }
      );

      Swal.fire({
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada correctamente 🎮",
        icon: "success",
      });

      // Limpiar formulario
      setNombre("");
      setRut("");
      setEmail("");
      setDireccion("");
      setContrasena("");
      setConfirmContrasena("");
      setFechaNacimiento("");
      setIdRol("1");
      setCodigoReferido("");
      setFoto(null);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data || "Error al registrar usuario",
        icon: "error",
      });
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
      <div className="form-box text-center p-4 rounded shadow-lg bg-body-tertiary">
        <h2 className="fw-bold mb-2">Crea tu cuenta</h2>
        <p>Únete a LevelUpGamer 🚀</p>

        <form onSubmit={validarRegistro} encType="multipart/form-data">
          {/* Nombre */}
          <div className="mb-3 text-start">
            <label htmlFor="nombre" className="form-label">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Rut */}
          <div className="mb-3 text-start">
            <label htmlFor="rut" className="form-label">RUT</label>
            <input
              type="text"
              id="rut"
              className="form-control"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Dirección */}
          <div className="mb-3 text-start">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input
              type="text"
              id="direccion"
              className="form-control"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>

          {/* Fecha de nacimiento */}
          <div className="mb-3 text-start">
            <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              className="form-control"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>

          {/* IdRol */}
          <div className="mb-3 text-start">
            <label htmlFor="idRol" className="form-label">Rol</label>
            <select
              id="idRol"
              className="form-control"
              value={idRol}
              onChange={(e) => setIdRol(e.target.value)}
            >
              <option value="1">Usuario</option>
              <option value="2">Administrador</option>
              {/* Agrega más roles según tu backend */}
            </select>
          </div>

          {/* Código referido (opcional) */}
          <div className="mb-3 text-start">
            <label htmlFor="codigoReferido" className="form-label">Código referido (opcional)</label>
            <input
              type="text"
              id="codigoReferido"
              className="form-control"
              value={codigoReferido}
              onChange={(e) => setCodigoReferido(e.target.value)}
            />
          </div>

          {/* Contraseña */}
          <div className="mb-3 text-start">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              className="form-control"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-3 text-start">
            <label htmlFor="confirmContrasena" className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmContrasena"
              className="form-control"
              value={confirmContrasena}
              onChange={(e) => setConfirmContrasena(e.target.value)}
            />
          </div>

          {/* Foto */}
          <div className="mb-3 text-start">
            <label htmlFor="foto" className="form-label">Foto</label>
            <input
              type="file"
              id="foto"
              accept="image/*"
              className="form-control"
              onChange={(e) => setFoto(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-gamer w-100">Registrarse</button>
        </form>

        <p className="mt-3">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-decoration-none text-success">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
