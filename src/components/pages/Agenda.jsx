import { useState } from "react";
import Calendar from "../ui/calendar";
import { ArrowLeftToLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Schedule from "../ui/schedule";

export default function Agenda() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirmedDate, setConfirmedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      setConfirmedDate(selectedDate);
    }
  };

  const handleContinue = () => {
    navigate("/confirmar");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <div className="w-full flex flex-col justify-center h-80">
        <ArrowLeftToLine className="cursor-pointer ml-5" onClick={() => navigate("/")} color="#8C5B4C" size={30} />
      </div>
      <div className="w-full h-full flex">
        <div className="w-[50%] p2 flex flex-col items-center ">
          <Calendar onDateSelect={handleDateSelect} confirmedDate={confirmedDate} />
          {confirmedDate && <Schedule />} {/* 🟢 Mostrar Schedule solo si hay fecha confirmada */}
        </div>
        <div className="w-[50%] p2">
          <div className="flex flex-col items-center justify-center p-5">
            <h2 className="montserrat-bold text-black-custom-1 text-4xl">Agenda tu cita</h2>
            <p className="text-center mt-10 w-3/5">
              Seleccione una fecha y hora de las opciones disponibles a continuación. Si es un cliente nuevo, complete el formulario de registro antes de su primera sesión.
            </p>
            <input
              type="button"
              value={confirmedDate ? "Confirmar cita" : "Continuar"}
              disabled={!selectedDate}
              onClick={confirmedDate ? handleContinue : handleConfirm} 
              className={`mt-10 font-bold py-2 px-6 cursor-pointer transition duration-300
                ${selectedDate ? (confirmedDate ? "bg-custom-beige-3" : "bg-custom-marron-1") : "bg-custom-beige-2 cursor-not-allowed"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
  