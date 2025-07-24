import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Calendar from "../ui/calendar";
import { ArrowLeftToLine, CalendarDays, CalendarCheck, ClipboardList, Tag, Lock, Clock, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom";
import Schedule from "../ui/schedule";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function Agenda() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const servicio = location.state?.servicio;

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
  const formatFechaBD = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto flex flex-col p-4 sm:p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center gap-4 mb-6"
      >
        <button
          onClick={() => navigate("/")}
          className="text-[#1c7578] hover:bg-[#F5FAFC] p-2 rounded-full"
        >
          <ArrowLeftToLine size={24} />
        </button>
        <div className="flex items-center gap-2">
          <CalendarDays size={24} className="text-[#1c7578]" />
          <h1 className="text-xl font-bold text-[#1c7578]">Agenda tu cita</h1>
        </div>
      </motion.div>

      {/* Contenido */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sección Calendario */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex-1"
        >
          <Calendar
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            servicioId={servicio?.id}
          />

          {selectedDate && (
            <Schedule
              selectedDate={selectedDate}
              psicologaId={servicio?.usuario_id}
              isVisible={!!selectedDate}
              onSelect={handleTimeSelect}
            />
          )}
        </motion.div>

        {/* Resumen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:max-w-xs w-full bg-white rounded-xl shadow-sm border border-[#E8F4F8] p-5 sticky top-4"
        >
          <div className="flex flex-col items-center mb-5">
            <CalendarCheck size={28} className="text-[#1c7578] mb-2" />
            <h2 className="text-lg font-bold text-[#1c7578]">Resumen de cita</h2>
          </div>

          <div className="space-y-4 mb-6">
            {servicio && (
              <div className="flex items-start gap-3">
                <ClipboardList size={18} className="text-[#3A6280] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Servicio</p>
                  <p className="text-sm font-medium text-[#1c7578]">{servicio.titulo}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <CalendarDays size={18} className="text-[#3A6280] mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Fecha</p>
                <p className={`text-sm font-medium ${selectedDate ? "text-[#1c7578]" : "text-gray-400"}`}>
                  {selectedDate ? formatFechaBD(selectedDate) : "No seleccionada"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="text-[#3A6280] mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Hora</p>
                <p className={`text-sm font-medium ${selectedTime ? "text-[#1c7578]" : "text-gray-400"}`}>
                  {selectedTime || "No seleccionada"}
                </p>
              </div>
            </div>

            {servicio?.precio && (
              <div className="flex items-start gap-3">
                <Tag size={18} className="text-[#3A6280] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Precio</p>
                  <p className="text-sm font-medium text-[#1c7578]">
                    {Number(servicio.precio).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <motion.button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2
              ${selectedDate && selectedTime ?
                "bg-[#1c7578] text-white hover:bg-[#3A6280]" :
                "bg-gray-100 text-gray-400 cursor-not-allowed"}
            `}
            whileHover={selectedDate && selectedTime ? { scale: 1.02 } : {}}
            whileTap={selectedDate && selectedTime ? { scale: 0.98 } : {}}
          >
            {selectedDate && selectedTime ? (
              <>
                <CheckCircle size={18} />
                Confirmar cita
              </>
            ) : (
              <>
                <Lock size={18} />
                Completa los datos
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>


  );
}
