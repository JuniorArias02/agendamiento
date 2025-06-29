import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerHistorialAccesos } from "../../services/historial/historial";
import { Globe, CalendarClock, MonitorSmartphone, User } from "lucide-react";
import { motion } from "framer-motion";
import SkeletonAccesos from "../skeleton/SkeletonAccesos";
const HistorialAccesos = () => {
	const { usuario } = useAuth();
	const [accesos, setAccesos] = useState([]);

	useEffect(() => {
		if (!usuario?.id) return;

		obtenerHistorialAccesos(usuario.id)
			.then(setAccesos)
			.catch((err) => {
				console.error("Error cargando accesos:", err);
			});
	}, [usuario]);

	return (
		<div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
			<motion.h2
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-3xl font-bold text-center bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] bg-clip-text text-transparent"
			>
				Historial de Accesos
			</motion.h2>

			{accesos.length === 0 ? (
				<div className="grid gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: i * 0.1 }}
						>
							<SkeletonAccesos />
						</motion.div>
					))}
				</div>
			) : (
				<div className="grid gap-4">
					{accesos.map((acceso, index) => (
						<motion.div
							key={acceso.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
							whileHover={{ scale: 1.01 }}
							className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md border border-white/20 p-5 transition-all duration-300"
						>
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
								{/* Información del usuario */}
								<div className="flex items-center gap-4 min-w-0 flex-1">
									<div className="p-2 bg-[#6EC1E4]/10 rounded-full">
										<User className="text-[#6EC1E4]" size={24} />
									</div>
									<div className="min-w-0">
										<p className="font-semibold text-lg text-gray-800 truncate">{acceso.nombre}</p>
										<p className="text-[#6D8BAB] text-sm truncate">{acceso.correo}</p>
									</div>
								</div>

								{/* Detalles del acceso */}
								<div className="grid sm:grid-cols-3 gap-4 w-full sm:w-auto">
									<div className="flex items-center gap-2 text-[#5A6D8B] bg-[#6EC1E4]/5 p-2 px-3 rounded-lg">
										<Globe size={16} className="text-[#6EC1E4]" />
										<span title={acceso.ip} className="truncate text-sm font-medium max-w-[140px]">
											{acceso.ip}
										</span>
									</div>

									<div className="flex items-center gap-2 text-[#5A6D8B] bg-[#61CE70]/5 p-2 px-3 rounded-lg">
										<MonitorSmartphone size={16} className="text-[#61CE70]" />
										<span title={acceso.navegador} className="truncate text-sm font-medium max-w-[140px]">
											{acceso.navegador}
										</span>
									</div>

									<div className="flex items-center gap-2 text-[#5A6D8B] bg-[#E0E5EC]/50 p-2 px-3 rounded-lg">
										<CalendarClock size={16} className="text-[#5A6D8B]" />
										<span className="text-sm font-medium">
											{new Date(acceso.fecha).toLocaleString()}
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
};

export default HistorialAccesos;
