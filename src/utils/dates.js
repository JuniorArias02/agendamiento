// utils/dates.js

// Convierte un valor de <input type="datetime-local"> (ej: "2025-09-07T15:00")
// a ISO UTC (ej: "2025-09-07T13:00:00.000Z") asegurando que se interprete como hora LOCAL del navegador.
export function datetimeLocalToUtcIso(localValue) {
	if (!localValue) return null; // guard
	const [datePart, timePart = "00:00"] = localValue.split('T');
	const [y, m, d] = datePart.split('-').map(Number);
	const [hh, mm] = timePart.split(':').map(Number);
	const dateLocal = new Date(y, m - 1, d, hh || 0, mm || 0, 0, 0); // crea Date en zona local
	return dateLocal.toISOString();
}

// Si ya tienes un Date object:
export function dateToUtcIso(dateObj) {
	return new Date(dateObj).toISOString();
}

// Formatea una fecha UTC recibida del servidor a la zona del usuario (string legible)
export function utcIsoToUserString(utcIso, locale = 'es-CO', opts) {
	const tz = getUserTZ();
	const options = Object.assign({
		year: 'numeric', month: '2-digit', day: '2-digit',
		hour: '2-digit', minute: '2-digit'
	}, opts || {});
	return new Date(utcIso).toLocaleString(locale, { timeZone: tz, ...options });
}


// export function toUtcIso(fecha, hora24) {
// 	// fecha viene como "2025-09-08" (ejemplo)
// 	// hora24 como "14:30"
// 	const [hh, mm] = hora24.split(":").map(Number);
// 	const dateLocal = new Date(`${fecha}T${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:00`);
// 	return dateLocal.toISOString(); // siempre en UTC
// }



// Convierte fecha local del user -> ISO UTC


// Detecta zona horaria del usuario
export function getUserTZ() {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Convierte un ISO UTC a Date local (a medianoche, para no correr días)
// utils/dates.js
export function utcIsoToUserDate(isoString) {
	const d = new Date(isoString);
	// Ojo: getUTC* en vez de get*
	return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}


// Convierte Date local a ISO UTC (para backend)
export function toUtcIso(date) {
	return new Date(Date.UTC(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	)).toISOString();
}

// Formatea fecha en local bonito (ej: 18/09/2025)
export function formatLocal(date) {
	return date.toLocaleDateString("es-CO", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	});
}
