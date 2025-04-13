import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { REGISTRAR_USER, LOGIN,RECUPERAR_CONTRASENA } from "../../api/registro";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false); // 🆕 Modo recuperación
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [correoRecuperar, setCorreoRecuperar] = useState(""); // 🆕 Email para recuperar
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRecovering) return; // 🆕 Evita que el submit normal se dispare

    if (isRegistering) {
      try {
        const res = await axios.post(REGISTRAR_USER, {
          nombre,
          documento,
          correo,
          contrasena,
        });

        const data = res.data;
        if (data.success) {
          navigate("/verificar_cuenta");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error en el registro:", error);
        alert("Hubo un error registrando el usuario.");
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
          navigate("/agenda");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error en el login:", error);
        alert("Hubo un error al iniciar sesión.");
      }
    }
  };

  const handleRecuperar = async () => {
    try {
      const res = await axios.post(RECUPERAR_CONTRASENA, {
        correo: correoRecuperar,
      });

      if (res.data.success) {
        alert("Se ha enviado un código a tu correo.");
        navigate("/verificar_codigo"); // o deja un modal, como prefieras
      } else {
        alert(res.data.message || "No se pudo enviar el correo.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al enviar el código.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600">
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
                placeholder="Correo para recuperar"
                value={correoRecuperar}
                onChange={(e) => setCorreoRecuperar(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleRecuperar}
                className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
              >
                Enviar código
              </motion.button>
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
                    className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <input
                    type="text"
                    placeholder="Número de documento"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </>
              )}
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
              >
                {isRegistering ? "Registrarse" : "Entrar"}
              </motion.button>
            </>
          )}
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500"
        >
          {!isRecovering && (
            <>
              {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-indigo-600 font-medium hover:underline"
              >
                {isRegistering ? "Inicia sesión" : "Regístrate"}
              </button>
            </>
          )}
        </motion.p>

        {!isRecovering && (
          <p className="text-center text-sm text-gray-500">
            <button
              onClick={() => {
                setIsRecovering(true);
                setIsRegistering(false);
              }}
              className="text-indigo-600 font-medium hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        )}

        {isRecovering && (
          <p className="text-center text-sm text-gray-500">
            <button
              onClick={() => setIsRecovering(false)}
              className="text-indigo-600 font-medium hover:underline"
            >
              Volver al inicio
            </button>
          </p>
        )}
      </motion.div>
    </div>
  );
}
