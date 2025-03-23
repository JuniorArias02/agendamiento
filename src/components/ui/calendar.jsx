import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  format, addDays, isSameMonth, isSameDay, addMonths
} from "date-fns";

const Calendar = ({ onDateSelect, confirmedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Evitar cambio de mes si hay fecha confirmada
  const handlePrevMonth = () => {
    if (!confirmedDate) setCurrentDate(addMonths(currentDate, -1));
  };
  
  const handleNextMonth = () => {
    if (!confirmedDate) setCurrentDate(addMonths(currentDate, 1));
  };

  // Evitar selección de otro día si hay fecha confirmada
  const handleSelectDate = (day) => {
    if (!confirmedDate) {
      setSelectedDate(day);
      onDateSelect(day);
    }
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

  // 🟢 Agrupar días por semanas
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-cream rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePrevMonth} 
          className={`text-brown font-bold ${confirmedDate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} 
          disabled={!!confirmedDate}>
          <ArrowLeft />
        </button>
        <h2 className="text-xl montserrat-regular text-center text-brown text-marron-custom-2">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button 
          onClick={handleNextMonth} 
          className={`text-brown font-bold ${confirmedDate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} 
          disabled={!!confirmedDate}>
          <ArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-gray-700">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="font-semibold">{d}</div>
        ))}
      </div>
      {/* 🟢 Renderizar solo la semana seleccionada cuando se confirma */}
      {weeks.map((week, index) => {
        const showWeek = confirmedDate
          ? week.some((day) => isSameDay(day, confirmedDate)) // Mostrar solo la fila del día seleccionado
          : true; // Si no se ha confirmado, mostrar todo

        return showWeek ? (
          <div key={index} className="grid grid-cols-7">
            {week.map((day, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectDate(day)}
                className={`p-2 transition duration-300 rounded-xl text-center
                  ${isSameMonth(day, currentDate) ? "text-black font-semibold" : "text-gray-400"} 
                  ${isSameDay(day, selectedDate) ? "day-items_selected text-white" : "hover:bg-gray-200 hover:text-black"}
                  ${confirmedDate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        ) : null;
      })}
    </div>
  );
};

export default Calendar;