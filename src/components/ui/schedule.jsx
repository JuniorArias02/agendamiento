import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";  // Usamos Axios
import { OBTENER_HORAS_OCUPADAS, OBTENER_DISPONIBILIDAD } from "../../api/registro"; // Asegúrate de tener la ruta correcta

const Schedule = ({ onSelect, isVisible, selectedDate, psicologaId }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  useEffect(() => {
    if (!selectedDate || !psicologaId) return;

    const fecha = selectedDate.toISOString().split("T")[0];

    // Primero obtenemos las horas disponibles desde la base de datos
    axios
      .get(`${OBTENER_DISPONIBILIDAD}?fecha=${fecha}&psicologa_id=${psicologaId}`)
      .then((response) => {
        const data = response.data;
        if (data.horas_disponibles) {
          const convertidas = data.horas_disponibles.map((hora24) => {
            const [h, m] = hora24.split(":").map(Number);
            let hora = h % 12;
            const modifier = h >= 12 ? "PM" : "AM";
            if (hora === 0) hora = 12;
            return `${hora}:${m < 10 ? '0' + m : m} ${modifier}`;
          });
          setHorasDisponibles(convertidas);
        }
      })
      .catch((error) => {
        console.error("Error al obtener las horas disponibles:", error);
      });

    // Luego obtenemos las horas ocupadas
    axios
      .get(`${OBTENER_HORAS_OCUPADAS}?fecha=${fecha}&psicologa_id=${psicologaId}`)
      .then((response) => {
        const data = response.data;
        if (data.horas_ocupadas) {
          const convertidas = data.horas_ocupadas.map((hora24) => {
            const [h, m] = hora24.split(":").map(Number);
            let hora = h % 12;
            const modifier = h >= 12 ? "PM" : "AM";
            if (hora === 0) hora = 12;
            return `${hora}:${m < 10 ? '0' + m : m} ${modifier}`;
          });
          setHorasOcupadas(convertidas);
        }
      })
      .catch((error) => {
        console.error("Error al obtener las horas ocupadas:", error);
      });

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
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-[90%] max-w-md grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-4 bg-[#D9EEF6] mx-auto rounded-lg text-center" // azul muy clarito de fondo
    >
      {horasDisponibles.length === 0 ? (
        <div className="col-span-full text-[#3A6280] text-sm sm:text-base italic">
          El doctor no se encuentra disponible en estas fechas 😥
        </div>
      ) : (
        horasDisponibles.map((time) => (
          <button
            key={time}
            onClick={() => handleSelect(time)}
            disabled={isPast(time) || isOcupado(time)}
            className={`cursor-pointer px-2 py-2 text-sm sm:text-base text-center rounded-md border shadow transition-colors montserrat-medium
              ${
                selectedTime === time
                  ? "bg-[#1c7578] text-white"  // azul oscuro para seleccionado
                  : isPast(time)
                  ? "bg-blue-200 text-white cursor-not-allowed"  // azul claro para pasado
                  : isOcupado(time)
                  ? "bg-blue-400 text-white cursor-not-allowed"  // azul medio para ocupado
                  : "bg-white hover:bg-blue-100 text-[#1c7578]" // hover azul claro y texto azul
              }`}
          >
            {time}
          </button>
        ))
      )}
    </motion.div>
  )}
</AnimatePresence>

  );

};

export default Schedule;
