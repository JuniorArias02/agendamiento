import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PsicologoRoute({ children }) {
  const { usuario } = useAuth();

  if (usuario?.rol !== "psicologa") {
    return <Navigate to="/" replace />;
  }

  return children;
}