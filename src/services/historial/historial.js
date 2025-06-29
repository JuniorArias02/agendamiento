import axios from "axios";

import { OBTENER_HISTORIAL_ACCESOS } from "../../api/controllers/historial/historial";

export const obtenerHistorialAccesos = async (usuario_id) => {
  try {
    const res = await axios.get(`${OBTENER_HISTORIAL_ACCESOS}?usuario_id=${usuario_id}`);
    return res.data.accesos || [];
  } catch (error) {
    console.error("Error obteniendo historial de accesos:", error);
    throw error;
  }
};
