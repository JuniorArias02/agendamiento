import axios from "axios";
import { ELIMINAR_SERVICIO, CREAR_SERVICIO, LISTAR_SERVICIOS, ACTUALIZAR_SERVICIO, LISTAR_SERVICIOS_PUBLICOS } from "../../api/controllers/servicios/servicios";

// Listar servicios por usuario
export const obtenerServiciosPorUsuario = async (usuario_id) => {
  try {
    const res = await axios.post(LISTAR_SERVICIOS, {
      usuario_id: usuario_id
    });
    return res.data;
  } catch (error) {
    console.error("Error al listar servicios:", error);
    throw error;
  }
};

// Eliminar un servicio
export const eliminarServicioPorId = async (datos) => {
  try {
    const res = await axios.post(ELIMINAR_SERVICIO, datos);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    throw error;
  }
};

export const listarServiciosPublicos = async () => {
  try {
    const res = await axios.get(LISTAR_SERVICIOS_PUBLICOS);
    return res.data?.servicios ?? [];
  } catch (error) {
    console.error("Error al listar servicios públicos:", error);
    throw error;
  }
};

export const crearServicio = async (formData) => {
  try {
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
    const res = await axios.post(CREAR_SERVICIO, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error al crear servicio:", error);
    throw error;
  }
};

export const actualizarServicio = async (datos) => {
  try {
    const res = await axios.post(ACTUALIZAR_SERVICIO, datos);
    return res.data;
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    throw error;
  }
};