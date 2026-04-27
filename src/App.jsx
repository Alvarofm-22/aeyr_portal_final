import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cotizacion from "./pages/Cotizacion";
import NotCotizacion from "./pages/NotCotizacion";
import LibroReclamaciones from "./pages/LibroReclamaciones";
import Navbar from "./componentes/Navbar";
import PrivateRoute from "./routes/PrivateRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";
import CotizacionViewer from "./pages/CotizacionViewer";
import BuscarCotizacion from "./pages/BuscarCotizacion"; // 👈 NUEVO
import { ROLES } from "./constants/roles";
import EmpleadoHome from "./pages/EmpleadoHome";
import UsuarioHome from "./pages/UsuarioHome";
import ProductosHome from "./pages/ProductosHome";
import TarifaProductoHome from "./pages/TarifaProductoHome";

const AppRoutes = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app-layout">
      {isAuthenticated && <Navbar logout={logout} />}

      <main className={isAuthenticated ? "main-content" : "full-content"}>
        <Routes>

          {/* LOGIN */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />

          {/* HOME */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* NOTIFICACIONES */}
          <Route
            path="/cotizaciones/notificaciones"
            element={
              <PrivateRoute roles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <NotCotizacion />
              </PrivateRoute>
            }
          />

          {/* CREAR */}
          <Route
            path="/cotizaciones/realizar"
            element={
              <PrivateRoute roles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <Cotizacion />
              </PrivateRoute>
            }
          />

          {/* 🔍 BUSCADOR */}
          <Route
            path="/cotizaciones/buscar"
            element={
              <PrivateRoute roles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <BuscarCotizacion />
              </PrivateRoute>
            }
          />

          {/* 📄 VIEWER PDF */}
          <Route
            path="/cotizaciones/numero/:numero"
            element={
              <PrivateRoute roles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <CotizacionViewer />
              </PrivateRoute>
            }
          />

          {/* RECLAMOS */}
          <Route
            path="/reclamos"
            element={
              <PrivateRoute roles={[ROLES.ADMIN]}>
                <LibroReclamaciones />
              </PrivateRoute>
            }
          />

          {/* EMLEADOS */}
          <Route
            path="/empleados"
            element={
              <PrivateRoute roles={[ROLES.ADMIN]}>  
                <EmpleadoHome />
              </PrivateRoute>
            }
          />

          {/* USUARIOS */}
          <Route
            path="/usuarios"
            element={
              <PrivateRoute roles={[ROLES.ADMIN]}>  
                <UsuarioHome />
              </PrivateRoute>
            }
          />

          {/* Productos */}
          <Route
            path="/productos"
            element={
              <PrivateRoute roles={[ROLES.ADMIN]}>  
                <ProductosHome />
              </PrivateRoute>
            }
          />

          {/* TARIFA POR PRODUCTO SEGUN DISTRITO */}
          <Route
            path="/tarifaProducto"
            element={
              <PrivateRoute roles={[ROLES.ADMIN]}>  
                <TarifaProductoHome />
              </PrivateRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;