import axios from "axios";
import { VERIFICAR_PAGO, PAYMENT, ACTUALIZAR_SESSION_ID } from "../../api/controllers/pagos/pagos";

export async function verificarPago(reference) {
  try {
    const res = await axios.get(
      `https://sandbox.wompi.co/v1/transactions?reference=${reference}`
    );
    const tx = res.data.data[0]; // la más reciente
    return {
      success: tx && tx.status === "APPROVED",
      transaction: tx,
    };
  } catch (err) {
    console.error("Error al verificar pago Wompi:", err);
    return { success: false };
  }
}
export const iniciarPago = async ({ monto, titulo, servicio_id, reference, redirect_url }) => {
  try {
    const response = await axios.post(PAYMENT, {
      monto,
      titulo,
      servicio_id,
      reference,
      redirect_url
    });
    return response;
  } catch (error) {
    console.error("Error al iniciar pago:", error);
    throw error;
  }
};

export const actualizarSessionId = async ({ usuario_id, reference }) => {
  try {
    const res = await axios.post(ACTUALIZAR_SESSION_ID, { usuario_id, reference });
    return res.data;
  } catch (error) {
    console.error("Error actualizando session_id:", error);
    throw error;
  }
};