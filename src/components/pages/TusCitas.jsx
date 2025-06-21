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
import FiltroCitas from "../ui/FiltroCitas";
import TemporizadorCita from "../ui/TemporizadorCita";
import SkeletonCard from "../layout/SkeletonCard";

export default function TusCitas() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log("Usuario en Dashboard:", citas);
  const [clickedStates, setClickedStates] = useState({});
  const [filtroAbierto, setFiltroAbierto] = useState(false);


  const ingresarACita = async (citaId, enlaceCita) => {
    if (clickedStates[citaId]) return;
    setClickedStates(prev => ({ ...prev, [citaId]: true }));

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
      setClickedStates(prev => ({ ...prev, [citaId]: false }));

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
      setClickedStates(prev => ({ ...prev, [citaId]: false }));
    }
  };

  const esHoyOMasAntiguo = (fechaCita) => {
    const hoy = new Date();
    const fechaCitaObj = new Date(fechaCita + "T00:00:00");

    hoy.setHours(0, 0, 0, 0);
    fechaCitaObj.setHours(0, 0, 0, 0);

    return fechaCitaObj.getTime() <= hoy.getTime();
  };


  useEffect(() => {
    if (!usuario) return;

    const cargarCitas = () => {
      obtenerCitas(usuario.id).then(data => {
        if (Array.isArray(data)) {
          setCitas(data);
        } else {
          setCitas([]);
        }
        setLoading(false);
      });
    };

    cargarCitas(); // carga al inicio

    const intervalo = setInterval(() => {
      cargarCitas(); // recarga cada 3 minutos
    }, 3 * 60 * 1000);

    return () => clearInterval(intervalo); // limpia el intervalo al desmontar el componente
  }, [usuario]);

  // useEffect(() => {
  //   if (usuario) {
  //     obtenerCitas(usuario.id).then(data => {
  //       if (Array.isArray(data)) {
  //         setCitas(data);
  //       } else {
  //         setCitas([]);
  //       }
  //       setLoading(false);
  //     });
  //   }
  // }, [usuario]);

  const verDetalles = (idCita) => {
    // alert("Ver detalles de la cita con ID: " + idCita);
    navigate(`/cita/${idCita}`);
  };

  const formatearFecha = (fechaString) => {
    const opciones = { day: "2-digit", month: "long", year: "numeric" };
    const [year, month, day] = fechaString.split("-");
    const fecha = new Date(Number(year), Number(month) - 1, Number(day));
    return fecha.toLocaleDateString("es-ES", opciones);
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

  const abrirAnotaciones = (idCita) => {
    navigate(`/informe_psicologico/${idCita}`);
    // console.log("Abrir anotaciones para la cita con ID:", idCita);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FiltroCitas
        setFiltroEstado={setFiltroEstado}
        filtroEstado={filtroEstado}
        setFiltroAbierto={setFiltroAbierto}
        filtroAbierto={filtroAbierto}
      />

      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] bg-clip-text text-transparent mb-3">
          Tus Citas
        </h1>
        <p className="text-[#6D8BAB] text-lg">Gestiona tus citas de forma sencilla e intuitiva</p>
      </div>

      {citas.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {citas
            .filter((cita) => !filtroEstado || cita.estado_cita === filtroEstado)
            .map((cita, index) => {
              const nombre = usuario.rol === "paciente" ? cita.psicologa : cita.paciente;
              const telefono = usuario.rol === "paciente" ? cita.telefono_psicologa : cita.telefono_paciente;

              return (
                <motion.div
                  key={cita.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4, type: "spring" }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-lg"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-xl font-bold text-gray-800">
                      {usuario.rol === "paciente" ? "Psicóloga: " : "Paciente: "}
                      <span className="text-[#5A6D8B]">{nombre}</span>
                    </p>

                    <span
                      className="font-bold px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor:
                          cita.estado_cita === PENDIENTE.valor ? "rgba(110, 193, 228, 0.2)" :
                            cita.estado_cita === EN_PROGRESO.valor ? "rgba(97, 206, 112, 0.2)" :
                              cita.estado_cita === FINALIZADA.valor ? "rgba(97, 206, 112, 0.3)" :
                                cita.estado_cita === RETARDO.valor ? "rgba(255, 107, 107, 0.2)" :
                                  "rgba(192, 201, 209, 0.2)",
                        color:
                          cita.estado_cita === PENDIENTE.valor ? "#6EC1E4" :
                            cita.estado_cita === EN_PROGRESO.valor ? "#61CE70" :
                              cita.estado_cita === FINALIZADA.valor ? "#4CAF50" :
                                cita.estado_cita === RETARDO.valor ? "#FF6B6B" :
                                  "#5A6D8B"
                      }}
                    >
                      {cita.estado_cita.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-[#6EC1E4] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-gray-600">{formatearFecha(cita.fecha)}</span>
                    </div>

                    <TemporizadorCita citaId={cita.id} />

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-[#6EC1E4] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-600">{formatearHora(cita.hora)}</span>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-[#6EC1E4] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      <span className="text-gray-600">{cita.servicio}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => verDetalles(cita.id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Ver Detalles
                    </button>

                    <button
                      onClick={() => contactarPorWhatsApp(telefono)}
                      className="w-full py-3 px-4 bg-white border border-[#61CE70] text-[#61CE70] font-semibold rounded-xl hover:bg-[#61CE70] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                      </svg>
                      Contactar
                    </button>

                    {usuario.rol === "psicologa" && (
                      <button
                        onClick={() => abrirAnotaciones(cita.id)}
                        className="w-full py-3 px-4 bg-white border border-[#6EC1E4] text-[#6EC1E4] font-semibold rounded-xl hover:bg-[#6EC1E4] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Anotaciones
                      </button>
                    )}

                    {(cita.estado_cita === PENDIENTE.valor || cita.estado_cita === RETARDO.valor || cita.estado_cita === EN_PROGRESO.valor) && cita.enlace_cita && esHoyOMasAntiguo(cita.fecha) && (
                      <button
                        onClick={() => ingresarACita(cita.id, cita.enlace_cita)}
                        disabled={clickedStates[cita.id]}
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#61CE70] to-[#6EC1E4] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {clickedStates[cita.id] ? (
                          <>
                            <Loader className="animate-spin" size={20} />
                            <span>Ingresando...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Ingresar a la Cita
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </div>
      )}
    </div>
  );
}
