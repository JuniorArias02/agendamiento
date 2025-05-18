import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { GUARDAR_CITA, VERIFICAR_PAGO } from "../../api/registro";

export default function ConfirmacionPago() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");
    // console.log("Session ID extraído:", sessionId); 

    // Evitar duplicación: Revisar si ya se procesó esta sesión
    const yaProcesado = localStorage.getItem(`procesado_${sessionId}`);
    // console.log("Ya procesado:", yaProcesado);

    if (sessionId && !yaProcesado) {
      verificarPagoYGuardarCita(sessionId);
    } else {
      // console.log("La cita ya fue procesada anteriormente.");
    }
  }, []);

  const verificarPagoYGuardarCita = async (sessionId) => {
    try {
      // Verifica con Stripe si el pago fue exitoso
      const res = await axios.post(VERIFICAR_PAGO, {
        session_id: sessionId,
      });

      if (res.data.success) {
        // console.log("✅ Pago confirmado con Stripe");

        // Obtener datos almacenados antes del pago
        const fecha = localStorage.getItem("fecha");
        const hora = localStorage.getItem("hora");
        const usuario_id = localStorage.getItem("usuario_id");
        const servicio_id = localStorage.getItem("servicio_id"); // Obtenemos el servicio_id de localStorage
        console.log("Datos de la cita:", { fecha, hora, usuario_id, servicio_id, session_id: sessionId });

        // Enviar la cita al backend
        await axios.post(GUARDAR_CITA, {
          usuario_id,
          fecha,
          hora,
          servicio_id, // Usamos el servicio_id de localStorage
          session_id: sessionId,
        });

        localStorage.setItem(`procesado_${sessionId}`, "true"); // Marcar la cita como procesada

        // alert("Cita guardada en la base de datos");
        // console.log("📅 Cita guardada en la base de datos");
      } else {
        // console.log("⚠️ El pago no fue exitoso");
        navigate("/agenda/cancelado");
      }
    } catch (error) {
      console.error("❌ Error verificando pago o guardando cita:", error);
      navigate("/agenda/cancelado");
    }

    // Eliminar datos de localStorage después de procesar la cita
    localStorage.removeItem("fecha");
    localStorage.removeItem("hora");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("servicio_id"); // Limpiamos el servicio_id también
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-screen flex flex-col items-center justify-center bg-white p-5"
    >
      <h2 className="text-3xl font-bold text-green-600">¡Pago exitoso!</h2>
      <p className="text-lg text-gray-600 mt-4 text-center">
        Tu cita ha sido agendada correctamente. <br />
        Gracias por tu confianza.
      </p>

      <div className="flex gap-4 mt-6">
        <motion.button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Volver al inicio
        </motion.button>
      </div>
    </motion.div>
  );
}
