const SkeletonCard = () => (
  <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md space-y-4">
    {/* Título */}
    <div className="skeleton h-5 w-1/2 rounded" />

    {/* Textos simulando campos */}
    <div className="space-y-2">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-4 w-3/5 rounded" />
    </div>

    {/* Estado Cita (etiqueta) */}
    <div className="skeleton h-6 w-32 rounded-full" />

    {/* Botones simulados */}
    <div className="space-y-2 pt-3">
      <div className="skeleton h-10 w-full rounded-full" />
      <div className="skeleton h-10 w-full rounded-full" />
      <div className="skeleton h-10 w-full rounded-full" />
    </div>
  </div>
);

export default SkeletonCard;
