import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { REGISTRAR_USER, LOGIN, RECUPERAR_CONTRASENA } from "../../api/registro";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [telefonoPrefijo, setTelefonoPrefijo] = useState("");
  const [correoRecuperar, setCorreoRecuperar] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRecovering) return;

    if (isRegistering) {

      const telefonoCompleto = telefonoPrefijo + telefono.replace(/\s/g, '');

      try {
        const res = await axios.post(REGISTRAR_USER, {
          nombre,
          documento,
          correo,
          contrasena,
          telefono: telefonoCompleto, // Enviamos el teléfono al backend
        });

        const data = res.data;
        if (data.success) {
          login(data.usuario);
          navigate("/verificar_cuenta");
        } else {
          // if (data.noVerificado) {
          //   navigate("/verificar_cuenta");
          //   return;
          // }
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          });
        }

      } catch (error) {
        console.error("Error en el registro:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error registrando el usuario.',
        });
      }
    } else {
      try {
        const res = await axios.post(LOGIN, {
          correo,
          contrasena,
        });

        const data = res.data;

        if (data.success) {
          login(data.usuario);
          navigate("/nueva_agenda");
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,

          });
          if (data.noVerificado) {
            navigate("/verificar_cuenta");
            return;
          }
        }
      } catch (error) {
        console.error("Error en el login:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al iniciar sesión.',
        });
      }
    }
  };

  const handleRecuperar = async () => {
    try {
      const res = await axios.post(RECUPERAR_CONTRASENA, {
        correo: correoRecuperar,
      });

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Código enviado',
          text: "Se ha enviado un código a tu correo.",
        });
        navigate("/verificar_codigo");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.data.message || "No se pudo enviar el correo.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al enviar el código.',
      });
    }
  };

  return (
  <div className="min-h-screen bg-[#e8f5f5] flex items-center justify-center px-4">
  <motion.div
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-5"
  >
    <h2 className="text-2xl font-semibold text-center text-[#1c7578]">
      {isRecovering
        ? "Recuperar contraseña"
        : isRegistering
        ? "Crear cuenta"
        : "Iniciar sesión"}
    </h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {isRecovering ? (
        <>
          <input
            type="email"
            placeholder="Correo"
            value={correoRecuperar}
            onChange={(e) => setCorreoRecuperar(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#69a3a5]"
          />
          <button
            type="button"
            onClick={handleRecuperar}
            className="w-full bg-[#1c7578] text-white py-2 rounded-lg font-medium hover:bg-[#145d5f] transition"
          >
            Enviar código
          </button>
        </>
      ) : (
        <>
          {isRegistering && (
            <>
              <input
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#69a3a5]"
              />
              <input
                type="text"
                placeholder="Documento"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#69a3a5]"
              />
              <select
                value={telefonoPrefijo}
                onChange={(e) => setTelefonoPrefijo(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#69a3a5]"
              >
                <option value="">Seleccionar prefijo</option>
                <option value="+57">+57 (Colombia)</option>
                <option value="+52">+52 (México)</option>
                <option value="+1">+1 (EEUU)</option>
                <option value="+54">+54 (Argentina)</option>
                <option value="+51">+51 (Perú)</option>
                <option value="+56">+56 (Chile)</option>
                <option value="+593">+593 (Ecuador)</option>
                <option value="+591">+591 (Bolivia)</option>
                <option value="+58">+58 (Venezuela)</option>
                <option value="+34">+34 (España)</option>
                <option value="+44">+44 (Reino Unido)</option>
                <option value="+353">+353 (Irlanda)</option>
                <option value="+33">+33 (Francia)</option>
                <option value="+49">+49 (Alemania)</option>
                <option value="+1">+1 (Canadá)</option>
                <option value="+61">+61 (Australia)</option>
                <option value="+91">+91 (India)</option>
                <option value="+27">+27 (Sudáfrica)</option>
              </select>
              <input
                type="text"
                placeholder="Número de teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#69a3a5]"
              />
            </>
          )}
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#69a3a5]"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#69a3a5]"
          />
          <button
            type="submit"
            className="w-full bg-[#1c7578] text-white py-2 rounded-lg font-medium hover:bg-[#145d5f] transition"
          >
            {isRegistering ? "Registrarse" : "Entrar"}
          </button>
        </>
      )}
    </form>

    {!isRecovering && (
      <p className="text-center text-sm text-gray-600">
        {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-[#1c7578] font-medium hover:underline"
        >
          {isRegistering ? "Inicia sesión" : "Regístrate"}
        </button>
      </p>
    )}

    {!isRecovering && (
      <p className="text-center text-sm text-gray-600">
        <button
          onClick={() => {
            setIsRecovering(true);
            setIsRegistering(false);
          }}
          className="text-[#1c7578] font-medium hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </p>
    )}
  </motion.div>
</div>

  );
}
