import { UserRound, DoorOpen, DoorClosed, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { getSwipe } from "../../utils/SwipeControl";

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
    { label: "Mis Historias", to: "/tus_citas" },
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

  return (
    <>
      <nav className="w-full px-4 py-3 bg-custom-blue-5 shadow-md flex items-center justify-between lg:flex-row flex-wrap">
        {/* Botón hamburguesa en móvil */}
        <button
          className="lg:hidden text-black"
          onClick={() => setOpenMenu(true)}
        >
          <Menu size={28} />
        </button>

        {/* Enlaces - solo en pantallas grandes */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.to.startsWith("http")) {
                  window.location.href = item.to; // Redirige fuera de tu app
                } else {
                  navigate(item.to); // Navega dentro de tu app
                }
              }}
              className="text-white text-base font-medium relative group transition duration-200 cursor-pointer"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 ease-in-out" />
            </button>
          ))}

        </div>


        {/* Perfil y Logout solo si hay usuario */}
        {usuario && (
          <div className="flex items-center gap-3 max-w-full overflow-hidden">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md shadow-inner cursor-pointer hover:brightness-105 transition whitespace-nowrap overflow-hidden max-w-[140px]"
              onClick={() => navigate("/mi_perfil")}
            >
              <UserRound size={20} className="text-black" />
              <span className="text-sm font-medium text-black truncate">
                {usuario?.nombre}
              </span>
            </div>

            <div
              onClick={handleLogout}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="cursor-pointer text-black hover:text-red-600 transition duration-200"
            >
              {hover ? <DoorOpen size={24} /> : <DoorClosed size={24} />}
            </div>
          </div>
        )}
      </nav>

      {/* Menú deslizable móvil */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform ${openMenu ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="p-6 flex flex-col gap-4">
          {links.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.to.startsWith("http")) {
                  window.location.href = item.to;
                } else {
                  navigate(item.to);
                }
                setOpenMenu(false);
              }}

              className="text-lg text-gray-800 font-medium text-left"
            >
              {item.label}
            </button>
          ))}
          {usuario && (
            <>
              <hr />
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline text-left mt-4"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>

      {/* Fondo para cerrar el menú móvil */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-white/60 backdrop-blur-md bg-opacity-30 z-40 lg:hidden"
          onClick={() => setOpenMenu(false)}
        />
      )}
    </>
  );
}

export default Navbar;
