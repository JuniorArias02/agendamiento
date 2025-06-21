import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, ArrowRightCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export default function Home() {
	const navigate = useNavigate();
	const { usuario } = useAuth();
	// console.log("Usuario en Home:", usuario);
	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
			className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6EC1E4]/10 to-[#61CE70]/10"
		>
			<div className="max-w-md w-full p-8 rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-white/20">
				<div className="flex flex-col items-center text-center space-y-8">
					{/* Icono animado */}
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
						className="p-4 bg-gradient-to-br from-[#6EC1E4] to-[#61CE70] rounded-2xl shadow-lg"
					>
						<CalendarCheck className="w-12 h-12 text-white" />
					</motion.div>

					{/* Título con animación */}
					<motion.h1
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
						className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] bg-clip-text text-transparent"
					>
						Agenda tu cita
					</motion.h1>

					{/* Texto descriptivo */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.4 }}
						className="text-[#5A6D8B] text-lg"
					>
						Encuentra el horario perfecto para tu bienestar emocional
					</motion.p>

					{/* Botón con animaciones */}
					<motion.button
						onClick={() => navigate("/nueva_agenda")}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						whileHover={{
							scale: 1.05,
							boxShadow: "0 10px 20px -5px rgba(110, 193, 228, 0.3)"
						}}
						whileTap={{ scale: 0.98 }}
						className="mt-6 w-full max-w-xs py-3 px-6 bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] text-white font-semibold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2"
					>
						<ArrowRightCircle className="w-5 h-5" />
						<span>Continuar</span>
					</motion.button>

					{/* Enlace "Iniciar sesión" con animación */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1, duration: 0.5 }}
						className="w-full text-center"
					>
						<p className="text-[#6D8BAB] text-sm mb-2">
							¿Ya tienes una cuenta?
						</p>
						<motion.a
							href="/login"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="text-[#6EC1E4] font-medium hover:text-[#5aa8d1] transition-colors duration-200 underline underline-offset-4"
						>
							Iniciar sesión
						</motion.a>
					</motion.div>

					{/* Elemento decorativo adicional */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1.2, duration: 0.5 }}
						className="flex items-center gap-2 mt-4 text-[#6D8BAB] text-sm"
					>
						<ShieldCheck className="w-4 h-4 text-[#61CE70]" />
						<span>Citas 100% seguras y confidenciales</span>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
}
