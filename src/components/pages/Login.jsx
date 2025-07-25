import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { registrarUsuario, loginUsuario, recuperarContrasena } from "../../services/auth/auth_services";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import {
  Mail,
  LogIn,
  Send,
  User,
  IdCard,
  Phone,
  ChevronDown,
  Lock,
  UserPlus
} from "lucide-react";
import { RUTAS } from "../../routers/routers";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [telefonoPrefijo, setTelefonoPrefijo] = useState("");
  const [correoRecuperar, setCorreoRecuperar] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRecovering) return;

    if (isRegistering) {
      const telefonoCompleto = telefonoPrefijo + telefono.replace(/\s/g, '');

      try {
        const data = await registrarUsuario({
          nombre,
          documento,
          correo,
          contrasena,
          telefono: telefonoCompleto,
        });

        if (data.success) {
          login(data.usuario);
          navigate("/verificar_cuenta");
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          });
        }
      } catch (error) {
        console.error("Error en el registro:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error registrando el usuario.',
        });
      }
    } else {
      try {
        const data = await loginUsuario({ correo, contrasena });

        if (data.success) {
          login(data.usuario);
          navigate("/nueva_agenda");
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          });

          if (data.noVerificado) {
            navigate("/verificar_cuenta");
            return;
          }
        }
      } catch (error) {
        console.error("Error en el login:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al iniciar sesión.',
        });
      }
    }
  };

  const handleRecuperar = async () => {
    try {
      const data = await recuperarContrasena({ correo: correoRecuperar });

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Código enviado',
          text: "Se ha enviado un código a tu correo.",
        });
        navigate("/verificar_codigo");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || "No se pudo enviar el correo.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al enviar el código.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6EC1E4]/10 to-[#61CE70]/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#6EC1E4]/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#61CE70]/20 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20"
      >
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] p-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white"
          >
            {isRecovering
              ? "Recuperar contraseña"
              : isRegistering
                ? "Crear cuenta"
                : "Iniciar sesión"}
          </motion.h2>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRecovering ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-5"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-[#6EC1E4]" />
                  </div>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correoRecuperar}
                    onChange={(e) => setCorreoRecuperar(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
                    required
                  />
                </div>

                <motion.button
                  type="button"
                  onClick={handleRecuperar}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Enviar código</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-5"
              >
                {isRegistering && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-[#6EC1E4]" />
                      </div>
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IdCard className="w-5 h-5 text-[#6EC1E4]" />
                      </div>
                      <input
                        type="text"
                        placeholder="Documento"
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="w-5 h-5 text-[#6EC1E4]" />
                        </div>
                        <select
                          value={telefonoPrefijo}
                          onChange={(e) => setTelefonoPrefijo(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none appearance-none"
                          required
                        >
                          {/* América Latina */}
                          <option value="+54">+54 (AR) Argentina</option>
                          <option value="+591">+591 (BO) Bolivia</option>
                          <option value="+55">+55 (BR) Brasil</option>
                          <option value="+56">+56 (CL) Chile</option>
                          <option value="+57">+57 (CO) Colombia</option>
                          <option value="+506">+506 (CR) Costa Rica</option>
                          <option value="+53">+53 (CU) Cuba</option>
                          <option value="+593">+593 (EC) Ecuador</option>
                          <option value="+503">+503 (SV) El Salvador</option>
                          <option value="+502">+502 (GT) Guatemala</option>
                          <option value="+504">+504 (HN) Honduras</option>
                          <option value="+52">+52 (MX) México</option>
                          <option value="+505">+505 (NI) Nicaragua</option>
                          <option value="+507">+507 (PA) Panamá</option>
                          <option value="+595">+595 (PY) Paraguay</option>
                          <option value="+51">+51 (PE) Perú</option>
                          <option value="+598">+598 (UY) Uruguay</option>
                          <option value="+58">+58 (VE) Venezuela</option>

                          {/* Europa */}
                          <option value="+43">+43 (AT) Austria</option>
                          <option value="+32">+32 (BE) Bélgica</option>
                          <option value="+359">+359 (BG) Bulgaria</option>
                          <option value="+420">+420 (CZ) Chequia</option>
                          <option value="+45">+45 (DK) Dinamarca</option>
                          <option value="+34">+34 (ES) España</option>
                          <option value="+33">+33 (FR) Francia</option>
                          <option value="+49">+49 (DE) Alemania</option>
                          <option value="+30">+30 (GR) Grecia</option>
                          <option value="+39">+39 (IT) Italia</option>
                          <option value="+31">+31 (NL) Países Bajos</option>
                          <option value="+351">+351 (PT) Portugal</option>
                          <option value="+40">+40 (RO) Rumanía</option>
                          <option value="+46">+46 (SE) Suecia</option>
                          <option value="+44">+44 (UK) Reino Unido</option>

                          {/* Otros comunes */}
                          <option value="+1">+1 (US/CA) Estados Unidos / Canadá</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6EC1E4]" />
                      </div>
                      <div className="col-span-2 relative">
                        <input
                          type="text"
                          placeholder="Número de teléfono"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-[#6EC1E4]" />
                  </div>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-[#6EC1E4]" />
                  </div>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E5EC] focus:border-[#6EC1E4] focus:ring-2 focus:ring-[#6EC1E4]/30 bg-white/50 outline-none transition-all"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#6EC1E4] to-[#61CE70] text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isRegistering ? (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Registrarse</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Entrar</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </form>

          {!isRecovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center space-y-3"
            >
              {/* Botón para ver servicios */}
              <p className="text-sm text-[#5A6D8B]">
                <button
                  onClick={() => navigate(RUTAS.AGENDA.NUEVA)}
                  className="text-[#6EC1E4] font-medium hover:underline focus:outline-none"
                >
                  Ver Servicios
                </button>
              </p>

              {/* Alternar entre registro/login */}
              <p className="text-sm text-[#5A6D8B]">
                {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
                <button
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setIsRecovering(false);
                  }}
                  className="text-[#6EC1E4] font-medium hover:underline focus:outline-none"
                >
                  {isRegistering ? "Inicia sesión" : "Regístrate"}
                </button>
              </p>

              {/* Recuperar contraseña */}
              <p className="text-sm text-[#5A6D8B]">
                <button
                  onClick={() => {
                    setIsRecovering(true);
                    setIsRegistering(false);
                  }}
                  className="text-[#6EC1E4] font-medium hover:underline focus:outline-none"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>

  );
}
