import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { OBTENER_HISTORIAL_ACCESOS } from "../../api/registro";
import { Globe, CalendarClock, MonitorSmartphone, User } from "lucide-react";

const HistorialAccesos = () => {
	const { usuario } = useAuth();
	const [accesos, setAccesos] = useState([]);

	useEffect(() => {
		if (!usuario?.id) return;

		axios.get(`${OBTENER_HISTORIAL_ACCESOS}?usuario_id=${usuario.id}`)
			.then(res => {
				setAccesos(res.data.accesos || []);
			})
			.catch(err => {
				console.error("Error cargando accesos:", err);
			});
	}, [usuario]);

	return (
		<div className="w-full max-w-4xl mx-auto p-4 grid gap-4">
			<h2 className="text-2xl font-bold text-custom-marron-1 mb-2 text-center">Historial de accesos</h2>
			{accesos.length === 0 ? (
				<p className="text-gray-500 text-center">No hay accesos registrados.</p>
			) : (
				accesos.map((acceso) => (
					<div
						key={acceso.id}
						className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition duration-300 flex flex-col sm:flex-row items-start gap-4"
					>
						<div className="flex items-center gap-3">
							<User className="text-custom-marron-1" size={28} />
							<div>
								<p className="font-semibold text-lg">{acceso.nombre}</p>
								<p className="text-gray-500 text-sm">{acceso.correo}</p>
							</div>
						</div>

						<div className="grid sm:grid-cols-3 gap-3 w-full sm:ml-auto text-sm mt-3 sm:mt-0">
							<div className="flex items-center gap-2 text-gray-700">
								<Globe size={18} />
								<span title={acceso.ip} className="truncate max-w-[160px]">{acceso.ip}</span>
							</div>
							<div className="flex items-center gap-2 text-gray-700">
								<MonitorSmartphone size={18} />
								<span title={acceso.navegador} className="truncate max-w-[160px]">{acceso.navegador}</span>
							</div>
							<div className="flex items-center gap-2 text-gray-700">
								<CalendarClock size={18} />
								<span>{new Date(acceso.fecha).toLocaleString()}</span>
							</div>
						</div>

					</div>
				))
			)}
		</div>
	);
};

export default HistorialAccesos;
