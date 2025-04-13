import { useState,useEffect  } from "react";
import { motion } from "framer-motion";
import Calendar from "../ui/calendar";
import { ArrowLeftToLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Schedule from "../ui/schedule";
import { useAuth } from "../../context/AuthContext";

export default function Agenda() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
    }
  }, [usuario, navigate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      navigate("/agenda/confirmar", { state: { selectedDate, selectedTime } });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      // className="w-full flex flex-col items-center justify-center h-full"
      className="w-full flex flex-col items-center justify-center h-full mt-10"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        className="w-full flex flex-col justify-center h-80 "
      >
        <ArrowLeftToLine
          className="cursor-pointer ml-5"
          onClick={() => navigate("/")}
          color="#8C5B4C"
          size={30}
        />
      </motion.div>

      <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="w-[90%] sm:w-[50%]  p-2 flex flex-col  items-center"
        >
          <Calendar onDateSelect={handleDateSelect} />
          {selectedDate && (
            <Schedule onSelect={handleTimeSelect} isVisible={!!selectedDate} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="w-[90%] sm:w-[50%]  p-2"
        >
          <div className="flex flex-col items-center justify-center p-5">
            <h2 className="montserrat-bold text-black-custom-1 text-4xl">
              Agenda tu cita
            </h2>
            <p className="text-center mt-10 w-3/5">
              Selecciona una fecha y una hora de las opciones disponibles.
            </p>
            <motion.input
              type="button"
              value="Continuar"
              disabled={!selectedDate || !selectedTime}
              onClick={handleContinue}
              className={`mt-10 font-bold py-2 px-6 cursor-pointer transition duration-300 ${selectedDate && selectedTime
                  ? "bg-custom-marron-1"
                  : "bg-custom-beige-2 cursor-not-allowed"
                }`}
              whileHover={{ scale: selectedDate && selectedTime ? 1.05 : 1 }}
              whileTap={{ scale: selectedDate && selectedTime ? 0.95 : 1 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
