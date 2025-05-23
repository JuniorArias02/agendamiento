import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LISTAR_SERVICIOS_PUBLICOS } from "../../api/servicios";

export default function NuevaAgenda() {
	const [servicios, setServicios] = useState([]);
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
			}
		};
		cargarServicios();
	}, []);


	const verServicio = (servicio) => {
		navigate("/agenda", { state: { servicio } });
	};

	return (
		<div className="bg-white py-12 px-6">
			<h2 className="text-3xl font-semibold text-center text-[#1c7578] mb-8">
				Descubre nuestros servicios
			</h2>

			<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
				{servicios.map((s) => (
					<div
						key={s.id}
						className="bg-[#f3fbfb] border-t-4 border-[#69a3a5] rounded-lg p-5 shadow-md hover:shadow-lg transition-all ease-in-out duration-300 cursor-pointer flex flex-col"
						onClick={() => verServicio(s)}
					>
						{s.imagen && (
							<div className="flex-shrink-0 mb-4">
								<img
									src={s.imagen}
									alt={s.titulo}
									className="w-full h-36 object-cover rounded-lg"
								/>
							</div>
						)}

						<div className="flex flex-col flex-grow">
							<h3 className="text-xl font-semibold text-[#1c7578] mb-2">
								{s.titulo}
							</h3>
							<p className="text-sm text-[#444] mb-4">{s.descripcion}</p>

							<div className="flex justify-between items-center mt-auto">
								<p className="text-[#145d5f] font-semibold text-lg">
									${Number(s.precio).toLocaleString("en-US", { minimumFractionDigits: 2 })} US · {s.duracion} min
								</p>

								<p className="text-xs text-gray-400">
									Psicóloga: {s.nombre_psicologa}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>

	);
}
