import axios from "axios";
import { OBTENER_CITA } from "../api/registro";

export const obtenerCitas = async (usuario_id) => {
  try {
    const res = await axios.post(OBTENER_CITA, {
      usuario_id,
  
    });
    return res.data;
  } catch (error) {
    console.error("Error al obtener citas", error);
    return [];
  }
};
