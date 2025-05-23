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
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#f7fafb]">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-[#1c7578] text-center mb-6">
          Editar Servicio
        </h2>

        <input
          type="text"
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          placeholder="Título del servicio"
          className="w-full px-5 py-3 rounded-xl border border-[#1c7578] focus:outline-none focus:ring-2 focus:ring-[#1c7578] transition placeholder:text-[#7ba6a7]"
        />

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full px-5 py-3 rounded-xl border border-[#1c7578] focus:outline-none focus:ring-2 focus:ring-[#1c7578] transition resize-none placeholder:text-[#7ba6a7]"
          rows={4}
        />

        <div className="flex flex-col sm:flex-row gap-5">
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            placeholder="Precio (COP)"
            className="w-full sm:w-1/2 px-5 py-3 rounded-xl border border-[#1c7578] focus:outline-none focus:ring-2 focus:ring-[#1c7578] transition placeholder:text-[#7ba6a7]"
          />

          <input
            type="number"
            name="duracion"
            value={form.duracion}
            onChange={handleChange}
            placeholder="Duración (min)"
            className="w-full sm:w-1/2 px-5 py-3 rounded-xl border border-[#1c7578] focus:outline-none focus:ring-2 focus:ring-[#1c7578] transition placeholder:text-[#7ba6a7]"
          />
        </div>

        <input
          type="text"
          name="imagen"
          value={form.imagen}
          onChange={handleChange}
          placeholder="URL de la imagen"
          className="w-full px-5 py-3 rounded-xl border border-[#1c7578] focus:outline-none focus:ring-2 focus:ring-[#1c7578] transition placeholder:text-[#7ba6a7]"
        />

        <select
          name="activo"
          value={form.activo}
          onChange={handleChange}
          className="w-full px-5 py-3 rounded-xl border border-[#1c7578] bg-white focus:outline-none focus:ring-2 focus:ring-[#1c7578] transition text-[#1c7578] font-semibold"
        >
          <option value={1}>Activo</option>
          <option value={0}>Inactivo</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#1c7578] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#155351] transition"
        >
          Guardar cambios
        </motion.button>
      </motion.form>
    </div>
  );
}
