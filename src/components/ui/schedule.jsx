import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { OBTENER_HORAS_OCUPADAS } from "../../api/registro";


const Schedule = ({ onSelect, isVisible, selectedDate, psicologaId}) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
console.log("Psicologa ID:", psicologaId);
  useEffect(() => {
    if (!selectedDate || !psicologaId) return;

    const fecha = selectedDate.toISOString().split("T")[0];
    console.log("Fecha seleccionada:", fecha);

    fetch(`${OBTENER_HORAS_OCUPADAS}?fecha=${fecha}&psicologa_id=${psicologaId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.horas_ocupadas) {
        // Convertimos "15:30:00" a "3:30 PM"
        const convertidas = data.horas_ocupadas.map((hora24) => {
          const [h, m] = hora24.split(":").map(Number);
          let hora = h % 12; // Obtener hora en formato de 12 horas
          const modifier = h >= 12 ? "PM" : "AM"; // Determinar AM/PM
          if (hora === 0) hora = 12; // Corregir la hora 0 a 12 para AM
          return `${hora}:${m < 10 ? '0' + m : m} ${modifier}`;
        });
          setHorasOcupadas(convertidas);
        }
      });
  }, [selectedDate, psicologaId]);

  const times = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];

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
          className="w-[90%] max-w-md grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-4 bg-beige mx-auto rounded-lg "
        >
          {times.map((time) => (
            <button
              key={time}
              onClick={() => handleSelect(time)}
              disabled={isPast(time) || isOcupado(time)}
              className={`cursor-pointer px-2 py-2 text-sm sm:text-base text-center rounded-md border shadow transition-colors montserrat-medium
                ${selectedTime === time
                  ? "bg-custom-marron-1 text-white"
                  : isPast(time)
                  ? "bg-red-300 text-white cursor-not-allowed"
                  : isOcupado(time)
                  ? "bg-custom-orange-1 text-white cursor-not-allowed"
                  : "bg-white hover:bg-gray-200 text-black"
                }`}
            >
              {time}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Schedule;
