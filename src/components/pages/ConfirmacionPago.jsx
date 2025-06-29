import { useEffect, useCallback, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { verificarPago } from "../../services/pagos/pago"
import { guardarCita } from "../../services/citas/citas"
import { CheckCircle2, Home, CalendarCheck, Clock, ClipboardList, Tag } from "lucide-react"
import { RUTAS } from "../../routers/routers"
export default function ConfirmacionPago() {
  const navigate = useNavigate()
  const location = useLocation()
  const [citaData, setCitaData] = useState(null)
  const [loading, setLoading] = useState(true)

  const verificarPagoYGuardarCita = useCallback(async (sessionId) => {
    try {
      setLoading(true)
      const res = await verificarPago(sessionId)
      
      if (res?.success) {
        const citaGuardada = await guardarCita({ session_id: sessionId })
        localStorage.setItem(`procesado_${sessionId}`, "true")
        setCitaData(citaGuardada?.data || null)

      } else {
        console.warn("El pago no fue exitoso")
        navigate("/agenda/cancelado")
      }
    } catch (error) {
      console.error("Error al verificar el pago:", error)
      navigate("/agenda/cancelado")
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id")
    const yaProcesado = localStorage.getItem(`procesado_${sessionId}`)
    
    if (sessionId && !yaProcesado) {
      verificarPagoYGuardarCita(sessionId)
    } else {
      setLoading(false)
    }
  }, [location.search, verificarPagoYGuardarCita])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-screen flex flex-col items-center justify-center bg-white p-5"
      >
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#1c7578] border-t-transparent rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold text-[#1c7578]">Procesando tu pago...</h2>
          <p className="text-gray-600 mt-2">Por favor espera un momento</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full min-h-screen flex flex-col items-center justify-center bg-[#F8FCFD] p-5"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Encabezado */}
        <div className="bg-[#1c7578] p-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center justify-center bg-white rounded-full p-3 mb-4"
          >
            <CheckCircle2 className="text-[#1c7578]" size={48} strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">¡Pago exitoso!</h2>
          <p className="text-white/90 mt-2">Tu cita ha sido agendada correctamente</p>
        </div>

        {/* Detalles de la cita */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#1c7578] mb-4">Detalles de tu cita</h3>
          
          <div className="space-y-4">
            {citaData?.fecha && (
              <div className="flex items-start gap-3">
                <CalendarCheck className="text-[#3A6280] mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium text-[#1c7578]">
                    {new Date(citaData.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {citaData?.hora && (
              <div className="flex items-start gap-3">
                <Clock className="text-[#3A6280] mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="font-medium text-[#1c7578]">
                    {citaData.hora.slice(0, 5)}
                  </p>
                </div>
              </div>
            )}

            {citaData?.servicio && (
              <div className="flex items-start gap-3">
                <ClipboardList className="text-[#3A6280] mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Servicio</p>
                  <p className="font-medium text-[#1c7578]">
                    {citaData.servicio.titulo}
                  </p>
                </div>
              </div>
            )}

            {citaData?.monto && (
              <div className="flex items-start gap-3">
                <Tag className="text-[#3A6280] mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Monto pagado</p>
                  <p className="font-medium text-[#1c7578]">
                    {Number(citaData.monto).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Nota importante */}
          <div className="mt-6 p-3 bg-[#F5FAFC] rounded-lg border border-[#D9EEF6]">
            <p className="text-sm text-[#3A6280]">
              <span className="font-semibold">Nota:</span> Recibirás un correo electrónico con los detalles de tu cita y un enlace para acceder a la videollamada.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="p-4 bg-gray-50 border-t flex justify-center">
          <motion.button
            onClick={() => navigate(RUTAS.TUS_CITAS.ROOT)}
            className="px-6 py-3 bg-[#1c7578] text-white rounded-lg font-semibold hover:bg-[#3A6280] transition cursor-pointer flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home size={20} />
            Mi Citas
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}