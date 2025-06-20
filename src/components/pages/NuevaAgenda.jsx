import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LISTAR_SERVICIOS_PUBLICOS } from "../../api/servicios";
import SkeletonServicios from "../layout/SkeletonServicios";
import { Sparkles, Clock, User } from "lucide-react";

export default function NuevaAgenda() {
	const [servicios, setServicios] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const cargarServicios = async () => {
			try {
				const res = await axios.get(LISTAR_SERVICIOS_PUBLICOS);
				const servicios = res.data?.servicios ?? [];
				setServicios(servicios);
			} catch (error) {
				console.error("Error al cargar servicios:", error);
				setServicios([]);
			} finally {
				setIsLoading(false); // 👈 esto es lo que te faltaba
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
							className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#e0f2fe]"
							onClick={() => verServicio(s)}
						>
							{/* --- Efecto de borde animado --- */}
							<div className="absolute inset-0 bg-gradient-to-r from-[#61CE70]/10 to-[#6EC1E4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

							{s.imagen && (
								<div className="h-48 overflow-hidden">
									<img
										src={s.imagen}
										alt={s.titulo}
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								</div>
							)}

							{/* --- Badge de "Más Popular" (condicional) --- */}
							{s.popular && (
								<div className="absolute top-4 right-4 bg-[#61CE70] text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
									⭐ Más Popular
								</div>
							)}

							{/* --- Contenido de la Card --- */}
							<div className="p-6">
								<h3 className="text-2xl font-bold text-[#093031] mb-3 group-hover:text-[#61CE70] transition-colors">
									{s.titulo}
								</h3>

								<p className="text-[#5a6c7b] mb-5 line-clamp-3">
									{s.descripcion}
								</p>

								{/* --- Precio con efecto "destacado" --- */}
								<div className="flex justify-between items-center mt-4">
									<span className="bg-gradient-to-r from-[#61CE70] to-[#6EC1E4] text-white px-4 py-2 rounded-full text-sm font-bold">
										${Number(s.precio).toLocaleString("en-US")} USD
									</span>
									<span className="text-xs text-[#6EC1E4] font-semibold flex items-center">
										<Clock className="mr-1" size={14} />
										{s.duracion} min
									</span>
								</div>

								{/* --- Psicóloga con avatar (ejemplo) --- */}
								<div className="flex items-center mt-6 pt-4 border-t border-[#e0f2fe]">
									<div className="bg-[#6EC1E4] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
										<User size={16} />
									</div>
									<span className="text-sm text-[#5a6c7b]">
										Dra. {s.nombre_psicologa}
									</span>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
