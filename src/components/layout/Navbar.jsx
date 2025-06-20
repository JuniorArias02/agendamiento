import { Menu, UserRound, DoorOpen, DoorClosed, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { getSwipe } from "../../utils/SwipeControl";  
import { AnimatePresence, motion } from "framer-motion";
function Navbar() {
  const navigate = useNavigate();
  const { logout, usuario } = useAuth();
  const [hover, setHover] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

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
        setOpenMenu(true);
      } else if (diffX < -80 && openMenu) {
        setOpenMenu(false);
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [openMenu]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const enlacesPsicologa = [
    { label: "Inicio", to: "https://psicologicamentehablando.space/" },
    { label: "Tus Citas", to: "/tus_citas" },
    { label: "Tus Servicios", to: "/tus_servicios" },
    // { label: "Mis Historias", to: "/tus_citas" },
    { label: "Mi Disponibilidad", to: "/mi_disponibilidad" },
    { label: "Mis Accesos ", to: "/historial_accesos" }
  ];

  const enlacesPaciente = [
    { label: "Inicio", to: "https://psicologicamentehablando.space/" },
    { label: "Tus Citas", to: "/tus_citas" },
    { label: "Nueva Agenda", to: "/nueva_agenda" },
    { label: "Mis Informes", to: "/historial_accesos" }
  ];

  let links = [];

  if (!usuario) {
    links = [
      { label: "Inicio", to: "https://psicologicamentehablando.space/" },
      { label: "Nueva Agenda", to: "/nueva_agenda" }
    ];
  } else if (usuario.rol === "psicologa") {
    links = enlacesPsicologa;
  } else if (usuario.rol === "paciente") {
    links = enlacesPaciente;
  }
  const NavLink = ({ item, navigate }) => (
    <button
      onClick={() => {
        if (item.to.startsWith("http")) {
          window.location.href = item.to;
        } else {
          navigate(item.to);
        }
      }}
      className="text-white text-base font-medium relative group transition duration-300 cursor-pointer focus:outline-none px-1 py-2"
    >
      {item.label}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 ease-in-out" />
    </button>
  );

  const MobileMenu = ({ openMenu, setOpenMenu, links, navigate, usuario, handleLogout }) => (
  <AnimatePresence>
    {openMenu && (
      <>
        {/* Menú principal */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 h-full w-64 bg-[#6EC1E4] z-50 shadow-lg lg:hidden"
        >
          <div className="p-6 flex flex-col gap-6 h-full">
            {/* Encabezado */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-between items-center"
            >
              <div className="text-lg font-semibold text-white">Menú</div>
              <button
                onClick={() => setOpenMenu(false)}
                className="focus:outline-none p-1 hover:bg-white/10 rounded-full transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={24} color="white" />
              </button>
            </motion.div>

            {/* Enlaces */}
            <nav className="flex flex-col gap-4 flex-grow">
              {links.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => {
                    if (item.to.startsWith("http")) {
                      window.location.href = item.to;
                    } else {
                      navigate(item.to);
                    }
                    setOpenMenu(false);
                  }}
                  className="text-lg text-white font-medium text-left py-2 focus:outline-none focus:bg-white/10 rounded px-2 hover:bg-white/10 transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>

            {/* Pie de página */}
            {usuario && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + 0.02 * links.length }}
                className="mt-auto pt-4 border-t border-white/30"
              >
                <motion.div 
                  className="flex items-center gap-3 mb-4 px-2 py-1.5"
                  whileHover={{ x: 3 }}
                >
                  <UserRound size={20} className="text-white" />
                  <span className="text-white font-medium truncate">
                    {usuario.nombre}
                  </span>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="w-full text-left text-red-200 hover:text-white px-2 py-2 focus:outline-none rounded hover:bg-white/10 transition-colors"
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cerrar sesión
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Fondo oscuro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpenMenu(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          transition={{ duration: 0.2 }}
        />
      </>
    )}
  </AnimatePresence>
); 

  return (
    <>
      <nav className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-[#61CE70] to-[#6EC1E4] shadow-lg flex items-center justify-between fixed top-0 z-50">
        {/* Parte izquierda: hamburguesa + logo */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Botón hamburguesa en móvil */}
          <button
            className="lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={() => setOpenMenu(true)}
          >
            <Menu size={28} color="white" />
          </button>

          {/* Logo - versión corta en móvil */}
          <div className="text-lg sm:text-xl font-semibold text-white whitespace-nowrap">
            <span className="lg:hidden">PsicoHablando</span>
            <span className="hidden lg:inline">PsicologicamenteHablando</span>
          </div>
        </div>

        {/* Enlaces centrales - solo en desktop */}
        <div className="hidden lg:flex items-center gap-6 mx-4 flex-grow justify-center">
          {links.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              navigate={navigate}
            />
          ))}
        </div>

        {/* Parte derecha: perfil + logout */}
        {usuario && (
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Perfil con tooltip para nombre largo */}
            <div className="relative group">
              <button
                onClick={() => navigate("/mi_perfil")}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Mi perfil"
              >
                <UserRound size={18} className="text-[#61CE70]" />
                <span className="hidden sm:inline text-sm font-medium text-gray-800 truncate max-w-[120px]">
                  {usuario?.nombre}
                </span>
              </button>
              {/* Tooltip para nombre largo */}
              <div className="absolute right-0 top-full mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                {usuario?.nombre}
              </div>
            </div>

            {/* Botón logout */}
            <button
              onClick={handleLogout}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Cerrar sesión"
            >
              {hover ? (
                <DoorOpen size={22} color="white" />
              ) : (
                <DoorClosed size={22} color="white" />
              )}
            </button>
          </div>
        )}
      </nav>

      {/* Menú móvil (igual que tu versión original) */}
      <MobileMenu
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        links={links}
        navigate={navigate}
        usuario={usuario}
        handleLogout={handleLogout}
      />
    </>
  );
}

export default Navbar;
