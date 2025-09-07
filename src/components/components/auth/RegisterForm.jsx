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
            {/* --- América --- */}
            <option value="+1">+1 (US/CA) Estados Unidos / Canadá</option>
            <option value="+52">+52 (MX) México</option>
            <option value="+57">+57 (CO) Colombia</option>
            <option value="+54">+54 (AR) Argentina</option>
            <option value="+55">+55 (BR) Brasil</option>
            <option value="+56">+56 (CL) Chile</option>
            <option value="+51">+51 (PE) Perú</option>
            <option value="+58">+58 (VE) Venezuela</option>
            <option value="+502">+502 (GT) Guatemala</option>
            <option value="+503">+503 (SV) El Salvador</option>
            <option value="+504">+504 (HN) Honduras</option>
            <option value="+505">+505 (NI) Nicaragua</option>
            <option value="+506">+506 (CR) Costa Rica</option>
            <option value="+507">+507 (PA) Panamá</option>
            <option value="+509">+509 (HT) Haití</option>
            <option value="+53">+53 (CU) Cuba</option>
            <option value="+592">+592 (GY) Guyana</option>
            <option value="+597">+597 (SR) Surinam</option>
            <option value="+593">+593 (EC) Ecuador</option>
            <option value="+595">+595 (PY) Paraguay</option>
            <option value="+598">+598 (UY) Uruguay</option>
            <option value="+1-809">+1-809 (DO) República Dominicana</option>
            <option value="+1-876">+1-876 (JM) Jamaica</option>
            <option value="+1-246">+1-246 (BB) Barbados</option>
            <option value="+1-441">+1-441 (BM) Bermudas</option>

            {/* --- Europa --- */}
            <option value="+34">+34 (ES) España</option>
            <option value="+39">+39 (IT) Italia</option>
            <option value="+33">+33 (FR) Francia</option>
            <option value="+49">+49 (DE) Alemania</option>
            <option value="+44">+44 (UK) Reino Unido</option>
            <option value="+351">+351 (PT) Portugal</option>
            <option value="+31">+31 (NL) Países Bajos</option>
            <option value="+32">+32 (BE) Bélgica</option>
            <option value="+41">+41 (CH) Suiza</option>
            <option value="+43">+43 (AT) Austria</option>
            <option value="+46">+46 (SE) Suecia</option>
            <option value="+47">+47 (NO) Noruega</option>
            <option value="+45">+45 (DK) Dinamarca</option>
            <option value="+358">+358 (FI) Finlandia</option>
            <option value="+420">+420 (CZ) República Checa</option>
            <option value="+48">+48 (PL) Polonia</option>
            <option value="+30">+30 (GR) Grecia</option>
            <option value="+36">+36 (HU) Hungría</option>
            <option value="+40">+40 (RO) Rumanía</option>
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
