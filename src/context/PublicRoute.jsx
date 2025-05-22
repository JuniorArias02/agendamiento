import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicRoute({ children }) {
  const { usuario } = useAuth();

  if (usuario) {
    return <Navigate to="/nueva_agenda" replace />;
  }

  return children;
}
