import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Calendar from "../ui/calendar";
import { ArrowLeftToLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Schedule from "../ui/schedule";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function Agenda() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const servicio = location.state?.servicio;
  console.log("Servicio seleccionado:", servicio);

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
  }, [usuario, navigate]);

  useEffect(() => {
    if (!servicio) {
      navigate("/seleccionar_servicios"); // o redirige a /explorar o donde tú quieras
    }
  }, [servicio, navigate]);
  

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    console.log("Fecha seleccionada:", date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime && servicio?.usuario_id) {
      localStorage.setItem("fecha", selectedDate);
      localStorage.setItem("hora", selectedTime);
      localStorage.setItem("psicologa_id", servicio.usuario_id);
      navigate("/agenda/confirmar", {
        state: {
          selectedDate,
          selectedTime,
          servicio,
          monto: servicio.precio,
        }
      });

    } else {
      console.error("Datos incompletos: servicio o usuario_id no están disponibles.");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex flex-col items-center justify-center py-8 px-4"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        className="w-full mb-4"
      >
        <ArrowLeftToLine
          className="cursor-pointer"
          onClick={() => navigate("/")}
          color="#8C5B4C"
          size={30}
        />
      </motion.div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
        {/* Calendario */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="w-full sm:w-1/2 max-w-md bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-[#8C5B4C] text-center mb-4">
            Selecciona una fecha
          </h3>
          <Calendar onDateSelect={handleDateSelect} />
          {selectedDate && (
            <Schedule
              onSelect={handleTimeSelect}
              isVisible={!!selectedDate}
              selectedDate={selectedDate}
              psicologaId={servicio?.usuario_id} // Asegúrate de que servicio tenga usuario_id
            />
          )}
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="w-full sm:w-1/2 max-w-md bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-[#8C5B4C] text-center mb-6">
            Agenda tu cita
          </h2>

          <motion.input
            type="button"
            value="Continuar"
            disabled={!selectedDate || !selectedTime}
            onClick={handleContinue}
            className={`w-full py-2 px-6 rounded-full font-semibold text-white transition duration-300 ${selectedDate && selectedTime
              ? "bg-[#8C5B4C] hover:brightness-110 cursor-pointer"
              : "bg-[#F4E6D4] text-gray-400 cursor-not-allowed"
              }`}
            whileHover={{ scale: selectedDate && selectedTime ? 1.05 : 1 }}
            whileTap={{ scale: selectedDate && selectedTime ? 0.95 : 1 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
