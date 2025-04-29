import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CAMBIAR_CONTRASENA } from "../../api/registro";
export default function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(CAMBIAR_CONTRASENA, {
        codigo,
        nuevaContrasena
      });

      if (res.data.success) {
        alert("✅ Contraseña cambiada con éxito");
        navigate("/login");
      } else {
        alert("❌ " + res.data.message);
      }
    } catch (error) {
      console.error("Error al verificar código:", error);
      alert("Hubo un error al cambiar la contraseña.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F4F0]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-[#B68F72]">
          Cambiar Contraseña
        </h2>

        <input
          type="text"
          placeholder="Código de verificación"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B68F72]"
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B68F72]"
        />

        <button
          type="submit"
          className="w-full bg-[#B68F72] text-white py-2 rounded-lg font-medium hover:bg-[#9C745C] transition"
        >
          Cambiar contraseña
        </button>
      </form>
    </div>

  );
}
