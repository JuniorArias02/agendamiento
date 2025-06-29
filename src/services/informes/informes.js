import axios from "axios";
import { OBTENER_INFORME_CITA,GUARDAR_INFORME_CITA } from "../../api/controllers/informes/informes";

// Servicio para obtener informe
export const obtenerInformeCita = async (idCita) => {
  try {
    const res = await axios.post(OBTENER_INFORME_CITA, { idCita });
    return res.data;
  } catch (error) {
    console.error("Error al obtener informe:", error);
    throw error;
  }
};

// Servicio para guardar informe
export const guardarInformeCita = async (formulario) => {
  try {
    const res = await axios.post(GUARDAR_INFORME_CITA, formulario);
    return res.data;
  } catch (error) {
    console.error("Error al guardar informe:", error);
    throw error;
  }
};