import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ACTUALIZAR_SERVICIO } from "../../api/servicios";
import { motion } from "framer-motion";

export default function EditarServicio() {
	const location = useLocation();
	const navigate = useNavigate();
	const servicio = location.state;

	const [form, setForm] = useState({
		id: servicio.id,
		titulo: servicio.titulo,
		descripcion: servicio.descripcion,
		precio: servicio.precio,
		duracion: servicio.duracion,
		imagen: servicio.imagen,
		activo: servicio.activo,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await axios.post(ACTUALIZAR_SERVICIO, form);
		navigate("/tus_servicios");
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8 bg-white">
			<motion.form
				onSubmit={handleSubmit}
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-custom-marron-1 space-y-4"
			>
				<h2 className="text-2xl sm:text-3xl font-bold text-custom-marron-1 text-center mb-4">
					Editar Servicio
				</h2>

				<input
					type="text"
					name="titulo"
					value={form.titulo}
					onChange={handleChange}
					placeholder="Título del servicio"
					className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-green-1 transition"
				/>

				<textarea
					name="descripcion"
					value={form.descripcion}
					onChange={handleChange}
					placeholder="Descripción"
					className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-green-1 transition resize-none"
					rows={4}
				/>

				<div className="flex flex-col sm:flex-row gap-4">
					<input
						type="number"
						name="precio"
						value={form.precio}
						onChange={handleChange}
						placeholder="Precio (COP)"
						className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-green-1 transition"
					/>

					<input
						type="number"
						name="duracion"
						value={form.duracion}
						onChange={handleChange}
						placeholder="Duración (min)"
						className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-green-1 transition"
					/>
				</div>

				<input
					type="text"
					name="imagen"
					value={form.imagen}
					onChange={handleChange}
					placeholder="URL de la imagen"
					className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-green-1 transition"
				/>

				<select 
					name="activo"
					value={form.activo}
					onChange={handleChange}
					className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-custom-green-1 transition"
				>
					<option value={1}>Activo</option>
					<option value={0}>Inactivo</option>
				</select>

				<motion.button
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.97 }}
					type="submit"
					className="w-full bg-custom-green-1 text-white py-3 rounded-xl font-semibold hover:bg-custom-green transition"
				>
					Guardar cambios
				</motion.button>
			</motion.form>
		</div>
	);
}
