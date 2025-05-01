import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { obtenerCitas } from "../../services/citas";
import { motion } from "framer-motion";
import { PENDIENTE, RETARDO, EN_PROGRESO, FINALIZADA } from "../../api/estados_citas";
import axios from 'axios';
import { ACTUALIZAR_ESTADO_CITA } from "../../api/servicios";
import { Loader } from "lucide-react";
import Swal from 'sweetalert2';

export default function TusCitas() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [citas, setCitas] = useState([]);
  console.log("Usuario en Dashboard:", citas);
  const [isClicked, setIsClicked] = useState(false); // Estado para el clic

  const ingresarACita = async (citaId, enlaceCita) => {
    if (isClicked) return; // Si ya está clickeado, no hacemos nada más

    setIsClicked(true); // Marcamos como clickeado

    // Mostramos la advertencia de SweetAlert
    const result = await Swal.fire({
      title: 'Advertencia',
      text: 'El estado de la cita cambiará a "en progreso". ¿Estás seguro de continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'No, cancelar',
    });

    if (!result.isConfirmed) {
      setIsClicked(false); // Habilitamos el botón si se cancela
      return; // No hacemos nada si el usuario cancela
    }

    try {
      // Primero actualizamos el estado de la cita a "en progreso" en el backend usando Axios
      await axios.post(`${ACTUALIZAR_ESTADO_CITA}?id=${citaId}`, {
        estado_cita: "en progreso",
      });

      // Ahora abrimos el enlace de la cita
      window.open(enlaceCita, "_blank");

      // Opcional: Actualizamos el estado local de las citas en React para reflejar el cambio inmediato
      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.id === citaId
            ? { ...cita, estado_cita: "en progreso" } // Actualizamos el estado de la cita en la UI
            : cita
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
    } finally {
      setIsClicked(false); // Habilitamos el botón después de un tiempo o proceso
    }
  };

  const esMismoDia = (fechaCita) => {
    const hoy = new Date();
    const fechaCitaObj = new Date(fechaCita);

    hoy.setHours(0, 0, 0, 0);
    fechaCitaObj.setHours(0, 0, 0, 0);

    return hoy.getTime() === fechaCitaObj.getTime();
  };


  useEffect(() => {
    if (usuario) {
      obtenerCitas(usuario.id).then(setCitas);
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      const interval = setInterval(() => {
        obtenerCitas(usuario.id).then(setCitas);
      }, 30000); // Actualiza cada 30 segundos

      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(interval);
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

  const [filtroEstado, setFiltroEstado] = useState(null);


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {[PENDIENTE, EN_PROGRESO, FINALIZADA, RETARDO].map((estado) => (
          <button
            key={estado.valor}
            onClick={() => setFiltroEstado(estado.valor)}
            className={`px-4 py-2 rounded-full font-semibold text-white text-sm transition-all duration-200 ${filtroEstado === estado.valor ? "brightness-110 scale-105" : "opacity-80"
              }`}
            style={{ backgroundColor: estado.color }}
          >
            {estado.valor.toUpperCase()}
          </button>
        ))}
        <button
          onClick={() => setFiltroEstado(null)}
          className="px-4 py-2 rounded-full font-semibold text-gray-700 border border-gray-400 text-sm"
        >
          TODOS
        </button>
      </div>

      <h1 className="text-4xl font-bold text-black mb-10 text-center montserrat-bold">
        Tus Citas
      </h1>

      {citas.length === 0 ? (
        <p className="text-center text-lg text-gray-500">
          No hay citas registradas.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {citas
            .filter((cita) => !filtroEstado || cita.estado_cita === filtroEstado)
            .map((cita, index) => {

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
                      <span
                        className="ml-2 font-bold px-3 py-1 rounded-full text-white text-xs"
                        style={{
                          backgroundColor:
                            cita.estado_cita === PENDIENTE.valor ? PENDIENTE.color :
                              cita.estado_cita === EN_PROGRESO.valor ? EN_PROGRESO.color :
                                cita.estado_cita === FINALIZADA.valor ? FINALIZADA.color :
                                  cita.estado_cita === RETARDO.valor ? RETARDO.color :
                                    "#6B7280", // Gris por defecto
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
                    {(cita.estado_cita === PENDIENTE.valor || cita.estado_cita === RETARDO.valor || cita.estado_cita === EN_PROGRESO.valor) && cita.enlace_cita && esMismoDia(cita.fecha) && (
                      <button
                        onClick={() => ingresarACita(cita.id, cita.enlace_cita)}
                        disabled={isClicked} // Deshabilita el botón después de hacer clic
                        className="w-full py-2 px-4 bg-custom-blue-link text-white font-semibold rounded-full hover:bg-indigo-700 transition-all duration-200 cursor-pointer"
                      >
                        {isClicked ? (
                          <div className="flex items-center justify-center">
                            <Loader className="animate-spin mr-2" size={20} />
                            <span>Ingresando...</span>
                          </div>
                        ) : (
                          "Ingresar a la Cita"
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}
