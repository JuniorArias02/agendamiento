import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, ArrowRight, Heart, Sparkles, Clock, Users, Shield, Brain, Leaf } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
	const navigate = useNavigate();
	const { usuario } = useAuth();

	// Animación de partículas suaves
	const FloatingParticles = () => (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{[...Array(12)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute text-emerald-300/20"
					initial={{
						y: Math.random() * 100,
						x: Math.random() * window.innerWidth,
					}}
					animate={{
						y: [null, Math.random() * 50 + 50],
						x: [null, Math.random() * 100 - 50],
					}}
					transition={{
						duration: Math.random() * 15 + 15,
						repeat: Infinity,
						ease: "easeInOut"
					}}
					style={{
						fontSize: Math.random() * 16 + 8,
						opacity: Math.random() * 0.3 + 0.1
					}}
				>
					•
				</motion.div>
			))}
		</div>
	);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50/70 via-teal-50/50 to-green-50/50"
		>
			{/* Fondos decorativos sutiles */}
			<div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>
			<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"></div>

			<FloatingParticles />

			{/* Contenido principal */}
			<div className="relative z-10 min-h-screen flex items-center justify-center p-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="max-w-4xl w-full"
				>
					<div className="grid md:grid-cols-2 gap-10 items-center">
						{/* Columna izquierda - Texto principal */}
						<div className="space-y-8">
							<motion.div
								initial={{ opacity: 0, x: -30 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3, duration: 0.7 }}
								className="space-y-6"
							>
								<div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200 shadow-sm">
									<div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
									<span className="text-sm font-medium text-emerald-700">Espacio seguro y confidencial</span>
								</div>

								<h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800">
									<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
										Tu bienestar
									</span>
									<br />
									<span className="bg-gradient-to-r from-teal-600 to-green-500 bg-clip-text text-transparent">
										emocional importa
									</span>
								</h1>
								<p className="text-lg text-gray-600 leading-relaxed">
									Hola, soy Luzmarina. Estoy aquí para escucharte y acompañarte en tu camino hacia el equilibrio y el bienestar emocional, en un espacio seguro y de confianza.
								</p>

							</motion.div>

							<motion.button
								onClick={() => navigate("/nueva_agenda")}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6, duration: 0.5 }}
								whileHover={{
									scale: 1.02,
									boxShadow: "0 10px 30px -5px rgba(16, 185, 129, 0.3)"
								}}
								whileTap={{ scale: 0.98 }}
								className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
							>
								<span className="relative z-10">Agendar sesión</span>
								<ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
								<div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</motion.button>

							{/* Stats */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.8, duration: 0.5 }}
								className="grid grid-cols-3 gap-4 pt-6"
							>
								{[
									{ icon: Users, number: "300+", text: "Pacientes", color: "bg-emerald-100 text-emerald-600" },
									{ icon: Clock, number: "Flex", text: "Horarios", color: "bg-teal-100 text-teal-600" },
									{ icon: Heart, number: "100%", text: "Confianza", color: "bg-green-100 text-green-600" }
								].map((stat, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
										className={`text-center p-4 rounded-lg border border-white/30 backdrop-blur-sm ${stat.color}`}
									>
										<stat.icon className="w-5 h-5 mx-auto mb-2" />
										<div className="font-bold text-sm">{stat.number}</div>
										<div className="text-xs">{stat.text}</div>
									</motion.div>
								))}
							</motion.div>
						</div>

						{/* Columna derecha - Tarjeta de psicóloga */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5, duration: 0.8 }}
							className="relative"
						>
							<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
								<div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
									<Brain className="w-6 h-6 text-white" />
								</div>

								<div className="space-y-6">
									<div className="text-center">
										<div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
											<img
												src="perfil.png"
												alt="Dra. Luzmarina Sepúlveda"
												className="w-full h-full object-cover rounded-full"
											/>
										</div>
										<h3 className="text-xl font-semibold text-gray-800">Dra. Luzmarina Sepúlveda</h3>
										<p className="text-emerald-600 text-sm mt-1">Psicóloga</p>
									</div>


									<div className="space-y-3">
										{[
											"Atención 100% online, desde donde estés",
											"Terapia individual personalizada",
											"Enfoque cálido, humano y empático",
											"Confidencialidad absoluta en cada sesión",
											"Estrategias y herramientas prácticas para tu día a día"
										].map((benefit, index) => (
											<motion.div
												key={index}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
												className="flex items-start gap-3 text-gray-700 text-sm"
											>
												<div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
													<div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
												</div>
												<span>{benefit}</span>
											</motion.div>
										))}
									</div>


									<div className="pt-4 border-t border-gray-200/50">
										<div className="flex items-center justify-center gap-2 text-xs text-gray-500">
											<Shield className="w-3 h-3 text-emerald-500" />
											<span>Confidencialidad profesional garantizada</span>
										</div>
									</div>
								</div>
							</div>

							{/* Elemento decorativo */}
							<motion.div
								animate={{
									y: [0, -5, 0],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut"
								}}
								className="absolute -bottom-2 -left-2 w-10 h-10 bg-teal-100/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20"
							>
								<Sparkles className="w-4 h-4 text-emerald-400" />
							</motion.div>
						</motion.div>
					</div>

					{/* Enlace de inicio de sesión */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1.2, duration: 0.5 }}
						className="text-center mt-12"
					>
						<p className="text-gray-600 text-sm">
							¿Ya eres paciente?{" "}
							<button
								onClick={() => navigate("/login")}
								className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors underline underline-offset-2"
							>
								Iniciar sesión
							</button>
						</p>
					</motion.div>
				</motion.div>
			</div>
		</motion.div>
	);
}
