// FiltroCitas.js
import React, { useEffect, useRef } from "react";
import { PENDIENTE, EN_PROGRESO, FINALIZADA, RETARDO } from "../../api/estados_citas";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FiltroCitas = ({ setFiltroEstado, filtroEstado, setFiltroAbierto, filtroAbierto }) => {
	const touchStartX = useRef(null);

	useEffect(() => {
		const handleTouchStart = (e) => {
			touchStartX.current = e.touches[0].clientX;
		};

		const handleTouchEnd = (e) => {
			const touchEndX = e.changedTouches[0].clientX;
			const diffX = touchEndX - touchStartX.current;

			if (diffX < -80 && !filtroAbierto) {
				setFiltroAbierto(true);
			} else if (diffX > 80 && filtroAbierto) {
				setFiltroAbierto(false);
			}
		};

		window.addEventListener("touchstart", handleTouchStart);
		window.addEventListener("touchend", handleTouchEnd);

		return () => {
			window.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("touchend", handleTouchEnd);
		};
	}, [filtroAbierto]);

	return (
		<>
			{/* Botón visible solo en móvil */}
			<div className="sm:hidden flex justify-end px-4 mb-4">
				<button
					onClick={() => setFiltroAbierto(true)}
					className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
				>
					<Filter className="w-5 h-5 text-gray-700" />
				</button>
			</div>

			{/* Panel para móvil */}
			<AnimatePresence>
				{filtroAbierto && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-white/60 backdrop-blur-md bg-opacity-30 flex justify-end sm:hidden"
						onClick={() => setFiltroAbierto(false)} // cerrar al tocar el fondo
					>
						<motion.div
							initial={{ x: 300 }}
							animate={{ x: 0 }}
							exit={{ x: 300 }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							className="w-64 bg-white shadow-lg h-full p-6 flex flex-col gap-4"
							onClick={(e) => e.stopPropagation()} // evitar que el clic dentro cierre
						>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-lg font-bold text-gray-800">Filtrar por estado</h2>
								<button
									onClick={() => setFiltroAbierto(false)}
									className="text-gray-500 hover:text-gray-800 text-xl"
								>
									✕
								</button>
							</div>

							{[PENDIENTE, EN_PROGRESO, FINALIZADA, RETARDO].map((estado) => (
								<button
									key={estado.valor}
									onClick={() => {
										setFiltroEstado(estado.valor);
										setFiltroAbierto(false);
									}}
									className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${filtroEstado === estado.valor ? 'text-black' : 'text-white'}`}
									style={{ backgroundColor: estado.color }}
								>
									{estado.valor.toUpperCase()}
								</button>
							))}

							<button
								onClick={() => {
									setFiltroEstado(null);
									setFiltroAbierto(false);
								}}
								className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 border border-gray-400 bg-white hover:bg-gray-100 transition"
							>
								TODOS
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Filtro para escritorio */}
			<div className="hidden sm:flex gap-3 bg-gray-100 p-3 rounded-full shadow-inner mx-auto w-fit">
				{[PENDIENTE, EN_PROGRESO, FINALIZADA, RETARDO].map((estado) => (
					<button
						key={estado.valor}
						onClick={() => setFiltroEstado(estado.valor)}
						className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 
              ${filtroEstado === estado.valor
								? "text-black scale-105 bg-white"
								: "text-gray-700 border border-gray-300 bg-white"
							}`}
						style={{
							backgroundColor: filtroEstado === estado.valor ? estado.color : undefined,
							borderColor: estado.color,
						}}
					>
						{estado.valor.toUpperCase()}
					</button>
				))}
				<button
					onClick={() => setFiltroEstado(null)}
					className="px-5 py-2 rounded-full text-sm font-semibold bg-white text-gray-600 border border-gray-300 hover:bg-gray-300 transition-all"
				>
					TODOS
				</button>
			</div>
		</>
	);
};

export default FiltroCitas;
