import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { ACTUALIZAR_PERFIL, OBTENER_PERFIL } from "../../api/servicios";
import { useAuth } from "../../context/AuthContext";
import ImageCropper from "../ui/ImageCropper"; // Asegúrate de que la ruta sea correcta
import { Camera } from "lucide-react"; // Asegúrate de que la ruta sea correcta

export default function MiPerfil() {
  const [imagenPreview, setImagenPreview] = useState("");
  const [imagen, setImagen] = useState(null);
  const [mostrarCrop, setMostrarCrop] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    documento: "",
    nombre: "",
    correo: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario?.id) cargarPerfil();
  }, [usuario]);

  const cargarPerfil = async () => {
    try {
      const { data } = await axios.post(OBTENER_PERFIL, { id: usuario.id });
      if (data.success) {
        setForm(data.usuario);
        setImagenPreview(data.usuario.imagen_perfil || "/default.png");
      } else {
        toast.error("Error cargando datos 😥");
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      toast.error("Error al conectar 🚨");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file)); // Previsualizar la imagen seleccionada
      setMostrarCrop(true); // Abrir el cropper
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", usuario.id);
      formData.append("documento", form.documento);
      formData.append("nombre", form.nombre);
      formData.append("correo", form.correo);
      formData.append("telefono", form.telefono);
      if (imagen) {
        formData.append("imagen", imagen); // Guardamos la imagen seleccionada o recortada
      }

      const { data } = await axios.post(ACTUALIZAR_PERFIL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Perfil actualizado 🎉");
      } else {
        toast.error("Error al actualizar 😥");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Error al conectar 🚨");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center relative">
      <Toaster />
      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center text-indigo-600 hover:text-indigo-800 p-2 rounded-full bg-white shadow-md transition-all"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver
      </button>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Imagen de perfil */}
        <div className="flex justify-center mb-6 relative">
          <label className="cursor-pointer relative">
            <img
              src={imagenPreview || "/default.png"}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full border-4 border-green-400 shadow-md object-cover"
              onClick={() => setMostrarModal(true)} // Abre el modal al hacer clic
            />
          </label>
        </div>

        {/* Formulario */}
        {["documento", "nombre", "correo", "telefono"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-gray-700 mb-2 capitalize">{field}</label>
            <input
              type={field === "correo" ? "email" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-all"
        >
          <Save className="w-5 h-5" />
          Guardar Cambios
        </button>
      </motion.form>

      {/* Cropper cuando se selecciona la imagen */}
      {mostrarCrop && (
        <ImageCropper
        image={URL.createObjectURL(imagen)}
        onCropDone={(cropped) => {
          setImagenPreview(cropped.fileUrl);
          setImagen(cropped.blob);
          setMostrarCrop(false);
        }}
        onCancel={() => setMostrarCrop(false)}
      />
      
      )}

      {/* Modal de la imagen */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-white via-gray-100 to-white backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl border border-gray-300 animate-fade-in">

            {/* Cerrar */}
            <button
              onClick={() => setMostrarModal(false)}
              className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Imagen */}
            <div className="flex flex-col items-center">
              <img
                src={imagenPreview || "/default.png"}
                alt="Imagen de perfil grande"
                className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-gray-200 mb-4"
              />

              <h3 className="text-xl font-bold text-gray-700 mb-8">Actualizar Imagen</h3>

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    fileInputRef.current.click();
                  }}
                  className="cursor-pointer flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-medium transition"
                >
                  <Camera className="w-4 h-4" />
                  Cambiar
                </button>

                <button
                  onClick={() => setMostrarModal(false)}
                  className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-full text-sm font-medium transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* Input de archivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
