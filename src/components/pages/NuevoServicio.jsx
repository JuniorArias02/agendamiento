import React, { useState } from "react";
import { PlusCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import { CREAR_SERVICIO } from "../../api/servicios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

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
    formData.append("usuario_id", usuario.id);

    try {
      await axios.post(CREAR_SERVICIO, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Servicio creado",
        text: "Tu servicio fue creado con éxito 🥳",
        confirmButtonColor: "#6b4f3b",
      });

      navigate(-1);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el servicio 😢",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-custom-green hover:text-custom-marron-1 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver
      </button>

      <h2 className="text-3xl font-semibold text-center text-custom-green mb-6">
        Crear Nuevo Servicio
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div>
          <label className="block text-sm font-medium text-custom-green">Precio (USD)</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full p-4 mt-2 border border-custom-marron-1 rounded-lg text-custom-green shadow-sm focus:outline-none focus:ring-2 focus:ring-custom-green"
            placeholder="Introduce el precio"
            required
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium text-custom-green">Imagen</label>
          <input
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
            className="w-full p-4 mt-2 border border-custom-marron-1 rounded-lg text-custom-green shadow-sm focus:outline-none focus:ring-2 focus:ring-custom-green"
          />
        </div>

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
