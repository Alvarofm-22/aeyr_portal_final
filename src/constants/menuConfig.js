import { ROLES } from "./roles";

export const MENU_CONFIG = {
  [ROLES.ADMIN]: [
    { label: "Inicio", path: "/" },

    {
      label: "Cotizaciones",
      children: [
        { label: "Notificaciones", path: "/cotizaciones/notificaciones" },
        { label: "Generar Cotización manual", path: "/cotizaciones/realizar" },
        { label: "Generar Cotización por Número de Cotización", path: "/cotizaciones/buscar" },
      ],
    },

    { label: "Reclamaciones", path: "/reclamos" },

    {
      label: "Gestión de Usuarios",
      children: [
        { label: "Usuarios", path: "/usuarios" },
        { label: "Empleados", path: "/empleados" },
      ]
    }
  ],

  [ROLES.VENDEDOR]: [
    { label: "Inicio", path: "/" },

    {
      label: "Cotizaciones",
      children: [
        { label: "Notificaciones", path: "/cotizaciones/notificaciones" },
        { label: "Generar Cotización manual", path: "/cotizaciones/realizar" },
        { label: "Generar Cotización por Numero de Cotización", path: "/cotizaciones/buscar" },
      ],
    },
  ],
};