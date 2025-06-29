import axios from "axios";

import { GENERAR_CODIGO_DESCUENTO,VALIDAR_CODIGO_DESCUENTO } from "../../api/controllers/descuento/descuento";

export const generarCodigoDescuento = async (datos) => {
  try {
    const response = await axios.post(GENERAR_CODIGO_DESCUENTO, datos);
    return response.data;
  } catch (error) {
    console.error("Error generando el código de descuento:", error);
    throw error;
  }
};

export const validarCodigoDescuento = async (datos) => {
  try {
    const response = await axios.post(VALIDAR_CODIGO_DESCUENTO, datos);
    return response.data;
  } catch (error) {
    console.error("Error validando el código de descuento:", error);
    throw error;
  }
};
