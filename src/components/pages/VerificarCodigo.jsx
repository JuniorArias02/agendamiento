import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { cambiarContrasena } from "../../services/auth/auth_services";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Lock, RefreshCw, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

export default function VerificarCodigo() {
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Manejar cambio en inputs de código
  const handleCodeChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newCode = [...codigo];
    newCode[index] = value;
    setCodigo(newCode);
    
    // Auto-focus al siguiente input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  // Manejar teclas (backspace)
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje("");
    
    const fullCode = codigo.join("");

    try {
      const data = await cambiarContrasena({ codigo: fullCode, nuevaContrasena });

      if (data.success) {
        setMensaje("✅ Contraseña cambiada con éxito");
        setIsSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMensaje("❌ " + data.message);
      }
    } catch (error) {
      setMensaje("Hubo un error al cambiar la contraseña.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/30 relative z-10"
      >
        {/* Header con gradiente moderno */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-teal-400/20 rounded-full"></div>
          
          <button 
            onClick={() => navigate(-1)}
            className="absolute left-5 top-5 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Nueva Contraseña
            </h2>
            <p className="text-white/90 mt-2 text-sm">
              Ingresa el código y tu nueva contraseña
            </p>
          </motion.div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Inputs de código con diseño moderno */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <label className="block text-sm font-medium text-gray-700 text-center">
                Código de verificación
              </label>
              
              <div className="flex justify-center space-x-2">
                {codigo.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 bg-white shadow-sm transition-all"
                    required
                    disabled={isLoading || isSuccess}
                  />
                ))}
              </div>
            </motion.div>

            {/* Campo de nueva contraseña */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  placeholder="Ingresa tu nueva contraseña"
                  value={nuevaContrasena}
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                  required
                  disabled={isLoading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  disabled={isLoading || isSuccess}
                >
                  {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números
              </p>
            </motion.div>

            {/* Botón con animación y estados de carga */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{
                scale: isLoading || isSuccess ? 1 : 1.02,
                boxShadow: isLoading || isSuccess ? "none" : "0 4px 15px -3px rgba(5, 150, 105, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || isSuccess || nuevaContrasena.length < 8}
              className="w-full bg-emerald-600 text-white py-3.5 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Cambiando...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>¡Contraseña cambiada!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Cambiar contraseña</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Mensaje de estado con animación */}
          <AnimatePresence>
            {mensaje && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-3 rounded-lg text-center text-sm ${mensaje.includes("✅") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
              >
                {mensaje}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}