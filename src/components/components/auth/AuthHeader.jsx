import { motion } from "framer-motion";

export default function AuthHeader({ title }) {
  return (
    <div className="bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] p-6 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-white"
      >
        {title}
      </motion.h2>
    </div>
  );
}
