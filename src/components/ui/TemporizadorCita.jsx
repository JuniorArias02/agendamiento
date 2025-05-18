import React, { useEffect, useState } from "react";

const TemporizadorCita = ({ citaId }) => {
  const [tiempoRestante, setTiempoRestante] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`temporizador_${citaId}`));
    if (!data) return;

    const interval = setInterval(() => {
      const ahora = Date.now();
      const diferencia = data.fin - ahora;

      if (diferencia <= 0) {
        clearInterval(interval);
        setTiempoRestante("Finalizada");
      } else {
        const minutos = Math.floor(diferencia / 60000);
        const segundos = Math.floor((diferencia % 60000) / 1000);
        setTiempoRestante(`${minutos}m ${segundos}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [citaId]);

  if (!tiempoRestante) return null;

  return (
    <p className="text-sm text-red-600 font-bold mt-2">
      Tiempo restante: {tiempoRestante}
    </p>
  );
};

export default TemporizadorCita;
