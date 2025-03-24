import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
	const navigate = useNavigate();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
			className="w-full flex items-center justify-center h-full"
		>
			<div className="flex flex-col items-center justify-center p-5">
				<motion.h1
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
					className="montserrat-bold text-5xl text-white text-custom-marron-1"
				>
					Agenda tu cita
				</motion.h1>
				<motion.input
					type="button"
					value="Continuar"
					className="btn-continuar bg-custom-beige-2 text-white mt-15 font-bold py-2 px-6 cursor-pointer transition duration-300"
					onClick={() => navigate("/agenda")}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				/>
			</div>
		</motion.div>
	);
}
