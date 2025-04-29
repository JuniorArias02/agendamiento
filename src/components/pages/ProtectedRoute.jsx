import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Componente para las rutas protegidas
function ProtectedRoute({ children }) {
  const { usuario } = useAuth();  // Se toma el usuario del contexto de autenticación
  
  if (!usuario) {
    // Si no hay usuario (es decir, no está autenticado), redirige a Login
    return <Navigate to="/login" replace />;
  }

  return children;  // Si está autenticado, muestra la ruta protegida
}

export default ProtectedRoute;
