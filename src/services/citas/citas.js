import axios from "axios";

import { OBTENER_FECHA_DISPONIBLE, MI_TIEMPO, REAGENDAR_CITA, CREAR_CITA_PENDIENTE, GUARDAR_CITA, ACTUALIZAR_ESTADO_CITA, DETALLE_CITA, GUARDAR_HORA_DISPONIBLE, OBTENER_CITA, OBTENER_DISPONIBILIDAD, OBTENER_HORAS_OCUPADAS } from "../../api/controllers/citas/citas";



export const obtenerMiTiempo = async (psicologa_id) => {
  try {
    const response = await axios.post(MI_TIEMPO, {
      psicologa_id
    });
    return response.data;
  } catch (error) {
    console.error("Error ", error);
    throw error;
  }
};

export const obtenerHorasDisponibles = async (fecha, psicologa_id) => {
  try {
    const response = await axios.post(OBTENER_DISPONIBILIDAD, {
      fecha,
      psicologa_id
    });
    // console.log("Horas disponibles:", response);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo horas disponibles:", error);
    throw error;
  }
};


export const obtenerHorasOcupadas = async (fecha, psicologa_id) => {
  try {
    const response = await axios.post(OBTENER_HORAS_OCUPADAS, {
      fecha,
      psicologa_id
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo horas ocupadas:", error);
    throw error;
  }
};


export const guardarHorasDisponibles = async (datos) => {
  try {
    const res = await axios.post(GUARDAR_HORA_DISPONIBLE, datos, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("Error guardando disponibilidad:", error);
    throw error;
  }
};

export const obtenerDetalleCita = async (id) => {
  try {
    const res = await axios.post(DETALLE_CITA, { id });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error al obtener detalle de cita:", error);
    throw error;
  }
};


export const obtenerCitas = async (usuarioId, estado = null) => {
  try {
    const body = { usuario_id: usuarioId };
    if (estado) body.estado_cita = estado;

    const res = await axios.post(OBTENER_CITA, body);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return [];
  }
};


export const actualizarEstadoCita = async (citaId, estado) => {
  try {
    const res = await axios.post(`${ACTUALIZAR_ESTADO_CITA}?id=${citaId}`, {
      estado_cita: estado,
    });
    return res.data;
  } catch (error) {
    console.error("Error al actualizar estado de cita:", error);
    throw error;
  }
};

export const guardarCita = async (datos) => {
  try {
    const res = await axios.post(GUARDAR_CITA, datos);
    return res.data;
  } catch (error) {
    console.error("Error al guardar cita:", error);
    throw error;
  }
};


export const guardarCitaPendientes = async (datos) => {
  try {
    const res = await axios.post(CREAR_CITA_PENDIENTE, datos);
    return res.data;
  } catch (error) {
    console.error("Error al guardar cita:", error);
    throw error;
  }
};

export const reagendarCita = async (datos) => {
  try {
    const res = await axios.post(REAGENDAR_CITA, datos);
    return res.data;
  } catch (error) {
    console.error("Error al guardar cita:", error);
    throw error;
  }
};


export const obtenerFechasDisponbiles = async (datos) => {
  try {
    const res = await axios.post(OBTENER_FECHA_DISPONIBLE, datos);
    return res.data;
  } catch (error) {
    console.error("Error al guardar cita:", error);
    throw error;
  }
};
