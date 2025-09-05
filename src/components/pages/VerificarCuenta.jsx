import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { validarCodigo } from "../../services/auth/auth_services";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, CheckCircle, ArrowLeft, Mail, RotateCcw } from "lucide-react";

export default function VerificarCuenta() {
	const navigate = useNavigate();
	const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
	const [mensaje, setMensaje] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isVerified, setIsVerified] = useState(false);

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

		const fullCode = codigo.join("");

		try {
			const res = await validarCodigo(fullCode);
			setMensaje(res.mensaje);

			if (res.mensaje.includes("✅")) {
				setIsVerified(true);
				setTimeout(() => navigate("/login"), 2000);
			}
		} catch (err) {
			setMensaje("Hubo un error, intenta más tarde.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	// Reenviar código
	const handleResendCode = () => {
		setMensaje("Te hemos enviado un nuevo código");
		// Aquí iría la lógica para reenviar el código
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
							<LockKeyhole className="w-8 h-8 text-white" />
						</div>
						<h2 className="text-2xl font-bold text-white">
							Verifica tu cuenta
						</h2>
						<p className="text-white/90 mt-2 text-sm">
							Ingresa el código de 6 dígitos que enviamos a tu correo
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
									/>
								))}
							</div>
						</motion.div>

						{/* Botón con animación y estados de carga */}
						<motion.button
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							whileHover={{
								scale: isLoading ? 1 : 1.02,
								boxShadow: isLoading ? "none" : "0 4px 15px -3px rgba(5, 150, 105, 0.3)"
							}}
							whileTap={{ scale: 0.98 }}
							type="submit"
							disabled={isLoading || isVerified}
							className="w-full bg-emerald-600 text-white py-3.5 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<>
									<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
									<span>Verificando...</span>
								</>
							) : isVerified ? (
								<>
									<CheckCircle className="w-5 h-5" />
									<span>¡Verificado!</span>
								</>
							) : (
								<>
									<CheckCircle className="w-5 h-5" />
									<span>Verificar ahora</span>
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
								className={`p-3 rounded-lg text-center text-sm ${mensaje.includes("éxito") || mensaje.includes("✅") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
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