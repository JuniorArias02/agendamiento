import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BotonAuth() {
	const { usuario, logout } = useAuth();
	const navigate = useNavigate();

	const handleLoginLogout = () => {
		if (usuario) {
			logout();
		} else {
			navigate("/login");
		}
	};

	return (
		<motion.button
			onClick={handleLoginLogout}
			className="absolute top-5 right-5 py-2 px-6 font-bold text-white rounded-full bg-custom-marron-1 hover:bg-custom-marron-2 transition duration-300 z-10 cursor-pointer"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
		>
			{usuario ? "Cerrar sesión" : "Iniciar sesión"}
		</motion.button>
	);
}
