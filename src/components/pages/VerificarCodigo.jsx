import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {CAMBIAR_CONTRASENA} from "../../api/registro";
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
    <div className="min-h-screen flex items-center justify-center bg-indigo-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-sm">
        <h2 className="text-xl font-bold text-indigo-600 text-center">Cambiar Contraseña</h2>

        <input
          type="text"
          placeholder="Código de verificación"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-300"
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-300"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Cambiar contraseña
        </button>
      </form>
    </div>
  );
}
