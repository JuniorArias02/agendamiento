import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { obtenerCitas } from "../../services/citas";
import { motion } from "framer-motion";

export default function TusCitas() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [citas, setCitas] = useState([]);
  console.log("Usuario en Dashboard:", citas);
  useEffect(() => {
    if (usuario) {
      obtenerCitas(usuario.id).then(setCitas);
    }
  }, [usuario]);

  const verDetalles = (idCita) => {
    // alert("Ver detalles de la cita con ID: " + idCita);
    navigate(`/cita/${idCita}`);
  };

  const formatearFecha = (fechaString) => {
    const opciones = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(fechaString).toLocaleDateString("es-ES", opciones);
  };

  const formatearHora = (horaString) => {
    const [hora, minutos] = horaString.split(":");
    const horasEnFormato12 = (hora % 12) || 12; // Convertimos al formato 12 horas
    const ampm = hora >= 12 ? "PM" : "AM"; // Determinamos si es AM o PM
    return `${horasEnFormato12}:${minutos} ${ampm}`;
  };
  


  const contactarPorWhatsApp = (telefono) => {
    const numeroLimpio = telefono.replace(/\D/g, "");
    window.open(`https://wa.me/${numeroLimpio}`, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-black mb-10 text-center montserrat-bold">
        Tus Citas
      </h1>

      {citas.length === 0 ? (
        <p className="text-center text-lg text-gray-500">
          No hay citas registradas.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {citas.map((cita, index) => {
            const nombre =
              usuario.rol === "paciente" ? cita.psicologa : cita.paciente;
            const telefono =
              usuario.rol === "paciente"
                ? cita.psicologa_telefono
                : cita.paciente_telefono;

            return (
              <motion.div
                key={cita.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4, type: "spring" }}
                className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <p className="text-lg font-semibold text-black mb-2">
                  {usuario.rol === "paciente" ? "Psicóloga: " : "Paciente: "}
                  <span className="text-custom-green-1 font-bold">{nombre}</span>
                </p>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    Fecha: <span className="font-medium text-black">{formatearFecha(cita.fecha)}</span>
                  </p>

                  <p>
  Hora: <span className="font-medium text-black">{formatearHora(cita.hora)}</span>
</p>
 
                  <p>
                    Estado: <span className="font-medium text-black">{cita.estado}</span>
                  </p>
                  <p>
                    Servicio: <span className="font-medium text-black">{cita.servicio}</span>
                  </p>
                  <p>
                    Estado Cita:
                    <span className="ml-2 font-bold px-3 py-1 rounded-full text-white text-xs"
                      style={{
                        backgroundColor:
                          cita.estado_cita === "pendiente" ? "#FBBF24" : // amarillo
                            cita.estado_cita === "en_progreso" ? "#3B82F6" : // azul
                              cita.estado_cita === "finalizada" ? "#10B981" : // verde
                                cita.estado_cita === "cancelada" ? "#EF4444" : // rojo
                                  "#6B7280", // gris por defecto
                      }}
                    >
                      {cita.estado_cita.replace("_", " ").toUpperCase()}
                    </span>
                  </p>

                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <button
                    onClick={() => verDetalles(cita.id)}
                    className="w-full py-2 px-4 bg-custom-marron-1 text-white font-semibold rounded-full hover:brightness-110 transition-all duration-200 cursor-pointer"
                  >
                    Ver Detalles
                  </button>

                  <button
                    onClick={() => contactarPorWhatsApp(telefono)}
                    className="w-full py-2 px-4 bg-custom-green-1 text-white font-semibold rounded-full hover:bg-green-600 transition-all duration-200 cursor-pointer"
                  >
                    Contactar
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
