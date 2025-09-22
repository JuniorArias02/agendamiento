import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { RUTAS } from "../../routers/routers";
import { Calendar, BarChart3, Clock, Key, TicketPercent, CalendarPlus, FileText, Clock10 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { usuario, logout } = useAuth();

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Enlaces según el rol
  const enlacesPsicologa = [
    { label: "Tus Citas", to: RUTAS.TUS_CITAS.ROOT, icon: <Calendar size={20} /> },
    { label: "Tus Servicios", to: RUTAS.SERVICIOS.TUS, icon: <BarChart3 size={20} /> },
    { label: "Mi Disponibilidad", to: RUTAS.DISPONIBILIDAD, icon: <Clock size={20} /> },
    { label: "Mis Accesos", to: RUTAS.HISTORIAL_ACCESOS, icon: <Key size={20} /> },
    { label: "Generar Código", to: RUTAS.DESCUENTOS, icon: <TicketPercent size={20} /> },
    { label: "Mi Tiempo", to: RUTAS.MI_TIEMPO, icon: <Clock10 size={20} /> }
  ];

  const enlacesPaciente = [
    { label: "Tus Citas", to: RUTAS.TUS_CITAS.ROOT, icon: <Calendar size={20} /> },
    { label: "Nueva Agenda", to: RUTAS.AGENDA.NUEVA, icon: <CalendarPlus size={20} /> },
    { label: "Mis Informes", to: RUTAS.HISTORIAL_ACCESOS, icon: <FileText size={20} /> },
  ];

  let links = [];
  if (!usuario) {
    links = [{ label: "Nueva Agenda", to: RUTAS.AGENDA.NUEVA, icon: <CalendarPlus size={20} /> }];
  } else if (usuario.rol === "psicologa") {
    links = enlacesPsicologa;
  } else if (usuario.rol === "paciente") {
    links = enlacesPaciente;
  }

  const handleLogout = () => {
    logout();
    navigate(RUTAS.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar fijo */}
      <Navbar usuario={usuario} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar (fixed para desktop) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        links={links}
        usuario={usuario}
        handleLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Contenido principal con padding para navbar y margen para sidebar */}
      <main
        className="min-h-screen pt-16 transition-all duration-300 lg:pt-0"
        style={!isMobile ? {
          marginLeft: collapsed ? '70px' : '250px',
          transition: 'margin-left 0.3s ease'
        } : {}}
      >
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;