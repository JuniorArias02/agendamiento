import { useState } from "react";
import { motion } from "framer-motion";
import { VALIDAR_CODIGO } from "../../api/registro";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerificarCuenta() {
	const navigate = useNavigate();
	const [codigo, setCodigo] = useState("");
	const [mensaje, setMensaje] = useState("");


	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await axios.post(VALIDAR_CODIGO, { codigo });
			setMensaje(res.data.mensaje);

			if (res.data.mensaje.includes("✅")) {
				setTimeout(() => navigate("/login"), 1500);
			}
		} catch (err) {
			setMensaje("Hubo un error, intenta más tarde.");
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#F9F4F0] px-4">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
			>
				<h2 className="text-2xl font-semibold text-center text-[#B68F72]">
					Verificar cuenta
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						value={codigo}
						onChange={(e) => setCodigo(e.target.value)}
						placeholder="Código de verificación"
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B68F72]"
					/>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type="submit"
						className="w-full bg-[#B68F72] text-white py-2 rounded-lg font-medium shadow hover:bg-[#9C745C] transition"
					>
						Verificar
					</motion.button>
				</form>

				{mensaje && (
					<p className="text-center text-sm text-[#6B6B6B] mt-4">{mensaje}</p>
				)}
			</motion.div>
		</div>

	);
}