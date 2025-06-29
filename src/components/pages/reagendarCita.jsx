import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Save, Plus, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
	guardarHorasDisponibles,
	obtenerHorasOcupadas,
	reagendarCita,
	obtenerHorasDisponibles
} from "../../services/citas/citas";
import { useLocation, useNavigate } from "react-router-dom";

export default function ReagendarCita() {
	const { state } = useLocation();
	const navigate = useNavigate();
	const cita = state?.cita;

	const { usuario } = useAuth();
	const psicologaId = usuario?.id;

	const [selectedDate, setSelectedDate] = useState(null);
	const [hora, setHora] = useState("");
	const [mensaje, setMensaje] = useState("");
	const [loading, setLoading] = useState(false);
	const [horasOcupadas, setHorasOcupadas] = useState([]);
	const [showAddHour, setShowAddHour] = useState(false);
	const [newHour, setNewHour] = useState("");
	const [horasDisponibles, setHorasDisponibles] = useState([]);


	// Efecto de sonido para interacciones
	const playClickSound = () => {
		if (typeof window !== 'undefined') {
			const audio = new Audio('/sounds/soft-click.mp3');
			audio.volume = 0.3;
			audio.play().catch(e => console.log("Audio error:", e));
		}
	};

	const generateCalendarDays = () => {
		const days = [];
		const today = new Date();
		const currentMonth = today.getMonth();
		const currentYear = today.getFullYear();

		// Días del mes actual
		const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

		// Días vacíos para alinear el calendario
		for (let i = 0; i < firstDayOfMonth; i++) {
			days.push(null);
		}

		// Agrega todos los días del mes actual
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(new Date(currentYear, currentMonth, i));
		}

		// Agrega 15 días del próximo mes
		for (let i = 1; i <= 15; i++) {
			days.push(new Date(currentYear, currentMonth + 1, i));
		}

		return days;
	};

	const calendarDays = generateCalendarDays();

	useEffect(() => {
		if (selectedDate && psicologaId) {
			const fecha = formatDate(selectedDate);

			const cargarHoras = async () => {
				try {
					const data = await obtenerHorasDisponibles(fecha, psicologaId);
					let horas = data.horas_disponibles?.map(h => h.slice(0, 5)) || [];

					// 🔎 Si la fecha seleccionada es hoy, filtra las horas pasadas
					if (esHoy(selectedDate)) {
						const ahora = new Date();
						const horaActual = ahora.getHours();
						const minutosActuales = ahora.getMinutes();

						horas = horas.filter(h => {
							const [hH, hM] = h.split(":").map(Number);
							if (hH > horaActual) return true;
							if (hH === horaActual && hM > minutosActuales) return true;
							return false;
						});
					}

					setHorasDisponibles(horas);
				} catch (err) {
					console.error("❌ No se pudieron cargar las horas disponibles");
				}
			};

			cargarHoras();
		}
	}, [selectedDate, psicologaId]);



	const esHoy = (fecha) => {
		const hoy = new Date();
		const fechaFormateada = fecha.toISOString().split('T')[0];
		const hoyFormateado = hoy.toISOString().split('T')[0];
		return fechaFormateada === hoyFormateado;
	};


	const formatDate = (date) => {
		return date.toISOString().split('T')[0];
	};

	const formatDay = (date) => {
		return date.getDate();
	};

	const formatWeekday = (date) => {
		return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()];
	};

	const isToday = (date) => {
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	const isSelected = (date) => {
		return selectedDate && formatDate(selectedDate) === formatDate(date);
	};

	const isWeekend = (date) => {
		return date.getDay() === 0 || date.getDay() === 6;
	};

	const isPastDate = (date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date < today && !isToday(date);
	};

	const handleAddHour = () => {
		if (newHour && !horasDisponibles.includes(newHour)) {
			playClickSound();
			const horaFormateada = newHour.slice(0, 5);
			setHorasDisponibles([...horasDisponibles, horaFormateada].sort());
			setNewHour("");
			setShowAddHour(false);
		}
	};

	const handleRemoveHour = (hourToRemove) => {
		playClickSound();
		setHorasDisponibles(horasDisponibles.filter(h => h !== hourToRemove));
		if (hora === hourToRemove) {
			setHora("");
		}
	};

	const handleReagendar = async () => {
		if (!selectedDate || !hora) {
			setMensaje("Selecciona fecha y hora");
			return;
		}

		setLoading(true);
		setMensaje("");

		try {
			if (horasOcupadas.includes(hora)) {
				setMensaje("❌ Esta hora ya está ocupada");
				setLoading(false);
				return;
			}

			const fecha = formatDate(selectedDate);
			const res = await guardarHorasDisponibles({
				psicologa_id: psicologaId,
				fecha,
				horas: [`${hora}:00`],
			});

			const disponibilidadId = res.id ?? res.inserted_id ?? res.disponibilidad_id;

			await reagendarCita({
				cita_id: cita.id,
				servicio_id: cita.servicio_id,
				fecha,
				hora: `${hora}:00`,
				disponibilidad_id: disponibilidadId,
			});

			setMensaje("✅ Reagendada con éxito");
			setTimeout(() => navigate("/dashboard"), 1500);
		} catch (err) {
			console.error("Error al reagendar:", err);
			setMensaje("❌ Error al reagendar");
		}

		setLoading(false);
	};

	return (
		<div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-xl max-w-4xl mx-auto mt-8">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
					<CalendarDays className="text-[#64CBA0] w-8 h-8" />
					<span className="bg-gradient-to-r from-[#64CBA0] to-[#6BC3D7] bg-clip-text text-transparent">
						Reagendar Cita
					</span>
				</h2>
				<div className="text-sm text-gray-500">
					ID: {cita?.id}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Calendario Moderno */}
				<div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
					<h3 className="font-medium text-gray-700 mb-4 text-lg">Selecciona una fecha</h3>
					<div className="grid grid-cols-7 gap-1 mb-2">
						{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
							<div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
								{day}
							</div>
						))}
					</div>
					<div className="grid grid-cols-7 gap-1">
						{calendarDays.map((date, index) => (
							<div key={index} className="aspect-square">
								{date ? (
									<button
										onClick={() => {
											playClickSound();
											setSelectedDate(date);
											setHora("");
										}}
										className={`w-full h-full rounded-lg flex flex-col items-center justify-center transition-all duration-200
                  ${isToday(date) ? 'border-2 border-[#64CBA0]' : ''}
                  ${isSelected(date) ? 'bg-gradient-to-br from-[#64CBA0] to-[#6BC3D7] text-white font-bold scale-95' : ''}
                  ${isWeekend(date) ? 'text-gray-400' : 'text-gray-700'}
                  ${isPastDate(date) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#64CBA0]/10 hover:scale-105'}
                  ${isSelected(date) && isWeekend(date) ? 'bg-[#64CBA0]/90' : ''}
                `}
										disabled={isPastDate(date)}
										aria-label={`Día ${formatDay(date)}`}
									>
										<span className="text-sm">{formatDay(date)}</span>
										{isToday(date) && !isSelected(date) && (
											<span className="w-1 h-1 rounded-full bg-[#64CBA0] mt-1"></span>
										)}
									</button>
								) : (
									<div className="w-full h-full" />
								)}
							</div>
						))}
					</div>
				</div>

				{/* Selector de Horas Moderno */}
				<div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
					<div className="flex justify-between items-center mb-4">
						<h3 className="font-medium text-gray-700 text-lg">Horario disponible</h3>
						<button
							onClick={() => {
								playClickSound();
								setShowAddHour(!showAddHour);
							}}
							className="text-[#64CBA0] hover:text-[#4da789] flex items-center gap-1 text-sm bg-[#64CBA0]/10 px-3 py-1.5 rounded-lg transition-all hover:bg-[#64CBA0]/20"
						>
							<Plus size={16} />
							Nueva hora
						</button>
					</div>

					{showAddHour && (
						<div className="flex gap-2 mb-4 animate-fadeIn">
							<input
								type="time"
								className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-[#64CBA0] focus:border-transparent"
								value={newHour}
								onChange={(e) => setNewHour(e.target.value)}
								autoFocus
							/>
							<button
								onClick={handleAddHour}
								className="bg-gradient-to-br from-[#64CBA0] to-[#6BC3D7] text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
								aria-label="Guardar hora"
							>
								<Save size={16} />
							</button>
							<button
								onClick={() => {
									playClickSound();
									setShowAddHour(false);
								}}
								className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors"
								aria-label="Cancelar"
							>
								<X size={16} />
							</button>
						</div>
					)}

					<div className="grid grid-cols-2 gap-3">
						{horasDisponibles.length > 0 ? (
							horasDisponibles.map((h) => {
								const isOccupied = horasOcupadas.includes(h);
								const isSelectedHour = hora === h;

								return (
									<button
										key={h}
										onClick={() => {
											if (!isOccupied) {
												playClickSound();
												setHora(h);
											}
										}}
										disabled={isOccupied}
										className={`py-3 px-4 rounded-xl text-sm flex items-center justify-between transition-all duration-200
                  ${isSelectedHour ? "bg-gradient-to-br from-[#64CBA0] to-[#6BC3D7] text-white shadow-md" : ""}
                  ${isOccupied
												? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
												: "bg-white hover:bg-[#64CBA0]/10 text-gray-700 hover:shadow-sm border border-gray-200"
											}
                  ${isSelectedHour ? "scale-95" : "hover:scale-[1.02]"}
                `}
										aria-label={`Hora ${h} ${isOccupied ? 'ocupada' : 'disponible'}`}
									>
										<span className="font-medium">{h}</span>
										{!isOccupied && !isSelectedHour && (
											<span
												onClick={(e) => {
													e.stopPropagation();
													handleRemoveHour(h);
												}}
												className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
												aria-label="Eliminar hora"
											>
												<X size={14} />
											</span>
										)}
										{isOccupied && (
											<span className="text-xs text-red-400">Ocupada</span>
										)}
									</button>
								);
							})
						) : (
							<div className="col-span-2 text-center text-gray-500 py-4">
								No hay horas disponibles. Agrega nuevas horas.
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Resumen de Cita */}
			{selectedDate && hora && (
				<div className="bg-gradient-to-r from-[#64CBA0]/10 to-[#6BC3D7]/10 p-5 rounded-xl border border-[#64CBA0]/20 animate-fadeIn">
					<h3 className="font-medium text-gray-700 mb-3 text-lg">Resumen de la cita</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-3">
							{/* Tarjeta de información */}
							<div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
								<h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
									<svg className="w-5 h-5 text-[#6BC3D7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
									</svg>
									Detalles de la Cita
								</h4>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Columna izquierda */}
									<div className="space-y-3">
										<div className="flex items-start">
											<span className="inline-block bg-[#6BC3D7]/20 text-[#6BC3D7] p-1 rounded mr-2">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
												</svg>
											</span>
											<div>
												<p className="text-xs font-medium text-gray-500">Servicio</p>
												<p className="text-sm font-medium text-gray-700">{cita?.servicio || 'No especificado'}</p>
											</div>
										</div>

										<div className="flex items-start">
											<span className="inline-block bg-[#64CBA0]/20 text-[#64CBA0] p-1 rounded mr-2">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
												</svg>
											</span>
											<div>
												<p className="text-xs font-medium text-gray-500">Paciente</p>
												<p className="text-sm font-medium text-gray-700">{cita?.paciente || 'No especificado'}</p>
											</div>
										</div>
									</div>

									{/* Columna derecha */}
									<div className="space-y-3">
										<div className="flex items-start">
											<span className="inline-block bg-[#9F7AEA]/20 text-[#9F7AEA] p-1 rounded mr-2">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
											</span>
											<div>
												<p className="text-xs font-medium text-gray-500">Estado</p>
												<p className={`text-sm font-medium ${cita?.estado_cita === 'Confirmada'
													? 'text-green-600'
													: cita?.estado_cita === 'Cancelada'
														? 'text-red-600'
														: 'text-yellow-600'
													}`}>
													{cita?.estado_cita || 'Pendiente'}
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center text-[#64CBA0]">
								<CalendarDays className="mr-2 w-5 h-5" />
								<span className="font-medium">
									{selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
								</span>
							</div>
							<div className="flex items-center text-[#6BC3D7]">
								<Clock3 className="mr-2 w-5 h-5" />
								<span className="font-medium">{hora}</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Mensajes y Confirmación */}
			<div className="flex flex-col items-center">
				{mensaje && (
					<p className={`mb-4 text-center text-sm font-medium px-4 py-2 rounded-lg ${mensaje.includes("✅")
						? "bg-green-100 text-green-700 animate-bounceIn"
						: "bg-red-100 text-red-700 animate-shake"
						}`}>
						{mensaje}
					</p>
				)}

				<button
					onClick={handleReagendar}
					disabled={loading || !selectedDate || !hora}
					className={`mt-2 py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-semibold w-full max-w-md transition-all duration-300
        ${loading || !selectedDate || !hora
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: "bg-gradient-to-r from-[#64CBA0] to-[#6BC3D7] text-white hover:opacity-90 hover:shadow-lg"
						}
        ${(!loading && selectedDate && hora) ? "hover:scale-[1.02]" : ""}
      `}
					aria-label="Confirmar reagendamiento"
				>
					{loading ? (
						<>
							<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Procesando...
						</>
					) : (
						<>
							<Save className="w-5 h-5" />
							Confirmar Reagendamiento
						</>
					)}
				</button>
			</div>
		</div>
	);
}

// Agregar estas animaciones en tu CSS global o con styled-components
