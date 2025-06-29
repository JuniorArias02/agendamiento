import axios from "axios";
import { OBTENER_PERFIL,ACTUALIZAR_PERFIL } from "../../api/controllers/perfil/perfi";

export const obtenerPerfil = async (id) => {
  try {
    const res = await axios.post(OBTENER_PERFIL, { id });
    return res.data;
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw error;
  }
};

export const actualizarPerfil = async (formData) => {
  try {
    const res = await axios.post(ACTUALIZAR_PERFIL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw error;
  }
};
