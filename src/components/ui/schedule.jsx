import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { obtenerHorasDisponibles, obtenerHorasOcupadas } from "../../services/citas/citas";
import { Clock, Frown, X, Check, Calendar, ChevronUp, ChevronDown } from "lucide-react";

// 🔄 Convierte un ISO UTC a string local en formato 12h
const isoToLocal12h = (isoStr) => {
  if (!isoStr) return "";
  const d = new Date(isoStr); // lo interpreta como UTC → local
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

// 🔄 Convierte ISO string a Date local
const isoToDate = (isoStr) => (isoStr ? new Date(isoStr) : null);

const Schedule = ({ onSelect, isVisible, selectedDate, psicologaId }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  useEffect(() => {
    if (!selectedDate || !psicologaId) return;

    // ✅ Usamos la fecha local (año-mes-día) en lugar de toISOString UTC
    const fechaLocal = new Date(selectedDate);
    const fechaStr =
      fechaLocal.getFullYear() +
      "-" +
      String(fechaLocal.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(fechaLocal.getDate()).padStart(2, "0");

    console.log("📡 Fecha enviada al backend (local):", fechaStr);

    // Horas disponibles
    obtenerHorasDisponibles(fechaStr, psicologaId)
      .then((res) => {
        const normalizadas = (res.horas_disponibles || []).map(
          (h) => new Date(h).toISOString() // backend manda UTC → ISO
        );
        setHorasDisponibles(normalizadas);
      })
      .catch(() => setHorasDisponibles([]));

    // Horas ocupadas
    obtenerHorasOcupadas(fechaStr, psicologaId)
      .then((res) => {
        const normalizadas = (res.horas_ocupadas || []).map(
          (h) => new Date(h).toISOString()
        );
        setHorasOcupadas(normalizadas);
      })
      .catch(() => setHorasOcupadas([]));
  }, [selectedDate, psicologaId]);


  const handleSelect = (horaIso) => {
    if (!isPast(horaIso) && !isOcupado(horaIso)) {
      setSelectedTime(horaIso);
      // 🟢 Enviamos al padre en UTC
      onSelect(new Date(horaIso).toISOString());
    }
  };

  const isOcupado = (horaIso) => horasOcupadas.includes(horaIso);

  const isPast = (horaIso) => {
    const horaDate = isoToDate(horaIso);
    return horaDate ? horaDate < new Date() : false;
  };

  return (
    
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden w-full"
      >
        {/* Header con toggle */}
        <div
          className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-green-50 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-emerald-100">
              <Calendar size={22} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">Selecciona una hora</h3>
              <p className="text-sm text-emerald-600 mt-1">{horasDisponibles.length} opciones disponibles</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-emerald-100 transition-all duration-200 text-emerald-600"
          >
            {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
          </motion.button>
        </div>

        {/* Contenido */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-5">
                {horasDisponibles.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-center py-8 text-gray-500"
                  >
                    <div className="relative mb-4">
                      <Frown size={48} className="text-emerald-400" />
                      <div className="absolute -inset-4 bg-emerald-100 rounded-full opacity-40"></div>
                    </div>
                    <p className="text-lg font-medium mb-1 text-gray-700">No hay horarios disponibles</p>
                    <p className="text-sm text-gray-500">Intenta con otra fecha</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {horasDisponibles.map((horaIso, idx) => {
                      const ocupado = isOcupado(horaIso);
                      const past = isPast(horaIso);
                      const selected = selectedTime === horaIso;

                      return (
                        <motion.button
                          key={idx}
                          disabled={ocupado || past}
                          onClick={() => handleSelect(horaIso)}
                          whileHover={{ scale: ocupado || past ? 1 : 1.05, y: -2 }}
                          whileTap={{ scale: ocupado || past ? 1 : 0.95 }}
                          className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-200
                          ${selected
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg border-emerald-500"
                              : "bg-white text-gray-700 border-emerald-100 hover:border-emerald-300"} 
                          ${ocupado ? "opacity-50 cursor-not-allowed grayscale" : ""}
                          ${past ? "opacity-70 cursor-not-allowed" : ""}
                          shadow-sm hover:shadow-md
                        `}
                        >
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} className={selected ? "text-white" : "text-emerald-500"} />
                            <span className="text-sm font-medium">{isoToLocal12h(horaIso)}</span>
                          </div>

                          <div className="mt-1.5">
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-white text-emerald-600 rounded-full p-0.5"
                              >
                                <Check size={14} />
                              </motion.div>
                            )}
                            {ocupado && !selected && (
                              <X size={16} className="text-red-400" />
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-emerald-100 p-4 bg-emerald-50">
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-700">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
                    <span>Seleccionado</span>
                  </div>
                  <div className="flex items-center">
                    <X size={12} className="text-red-400 mr-2" />
                    <span>Ocupado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-white border border-emerald-300 rounded mr-2"></div>
                    <span>Disponible</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  
  );
};

export default Schedule;
