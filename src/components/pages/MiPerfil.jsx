import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import ImageCropper from "../ui/ImageCropper"; // Asegúrate de que la ruta sea correcta
import { Camera } from "lucide-react"; // Asegúrate de que la ruta sea correcta
import { setSwipe } from "../../utils/SwipeControl";
import { obtenerPerfil, actualizarPerfil } from "../../services/perfil/perfil";
import Skeleton from "../skeleton/Skeleton";

export default function MiPerfil() {
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(false);

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

  useEffect(() => {
    const debeDesactivarSwipe = mostrarModal || mostrarCrop;
    setSwipe(!debeDesactivarSwipe);
  }, [mostrarModal, mostrarCrop]);



  useEffect(() => {
    if (usuario?.id) cargarPerfil();
  }, [usuario]);

  const cargarPerfil = async () => {
    setLoading(true);
    try {
      const data = await obtenerPerfil(usuario.id);
      if (data.success) {
        setForm(data.usuario);
        setImagenPreview(data.usuario.imagen_perfil || "/default.png");
      } else {
        toast.error("Error cargando datos 😥");
      }
    } catch (error) {
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
    if (cargando) return;
    setCargando(true);

    try {
      const formData = new FormData();
      formData.append("id", usuario.id);
      formData.append("documento", form.documento);
      formData.append("nombre", form.nombre);
      formData.append("correo", form.correo);
      formData.append("telefono", form.telefono);
      if (imagen) formData.append("imagen", imagen);

      formData.append("imagen_perfil_actual", usuario.imagen_perfil || "");
      const data = await actualizarPerfil(formData);

      if (data.success) {
        toast.success("Perfil actualizado 🎉");
      } else {
        toast.error("Error al actualizar 😥");
      }
    } catch (error) {
      toast.error("Error al conectar 🚨");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center relative">
      <Toaster />

      {/* Botón Volver simple y discreto */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-custom-blue-1 hover:text-emerald-800 p-2 rounded-full transition cursor-pointer"
        aria-label="Volver"
      >
        <ArrowLeft className="w-8 h-8" />
      </button>

      {loading ? (
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm border border-gray-200">
          <div className="flex justify-center mb-5">
            <Skeleton className="w-20 h-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm border border-gray-200"
        >
          {/* Imagen de perfil minimalista */}
          <div className="flex justify-center mb-5">
            <label className="cursor-pointer">
              <img
                src={imagenPreview || "/default.png"}
                alt="Perfil"
                className="w-20 h-20 rounded-full border-2 border-emerald-400 object-cover hover:opacity-80 transition"
                onClick={() => setMostrarModal(true)}
              />
            </label>
          </div>

          {/* Inputs simplificados */}
          {["documento", "nombre", "correo", "telefono"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-gray-600 mb-1 capitalize text-sm">{field}</label>
              <input
                type={field === "correo" ? "email" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none text-sm"
                required
              />
            </div>
          ))}

          {/* Botón guardar más simple */}
          <button
            type="submit"
            className="w-full bg-custom-blue-5-down text-white py-2 rounded-md transition font-medium cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cargando}
          >
            <Save className="inline w-5 h-5 mr-2" />
            {cargando ? "Guardando..." : "Guardar Cambios"}
          </button>

        </motion.form>
      )}
      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0  bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="bg-white p-6 rounded-xl shadow-lg max-w-xs w-full"
          >
            <button
              onClick={() => setMostrarModal(false)}
              className="text-gray-500 hover:text-gray-800 text-xl float-right"
              aria-label="Cerrar modal"
            >
              &times;
            </button>
            <div className="flex flex-col items-center mt-4">
              <img
                src={imagenPreview || "/default.png"}
                alt="Perfil grande"
                className="w-24 h-24 rounded-full object-cover mb-4 border border-gray-200"
              />
              <h3 className="text-gray-700 font-semibold mb-6">Actualizar Imagen</h3>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    fileInputRef.current.click();
                  }}
                  className="bg-custom-blue-5-down hover:bg-emerald-600 text-white py-2 px-5 rounded-md text-sm font-medium transition"
                >
                  <Camera className="inline w-4 h-4 mr-1" />
                  Cambiar
                </button>
                <button
                  onClick={() => setMostrarModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-5 rounded-md text-sm transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {/* Cropper */}
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
    </div>

  );
}
