export const RUTAS = {
  HOME: "/",
  LOGIN: "/login",
  
  INICIO: "https://psicologicamentehablando.space/",

  VERIFICACION: {
    VERIFICAR_CUENTA: "/verificar_cuenta",
    VERIFICAR_CODIGO: "/verificar_codigo",
  },

  AGENDA: {
    ROOT: "/agenda",
    NUEVA: "/nueva_agenda",
    CONFIRMAR: "/agenda/confirmar",
    CANCELADO: "/agenda/cancelado",
    CONFIRMADO: "/agenda/confirmado",
  },

  TUS_CITAS: {
    ROOT: "/tus_citas",
    DETALLE: "/cita/:id",
    REAGENDAR: "/reagendar_cita",
  },

  SERVICIOS: {
    TUS: "/tus_servicios",
    CREAR: "/crear_servicios",
    EDITAR: "/servicios/editar_servicio",
  },

  PERFIL: "/mi_perfil",

  DISPONIBILIDAD: "/mi_disponibilidad",

  HISTORIAL_ACCESOS: "/historial_accesos",

  INFORME: {
    PSICOLOGICO: "/informe_psicologico/:idCita",
  },

  DESCUENTOS:"/generar_descuentos",

  NOT_FOUND: "*",
};