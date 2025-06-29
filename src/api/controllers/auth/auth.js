import { URL_ENDPOINT } from "../../conexion";

export const REGISTRAR_USER = `${URL_ENDPOINT}/controllers/auth/registrar_usuario.php`;
export const VALIDAR_CODIGO = `${URL_ENDPOINT}/controllers/auth/verificar_codigo.php`;
export const LOGIN = `${URL_ENDPOINT}/controllers/auth/login.php`;
export const NOTIFICAR_LOGIN = `${URL_ENDPOINT}/utils/notificar_login.php`;
export const RECUPERAR_CONTRASENA = `${URL_ENDPOINT}/controllers/auth/recuperar_contrasena.php`;
export const CAMBIAR_CONTRASENA = `${URL_ENDPOINT}/controllers/auth/cambiar_contrasena.php`;
