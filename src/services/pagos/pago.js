import axios from "axios";
import { VERIFICAR_PAGO, PAYMENT,ACTUALIZAR_SESSION_ID } from "../../api/controllers/pagos/pagos";

export const verificarPago = async (sessionId) => {
	try {
		const res = await axios.post(VERIFICAR_PAGO, { session_id: sessionId });
		return res.data;
	} catch (error) {
		console.error("Error al verificar el pago:", error);
		throw error;
	}
};

export const iniciarPago = async ({ monto, titulo, servicio_id, session_id }) => {
  try {
    const response = await axios.post(PAYMENT, {
      monto,
      titulo,
      servicio_id,
      session_id
    });
    return response;
  } catch (error) {
    console.error("Error al iniciar pago:", error);
    throw error;
  }
};

export const actualizarSessionId = async ({ usuario_id, session_id }) => {
  try {
    const res = await axios.post(ACTUALIZAR_SESSION_ID, { usuario_id, session_id });
    return res.data;
  } catch (error) {
    console.error("Error actualizando session_id:", error);
    throw error;
  }
};