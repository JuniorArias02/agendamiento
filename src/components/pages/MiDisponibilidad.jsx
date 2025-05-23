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
    <div className="w-full max-w-xl mx-auto p-6 rounded-lg bg-[#f3fbfb] space-y-6 shadow-md">
      <h2 className="text-2xl font-bold text-center text-[#1c7578]">📅 Mi Disponibilidad</h2>

      <div>
        <label className="block text-sm font-semibold text-[#1c7578] mb-1">Selecciona una fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-[#69a3a5] text-[#1c7578] bg-white focus:ring-2 focus:ring-[#69a3a5] outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1c7578] mb-1">Selecciona tus horas</label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {horas.map((hora) => (
            <button
              key={hora}
              type="button"
              onClick={() => toggleHora(hora)}
              className={`text-sm font-medium px-2 py-1 rounded-md border transition
              ${horasSeleccionadas.includes(hora)
                  ? "bg-[#1c7578] text-white hover:bg-[#145d5f]"
                  : "bg-white text-[#1c7578] border-[#69a3a5] hover:bg-[#e2f3f3]"}`}
            >
              {hora}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-sm font-semibold text-[#1c7578] mb-2">Agregar hora manual</label>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="flex items-center gap-3">
            <MobileTimePicker
              label="Hora manual"
              value={horaManual}
              onChange={(newValue) => setHoraManual(newValue)}
              renderInput={(params) => (
                <TextField {...params} size="small" fullWidth />
              )}
            />
            <Button
              onClick={agregarHoraManual}
              variant="contained"
              style={{ backgroundColor: "#1c7578" }}
            >
              Agregar
            </Button>
          </div>
        </LocalizationProvider>
      </div>
      {horasSeleccionadas.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#1c7578] mb-1">Horas seleccionadas:</h3>
          <div className="flex flex-wrap gap-2">
            {horasSeleccionadas.map((h, index) => (
              <span
                key={index}
                className="px-2 py-1 text-sm bg-[#1c7578] text-white rounded-md"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}


      <div className="text-center pt-4">
        <button
          type="button"
          onClick={guardarDisponibilidad}
          disabled={!fecha || horasSeleccionadas.length === 0}
          className={`font-bold px-6 py-2 rounded-md transition-all ${!fecha || horasSeleccionadas.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#1c7578] hover:bg-[#145d5f] text-white"
            }`}
        >
          Guardar disponibilidad
        </button>
      </div>
    </div>
  );
};

export default MiDisponibilidad;
