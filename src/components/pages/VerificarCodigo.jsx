import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { cambiarContrasena } from "../../services/auth/auth_services";
import { motion } from "framer-motion";
import { Key, Lock, RefreshCw } from "lucide-react";

export default function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await cambiarContrasena({ codigo, nuevaContrasena });

      if (data.success) {
        alert("✅ Contraseña cambiada con éxito");
        navigate("/login");
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      alert("Hubo un error al cambiar la contraseña.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6EC1E4]/10 to-[#61CE70]/10 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#6EC1E4]/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#61CE70]/20 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20"
      >
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] p-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white"
          >
            Cambiar Contraseña
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/90 mt-2 text-sm"
          >
            Ingresa tu código y nueva contraseña
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Campo de código */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="w-5 h-5 text-[#6EC1E4]" />
            </div>
            <input
              type="text"
              placeholder="Código de verificación"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
              required
            />
          </motion.div>

          {/* Campo de nueva contraseña */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-[#6EC1E4]" />
            </div>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
              required
            />
          </motion.div>

          {/* Botón de enviar */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            type="submit"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 15px -3px rgba(110, 193, 228, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Cambiar contraseña</span>
          </motion.button>
        </form>
      </motion.div>
    </div>

  );
}
