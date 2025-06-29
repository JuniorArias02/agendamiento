import { useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { XCircle, Calendar, Home, RotateCw } from "lucide-react"

export default function CanceladoAgenda() {
  const navigate = useNavigate()

  useEffect(() => {
    // Aquí puedes mostrar un mensaje después de la redirección, si lo deseas
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FFF5F5] p-5"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Encabezado */}
        <div className="bg-red-100 p-6 text-center border-b border-red-200">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center bg-red-500 text-white rounded-full p-3 mb-4"
          >
            <XCircle size={48} strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-2xl font-bold text-red-600">Cita cancelada</h2>
          <p className="text-red-500 mt-2">No se completó el proceso de pago</p>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              Parece que decidiste no continuar con el pago de la cita.
            </p>
            <p className="text-gray-600">
              Si fue un error o cambias de opinión, puedes intentarlo nuevamente.
            </p>
          </div>

          {/* Opciones */}
          <div className="space-y-3">
            <motion.button
              onClick={() => navigate("/agenda")}
              className="w-full py-3 px-4 bg-[#1c7578] text-white rounded-lg font-medium hover:bg-[#3A6280] transition flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCw size={20} />
              Intentar nuevamente
            </motion.button>

            <motion.button
              onClick={() => navigate("/servicios")}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar size={20} />
              Ver otros servicios
            </motion.button>

            <motion.button
              onClick={() => navigate("/")}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home size={20} />
              Volver al inicio
            </motion.button>
          </div>
        </div>

        {/* Mensaje adicional */}
        <div className="p-4 bg-gray-50 border-t text-center">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? <a href="#" className="text-[#1c7578] hover:underline">Contáctanos</a>
          </p>
        </div>
      </div>
    </motion.div>
  )
}