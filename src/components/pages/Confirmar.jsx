import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { iniciarPago } from "../../services/pagos/pago";
import { guardarCitaPendientes, guardarCita } from "../../services/citas/citas";
import { validarCodigoDescuento } from "../../services/descuento/descuento";
import axios from "axios";
import { CalendarCheck, Clock, ClipboardList, Tag, AlertCircle, Loader2, ArrowLeftCircle, CheckCircle } from "lucide-react";
import { VERIFICAR_PAGO_WOMPI } from "../../api/controllers/pagos/pagos";
import { toUtcIso } from "../../utils/dates"; // 👈 asegurarnos de usar esta función

export default function ConfirmarAgenda() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = location.state?.selectedDate; // Date en local
  const selectedTime = location.state?.selectedTime; // "HH:MM AM/PM"
  const servicio = location.state?.servicio;
  const [codigo, setCodigo] = useState("");
  const [codigoValido, setCodigoValido] = useState(null);
  const [precioFinal, setPrecioFinal] = useState(servicio.precio);
  const [codigoUsado, setCodigoUsado] = useState(null);
  const [porcentajeUsado, setPorcentajeUsado] = useState(null);
  const { usuario } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Combina fecha (Date) + hora (puede ser ISO o "hh:mm AM/PM")
  const combineDateTime = (dateOnly, time) => {
    if (!dateOnly || !time) return null;

    const base = new Date(dateOnly);

    // ⏰ Caso 1: viene como ISO completo
    if (time.includes("T")) {
      const hora = new Date(time);
      if (isNaN(hora)) return null;
      base.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
      return base;
    }

    // ⏰ Caso 2: viene como "10:30 AM"
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    base.setHours(hours, minutes, 0, 0);
    return base;
  };


  useEffect(() => {
    if (!selectedDate || !selectedTime) navigate("/agenda");
  }, [selectedDate, selectedTime, navigate]);

  useEffect(() => {
    // Convertir USD a COP
    const convertirUSDaCOP = async () => {
      if (servicio?.precio) {
        try {
          const res = await fetch("https://api.frankfurter.dev/v1/latest?base=USD&symbols=COP");
          const data = await res.json();
          const tasa = data?.rates?.COP;
          if (tasa) setPrecioFinal(servicio.precio * tasa);
          else setPrecioFinal(servicio.precio * 4000);
        } catch {
          console.error("Error al obtener tasa de cambio");
          setPrecioFinal(servicio.precio * 4000);
        }
      }
    };
    convertirUSDaCOP();
  }, [servicio?.precio]);


  const formatFechaHoraVista = (date, timeStr) => {
    const combined = combineDateTime(date, timeStr);
    if (!combined) return "No seleccionaste fecha";

    const tz = localStorage.getItem("user_tz") || "UTC";

    return combined.toLocaleString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: tz,
    });
  };


  const combinedToUtc = (selectedDate, selectedTime) => {
    if (!selectedDate || !selectedTime) return null;

    const [time, modifier] = selectedTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    // 🔹 Crear Date local combinando fecha + hora
    const combined = new Date(selectedDate);
    combined.setHours(hours, minutes, 0, 0);

    // 🔹 Pasar a UTC sin pasar por ISO de nuevo
    const year = combined.getUTCFullYear();
    const month = String(combined.getUTCMonth() + 1).padStart(2, "0");
    const day = String(combined.getUTCDate()).padStart(2, "0");
    const hour = String(combined.getUTCHours()).padStart(2, "0");
    const minute = String(combined.getUTCMinutes()).padStart(2, "0");
    const second = String(combined.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`; // formato MySQL
  };

  const toMySqlUtc = (date, timeStr) => {
    const combined = combineDateTime(date, timeStr);
    if (!combined) return null;

    return `${combined.getUTCFullYear()}-${String(combined.getUTCMonth() + 1).padStart(2, "0")}-${String(combined.getUTCDate()).padStart(2, "0")} ${String(combined.getUTCHours()).padStart(2, "0")}:${String(combined.getUTCMinutes()).padStart(2, "0")}:${String(combined.getUTCSeconds()).padStart(2, "0")}`;
  };


  const handleConfirmar = async () => {
    if (!selectedDate || !selectedTime) return;
    setLoading(true);
    setError(null);

    try {
      if (!usuario || !usuario.id) throw new Error("Usuario no autenticado.");

      // 🔹 Combinar fecha y hora en un Date local
      const [time, modifier] = selectedTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const fechaHoraUTC = toMySqlUtc(selectedDate, selectedTime);
      if (!fechaHoraUTC) throw new Error("Fecha/hora inválida");

      // 🔹 Convertir a ISO UTC
      // const fechaHoraUtc = toUtcIso(combined);
      // 1️⃣ Guardar cita pendiente con UTC
      const resCita = await guardarCitaPendientes({
        usuario_id: usuario.id,
        servicio_id: servicio.id,
        fecha_hora_utc: fechaHoraUTC,
        codigo_descuento: codigoUsado,
        porcentaje_descuento: porcentajeUsado,
      });

      if (resCita.status !== "ok") throw new Error(resCita.message || "Error al guardar la cita pendiente");

      const reference = resCita.reference;

      // 2️⃣ Iniciar pago
      const redirectUrl = `${window.location.origin}/agenda/resultado`;
      const response = await iniciarPago({
        monto: Math.round(precioFinal),
        titulo: servicio.titulo,
        servicio_id: servicio.id,
        reference,
        redirect_url: redirectUrl,
      });

      if (response.data.status !== "ok") throw new Error(response.data.message || "Error al iniciar pago con Wompi");

      const { amount_in_cents, currency, integrity_signature } = response.data;

      // 3️⃣ Widget Wompi
      const checkout = new WidgetCheckout({
        currency,
        amountInCents: amount_in_cents,
        reference,
        publicKey: "pub_test_k5hdWX1ahXc06Pyhu0VEZXOYQIBXGdcg",
        redirectUrl,
        signature: { integrity: integrity_signature },
      });

      checkout.open(async (result) => {
        try {
          const transactionId = result?.transaction?.id;
          if (!transactionId) throw new Error("No se recibió transactionId de Wompi");

          const res = await axios.post(
            VERIFICAR_PAGO_WOMPI,
            { transactionId },
            { headers: { "Content-Type": "application/json" } }
          );

          if (res.data?.success) {
            await guardarCita({ reference, transactionId });
            navigate("/agenda/confirmado", { state: { reference } });
          } else {
            navigate("/agenda/cancelado");
          }
        } catch (err) {
          console.error("Error al verificar pago:", err);
          navigate("/agenda/cancelado");
        }
      });
    } catch (err) {
      console.error("Error en handleConfirmar:", err);
      setError(err.response?.data?.message || err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const aplicarDescuento = async () => {
    try {
      const res = await validarCodigoDescuento({ codigo });
      if (res.status === "ok") {
        const descuento = (servicio.precio * res.porcentaje) / 100;
        const nuevoPrecio = servicio.precio - descuento;
        setPrecioFinal(nuevoPrecio);
        setCodigoValido(true);
        setCodigoUsado(res.codigo);
        setPorcentajeUsado(res.porcentaje);
      } else {
        setCodigoValido(false);
        setPrecioFinal(servicio.precio);
      }
    } catch {
      setCodigoValido(false);
      setPrecioFinal(servicio.precio);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full flex flex-col items-center p-5"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-white/30">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-[#64CBA0] to-[#6BC3D7] p-6 text-center">
          <div className="flex flex-col items-center">
            <CalendarCheck className="w-12 h-12 text-white mb-3" />
            <h2 className="text-3xl font-bold text-white">Confirmar Cita</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Detalles de la cita */}
          <div className="bg-gradient-to-r from-[#64CBA0]/10 to-[#6BC3D7]/10 rounded-xl p-5 border border-[#64CBA0]/20">
            <p className="text-lg text-gray-700 text-center flex items-center justify-center">
              <Clock className="mr-2 text-[#64CBA0]" size={20} />
              <span>
                Cita programada para el{" "}
                <span className="font-bold text-[#64CBA0]">
                  {formatFechaHoraVista(selectedDate, selectedTime)}
                </span>
              </span>
            </p>
          </div>


          {/* Detalles del servicio */}
          <div className="space-y-4">
            {servicio && servicio.titulo && (
              <div className="flex items-start">
                <ClipboardList className="text-[#6BC3D7] mr-3 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Servicio</p>
                  <p className="text-lg font-medium text-gray-800">{servicio.titulo}</p>
                </div>
              </div>
            )}

            {servicio.precio && (
              <div className="flex items-start">
                <Tag className="text-[#6BC3D7] mr-3 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Precio</p>
                  <p className="text-lg font-medium text-gray-800">
                    {Number(precioFinal).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Código de descuento */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Código de descuento</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64CBA0] focus:border-transparent"
                placeholder="INGRESA TU CÓDIGO"
              />
              <motion.button
                onClick={aplicarDescuento}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 bg-[#64CBA0] text-white rounded-xl font-medium hover:bg-[#5ab790] transition-colors"
              >
                Aplicar
              </motion.button>
            </div>

            {codigoValido === true && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-green-600 flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" /> Código aplicado correctamente
              </motion.p>
            )}
            {codigoValido === false && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Código inválido o expirado
              </motion.p>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start p-3 bg-red-50 rounded-lg border border-red-100"
            >
              <AlertCircle className="text-red-500 mr-2 mt-0.5" size={18} />
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-between gap-4 pt-4">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeftCircle size={20} /> Regresar
            </motion.button>

            <motion.button
              onClick={handleConfirmar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2
            ${loading ? 'bg-[#64CBA0]/70' : 'bg-gradient-to-r from-[#64CBA0] to-[#6BC3D7] hover:shadow-md'}
          `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Procesando...
                </>
              ) : (
                <>
                  <CheckCircle size={20} /> Confirmar
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
