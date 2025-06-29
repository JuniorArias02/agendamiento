import { useState } from "react";
import { generarCodigoDescuento } from "../../services/descuento/descuento";
import { Copy, Check, PercentCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function VistaDescuentos() {
  const [porcentaje, setPorcentaje] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerar = async () => {
    if (!porcentaje || isNaN(porcentaje) || porcentaje < 1 || porcentaje > 100) {
      setMensaje("❌ Ingresa un porcentaje válido (1-100)");
      return;
    }

    setIsGenerating(true);
    setMensaje("Generando código...");

    try {
      const res = await generarCodigoDescuento({ porcentaje: parseInt(porcentaje) });
      setCodigoGenerado(res.codigo);
      setMensaje("¡Código generado con éxito!");
      setCopiado(false);
    } catch (error) {
      setMensaje(" Error al generar el código");
    } finally {
      setIsGenerating(false);
    }
  };

  const copiarAlPortapapeles = async () => {
    try {
      await navigator.clipboard.writeText(codigoGenerado);
      setCopiado(true);
      setMensaje("📋 ¡Código copiado!");
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      setMensaje("❌ No se pudo copiar");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl p-8 rounded-2xl space-y-6 mt-10 border border-white/30 backdrop-blur-sm bg-white/90">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-[#64CBA0] to-[#6BC3D7] p-4 rounded-xl -m-4 mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <PercentCircle className="w-7 h-7 text-white/90" />
          <span>Generador de Descuentos</span>
        </h2>
        <p className="text-white/90 mt-1 text-sm">Crea códigos promocionales para tus clientes</p>
      </div>

      {/* Input y botón */}
      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6BC3D7]">
              %
            </div>
            <input
              type="number"
              min="1"
              max="100"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#64CBA0] focus:border-transparent shadow-sm"
              placeholder="Ej: 15"
              value={porcentaje}
              onChange={(e) => setPorcentaje(e.target.value)}
            />
          </div>
          
          <motion.button
            onClick={handleGenerar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isGenerating}
            className={`px-5 py-3 rounded-xl font-medium text-white shadow-md flex items-center gap-2
              ${isGenerating 
                ? 'bg-[#64CBA0]/70' 
                : 'bg-gradient-to-r from-[#64CBA0] to-[#6BC3D7] hover:shadow-lg'
              }`}
          >
            {isGenerating ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            Generar
          </motion.button>
        </div>

        {/* Mensaje de estado */}
        {mensaje && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm px-3 py-2 rounded-lg ${mensaje.includes("❌") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {mensaje}
          </motion.p>
        )}

        {/* Código generado */}
        {codigoGenerado && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-2"
          >
            <p className="text-sm text-gray-600">Código de descuento:</p>
            <div className="flex justify-between items-center bg-gradient-to-r from-[#64CBA0]/10 to-[#6BC3D7]/10 p-4 rounded-xl border border-[#64CBA0]/20">
              <span className="font-mono text-lg font-bold text-[#64CBA0]">{codigoGenerado}</span>
              <motion.button
                onClick={copiarAlPortapapeles}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-[#64CBA0]/10 transition-colors"
                title={copiado ? "Copiado!" : "Copiar código"}
              >
                {copiado ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-[#6BC3D7]" />
                )}
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Descuento del {porcentaje}% aplicable en el checkout
            </p>
          </motion.div>
        )}
      </div>

      {/* Detalle decorativo */}
      <div className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span>Los códigos expiran después de 1 días</span>
        <Sparkles className="w-4 h-4" />
      </div>
    </div>
  );
}