import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { obtenerHorasDisponibles, obtenerHorasOcupadas } from "../../services/citas/citas";
import { Clock, Frown, X, Check } from "lucide-react"
const Schedule = ({ onSelect, isVisible, selectedDate, psicologaId }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  useEffect(() => {
    if (!selectedDate || !psicologaId) return;

    const fecha = selectedDate.toISOString().split("T")[0];

    obtenerHorasDisponibles(fecha, psicologaId)
      .then((data) => {
        if (data.horas_disponibles) {
          const convertidas = data.horas_disponibles.map((hora24) => {
            const [h, m] = hora24.split(":").map(Number);
            let hora = h % 12 || 12;
            const modifier = h >= 12 ? "PM" : "AM";
            return `${hora}:${m < 10 ? '0' + m : m} ${modifier}`;
          });
          setHorasDisponibles(convertidas);
        }
      })
      .catch((error) => console.error("Error al obtener horas disponibles:", error));

    obtenerHorasOcupadas(fecha, psicologaId)
      .then((data) => {
        if (data.horas_ocupadas) {
          const convertidas = data.horas_ocupadas.map((hora24) => {
            const [h, m] = hora24.split(":").map(Number);
            let hora = h % 12 || 12;
            const modifier = h >= 12 ? "PM" : "AM";
            return `${hora}:${m < 10 ? '0' + m : m} ${modifier}`;
          });
          setHorasOcupadas(convertidas);
        }
      })
      .catch((error) => console.error("Error al obtener horas ocupadas:", error));

  }, [selectedDate, psicologaId]);

  const handleSelect = (time) => {
    if (!isPast(time) && !isOcupado(time)) {
      setSelectedTime(time);
      onSelect(time);
    }
  };

  const isOcupado = (time) => {
    return horasOcupadas.includes(time);
  };

  const isPast = (timeStr) => {
    if (!selectedDate) return false;

    const now = new Date();
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes, 0, 0);

    return selectedDate.toDateString() === now.toDateString() && dateTime < now;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="mt-4 bg-[#F5FAFC] rounded-xl p-4 border border-[#D9EEF6]"
        >
          <div className="flex items-center gap-2 mb-3 text-[#1c7578]">
            <Clock size={18} />
            <h3 className="font-medium">Horarios disponibles</h3>
          </div>

          {horasDisponibles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-3 text-[#3A6280] text-sm"
            >
              <Frown className="mb-1" size={20} />
              <p>No hay horarios disponibles</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {horasDisponibles.map((time) => {
                const disabled = isPast(time) || isOcupado(time)
                const isSelected = selectedTime === time

                return (
                  <motion.button
                    key={time}
                    onClick={() => !disabled && handleSelect(time)}
                    disabled={disabled}
                    className={`py-2 text-sm rounded-lg flex items-center justify-center gap-1 transition-all
                      ${isSelected ? "bg-[#1c7578] text-white" :
                        disabled ? "bg-gray-100 text-gray-400" :
                          "bg-white text-[#1c7578] hover:bg-[#D9EEF6] border border-[#D9EEF6]"}
                    `}
                    whileHover={!disabled ? { scale: 1.03 } : {}}
                    whileTap={!disabled ? { scale: 0.97 } : {}}
                  >
                    {isSelected && <Check size={14} />}
                    {time.slice(0, 5)}
                    {isOcupado(time) && <X size={14} className="ml-1" />}
                  </motion.button>
                )
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

};

export default Schedule;
