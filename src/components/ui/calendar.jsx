import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isBefore, startOfDay } from "date-fns";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  format, addDays, isSameMonth, isSameDay, addMonths
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { obtenerFechasDisponbiles } from "../../services/citas/citas";

const Calendar = ({ onDateSelect, confirmedDate, servicioId }) => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [monthKey, setMonthKey] = useState(format(currentDate, "yyyy-MM"));
  const [availableDates, setAvailableDates] = useState([]); 
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const mes = format(currentDate, "M");
        const anio = format(currentDate, "yyyy");

        const { fechas_disponibles, success } = await obtenerFechasDisponbiles({
          servicio_id: servicioId,
          mes,
          anio,
        });

        if (success) {
          const fechas = fechas_disponibles.map(f => {
            const [year, month, day] = f.split("-"); // evita error por zona horaria
            return new Date(year, month - 1, day);
          });
          setAvailableDates(fechas);
        } else {
          setAvailableDates([]);
        }
      } catch (error) {
        console.error("Error cargando días disponibles:", error);
        setAvailableDates([]);
      }
    };

    fetchAvailableDates();
  }, [currentDate]);


  const handlePrevMonth = () => {
    if (!confirmedDate) {
      const newDate = addMonths(currentDate, -1);
      setCurrentDate(newDate);
      setSelectedDate(null);
      setSelectedWeek(null);
      setMonthKey(format(newDate, "yyyy-MM"));
      onDateSelect(null);
    }
  };

  const handleNextMonth = () => {
    if (!confirmedDate) {
      const newDate = addMonths(currentDate, 1);
      setCurrentDate(newDate);
      setSelectedDate(null);
      setSelectedWeek(null);
      setMonthKey(format(newDate, "yyyy-MM"));
      onDateSelect(null);
    }
  };

  const handleSelectDate = (day) => {
    const today = startOfDay(new Date());
    if (isBefore(day, today) || confirmedDate) return;

    setSelectedDate(day);
    onDateSelect(day);

    const weekIndex = weeks.findIndex((week) => week.includes(day));
    setSelectedWeek(weekIndex);
  };

  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const startWeek = startOfWeek(startMonth);
  const endWeek = endOfWeek(endMonth);

  const days = [];
  let day = startWeek;
  while (day <= endWeek) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8F4F8]">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          disabled={!!confirmedDate}
          className={`p-2 rounded-full ${confirmedDate ? "text-gray-400" : "text-[#1c7578] hover:bg-[#F5FAFC]"}`}
        >
          <ChevronLeft size={20} />
        </button>

        <motion.h2
          className="text-lg font-semibold text-[#1c7578]"
          key={monthKey}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {format(currentDate, "MMMM yyyy")}
        </motion.h2>

        <button
          onClick={handleNextMonth}
          disabled={!!confirmedDate}
          className={`p-2 rounded-full ${confirmedDate ? "text-gray-400" : "text-[#1c7578] hover:bg-[#F5FAFC]"}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-[#3A6280] mb-2">
        {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
          <div key={d} className="py-1 font-medium">{d}</div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-7 gap-1"
        >
          {weeks.map((week, weekIndex) => (
            week.map((day, dayIndex) => {
              const isPast = isBefore(day, startOfDay(new Date()));
              const isSelected = isSameDay(day, selectedDate);
              const isAvailable = availableDates.some(fecha => isSameDay(fecha, day));

              return (
                <motion.button
                  key={`${weekIndex}-${dayIndex}`}
                  onClick={() => isAvailable && !isPast && !confirmedDate && handleSelectDate(day)}
                  disabled={!isAvailable || isPast || confirmedDate}
                  className={`aspect-square rounded-full text-sm flex items-center justify-center transition-all
                    ${isSameMonth(day, currentDate) ? "text-[#3A6280]" : "text-gray-300"}
                    ${isSelected ? "!bg-[#1c7578] !text-white scale-105" : ""}
                    ${!isAvailable || isPast ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F5FAFC] cursor-pointer"}
                  `}
                  whileHover={!isPast && isAvailable && !confirmedDate ? { scale: 1.05 } : {}}
                  whileTap={!isPast && isAvailable && !confirmedDate ? { scale: 0.95 } : {}}
                >
                  {format(day, "d")}
                </motion.button>
              );
            })
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
