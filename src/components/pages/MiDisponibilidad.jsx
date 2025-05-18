import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from 'axios';  // Importa axios
import { GUARDAR_HORA_DISPONIBLE } from "../../api/registro";
import { useAuth } from "../../context/AuthContext";
import Swal from 'sweetalert2';


const MiDisponibilidad = () => {
  const [fecha, setFecha] = useState("");
  const [horaManual, setHoraManual] = useState(null);
  const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);
  const { usuario } = useAuth(); // esto te da el ID

  const guardarDisponibilidad = async () => {
    const payload = {
      psicologa_id: usuario.id,
      fecha,
      horas: horasSeleccionadas.map(convertirHora24),
    };

    try {
      const res = await axios.post(GUARDAR_HORA_DISPONIBLE, payload, {
        headers: {
          "Content-Type": "application/json"
        }
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
    if (periodo === 'PM' && hora24 !== 12) {
      hora24 += 12;
    }
    if (periodo === 'AM' && hora24 === 12) {
      hora24 = 0;
    }
    return `${hora24.toString().padStart(2, '0')}:${minuto}`;
  };

  const agregarHoraManual = () => {
    if (!horaManual) return;
    const horaStr = horaManual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hora24 = convertirHora24(horaStr);
    if (!horasSeleccionadas.includes(hora24)) {
      setHorasSeleccionadas((prev) => [...prev, hora24]);
    }
    setHoraManual(null); // Limpiar el picker
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white  space-y-6">
      <h2 className="text-2xl font-bold text-center text-brown-800">📅 Mi Disponibilidad</h2>

      <div>
        <label className="block text-sm font-semibold text-brown-700 mb-1">Selecciona una fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-brown-300 shadow-sm focus:ring-2 focus:ring-brown-300"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-brown-700 mb-1">Selecciona tus horas</label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {horas.map((hora) => (
            <button
              key={hora}
              type="button"
              onClick={() => toggleHora(hora)}
              className={`text-sm font-medium px-2 py-1 rounded-lg transition-all border shadow-sm
            ${horasSeleccionadas.includes(hora)
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100"}`}
            >
              {hora}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-brown-700 mb-1">Agregar otra hora</label>
        <div className="flex items-center gap-2">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileTimePicker
              label="Seleccionar hora"
              value={horaManual}
              onChange={(newValue) => setHoraManual(newValue)}
              ampm
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                },
              }}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            color="primary"
            onClick={agregarHoraManual}
            className="!bg-brown-600 hover:!bg-brown-700"
          >
            Añadir
          </Button>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-brown-700 mb-2">Horas seleccionadas:</p>
        <div className="flex flex-wrap gap-2">
          {horasSeleccionadas.map((hora, idx) => (
            <span
              key={idx}
              onClick={() => toggleHora(hora)}
              className="bg-brown-100 hover:bg-red-200 text-brown-800 text-xs px-3 py-1 rounded-full cursor-pointer transition"
              title="Haz clic para eliminar"
            >
              {hora}
            </span>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={guardarDisponibilidad}
          disabled={!fecha || horasSeleccionadas.length === 0}
          className={`font-bold px-6 py-2 rounded-md transition-all ${!fecha || horasSeleccionadas.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-custom-marron-1 hover:bg-brown-700 text-white cursor-pointer"
            }`}
        >
          Guardar disponibilidad
        </button>
      </div>
    </div>

  );
};

export default MiDisponibilidad;
