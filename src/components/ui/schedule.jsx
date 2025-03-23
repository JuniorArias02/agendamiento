import { useState } from "react";

const Schedule = ({ onSelect }) => {
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
    <div className="w-[70%]  grid grid-cols-4 gap-3 p-4 bg-beige">
      {times.map((time) => (
        <button
          key={time}
          onClick={() => handleSelect(time)}
          className={`px-4 w-35 text-center py-2 rounded-lg border-custom-marron-1  shadow-md text-lg transition-colors montserrat-medium text-black
            ${selectedTime === time ? "bg-custom-marron-1 text-white" : "bg-white text-black hover:bg-gray-200"}`}
        >
          {time}
        </button>
      ))}
    </div>
  );
};

export default Schedule;
