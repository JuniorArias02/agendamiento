import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isBefore, startOfDay } from "date-fns";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
  Heart,
  Zap,
  Leaf,
  RotateCcw
} from "lucide-react";
import { obtenerFechasDisponbiles } from "../../services/citas/citas";

// 🔄 Convierte string UTC → Date local
const utcIsoToUserDate = (isoString) => {
  if (!isoString) return null;
  return new Date(isoString); // navegador lo convierte a local
};

// 🔄 Convierte Date local → ISO UTC
const userDateToUtcIso = (date) => {
  if (!date) return null;
  return date.toISOString();
};

const Calendar = ({ onDateSelect, confirmedDate, servicioId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthKey, setMonthKey] = useState(format(new Date(), "yyyy-MM"));
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 📡 Traer días disponibles

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
          // 🔑 Convertimos ISO UTC → Date local
          const fechasLocales = fechas_disponibles.map(utcIsoToUserDate);
          setAvailableDates(fechasLocales);
        } else {
          setAvailableDates([]);
        }
      } catch (error) {
        console.error("Error cargando días disponibles:", error);
        setAvailableDates([]);
      }
    };

    fetchAvailableDates();
  }, [currentDate, servicioId]);

  const handleSelectDate = (day) => {
    const today = startOfDay(new Date());
    if (isBefore(day, today) || confirmedDate) return;

    setSelectedDate(day);
    onDateSelect(day); // <-- le pasamos el Date local, no ISO
  };


  // ⬅️ Mes anterior
  const handlePrevMonth = () => {
    if (!confirmedDate) {
      const newDate = addMonths(currentDate, -1);
      setCurrentDate(newDate);
      setSelectedDate(null);
      setMonthKey(format(newDate, "yyyy-MM"));
      onDateSelect(null);
    }
  };

  // ➡️ Mes siguiente
  const handleNextMonth = () => {
    if (!confirmedDate) {
      const newDate = addMonths(currentDate, 1);
      setCurrentDate(newDate);
      setSelectedDate(null);
      setMonthKey(format(newDate, "yyyy-MM"));
      onDateSelect(null);
    }
  };

  // 🗓️ Generar grilla de calendario
  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const startWeek = startOfWeek(startMonth, { weekStartsOn: 1 }); // lunes
  const endWeek = endOfWeek(endMonth, { weekStartsOn: 1 });

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
    <div className="mt-5 mb-5 via-green-50 to-teal-50 p-6 rounded-3xl shadow-2xs border border-emerald-200/60 w-full mx-auto ">
      {/* Header con onda wellness mejorado */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-6 relative"
      >
        <div className="absolute -top-2 -left-2">
          <Sparkles size={16} className="text-emerald-400 animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Sparkles size={16} className="text-emerald-400 animate-pulse" />
        </div>

        <div className="flex justify-center mb-3">
          <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl shadow-lg">
            <CalendarIcon size={24} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
          Agenda tu Sesión
        </h2>
        <p className="text-sm text-emerald-600/80 mt-2 font-medium">
          Elige la fecha para tu momento de bienestar
        </p>
      </motion.div>

      {/* Navegación del mes mejorada */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center mb-6 p-4 bg-white/80 rounded-2xl shadow-sm border border-emerald-100 backdrop-blur-sm"
      >
        <button
          onClick={handlePrevMonth}
          disabled={confirmedDate}
          className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        >
          <ChevronLeft className="text-emerald-700" size={20} />
        </button>

        <motion.h2
          key={monthKey}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-lg font-semibold text-emerald-800 flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full"
        >
          <Leaf size={16} className="text-emerald-500" />
          {format(currentDate, "MMMM yyyy")}
          <Leaf size={16} className="text-emerald-500" />
        </motion.h2>

        <button
          onClick={handleNextMonth}
          disabled={confirmedDate}
          className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        >
          <ChevronRight className="text-emerald-700" size={20} />
        </button>
      </motion.div>

      {/* Indicador de carga */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mb-4"
        >
          <div className="flex items-center text-emerald-600 text-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              <Sparkles size={14} />
            </motion.div>
            Cargando fechas disponibles...
          </div>
        </motion.div>
      )}

      {/* Días de la semana mejorados */}
      <div className="grid grid-cols-7 text-center font-medium text-emerald-700 mb-4 px-2">
        {["L", "M", "X", "J", "V", "S", "D"].map((dia, index) => (
          <div
            key={dia}
            className={`p-2 text-xs font-semibold ${index >= 5 ? 'text-emerald-500' : 'text-emerald-700'}`}
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Grilla de días mejorada */}
      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-7 gap-2 px-2 mb-6"
        >
          {weeks.flat().map((day, idx) => {
            const isAvailable = availableDates.some(d => isSameDay(d, day));
            const isSelected = selectedDate && isSameDay(selectedDate, day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.button
                key={idx}
                onClick={() => handleSelectDate(day)}
                disabled={!isAvailable || confirmedDate}
                whileHover={{ scale: isAvailable && !confirmedDate ? 1.05 : 1 }}
                whileTap={{ scale: isAvailable && !confirmedDate ? 0.95 : 1 }}
                className={`
                relative p-2 rounded-xl text-sm font-medium transition-all duration-200
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isToday && !isSelected ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}
                ${isAvailable ?
                    isSelected ?
                      'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg' :
                      'bg-white/90 text-emerald-800 hover:bg-emerald-50 hover:shadow-md border border-emerald-100' :
                    'text-gray-400 bg-gray-100/50 cursor-not-allowed'
                  }
                ${confirmedDate && !isSelected ? 'opacity-70' : ''}
              `}
              >
                {/* Decoración especial para días disponibles */}
                {isAvailable && !isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full"
                  />
                )}

                {format(day, "d")}

                {/* Indicador de hoy */}
                {isToday && !isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"
                  />
                )}

                {/* Efecto de selección */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -inset-0.5 bg-emerald-100/50 rounded-xl -z-10"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Feedback de fecha seleccionada */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-6 p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl text-center border border-emerald-200/50"
          >
            <p className="text-sm text-emerald-800 font-medium mb-3">
              Seleccionaste: <span className="font-semibold">{format(selectedDate, "dd 'de' MMMM")}</span>
            </p>

            {!confirmedDate && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedDate(null);
                  onDateSelect(null);
                }}
                className="px-3 py-1 bg-white text-emerald-700 rounded-lg text-xs font-medium border border-emerald-200 shadow-sm hover:shadow-md transition-all flex items-center mx-auto"
              >
                <RotateCcw size={12} className="mr-1" />
                Cambiar selección
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer con mensaje wellness mejorado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4 border-t border-emerald-200/50"
      >
        <div className="flex items-center justify-center gap-2 text-emerald-600/80 mb-1">
          <Sparkles size={12} className="text-emerald-500" />
          <span className="text-xs font-medium">Tu bienestar es nuestra prioridad</span>
          <Sparkles size={12} className="text-emerald-500" />
        </div>
        <p className="text-xs text-emerald-500/70">Tómate un momento para cuidar de ti</p>
      </motion.div>
    </div>
  );
};

export default Calendar;
