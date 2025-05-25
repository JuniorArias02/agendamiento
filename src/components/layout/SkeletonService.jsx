export default function SkeletonService() {
	return (
		<div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 animate-pulse">
			<div className="w-full h-2 rounded-t-2xl bg-gray-200 mb-4" />
			<div className="w-full h-40 bg-gray-200 rounded-xl mb-4" />
			<div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
			<div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
			<div className="h-4 bg-gray-200 rounded w-full mb-3" />
			<div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
		</div>
	);
}
