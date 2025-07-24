import React, { useState } from "react";
import { ArrowLeft, PlusCircle, ImagePlus, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { crearServicio } from "../../services/servicios/servicios";

export default function NuevoServicio() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [duracion, setDuracion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const { usuario } = useAuth();
  const [numeroSesiones, setNumeroSesiones] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagenUrl, setImagenUrl] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("duracion", duracion);
    formData.append("numero_sesiones", numeroSesiones);
    formData.append("usuario_id", usuario.id);

    if (imagen) {
      formData.append("imagen", imagen); // acá va el archivo real
    }

    try {
      await crearServicio(formData); // tu función ya debe usar fetch con `multipart/form-data`

      await Swal.fire({
        icon: "success",
        title: "¡Servicio creado!",
        text: "Tu servicio fue creado con éxito 🎉",
        showConfirmButton: false,
        background: '#fff',
        backdrop: `
        rgba(100,203,160,0.4)
        url("/images/confetti.gif")
        center top
        no-repeat
      `,
        timer: 2000
      });

      navigate(-1);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el servicio",
        confirmButtonColor: "#64CBA0",
        background: '#fff',
        customClass: {
          confirmButton: 'shadow-md rounded-xl'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#64CBA0] hover:text-[#4da789] transition-colors duration-300 focus:outline-none group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100/50">
        <div className="bg-gradient-to-r from-[#64CBA0] to-[#6BC3D7] p-6 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <PlusCircle className="w-8 h-8" />
            <span>Crear Nuevo Servicio</span>
          </h2>
          <p className="text-white/90 mt-2">Completa los detalles de tu nuevo servicio</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Preview de imagen */}
          {preview && (
            <div className="flex justify-center">
              <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-dashed border-[#64CBA0]/30">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setImagen(null);
                  }}
                  className="absolute top-2 right-2 bg-white/90 text-red-500 p-1 rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="titulo" className="text-sm font-medium text-gray-700 flex items-center">
                Título del servicio
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64CBA0] focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
                placeholder="Ej: Consulta de Nutrición"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="descripcion" className="text-sm font-medium text-gray-700 flex items-center">
                Descripción
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6BC3D7] focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
                placeholder="Describe detalladamente tu servicio..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="precio" className="text-sm font-medium text-gray-700 flex items-center">
                  Precio (USD)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    $
                  </div>
                  <input
                    type="number"
                    id="precio"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64CBA0] focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="duracion" className="text-sm font-medium text-gray-700 flex items-center">
                  Duración
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="duracion"
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                    className="w-full px-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6BC3D7] focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
                    placeholder="30"
                    min="1"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    min
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="numeroSesiones" className="text-sm font-medium text-gray-700">
                  Número de sesiones
                </label>
                <input
                  type="number"
                  id="numeroSesiones"
                  value={numeroSesiones}
                  onChange={(e) => setNumeroSesiones(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64CBA0] focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
                  placeholder="1"
                  min="1"
                  required
                />
              </div>


              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="space-y-1">
                    <label htmlFor="imagen" className="text-sm font-medium text-gray-700">
                      Imagen del servicio
                    </label>
                    <input
                      type="file"
                      id="imagen"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setImagen(file); // asegúrate de tener `const [imagen, setImagen] = useState(null);`
                        setPreview(URL.createObjectURL(file));
                      }}
                      className="w-full px-4 py-2 border rounded-xl border-gray-200 shadow-sm text-gray-700"
                    />
                  </div>

                </div>
              </div>


            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#64CBA0]
                ${isSubmitting
                  ? 'bg-[#64CBA0]/70 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#64CBA0] to-[#6BC3D7] hover:shadow-lg hover:from-[#5ab790] hover:to-[#5fb1c9] shadow-md'
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando servicio...
                </>
              ) : (
                <>
                  <PlusCircle className="inline mr-2" size={20} />
                  Crear Servicio
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}