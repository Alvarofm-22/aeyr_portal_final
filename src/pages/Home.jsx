import { useAuth } from "../context/AuthContext";
import AdminHome from "./AdminHome";
import VendedorHome from "./VendedorHome";
import { ROLES } from "../constants/roles";


const Home = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;
  if (!user) return <div>No autenticado</div>;

  if (user.rol === ROLES.ADMIN) return <AdminHome />;
  if (user.rol === ROLES.VENDEDOR) return <VendedorHome />;

  return <div>No autorizado</div>;
};

export default Home;