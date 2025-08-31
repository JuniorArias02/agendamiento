import { 
  Menu, UserRound, DoorOpen, DoorClosed, X, Home, 
  Calendar, Clock, FileText, Key, TicketPercent, 
  CalendarPlus, BarChart3, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { getSwipe } from "../../utils/SwipeControl";
import { AnimatePresence, motion } from "framer-motion";
import { RUTAS } from '../../routers/routers';

function Navbar() {
  const navigate = useNavigate();
  const { logout, usuario } = useAuth();
  const [hover, setHover] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const touchStartX = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (!getSwipe()) return;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (!getSwipe()) return;
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX.current;

      if (diffX > 80) {
        setSidebarOpen(true);
      } else if (diffX < -80 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Definición de enlaces con iconos
  const enlacesPsicologa = [
    { label: "Inicio", to: RUTAS.INICIO, icon: <Home size={20} /> },
    { label: "Tus Citas", to: RUTAS.TUS_CITAS.ROOT, icon: <Calendar size={20} /> },
    { label: "Tus Servicios", to: RUTAS.SERVICIOS.TUS, icon: <BarChart3 size={20} /> },
    { label: "Mi Disponibilidad", to: RUTAS.DISPONIBILIDAD, icon: <Clock size={20} /> },
    { label: "Mis Accesos", to: RUTAS.HISTORIAL_ACCESOS, icon: <Key size={20} /> },
    { label: "Generar Codigo", to: RUTAS.DESCUENTOS, icon: <TicketPercent size={20} /> },
  ];

  const enlacesPaciente = [
    { label: "Inicio", to: "https://psicologicamentehablando.space/", icon: <Home size={20} /> },
    { label: "Tus Citas", to: RUTAS.TUS_CITAS.ROOT, icon: <Calendar size={20} /> },
    { label: "Nueva Agenda", to: RUTAS.AGENDA.NUEVA, icon: <CalendarPlus size={20} /> },
    { label: "Mis Informes", to: RUTAS.HISTORIAL_ACCESOS, icon: <FileText size={20} /> },
  ];

  let links = [];

  if (!usuario) {
    links = [
      { label: "Inicio", to: "https://psicologicamentehablando.space/", icon: <Home size={20} /> },
      { label: "Nueva Agenda", to: RUTAS.AGENDA.NUEVA, icon: <CalendarPlus size={20} /> }
    ];
  } else if (usuario.rol === "psicologa") {
    links = enlacesPsicologa;
  } else if (usuario.rol === "paciente") {
    links = enlacesPaciente;
  }

  const SidebarLink = ({ item, collapsed }) => (
    <button
      onClick={() => {
        if (item.to.startsWith("http")) {
          window.open(item.to, '_blank');
        } else {
          navigate(item.to);
        }
        setSidebarOpen(false);
      }}
      className="flex items-center gap-3 text-white text-base font-medium p-3 rounded-lg hover:bg-white/10 transition duration-300 cursor-pointer focus:outline-none w-full"
      title={item.label}
    >
      {item.icon}
      {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
    </button>
  );

  const Sidebar = ({ collapsed, setCollapsed, links, usuario, handleLogout }) => (
    <motion.div
      animate={{ width: collapsed ? 70 : 250 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
     className="fixed top-0 left-0 h-full bg-gradient-to-b from-[#1A535C] to-[#4ECDC4] z-40 shadow-lg hidden lg:flex flex-col"
    >
      <div className="p-4 flex flex-col gap-4 h-full">
        {/* Logo y botón de colapsar */}
        <div className="flex justify-between items-center h-12">
          {!collapsed && (
            <div className="text-lg font-semibold text-white whitespace-nowrap">
              PsicoHablando
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-full hover:bg-white/10 transition"
          >
            {collapsed ? <ChevronRight size={20} color="white" /> : <ChevronLeft size={20} color="white" />}
          </button>
        </div>

        {/* Enlaces */}
        <nav className="flex flex-col gap-2 flex-grow mt-4">
          {links.map((item) => (
            <SidebarLink 
              key={item.label} 
              item={item} 
              collapsed={collapsed} 
            />
          ))}
        </nav>

        {/* Información de usuario y logout */}
        {usuario && (
          <div className="mt-auto pt-4 border-t border-white/30">
            <button
              onClick={() => navigate("/mi_perfil")}
              className="flex items-center gap-3 w-full text-left text-white p-2 rounded-lg hover:bg-white/10 transition mb-2"
              title={usuario.nombre}
            >
              <UserRound size={20} className="text-white" />
              {!collapsed && (
                <span className="text-white font-medium truncate">
                  {usuario.nombre}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left text-white p-2 rounded-lg hover:bg-white/10 transition"
              title="Cerrar sesión"
            >
              <DoorClosed size={20} />
              {!collapsed && <span>Cerrar sesión</span>}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const MobileMenu = ({ sidebarOpen, setSidebarOpen, links, usuario, handleLogout }) => (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Menú móvil */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-70 bg-gradient-to-b from-[#1A535C] to-[#4ECDC4] z-50 shadow-lg lg:hidden"
          >
            <div className="p-6 flex flex-col gap-6 h-full">
              {/* Encabezado */}
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-white">Menú</div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="focus:outline-none p-1 hover:bg-white/10 rounded-full transition"
                >
                  <X size={24} color="white" />
                </button>
              </div>

              {/* Enlaces */}
              <nav className="flex flex-col gap-2 flex-grow">
                {links.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.to.startsWith("http")) {
                        window.open(item.to, '_blank');
                      } else {
                        navigate(item.to);
                      }
                      setSidebarOpen(false);
                    }}
                    className="flex items-center gap-3 text-lg text-white font-medium text-left py-3 px-4 rounded-lg hover:bg-white/10 transition"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Pie de página */}
              {usuario && (
                <div className="mt-auto pt-4 border-t border-white/30">
                  <button
                    onClick={() => navigate("/mi_perfil")}
                    className="flex items-center gap-3 w-full text-left text-white px-2 py-2 rounded-lg hover:bg-white/10 transition mb-2"
                  >
                    <UserRound size={20} className="text-white" />
                    <span className="text-white font-medium truncate">
                      {usuario.nombre}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left text-white px-2 py-2 rounded-lg hover:bg-white/10 transition"
                  >
                    <DoorClosed size={20} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Fondo oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            transition={{ duration: 0.2 }}
          />
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Navbar superior (solo para móvil) */}
      <nav className="w-full px-4 sm:px-6 py-3 bg-gradient-to-b from-[#1A535C] to-[#4ECDC4] shadow-lg flex items-center justify-between fixed top-0 z-40 lg:hidden">
        {/* Botón para abrir menú móvil */}
        <button
          className="text-white focus:outline-none"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={28} color="white" />
        </button>

        {/* Logo */}
        <div className="text-lg font-semibold text-white">
          PsicoHablando
        </div>

        {/* Perfil (solo si hay usuario) */}
        {usuario && (
          <button
            onClick={() => navigate("/mi_perfil")}
            className="p-1.5 rounded-full bg-white/20"
          >
            <UserRound size={20} className="text-white" />
          </button>
        )}
      </nav>

      {/* Sidebar para desktop */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        links={links}
        usuario={usuario}
        handleLogout={handleLogout}
      />

      {/* Menú móvil */}
      <MobileMenu
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        links={links}
        usuario={usuario}
        handleLogout={handleLogout}
      />
    </>
  );
}

export default Navbar;