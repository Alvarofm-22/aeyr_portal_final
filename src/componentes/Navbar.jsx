import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../style/Navbar.css";
import { MENU_CONFIG } from "../constants/menuConfig";
import { useAuth } from "../context/AuthContext";

import { obtenerCotizaciones } from "../services/CotizacionService";
import { obtenerReclamos } from "../services/ReclamoService";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [badges, setBadges] = useState({
    cotizaciones: 0,
    reclamos: 0,
  });

  const role = user?.rol;

  const menuItems = useMemo(() => {
    if (!role) return [];
    return MENU_CONFIG[role] ?? [];
  }, [role]);

  const actualizarContadores = async () => {
    try {
      const [cotizaciones, reclamos] = await Promise.all([
        obtenerCotizaciones(),
        obtenerReclamos(),
      ]);

      setBadges({
        cotizaciones: (cotizaciones || []).filter(
          (c) => c.estado === "PENDIENTE"
        ).length,
        reclamos: (reclamos || []).filter(
          (r) => r.estado === "PENDIENTE"
        ).length,
      });
    } catch (error) {
      console.error("Navbar error:", error.message);
    }
  };

  useEffect(() => {
    if (!user) return;

    actualizarContadores();

    const interval = setInterval(actualizarContadores, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>AEYR PANEL</h2>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item, index) => {
            if (!item.children) {
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`menu-item ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  {item.label}

                  {item.path === "/reclamos" && badges.reclamos > 0 && (
                    <span className="badge-count">{badges.reclamos}</span>
                  )}
                </Link>
              );
            }

            return (
              <div key={index} className="menu-dropdown">
                <div
                  className="menu-item dropdown-trigger"
                  onClick={() =>
                    setOpenMenu(openMenu === index ? null : index)
                  }
                >
                  <span>{item.label}</span>

                  {item.label === "Cotizaciones" &&
                    badges.cotizaciones > 0 && (
                      <span className="badge-count">
                        {badges.cotizaciones}
                      </span>
                    )}

                  <span
                    className={`arrow ${
                      openMenu === index ? "rotate" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>

                <div
                  className={`submenu-wrapper ${
                    openMenu === index ? "open" : ""
                  }`}
                >
                  <div className="submenu">
                    {item.children.map((sub, i) => (
                      <Link
                        key={i}
                        to={sub.path}
                        className="submenu-item"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="btn-logout"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* 🔒 MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="modal">
          <div className="modal-content logout-modal">
            <h3>¿Cerrar sesión?</h3>

            <p className="logout-text">
              Tu sesión actual se cerrará. ¿Deseas continuar?
            </p>

            <div className="modal-actions">
              <button
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Sí, salir
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;