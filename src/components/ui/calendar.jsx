import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { isBefore, startOfDay } from "date-fns";

import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  format, addDays, isSameMonth, isSameDay, addMonths
} from "date-fns";

const Calendar = ({ onDateSelect, confirmedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [monthKey, setMonthKey] = useState(format(currentDate, "yyyy-MM"));

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

    // Si la fecha es anterior a hoy, no hacer nada
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
    <div className="max-w-md mx-auto p-4 bg-cream rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className={`font-bold text-[#1c7578] ${confirmedDate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          disabled={!!confirmedDate}
        >
          <ArrowLeft />
        </button>
        <h2 className="text-xl montserrat-regular text-center text-[#1c7578]">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={handleNextMonth}
          className={`font-bold text-[#1c7578] ${confirmedDate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          disabled={!!confirmedDate}
        >
          <ArrowRight />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-gray-700">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="font-semibold">{d}</div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {weeks.map((week, index) => {
            const shouldShowWeek = selectedDate ? index === selectedWeek : true;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: shouldShowWeek ? 1 : 0, height: shouldShowWeek ? "auto" : 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`grid grid-cols-7 overflow-hidden transition-all`}
              >
                {week.map((day, idx) => {
                  const isPast = isBefore(day, startOfDay(new Date()));
                  return (
                    <div
                      key={idx}
                      onClick={() => !isPast && !confirmedDate && handleSelectDate(day)}
                      className={`p-2 transition duration-300 rounded-full text-center
                    ${isSameMonth(day, currentDate) ? "text-black font-semibold" : "text-gray-400"}
                    ${isSameDay(day, selectedDate) ? "bg-[#1c7578] text-white" : ""}
                    ${isPast
                          ? "bg-red-300 text-white opacity-60 cursor-not-allowed"
                          : confirmedDate
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#7fc1c1] hover:text-black cursor-pointer"
                        }`}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>

  );
};

export default Calendar;
