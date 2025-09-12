import { motion, AnimatePresence } from "framer-motion";
import { UserRound, DoorClosed, ChevronRight, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SidebarLink = ({ item, collapsed, setSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        if (item.to.startsWith("http")) {
          window.open(item.to, "_blank");
        } else {
          navigate(item.to);
        }
        setSidebarOpen?.(false);
      }}
      className="flex items-center gap-3 text-white text-base font-medium p-3 rounded-lg hover:bg-white/10 transition duration-300 cursor-pointer focus:outline-none w-full"
      title={item.label}
    >
      {item.icon}
      {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
    </button>
  );
};

export const Sidebar = ({ collapsed, setCollapsed, links, usuario, handleLogout, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop */}
      <motion.div
        animate={{ width: collapsed ? 70 : 250 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 left-0 h-full bg-gradient-to-b from-[#1A535C] to-[#4ECDC4] z-40 shadow-lg hidden lg:block" // Cambiado de flex a block
      >
        <div className="p-4 flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center h-12">
            {!collapsed && <div className="text-lg font-semibold text-white">PsicoHablando</div>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-full hover:bg-white/10 transition"
            >
              {collapsed ? <ChevronRight size={20} color="white" /> : <ChevronLeft size={20} color="white" />}
            </button>
          </div>

          <nav className="flex flex-col gap-2 flex-grow mt-4">
            {links.map((item) => (
              <SidebarLink key={item.label} item={item} collapsed={collapsed} />
            ))}
          </nav>

          {usuario && (
            <div className="mt-auto pt-4 border-t border-white/30">
              <button
                onClick={() => navigate("/mi_perfil")}
                className="flex items-center gap-3 w-full text-left text-white p-2 rounded-lg hover:bg-white/10 transition mb-2"
                title={usuario.nombre}
              >
                <UserRound size={20} className="text-white" />
                {!collapsed && <span className="text-white font-medium truncate">{usuario.nombre}</span>}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left text-white p-2 rounded-lg hover:bg-white/10 transition"
              >
                <DoorClosed size={20} />
                {!collapsed && <span>Cerrar sesión</span>}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-gradient-to-b from-[#1A535C] to-[#4ECDC4] z-50 shadow-xl lg:hidden"
            >
              <div className="p-6 flex flex-col gap-6 h-full pt-20 overflow-y-auto">
                <div className="flex justify-between items-center -mt-8">
                  <div className="text-lg font-semibold text-white">Menú</div>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                    <X size={24} color="white" />
                  </button>
                </div>

                <nav className="flex flex-col gap-2 flex-grow">
                  {links.map((item) => (
                    <SidebarLink key={item.label} item={item} setSidebarOpen={setSidebarOpen} />
                  ))}
                </nav>

                {usuario && (
                  <div className="mt-auto pt-4 border-t border-white/30 space-y-2">
                    <button
                      onClick={() => {
                        navigate("/mi_perfil");
                        setSidebarOpen(false);
                      }}
                      className="flex items-center gap-4 w-full text-left text-white px-4 py-3 rounded-lg hover:bg-white/10"
                    >
                      <UserRound size={20} className="text-white" />
                      <span className="text-white font-medium truncate">{usuario.nombre}</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setSidebarOpen(false);
                      }}
                      className="flex items-center gap-4 w-full text-left text-white px-4 py-3 rounded-lg hover:bg-white/10"
                    >
                      <DoorClosed size={20} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};
