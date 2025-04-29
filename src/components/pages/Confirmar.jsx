import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { PAYMENT } from "../../api/registro";
import { useAuth } from "../../context/AuthContext";
import { HiArrowLeft, HiCheck } from 'react-icons/hi';


export default function ConfirmarAgenda() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = location.state?.selectedDate;
  const selectedTime = location.state?.selectedTime;
  const servicio = location.state?.servicio;

  const { usuario } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      navigate("/agenda");
    }
  }, [selectedDate, selectedTime, navigate]);

  const formatFechaBD = (fecha) => {
    const date = new Date(fecha);
    const año = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  const formatHoraBD = (hora) => {
    if (hora.includes("AM") || hora.includes("PM")) {
      const [time, modifier] = hora.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours, 10);
      if (modifier === 'PM' && hours !== 12) {
        hours += 12;
      }
      if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }
      return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    } else {
      return `${hora}:00`;
    }
  };

  const handleConfirmar = async () => {
    if (!selectedDate || !selectedTime) return;

    setLoading(true);
    setError(null);

    try {
      if (!usuario || !usuario.id) {
        throw new Error("Usuario no autenticado.");
      }

      const fechaFormateada = formatFechaBD(selectedDate);
      const horaFormateada = formatHoraBD(selectedTime);

      localStorage.setItem("fecha", fechaFormateada);
      localStorage.setItem("hora", horaFormateada);
      localStorage.setItem("usuario_id", usuario.id);
      localStorage.setItem("servicio_id", servicio.id);

      const response = await axios.post(PAYMENT, {
        monto: servicio.precio,
        titulo: servicio.titulo,
        servicio_id: servicio.id
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("Error al crear la sesión de pago.");
      }
    } catch (err) {
      setError("Hubo un error al procesar el pago. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 p-5"
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Confirmar Cita</h2>
        <p className="text-lg text-gray-600 text-center mb-6">
          Estás a punto de agendar una cita para el{" "}
          <span className="text-custom-marron-1 font-semibold text-xl">
            {selectedDate && selectedTime
              ? `${formatFechaBD(selectedDate)} a las ${formatHoraBD(selectedTime).slice(0, 5)}`
              : "No seleccionaste fecha"}
          </span>
        </p>

        {servicio && servicio.titulo && (
          <p className="text-lg text-gray-700 mb-4">
            Servicio seleccionado: <strong className="text-custom-marron-1">{servicio.titulo}</strong>
          </p>
        )}

        {servicio.precio && (
          <p className="text-lg text-gray-700 mb-6">
            El precio de la cita es: <strong className="text-custom-marron-1">{servicio.precio} US</strong>
          </p>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-between gap-4">
          <motion.button
            onClick={() => navigate("/agenda")}
            className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition cursor-pointer flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiArrowLeft size={20} /> Regresar
          </motion.button>
          <motion.button
            onClick={handleConfirmar}
            className="px-6 py-2 bg-custom-beige-2 text-white rounded-lg font-semibold hover:bg-opacity-90 transition cursor-pointer flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Procesando..." : <>
              <HiCheck size={20} /> Confirmar
            </>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
