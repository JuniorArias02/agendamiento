import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ACTUALIZAR_SERVICIO } from "../../api/servicios";
import { motion } from "framer-motion";
import {
  PenLine,
  Info,
  Text,
  AlignLeft,
  DollarSign,
  Clock,
  Image,
  ToggleLeft,
  Save
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7fb] to-[#e2eff8] flex items-center justify-center p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20"
      >
        {/* --- Encabezado con gradiente --- */}
        <div className="bg-gradient-to-r from-[#61CE70] to-[#6EC1E4] p-6 text-center">
          <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <PenLine size={28} className="text-white/90" />
            Editar Servicio
          </h2>
          <p className="text-white/80 mt-2 flex items-center justify-center gap-2 text-sm">
            <Info size={16} />
            Completa todos los campos con atención
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* --- Campo Título con Icono --- */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Text size={20} className="text-[#61CE70]" />
            </div>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Título del servicio"
              className="w-full pl-10 pr-5 py-4 rounded-xl border border-gray-200 focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 transition-all placeholder:text-gray-400 text-gray-700 bg-white/50"
            />
          </div>

          {/* --- Campo Descripción con Icono --- */}
          <div className="relative">
            <div className="absolute top-4 left-3">
              <AlignLeft size={20} className="text-[#61CE70]" />
            </div>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción detallada del servicio"
              className="w-full pl-10 pr-5 py-3 rounded-xl border border-gray-200 focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 transition-all resize-y min-h-[120px] placeholder:text-gray-400 text-gray-700 bg-white/50"
            />
          </div>

          {/* --- Campos Precio y Duración (en línea) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={20} className="text-[#6EC1E4]" />
              </div>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Precio (COP)"
                className="w-full pl-10 pr-5 py-4 rounded-xl border border-gray-200 focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 transition-all placeholder:text-gray-400 text-gray-700"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={20} className="text-[#6EC1E4]" />
              </div>
              <input
                type="number"
                name="duracion"
                value={form.duracion}
                onChange={handleChange}
                placeholder="Duración (minutos)"
                className="w-full pl-10 pr-5 py-4 rounded-xl border border-gray-200 focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 transition-all placeholder:text-gray-400 text-gray-700"
              />
            </div>
          </div>

          {/* --- Campo Imagen con Icono --- */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Image size={20} className="text-[#61CE70]" />
            </div>
            <input
              type="text"
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              placeholder="URL de la imagen (ej: https://...)"
              className="w-full pl-10 pr-5 py-4 rounded-xl border border-gray-200 focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 transition-all placeholder:text-gray-400 text-gray-700"
            />
          </div>

          {/* --- Selector Estado con Icono --- */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ToggleLeft size={20} className="text-[#6EC1E4]" />
            </div>
            <select
              name="activo"
              value={form.activo}
              onChange={handleChange}
              className="w-full pl-10 pr-5 py-4 rounded-xl border border-gray-200 focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 transition-all appearance-none text-gray-700 bg-white"
            >
              <option value={1} className="flex items-center gap-2">
                Activo
              </option>
              <option value={0} className="flex items-center gap-2">
                Inactivo
              </option>
            </select>
          </div>

          {/* --- Botón con Efecto Premium --- */}
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0px 5px 15px rgba(110, 193, 228, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-[#61CE70] to-[#6EC1E4] text-white py-4 rounded-xl font-bold text-lg shadow-lg mt-4 flex items-center justify-center gap-2"
          >
            <Save size={22} />
            Guardar Cambios
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
