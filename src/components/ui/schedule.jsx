import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Schedule = ({ onSelect, isVisible }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const times = [
    "8:00 a.m", "8:30 a.m", "9:00 a.m", "9:30 a.m",
    "10:00 a.m", "10:30 a.m", "11:00 a.m", "11:30 a.m",
    "2:00 p.m", "2:30 p.m", "3:00 p.m", "3:30 p.m",
    "4:00 p.m", "4:30 p.m", "5:00 p.m", "5:30 p.m"
  ];

  const handleSelect = (time) => {
    setSelectedTime(time);
    onSelect(time);
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
              className={`cursor-pointer px-2 py-2 text-sm sm:text-base text-center rounded-md border border-custom-marron-1 shadow text-black transition-colors montserrat-medium
                ${selectedTime === time
                  ? "bg-custom-marron-1 text-white"
                  : "bg-white hover:bg-gray-200"
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
