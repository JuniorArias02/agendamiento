const SkeletonServicios = () => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-5 shadow-md flex flex-col space-y-4 h-[350px]">
      <div className="skeleton w-full h-36 bg-gray-200 rounded-lg" />
      <div className="skeleton h-6 w-3/4 bg-gray-200 rounded" />
      <div className="skeleton h-4 w-full bg-gray-200 rounded" />
      <div className="flex justify-between mt-auto">
        <div className="skeleton h-5 w-24 bg-gray-200 rounded" />
        <div className="skeleton h-5 w-28 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default SkeletonServicios;
