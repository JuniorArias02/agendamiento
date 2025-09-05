import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

export default function RecoverForm({ correoRecuperar, setCorreoRecuperar, handleRecuperar }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-5">
      <div className="relative">
        <Mail className="w-5 h-5 text-[#6EC1E4] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correoRecuperar}
          onChange={(e) => setCorreoRecuperar(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
          required
        />
      </div>

      <motion.button
        type="button"
        onClick={handleRecuperar}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        <span>Enviar código</span>
      </motion.button>
    </motion.div>
  );
}
