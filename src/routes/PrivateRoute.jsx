import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth(); // ✅ AQUÍ ESTÁ LA CLAVE

  // 🔐 no autenticado → login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 validación de roles
  if (roles && !roles.includes(user?.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;