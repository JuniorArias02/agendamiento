import { motion } from "framer-motion";
import { User, IdCard, Phone, ChevronDown, Mail, Lock, UserPlus } from "lucide-react";

export default function RegisterForm({
  nombre, setNombre,
  documento, setDocumento,
  telefono, setTelefono,
  telefonoPrefijo, setTelefonoPrefijo,
  correo, setCorreo,
  contrasena, setContrasena
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-5">

      {/* Nombre */}
      <div className="relative">
        <User className="w-5 h-5 text-[#6EC1E4] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
          required
        />
      </div>

      {/* Documento */}
      <div className="relative">
        <IdCard className="w-5 h-5 text-[#6EC1E4] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
          required
        />
      </div>

      {/* Teléfono */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1 relative">
          <Phone className="w-5 h-5 text-[#6EC1E4] absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={telefonoPrefijo}
            onChange={(e) => setTelefonoPrefijo(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none appearance-none"
            required
          >
            <option value="+57">+57 (CO) Colombia</option>
            <option value="+54">+54 (AR) Argentina</option>
            <option value="+52">+52 (MX) México</option>
            <option value="+1">+1 (US/CA) Estados Unidos / Canadá</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6EC1E4]" />
        </div>
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Número de teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
            required
          />
        </div>
      </div>

      {/* Correo */}
      <div className="relative">
        <Mail className="w-5 h-5 text-[#6EC1E4] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
          required
        />
      </div>

      {/* Contraseña */}
      <div className="relative">
        <Lock className="w-5 h-5 text-[#6EC1E4] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
          required
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        <UserPlus className="w-5 h-5" />
        <span>Registrarse</span>
      </motion.button>
    </motion.div>
  );
}
