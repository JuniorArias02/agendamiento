const SkeletonAccesos = () => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col sm:flex-row items-start gap-4 animate-pulse">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="bg-gray-300 rounded-full w-10 h-10" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded" />
          <div className="h-3 w-40 bg-gray-300 rounded" />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 w-full mt-3 sm:mt-0">
        <div className="h-4 w-32 bg-gray-300 rounded" />
        <div className="h-4 w-32 bg-gray-300 rounded" />
        <div className="h-4 w-36 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default SkeletonAccesos;
