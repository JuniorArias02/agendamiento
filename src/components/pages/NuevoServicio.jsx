import React, { useState } from "react";
import { ArrowLeft, PlusCircle } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto p-8 mt-10 rounded-xl shadow-lg bg-white/80 backdrop-blur-sm border border-white/30">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#61CE70] hover:text-[#50B860] mb-8 transition-colors duration-300 focus:outline-none"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver
      </button>

      <h2 className="text-3xl font-semibold text-center text-[#6EC1E4] mb-8">
        Crear Nuevo Servicio
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">Título</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#61CE70] focus:border-transparent shadow-sm text-gray-700"
            placeholder="Introduce el título del servicio"
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6EC1E4] focus:border-transparent shadow-sm text-gray-700"
            placeholder="Describe el servicio que vas a ofrecer"
            required
          />
        </div>

        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">Precio (USD)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              $
            </div>
            <input
              type="number"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full pl-7 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#61CE70] focus:border-transparent shadow-sm text-gray-700"
              placeholder="Precio en dólares"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="duracion" className="block text-sm font-medium text-gray-700 mb-2">Duración (min)</label>
          <div className="relative">
            <input
              type="number"
              id="duracion"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6EC1E4] focus:border-transparent shadow-sm text-gray-700"
              placeholder="Duración en minutos"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              min
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
          <input
            type="file"
            id="imagen"
            onChange={(e) => setImagen(e.target.files[0])}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#61CE70] focus:border-transparent shadow-sm text-gray-700
                        file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#61CE70] text-white font-semibold rounded-xl hover:bg-[#50B860] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#61CE70] focus:ring-offset-2 shadow-md"
          >
            <PlusCircle className="inline mr-2" size={20} />
            Crear Servicio
          </button>
        </div>
      </form>
    </div>
  );
}
