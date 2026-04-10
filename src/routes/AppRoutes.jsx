import { ROLES } from "../constants/roles";
import PrivateRoute from "./PrivateRoute";

<Route
    path="/cotizaciones/realizar"
    element={
        <PrivateRoute roles={[ROLES.ADMIN]}>
            <Cotizacion />
        </PrivateRoute>
    }
/>