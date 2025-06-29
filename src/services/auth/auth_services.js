import axios from "axios";
import { LOGIN,CAMBIAR_CONTRASENA,RECUPERAR_CONTRASENA,REGISTRAR_USER,VALIDAR_CODIGO } from "../../api/controllers/auth/auth";

export const registrarUsuario = async (datos) => {
  try {
    const res = await axios.post(REGISTRAR_USER, datos);
    return res.data;
  } catch (error) {
    console.error("Error registrando:", error);
    throw error;
  }
};

// Login
export const loginUsuario = async (datos) => {
  try {
    const res = await axios.post(LOGIN, datos);
    return res.data;
  } catch (error) {
    console.error("Error logueando:", error);
    throw error;
  }
};

// Recuperar contraseña
export const recuperarContrasena = async (datos) => {
  try {
    const res = await axios.post(RECUPERAR_CONTRASENA, datos);
    return res.data;
  } catch (error) {
    console.error("Error recuperando contraseña:", error);
    throw error;
  }
};

export const validarCodigo = async (codigo) => {
  try {
    const res = await axios.post(VALIDAR_CODIGO, { codigo });
    return res.data;
  } catch (error) {
    console.error("Error validando el código:", error);
    throw error;
  }
};

export const cambiarContrasena = async (datos) => {
  try {
    const res = await axios.post(CAMBIAR_CONTRASENA, datos);
    return res.data;
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    throw error;
  }
};