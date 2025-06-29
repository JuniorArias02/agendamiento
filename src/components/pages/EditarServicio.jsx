import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { actualizarServicio } from "../../services/servicios/servicios";
import { motion } from "framer-motion";
import { PenLine, Save, X, ImagePlus, Check } from "lucide-react";
import Swal from "sweetalert2";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(servicio.imagen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Actualizar preview si cambia la URL de la imagen
    if (name === 'imagen') {
      setPreviewImage(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await actualizarServicio(form);
      
      await Swal.fire({
        title: "¡Actualizado!",
        text: "El servicio se actualizó correctamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        background: '#fff',
        backdrop: `
          rgba(100,203,160,0.4)
          url("/images/confetti.gif")
          center top
          no-repeat
        `
      });
      
      navigate("/tus_servicios");
    } catch (error) {
      console.error("Error al actualizar el servicio:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el servicio",
        icon: "error",
        confirmButtonColor: "#64CBA0",
        background: '#fff'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validar URL de imagen
  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f5] to-[#e6f4f9] flex items-center justify-center p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20"
      >
        {/* --- Encabezado con gradiente --- */}
        <div className="bg-gradient-to-r from-[#64CBA0] to-[#6BC3D7] p-6 text-center relative">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <PenLine size={24} className="text-white/90" />
            Editar Servicio
          </h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Vista previa de imagen */}
          {isValidImageUrl(previewImage) && (
            <div className="flex justify-center mb-4">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-[#64CBA0]/20">
                <img
                  src={previewImage}
                  alt="Preview del servicio"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Imagen+no+disponible';
                  }}
                />
              </div>
            </div>
          )}

          {/* --- Campo Título --- */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Título del servicio</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ej: Consulta Especializada"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64CBA0] focus:border-transparent transition-all placeholder:text-gray-400 text-gray-700"
              required
            />
          </div>

          {/* --- Campo Descripción --- */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe detalladamente tu servicio..."
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6BC3D7] focus:border-transparent transition-all placeholder:text-gray-400 text-gray-700"
              required
            />
          </div>

          {/* --- Campos Precio y Duración --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Precio (COP)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  $
                </div>
                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64CBA0] focus:border-transparent placeholder:text-gray-400 text-gray-700"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Duración (min)</label>
              <div className="relative">
                <input
                  type="number"
                  name="duracion"
                  value={form.duracion}
                  onChange={handleChange}
                  placeholder="30"
                  className="w-full px-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6BC3D7] focus:border-transparent placeholder:text-gray-400 text-gray-700"
                  min="1"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                  min
                </div>
              </div>
            </div>
          </div>

          {/* --- Campo Imagen --- */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">URL de la imagen</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6BC3D7]">
                <ImagePlus size={18} />
              </div>
              <input
                type="url"
                name="imagen"
                value={form.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64CBA0] focus:border-transparent placeholder:text-gray-400 text-gray-700"
              />
            </div>
            {form.imagen && !isValidImageUrl(form.imagen) && (
              <p className="text-xs text-red-500 mt-1">Por favor ingresa una URL válida de imagen (jpg, png, gif)</p>
            )}
          </div>

          {/* --- Campo Estado --- */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Estado del servicio</label>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="activo"
                  value={1}
                  checked={form.activo == 1}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#64CBA0] focus:ring-[#64CBA0]"
                />
                <span className="flex items-center gap-1">
                  <Check size={16} className="text-green-500" />
                  Activo
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="activo"
                  value={0}
                  checked={form.activo == 0}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#64CBA0] focus:ring-[#64CBA0]"
                />
                <span className="flex items-center gap-1">
                  <X size={16} className="text-red-500" />
                  Inactivo
                </span>
              </label>
            </div>
          </div>

          {/* --- Botón de Guardar --- */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || !isValidImageUrl(form.imagen)}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all mt-6
              ${isSubmitting || !isValidImageUrl(form.imagen)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#64CBA0] to-[#6BC3D7] hover:shadow-lg'
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Save size={20} />
                Guardar Cambios
              </span>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}