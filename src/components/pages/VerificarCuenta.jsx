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
				setTimeout(() => navigate("/agenda"), 1500);
			}
		} catch (err) {
			setMensaje("Hubo un error, intenta más tarde.");
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
			>
				<h2 className="text-2xl font-bold text-center text-indigo-600">Verificar cuenta</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						value={codigo}
						onChange={(e) => setCodigo(e.target.value)}
						placeholder="Código de verificación"
						className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300"
					/>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type="submit"
						className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
					>
						Verificar
					</motion.button>
				</form>

				{mensaje && (
					<p className="text-center text-sm text-gray-600 mt-4">{mensaje}</p>
				)}
			</motion.div>
		</div>
	);
}