import { ROLES } from "./roles";

export const MENU_CONFIG = {
  [ROLES.ADMIN]: [
    { label: "Inicio", path: "/" },

    {
      label: "Cotizaciones",
      children: [
        { label: "Notificaciones", path: "/cotizaciones/notificaciones" },
        { label: "Generar Cotización manual", path: "/cotizaciones/realizar" },
        { label: "Generar Cotizacion por ID", path: "/cotizaciones/buscar" },
      ],
    },

    { label: "Reclamaciones", path: "/reclamos" },
    { label: "Usuarios", path: "/usuarios" },
  ],

  [ROLES.VENDEDOR]: [
    { label: "Inicio", path: "/" },

    {
      label: "Cotizaciones",
      children: [
        { label: "Notificaciones", path: "/cotizaciones/notificaciones" },
        { label: "Generar Cotización manual", path: "/cotizaciones/realizar" },
        { label: "Generar Cotización por ID", path: "/cotizaciones/buscar" },
      ],
    },
  ],
};