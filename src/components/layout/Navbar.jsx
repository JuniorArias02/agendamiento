import { Menu, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ usuario, setSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full px-4 sm:px-6 py-3 bg-gradient-to-b from-[#1A535C] to-[#4ECDC4] shadow-lg flex items-center justify-between fixed top-0 z-40 lg:hidden">
      <button
        className="text-white p-1 rounded-lg hover:bg-white/10"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={28} color="white" />
      </button>

      <div className="text-lg font-semibold text-white">PsicoHablando</div>

      {usuario ? (
        <button
          onClick={() => navigate("/mi_perfil")}
          className="p-1.5 rounded-full bg-white/20 hover:bg-white/30"
        >
          <UserRound size={20} className="text-white" />
        </button>
      ) : (
        <div className="w-8 h-8" />
      )}
    </nav>
  );
};

export default Navbar;
