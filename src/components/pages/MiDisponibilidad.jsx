import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from 'axios';
import { GUARDAR_HORA_DISPONIBLE } from "../../api/registro";
import { useAuth } from "../../context/AuthContext";
import Swal from 'sweetalert2';

const MiDisponibilidad = () => {
  const [fecha, setFecha] = useState("");
  const [horaManual, setHoraManual] = useState(null);
  const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);
  const { usuario } = useAuth();

  const horas = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  const toggleHora = (hora) => {
    setHorasSeleccionadas((prev) =>
      prev.includes(hora) ? prev.filter((h) => h !== hora) : [...prev, hora]
    );
  };

  const convertirHora24 = (hora12) => {
    const [hora, minuto, periodo] = hora12.split(/:|\s/);
    let hora24 = parseInt(hora);
    if (periodo === 'PM' && hora24 !== 12) hora24 += 12;
    if (periodo === 'AM' && hora24 === 12) hora24 = 0;
    return `${hora24.toString().padStart(2, '0')}:${minuto}`;
  };

  const agregarHoraManual = () => {
    if (!horaManual) return;
    const horaStr = horaManual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hora24 = convertirHora24(horaStr);
    if (!horasSeleccionadas.includes(hora24)) {
      setHorasSeleccionadas((prev) => [...prev, hora24]);
    }
    setHoraManual(null);
  };

  const guardarDisponibilidad = async () => {
    const payload = {
      psicologa_id: usuario.id,
      fecha,
      horas: horasSeleccionadas.map(convertirHora24),
    };

    try {
      const res = await axios.post(GUARDAR_HORA_DISPONIBLE, payload, {
        headers: { "Content-Type": "application/json" }
      });

      const data = res.data;

      if (data.status === "ok") {
        Swal.fire({
          icon: 'success',
          title: 'Disponibilidad guardada',
          text: 'Tus horas fueron registradas correctamente 🕒',
          confirmButtonColor: '#6b4f3b'
        });
        setHorasSeleccionadas([]);
        setFecha("");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: data.message || 'Ocurrió un error inesperado',
          confirmButtonColor: '#d33'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'warning',
        title: 'Error de conexión',
        text: 'No pudimos conectar con el servidor 😢',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] bg-clip-text text-transparent">
        Disponibilidad
      </h2>

      <div className="space-y-5">
        {/* Selector de fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Fecha</label>
          <div className="relative">
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 bg-white focus:ring-2 focus:ring-[#6EC1E4] focus:border-[#6EC1E4] outline-none transition-all pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6EC1E4]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Selector de horas */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Horas disponibles</label>
          <div className="grid grid-cols-4 gap-2">
            {horas.map((hora) => (
              <button
                key={hora}
                type="button"
                onClick={() => toggleHora(hora)}
                className={`text-xs sm:text-sm font-medium px-2 py-1.5 rounded-lg border transition-all duration-200
              ${horasSeleccionadas.includes(hora)
                    ? "bg-gradient-to-br from-[#61CE70] to-[#6EC1E4] text-white border-transparent shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#6EC1E4] hover:text-[#6EC1E4]"
                  }`}
              >
                {hora}
              </button>
            ))}
          </div>
        </div>

        {/* Agregar hora manual */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Agregar hora</label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="flex gap-2">
              <MobileTimePicker
                value={horaManual}
                onChange={(newValue) => setHoraManual(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: '#E0E5EC',
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#6EC1E4',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6EC1E4',
                        },
                      },
                    }}
                  />
                )}
              />
              <Button
                onClick={agregarHoraManual}
                variant="contained"
                size="small"
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#61CE70',
                  '&:hover': {
                    backgroundColor: '#4FB560',
                  },
                  minWidth: '90px',
                  fontWeight: '500',
                }}
              >
                Agregar
              </Button>
            </div>
          </LocalizationProvider>
        </div>

        {/* Horas seleccionadas */}
        {horasSeleccionadas.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Seleccionadas</span>
              <span className="text-xs bg-[#6EC1E4] text-white px-2 py-0.5 rounded-full">
                {horasSeleccionadas.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {horasSeleccionadas.map((h, index) => (
                <div
                  key={index}
                  className="px-2 py-1 text-xs bg-[#6EC1E4]/10 text-[#6EC1E4] rounded-md flex items-center gap-1 border border-[#6EC1E4]/20"
                >
                  {h}
                  <button
                    onClick={() => toggleHora(h)}
                    className="text-[#6EC1E4] hover:text-[#4A9DB5]"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón de guardar */}
        <button
          type="button"
          onClick={guardarDisponibilidad}
          disabled={!fecha || horasSeleccionadas.length === 0}
          className={`w-full mt-4 font-medium px-4 py-2.5 rounded-xl transition-all duration-300 ${!fecha || horasSeleccionadas.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#61CE70] to-[#6EC1E4] hover:from-[#4FB560] hover:to-[#5AB7D4] text-white shadow-md hover:shadow-lg"
            }`}
        >
          Guardar disponibilidad
        </button>
      </div>
    </div>

  );
};

export default MiDisponibilidad;
