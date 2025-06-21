import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicRoute({ children }) {
  const { usuario } = useAuth();

  // Si ya tiene rol, redirige según su tipo
  if (usuario?.rol === "paciente") {
    return <Navigate to="/nueva_agenda" replace />;
  }
  if (usuario?.rol === "psicologa") {
    return <Navigate to="/tus_citas" replace />;
  }

  return children;
}