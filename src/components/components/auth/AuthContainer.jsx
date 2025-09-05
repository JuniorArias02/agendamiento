import { motion } from "framer-motion";

export default function AuthContainer({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6EC1E4]/10 to-[#61CE70]/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondos decorativos */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#6EC1E4]/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#61CE70]/20 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20"
      >
        {children}
      </motion.div>
    </div>
  );
}
