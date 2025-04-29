import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CanceladoAgenda() {
	const navigate = useNavigate();

	useEffect(() => {
		// Aquí puedes mostrar un mensaje después de la redirección, si lo deseas
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="w-full h-screen flex flex-col items-center justify-center bg-white p-5"
		>
			<h2 className="text-3xl font-bold text-red-600">La cita fue cancelada</h2>
			<p className="text-lg text-gray-600 mt-4 text-center">
				Parece que decidiste no continuar con el pago de la cita. <br />
				Si cambias de opinión, puedes intentarlo nuevamente.
			</p>

			<div className="flex gap-4 mt-6">
				<motion.button
					onClick={() => navigate("/agenda")}
					className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition cursor-pointer"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					Volver a Agenda
				</motion.button>
				<motion.button
					onClick={() => navigate("/")}
					className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					Salir
				</motion.button>
			</div>
		</motion.div>
	);
}
