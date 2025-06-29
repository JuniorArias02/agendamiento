import { useState } from "react";
import { motion } from "framer-motion";
import { validarCodigo } from "../../services/auth/auth_services";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, CheckCircle } from "lucide-react";

export default function VerificarCuenta() {
	const navigate = useNavigate();
	const [codigo, setCodigo] = useState("");
	const [mensaje, setMensaje] = useState("");


	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await validarCodigo(codigo);
			setMensaje(res.mensaje);

			if (res.mensaje.includes("✅")) {
				setTimeout(() => navigate("/login"), 1500);
			}
		} catch (err) {
			setMensaje("Hubo un error, intenta más tarde.");
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6EC1E4]/10 to-[#61CE70]/10 p-4 relative">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
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
						Verificar tu cuenta
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="text-white/90 mt-1"
					>
						Ingresa el código que te enviamos
					</motion.p>
				</div>

				<div className="p-6 sm:p-8 space-y-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Input con icono */}
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 }}
							className="relative"
						>
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<LockKeyhole className="w-5 h-5 text-[#6EC1E4]" />
							</div>
							<input
								type="text"
								value={codigo}
								onChange={(e) => setCodigo(e.target.value)}
								placeholder="Código de verificación"
								className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
								required
							/>
						</motion.div>

						{/* Botón con animación */}
						<motion.button
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							whileHover={{
								scale: 1.02,
								boxShadow: "0 4px 15px -3px rgba(110, 193, 228, 0.4)"
							}}
							whileTap={{ scale: 0.98 }}
							type="submit"
							className="w-full bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
						>
							<CheckCircle className="w-5 h-5" />
							<span>Verificar ahora</span>
						</motion.button>
					</form>

					{/* Mensaje de estado */}
					{mensaje && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className={`p-3 rounded-lg text-center text-sm ${mensaje.includes("éxito") ? "bg-[#61CE70]/10 text-[#61CE70]" : "bg-[#FF6B6B]/10 text-[#FF6B6B]"}`}
						>
							{mensaje}
						</motion.div>
					)}
				</div>
			</motion.div>
		</div>
	);
}