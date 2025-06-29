import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Clock, User } from "lucide-react";
import { listarServiciosPublicos } from "../../services/servicios/servicios";
import SkeletonServicios from "../skeleton/SkeletonServicios";
import { Heart, HeartPulse, CircleDashed, AlignLeft, Banknote, CalendarDays, GraduationCap, Monitor, Star, ArrowRight } from "lucide-react";
export default function NuevaAgenda() {
	const [servicios, setServicios] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();


	useEffect(() => {
		const cargarServicios = async () => {
			try {
				const servicios = await listarServiciosPublicos();
				setServicios(servicios);
			} catch (error) {
				setServicios([]);
			} finally {
				setIsLoading(false);
			}
		};

		cargarServicios();
	}, []);

	const verServicio = (servicio) => {
		navigate("/agenda", { state: { servicio } });
	};

	return (
		<div className="bg-gradient-to-br from-white to-[#f0f9ff] py-16 px-4 sm:px-6 lg:px-8">
			{/* --- Título con efecto gradiente y micro-interacción --- */}
			<div className="text-center mb-12 animate-fade-in">
				<h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#61CE70] to-[#6EC1E4]">
					<Sparkles className="inline mr-3" size={30} />
					Servicios Psicológicos
					<Sparkles className="inline ml-3" size={30} />
				</h2>
				<p className="mt-4 text-lg text-[#5a6c7b] max-w-2xl mx-auto">
					<HeartPulse className="inline mr-2 text-[#61CE70]" size={20} />
					Terapias personalizadas para tu bienestar emocional
				</p>
			</div>

			{/* --- Grid de Servicios con Efecto 3D --- */}
			<div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
				{isLoading ? (
					Array.from({ length: 6 }).map((_, i) => <SkeletonServicios key={i} />)
				) : (
					servicios.map((s) => (
						<div
							key={s.id}
							className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#e0f2fe] cursor-pointer flex flex-col"
							onClick={() => verServicio(s)}
						>
							{/* --- Efecto de borde animado --- */}
							<div className="absolute inset-0 bg-gradient-to-r from-[#61CE70]/10 to-[#6EC1E4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

							{/* --- Contenedor de imagen con altura flexible --- */}
							<div className="flex-shrink-0">
								<div className="relative overflow-hidden h-48">
									{s.imagen ? (
										<>
											<img
												src={s.imagen}
												alt={s.titulo}
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
							</div>

							{/* --- Badge de "Más Popular" (condicional) --- */}
							{s.popular && (
								<div className="absolute top-4 right-4 bg-[#61CE70] text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
									<Star className="inline mr-1" size={14} />
									Más Popular
								</div>
							)}

							{/* --- Contenido de la Card con crecimiento flexible --- */}
							<div className="p-6 flex flex-col flex-grow">
								<h3 className="text-2xl font-bold text-[#093031] mb-3 group-hover:text-[#61CE70] transition-colors">
									<CircleDashed className="inline mr-2" size={20} />
									{s.titulo}
								</h3>

								<p className="text-[#5a6c7b] mb-5 line-clamp-3 flex-grow">
									<AlignLeft className="inline mr-2 opacity-70" size={16} />
									{s.descripcion}
								</p>

								{/* --- Detalles del servicio --- */}
								<div className="grid grid-cols-2 gap-3 mb-4">
									{/* Precio */}
									<div className="flex items-center text-sm text-[#5a6c7b]">
										<Banknote className="mr-2 text-[#61CE70]" size={16} />
										${Number(s.precio).toLocaleString("en-US")} USD
									</div>

									{/* Duración */}
									<div className="flex items-center text-sm text-[#5a6c7b]">
										<Clock className="mr-2 text-[#6EC1E4]" size={16} />
										{s.duracion} min
									</div>

									{/* Número de sesiones */}
									{s.numero_sesiones && (
										<div className="flex items-center text-sm text-[#5a6c7b]">
											<CalendarDays className="mr-2 text-[#61CE70]" size={16} />
											{s.numero_sesiones} sesión{s.numero_sesiones !== 1 ? 'es' : ''}
										</div>
									)}

									{/* Modalidad */}
									<div className="flex items-center text-sm text-[#5a6c7b]">
										<Monitor className="mr-2 text-[#6EC1E4]" size={16} />
										{s.modalidad || 'Online'}
									</div>
								</div>

								{/* --- Psicóloga con avatar --- */}
								<div className="flex items-center mt-auto pt-4 border-t border-[#e0f2fe]">
									<div className="bg-[#6EC1E4] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
										<User size={16} />
									</div>
									<div>
										<span className="text-sm font-medium text-[#5a6c7b] block">
											Dra. {s.nombre_psicologa}
										</span>
										<span className="text-xs text-[#6EC1E4] flex items-center">
											<GraduationCap className="mr-1" size={12} />
											Especialista
										</span>
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
