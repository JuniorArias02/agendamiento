import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { registrarUsuario, loginUsuario, recuperarContrasena } from "../../services/auth/auth_services";
import { RUTAS } from "../../routers/routers";

// Importamos los componentes de Lucide para los iconos
import {
  Brain,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  IdCard,
  Phone,
  ArrowLeft,
  Calendar
} from "lucide-react";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [telefonoPrefijo, setTelefonoPrefijo] = useState("+57");
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
          Swal.fire({ icon: 'error', title: 'Oops...', text: data.message });
        }
      } catch (error) {
        console.error("Error en el registro:", error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Hubo un error registrando el usuario.' });
      }
    } else {
      try {
        const data = await loginUsuario({ correo, contrasena });

        if (data.success) {
          login(data.usuario);
          navigate("/nueva_agenda");
        } else {
          Swal.fire({ icon: 'error', title: 'Oops...', text: data.message });
          if (data.noVerificado) {
            navigate("/verificar_cuenta");
            return;
          }
        }
      } catch (error) {
        console.error("Error en el login:", error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Hubo un error al iniciar sesión.' });
      }
    }
  };

  const handleRecuperar = async () => {
    try {
      const data = await recuperarContrasena({ correo: correoRecuperar });
      if (data.success) {
        Swal.fire({ icon: 'success', title: 'Código enviado', text: "Se ha enviado un código a tu correo." });
        navigate("/verificar_codigo");
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message || "No se pudo enviar el correo." });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al enviar el código.' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Contenido visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-700 via-teal-600 to-green-500 relative overflow-hidden">
        {/* Fondos con formas sutiles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>

        {/* Contenedor principal */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full px-12 text-white">

          {/* Logo y nombre */}
          <div className="absolute top-8 left-8 flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm overflow-hidden">
              <img
                src="/logo1.png"
                alt="Logo PsicologicamenteHablando"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-xl font-semibold">PsicologicamenteHablando</span>
          </div>
          {/* Foto de la doctora */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
              <img
                src="perfil.png"
                alt="Dra. Psicóloga"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Carrusel moderno */}
          <div className="w-full max-w-md mx-auto relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Bienestar Mental Integral</h2>
                <p className="text-white/90 mb-6">Te acompañamos en tu camino hacia el equilibrio emocional y mental.</p>
              </div>

              {/* Contenedor del carrusel */}
              <div className="relative h-40 overflow-hidden rounded-xl">
                <div className="absolute inset-0 flex flex-col space-y-4 carrusel-container">
                  {[
                    "✨ Atención personalizada y confidencial",
                    "💖 Enfocado en tu crecimiento personal",
                    "🌱 Herramientas para tu día a día",
                    "📅 Sesiones online y presenciales",
                    "🕊️ Espacio seguro de expresión",
                    "🌟 Profesionales certificados"
                  ].map((message, index) => (
                    <div
                      key={index}
                      className="carrusel-item bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm flex-shrink-0"
                    >
                      <div className="text-center font-medium">
                        {message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indicadores del carrusel */}
              <div className="flex justify-center space-x-2 mt-4">
                {[0, 1, 2, 3, 4, 5].map((dot) => (
                  <div key={dot} className="w-2 h-2 bg-white/30 rounded-full carrusel-dot"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Elemento decorativo */}
          <div className="absolute bottom-8 text-center text-sm text-white/70">
            <p>Tu bienestar mental es nuestra prioridad</p>
          </div>
        </div>
      </div>
      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-indigo-600 p-4 rounded-2xl">
              <Brain size={40} className="text-white" />
            </div>
          </div>
          {/* Formulario */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-7">
              <h2 className="text-2xl font-bold text-gray-800">
                {isRecovering ? 'Recuperar Acceso' : isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </h2>
              <p className="text-gray-500 mt-2">
                {isRecovering
                  ? 'Te enviaremos un código de recuperación'
                  : isRegistering
                    ? 'Completa tus datos para registrarte'
                    : 'Ingresa a tu cuenta para continuar'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRecovering ? (
                <div className="space-y-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="email"
                      value={correoRecuperar}
                      onChange={(e) => setCorreoRecuperar(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                      placeholder="Correo electrónico"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRecuperar}
                    className="w-full bg-emerald-600 text-white py-3.5 px-4 rounded-xl hover:bg-emerald-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Mail size={20} />
                    Enviar código de recuperación
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRecovering(false)}
                    className="w-full text-gray-600 py-3.5 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 border border-gray-200"
                  >
                    <ArrowLeft size={20} />
                    Volver al inicio
                  </button>
                </div>
              ) : isRegistering ? (
                <div className="space-y-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                      placeholder="Nombre completo"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IdCard className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      value={documento}
                      onChange={(e) => setDocumento(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                      placeholder="Número de documento"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1/4">
                      <select
                        value={telefonoPrefijo}
                        onChange={(e) => setTelefonoPrefijo(e.target.value)}
                        className="w-full px-3 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                      >
                        <option value="+57">+57</option>
                        <option value="+1">+1</option>
                        <option value="+52">+52</option>
                        <option value="+34">+34</option>
                      </select>
                    </div>
                    <div className="w-3/4 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                        placeholder="Número de teléfono"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                      placeholder="Correo electrónico"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-gray-400" size={20} />
                    </div>
                    <input
                      type={mostrarContrasena ? "text" : "password"}
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                      placeholder="Contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3.5 px-4 rounded-xl hover:bg-emerald-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    Crear cuenta
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                      placeholder="Correo electrónico"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-gray-400" size={20} />
                    </div>
                    <input
                      type={mostrarContrasena ? "text" : "password"}
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 focus:bg-white"
                      placeholder="Contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span className="text-sm text-gray-600">Recordarme</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setIsRecovering(true);
                        setIsRegistering(false);
                      }}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3.5 px-4 rounded-xl hover:bg-emerald-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    Iniciar sesión
                  </button>
                </div>
              )}
            </form>

            {/* Separador */}
            {!isRecovering && (
              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-4 text-sm text-gray-500">o</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            )}

            {/* Footer opciones */}
            {!isRecovering && (
              <div className="text-center space-y-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate(RUTAS.AGENDA.NUEVA)}
                  className="flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm w-full py-3 rounded-xl hover:bg-emerald-50/50 transition-colors"
                >
                  <Calendar size={18} />
                  Ver Servicios y Agendar Cita
                </button>

                <p className="text-sm text-gray-600">
                  {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
                  <button
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setIsRecovering(false);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {isRegistering ? "Inicia sesión" : "Regístrate"}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}