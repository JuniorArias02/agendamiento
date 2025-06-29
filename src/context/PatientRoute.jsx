import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PatientRoute({ children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return children;
  }

  if (usuario.rol === "psicologo") {
    return <Navigate to="/tus_citas" replace />; // Redirige a psicólogos
  }

 
  if (usuario.rol === "paciente" || !usuario.rol) {
    return children;
  }

  // Redirige por defecto (ej: otros roles no contemplados)
  return <Navigate to="/tus_citas" replace />;
}