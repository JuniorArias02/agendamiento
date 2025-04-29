import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { CREAR_SERVICIO } from "../../api/servicios"; // Asumiendo que tienes esta constante en el archivo de rutas
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; 
export default function NuevoServicio() {
	const navigate = useNavigate();
	const [titulo, setTitulo] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [precio, setPrecio] = useState("");
	const [duracion, setDuracion] = useState("");
	const [imagen, setImagen] = useState(null);
	const { usuario } = useAuth(); 
	
	const handleSubmit = async (e) => {
		e.preventDefault();
	
		const formData = new FormData();
		formData.append("titulo", titulo);
		formData.append("descripcion", descripcion);
		formData.append("precio", precio);
		formData.append("duracion", duracion);
		if (imagen) formData.append("imagen", imagen);
		formData.append("usuario_id", usuario.id); // Enviar usuario_id como parte del cuerpo
	
		try {
			await axios.post(CREAR_SERVICIO, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			navigate(-1); // Redirigir a la página anterior
			alert("Servicio creado con éxito");
			// Aquí puedes redirigir o actualizar la lista de servicios
		} catch (error) {
			alert("Error al crear el servicio");
			console.error(error);
		}
	};
	
	return (
		<div className="max-w-3xl mx-auto p-8 shadow-xl rounded-xl mt-10 border border-custom-marron-1">
		  <button
			onClick={() => navigate(-1)}
			className="flex items-center text-custom-green hover:text-custom-marron-1 mb-6 cursor-pointer"
		  >
			<ArrowLeft className="w-5 h-5 mr-2" />
			Volver
		  </button>
	  
		  <h2 className="text-3xl font-semibold text-center text-custom-green mb-6">
			Crear Nuevo Servicio
		  </h2>
	  
		  <form onSubmit={handleSubmit} className="space-y-6">
			{/* Título */}
			<div>
			  <label className="block text-sm font-medium text-custom-green">Título</label>
			  <input
				type="text"
				value={titulo}
				onChange={(e) => setTitulo(e.target.value)}
				className="w-full p-4 mt-2 border border-custom-marron-1 rounded-lg text-custom-green shadow-sm focus:outline-none focus:ring-2 focus:ring-custom-green"
				placeholder="Introduce el título"
				required
			  />
			</div>
	  
			{/* Descripción */}
			<div>
			  <label className="block text-sm font-medium text-custom-green">Descripción</label>
			  <textarea
				value={descripcion}
				onChange={(e) => setDescripcion(e.target.value)}
				className="w-full p-4 mt-2 border border-custom-marron-1 rounded-lg text-custom-green shadow-sm focus:outline-none focus:ring-2 focus:ring-custom-green"
				rows="4"
				placeholder="Describe el servicio"
				required
			  />
			</div>
	  
			{/* Precio */}
			<div>
			  <label className="block text-sm font-medium text-custom-green">Precio (COP)</label>
			  <input
				type="number"
				value={precio}
				onChange={(e) => setPrecio(e.target.value)}
				className="w-full p-4 mt-2 border border-custom-marron-1 rounded-lg text-custom-green shadow-sm focus:outline-none focus:ring-2 focus:ring-custom-green"
				placeholder="Introduce el precio"
				required
			  />
			</div>
	  
			{/* Duración */}
			<div>
			  <label className="block text-sm font-medium text-custom-green">Duración (min)</label>
			  <input
				type="number"
				value={duracion}
				onChange={(e) => setDuracion(e.target.value)}
				className="w-full p-4 mt-2 border border-custom-marron-1 rounded-lg text-custom-green shadow-sm focus:outline-none focus:ring-2 focus:ring-custom-green"
				placeholder="Duración en minutos"
				required
			  />
			</div>
	  
			{/* Imagen */}
			<div>
			  <label className="block text-sm font-medium text-custom-green">Imagen</label>
			  <input
				type="file"
				onChange={(e) => setImagen(e.target.files[0])}
				className="w-full p-4 mt-2 border border-custom-marron-1 rounded-lg text-custom-green shadow-sm focus:outline-none focus:ring-2 focus:ring-custom-green"
			  />
			</div>
	  
			{/* Botón */}
			<div className="flex justify-center">
			  <button
				type="submit"
				className="w-full py-3 px-6 bg-custom-green text-white font-semibold rounded-lg hover:bg-custom-green-1 transition-all duration-300 transform hover:scale-105"
			  >
				<PlusCircle className="inline mr-2" size={20} />
				Crear Servicio
			  </button>
			</div>
		  </form>
		</div>
	  );
	  
	  
	
}
