import React, { useEffect, useState } from "react";
import { Sparkles, HeartPulse, ClipboardList, Pencil, Trash2, PlusCircle, PauseCircle, Heart, User, DollarSign, CircleDashed, AlignLeft, Banknote, CalendarDays, Monitor, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { obtenerServiciosPorUsuario, eliminarServicioPorId } from "../../services/servicios/servicios";
import SkeletonServicios from "../skeleton/SkeletonServicios";
import { PATH_IMAGEN } from "../../api/conexion";
export default function TuServicios() {
	const navigate = useNavigate();
	const { usuario } = useAuth();
	const [servicios, setServicios] = useState([]);
	const [loading, setLoading] = useState(true);


	const cargarServicios = async () => {
		setLoading(true);
		try {
			const data = await obtenerServiciosPorUsuario(usuario.id);
			setServicios(data.servicios);
			console.log(data);
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	useEffect(() => {
		cargarServicios();
	}, []);

	const eliminarServicio = async (id) => {
		if (!window.confirm("¿Eliminar este servicio?")) return;
		try {
			await eliminarServicioPorId({ id, usuario_id: usuario.id });
			cargarServicios();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
			{/* Header con gradiente y botón flotante */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
				<div>
					<h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] bg-clip-text text-transparent mb-2">
						<Sparkles className="inline mr-3" size={28} />
						Nuestros Servicios
						<Sparkles className="inline ml-3" size={28} />
					</h1>
					<p className="text-[#6D8BAB] max-w-2xl flex items-center">
						<HeartPulse className="w-5 h-5 mr-2 text-[#61CE70]" />
						Descubre terapias personalizadas para tu bienestar emocional y mental
					</p>
				</div>

				{usuario?.rol === "psicologa" && (
					<button
						onClick={() => navigate("/crear_servicios")}
						className="flex items-center gap-2 bg-gradient-to-r from-[#61CE70] to-[#6EC1E4] hover:from-[#4FB560] hover:to-[#5AB7D4] text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
					>
						<PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
						<span>Crear Nuevo Servicio</span>
					</button>
				)}
			</div>

			{/* Estado de carga */}
			{loading ? (
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{Array(6).fill(0).map((_, i) => (
						<div key={i} className="bg-white/80 backdrop-blur-sm rounded-3xl p-1 shadow-sm hover:shadow-md transition-all duration-300 border border-white/20">
							<div className="bg-gray-200/50 animate-pulse h-48 rounded-2xl mb-4"></div>
							<div className="space-y-3 p-4">
								<div className="h-6 bg-gray-200/50 rounded animate-pulse"></div>
								<div className="h-4 bg-gray-200/30 rounded animate-pulse w-3/4"></div>
								<div className="h-16 bg-gray-200/30 rounded animate-pulse"></div>
								<div className="h-5 bg-gray-200/50 rounded animate-pulse w-1/2"></div>
							</div>
						</div>
					))}
				</div>
			) : servicios.length === 0 ? (
				<div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-[#6EC1E4]/30">
					<ClipboardList className="w-12 h-12 mx-auto text-[#6EC1E4] mb-4" />
					<h3 className="text-xl font-medium text-[#5A6D8B] mb-2">No hay servicios disponibles</h3>
					<p className="text-[#6D8BAB] max-w-md mx-auto">
						{usuario?.rol === "psicologa"
							? "Comienza creando tu primer servicio para ayudar a tus pacientes"
							: "Pronto tendremos nuevos servicios disponibles para ti"}
					</p>
				</div>
			) : (
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{servicios.map((serv) => (
						<motion.div
							key={serv.id}
							whileHover={{ y: -5 }}
							transition={{ type: "spring", stiffness: 300 }}
							className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-white/20 relative group"
						>
							{/* Badge de estado */}
							<div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow ${serv.activo === 1
								? 'bg-[#61CE70]/10 text-[#61CE70]'
								: 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
								}`}>
								{serv.activo === 1 ? (
									<>
										<CheckCircle className="w-3.5 h-3.5" />
										<span>Disponible</span>
									</>
								) : (
									<>
										<PauseCircle className="w-3.5 h-3.5" />
										<span>Inactivo</span>
									</>
								)}
							</div>

							{/* Badge de popular (nuevo) */}
							{serv.popular && (
								<div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow bg-[#6EC1E4]/10 text-[#6EC1E4]">
									<Star className="w-3.5 h-3.5" />
									<span>Popular</span>
								</div>
							)}

							{/* Imagen con overlay */}
							<div className="relative overflow-hidden h-48">
								{serv.imagen ? (
									<>
										<img
											src={`${PATH_IMAGEN}/${serv.imagen}`}
											alt={serv.titulo}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>

										<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
									</>
								) : (
									<div className="w-full h-full bg-gradient-to-br from-[#6EC1E4]/20 to-[#61CE70]/20 flex items-center justify-center">
										<Heart className="w-12 h-12 text-[#6EC1E4]/50" />
									</div>
								)}
							</div>

							{/* Contenido de la tarjeta */}
							<div className="p-6">
								<div className="flex justify-between items-start mb-3">
									<h2 className="text-xl font-bold text-[#4A5568] line-clamp-2 flex items-start">
										<CircleDashed className="w-5 h-5 mr-2 mt-1 text-[#61CE70] flex-shrink-0" />
										{serv.titulo}
									</h2>

									{usuario?.rol === "psicologa" && (
										<div className="flex gap-2 ml-3">
											<button
												onClick={(e) => {
													e.stopPropagation();
													navigate("/servicios/editar_servicio", { state: serv });
												}}
												className="text-[#6D8BAB] hover:text-[#6EC1E4] transition-colors p-1 rounded-lg hover:bg-[#6EC1E4]/10"
												title="Editar"
											>
												<Pencil size={18} />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													eliminarServicio(serv.id);
												}}
												className="text-[#E2A0A0] hover:text-[#FF6B6B] transition-colors p-1 rounded-lg hover:bg-[#FF6B6B]/10"
												title="Eliminar"
											>
												<Trash2 size={18} />
											</button>
										</div>
									)}
								</div>

								<div className="flex items-center text-sm text-[#718096] mb-4 gap-2">
									<User className="w-4 h-4 text-[#6EC1E4]" />
									<span>Psicóloga: {serv.nombre_psicologo}</span>
								</div>

								<p className="text-[#5A6D8B] mb-5 line-clamp-3 flex">
									<AlignLeft className="w-4 h-4 mr-2 mt-1 text-[#6EC1E4] flex-shrink-0" />
									{serv.descripcion}
								</p>

								{/* Detalles del servicio con iconos */}
								<div className="grid grid-cols-2 gap-3 mb-4">
									{/* Precio */}
									<div className="flex items-center text-sm font-medium text-[#61CE70]">
										<Banknote className="w-4 h-4 mr-1.5" />
										{serv.precio} USD
									</div>

									{/* Duración */}
									<div className="flex items-center text-sm font-medium text-[#6EC1E4]">
										<Clock className="w-4 h-4 mr-1.5" />
										{serv.duracion} min
									</div>

									{/* Número de sesiones */}
									<div className="flex items-center text-sm font-medium text-[#61CE70]">
										<CalendarDays className="w-4 h-4 mr-1.5" />
										{serv.numero_sesiones || 1} sesión{serv.numero_sesiones !== 1 ? 'es' : ''}
									</div>

									{/* Modalidad */}
									<div className="flex items-center text-sm font-medium text-[#6EC1E4]">
										<Monitor className="w-4 h-4 mr-1.5" />
										{serv.modalidad || 'Online'}
									</div>
								</div>

							</div>
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
}
