import { ROLES } from "../constants/roles";

export const isAdmin = (user) => user?.rol === ROLES.ADMIN;
export const isVendedor = (user) => user?.rol === ROLES.VENDEDOR;

export const getUserRole = (user) => user?.rol || null;