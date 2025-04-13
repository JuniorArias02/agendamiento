import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function ConfirmarAgenda() {
	const location = useLocation();
	const navigate = useNavigate();
	const selectedDate = location.state?.selectedDate;

	// Redirigir si no hay fecha seleccionada
	useEffect(() => {
		if (!selectedDate) {
			navigate("/agenda");
		}
	}, [selectedDate, navigate]);

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="w-full h-screen flex flex-col items-center justify-center bg-white p-5"
		>
			<h2 className="text-3xl font-bold text-gray-800">¿Deseas continuar?</h2>
			<p className="text-lg text-gray-600 mt-4 text-center">
				Estás a punto de agendar una nueva cita para el <br />
				<span className="text-custom-marron-1 font-semibold text-xl">
					{selectedDate && location.state?.selectedTime
						? `${new Date(selectedDate).toLocaleDateString()} a las ${location.state.selectedTime}`
						: "No seleccionaste fecha"}
				</span>
			</p>

			<div className="flex gap-4 mt-6">
				<motion.button
					onClick={() => navigate("/agenda")}
					className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition cursor-pointer"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					Regresar
				</motion.button>
				<motion.button
					onClick={() => navigate("/agenda/cita-confirmada")}
					className="confir-cita px-6 py-2 bg-custom-beige-2 text-white rounded-lg font-semibold hover:bg-opacity-90 transition cursor-pointer"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					Confirmar
				</motion.button>
			</div>
		</motion.div>
	);
}
