import React, { useEffect, useState } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { ELIMINAR_SERVICIO, LISTAR_SERVICIOS, } from "../../api/servicios";
import { useNavigate } from "react-router-dom";
import SkeletonService from "../layout/SkeletonService";
export default function TuServicios() {
	const navigate = useNavigate();
	const { usuario } = useAuth();
	const [servicios, setServicios] = useState([]);
	const [loading, setLoading] = useState(true);

	const cargarServicios = async () => {
		setLoading(true);
		const res = await axios.get(`${LISTAR_SERVICIOS}?usuario_id=${usuario.id}`);
		setServicios(res.data.servicios);
		setLoading(false);
	};

	useEffect(() => {
		cargarServicios();
	}, []);

	const eliminarServicio = async (id) => {
		if (!window.confirm("¿Eliminar este servicio?")) return;
		await axios.post(ELIMINAR_SERVICIO, {
			id,
			usuario_id: usuario.id,
		});
		cargarServicios();
	};

	return (
		<div className="max-w-6xl mx-auto px-4 py-10">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-bold text-gray-800">Servicios</h1>
				{usuario?.rol === "psicologa" && (
					<button className="flex items-center gap-2 bg-custom-green-1 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition cursor-pointer" onClick={() => navigate("/crear_servicios")}>
						<PlusCircle className="w-5 h-5" />
						Nuevo Servicio
					</button>
				)}
			</div>

			{loading ? (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{Array(6).fill(0).map((_, i) => (
						<SkeletonService key={i} />
					))}
				</div>
			) : servicios.length === 0 ? (
				<p className="text-gray-600">No hay servicios disponibles.</p>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{servicios.map((serv) => (
						<div
							key={serv.id}
							className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 relative overflow-hidden"
						>
							{/* Cintilla de estado */}
							<div
								className={`absolute top-0 left-0 w-full h-2 rounded-t-2xl ${serv.activo === 1 ? 'bg-[#D0E8D3]' : 'bg-red-300'
									}`}
							/>

							{serv.imagen && (
								<img
									src={serv.imagen}
									alt={serv.titulo}
									className="w-full h-40 object-cover rounded-xl mb-4"
								/>
							)}

							<h2 className="text-xl font-bold text-gray-800 mb-2">{serv.titulo}</h2>
							<p className="text-sm text-gray-500 mb-1">
								Psicóloga: {serv.nombre_psicologo}
							</p>
							<p className="text-gray-600 mb-3">{serv.descripcion}</p>

							<p className="text-green-700 font-semibold mb-3">
								${serv.precio} USD · {serv.duracion} min
							</p>

							{usuario?.rol === "psicologa" && (
								<div className="absolute top-3 right-3 flex gap-2">
									<button
										onClick={() => navigate("/servicios/editar_servicio", { state: serv })}
										className="text-blue-600 hover:text-blue-800 cursor-pointer"
										title="Editar"
									>
										<Pencil size={18} />
									</button>

									<button
										onClick={() => eliminarServicio(serv.id)}
										className="text-red-600 hover:text-red-800 cursor-pointer"
										title="Eliminar"
									>
										<Trash2 size={18} />
									</button>
								</div>
							)}
						</div>

					))}
				</div>
			)}
		</div>
	);
}
