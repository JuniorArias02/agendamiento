import { URL_ENDPOINT } from "../../conexion";

export const GUARDAR_CITA = `${URL_ENDPOINT}/controllers/citas/guardar_cita.php`;
export const OBTENER_CITA = `${URL_ENDPOINT}/controllers/citas/obtener_citas.php`;
export const DETALLE_CITA = `${URL_ENDPOINT}/controllers/citas/detalle_cita.php`;
export const OBTENER_HORAS_OCUPADAS = `${URL_ENDPOINT}/controllers/citas/obtener_horas_ocupadas.php`;
export const OBTENER_DISPONIBILIDAD = `${URL_ENDPOINT}/controllers/citas/obtener_disponibilidad.php`;
export const GUARDAR_HORA_DISPONIBLE = `${URL_ENDPOINT}/controllers/citas/guardar_disponibilidad.php`;
export const ACTUALIZAR_ESTADO_CITA = `${URL_ENDPOINT}/controllers/citas/actualizar_estado_cita.php`;
export const CREAR_CITA_PENDIENTE = `${URL_ENDPOINT}/controllers/citas/crear_cita_pendiente.php`;
export const REAGENDAR_CITA = `${URL_ENDPOINT}/controllers/citas/reagendar_cita.php`;
export const OBTENER_FECHA_DISPONIBLE = `${URL_ENDPOINT}/controllers/citas/obtener_fechas_disponibles.php`;