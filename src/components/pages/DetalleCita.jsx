import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { DETALLE_CITA } from "../../api/registro";
import { motion } from "framer-motion";

export default function DetalleCita() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [cita, setCita] = useState(null);
	const [loading, setLoading] = useState(true);

	const primaryColor = '#61CE70';
	const secondaryColor = '#6EC1E4';
0

	useEffect(() => {
		axios.get(`${DETALLE_CITA}?id=${id}`)
			.then((res) => {
				if (res.data.success) {
					setCita(res.data.cita);
				}
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, [id]);
	const descargarFactura = () => {
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: [90, 150] // Altura aumentada para mejor distribución
		});

		// Paleta de colores moderna
		const colors = {
			primary: [97, 206, 112],     // Verde principal #61CE70
			secondary: [110, 193, 228],   // Azul secundario #6EC1E4
			accent: [255, 107, 107],      // Coral para destacar #FF6B6B
			dark: [45, 55, 72],           // Gris oscuro moderno #2D3748
			light: [113, 128, 150],       // Gris claro #718096
			background: [247, 250, 252],  // Fondo suave #F7FAFC
			white: [255, 255, 255]
		};

		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		const margin = 8;
		let currentY = 0;

		const fechaDescarga = new Date().toLocaleString("es-CO", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		});

		// === HEADER MODERNO CON GRADIENTE SIMULADO ===
		// Fondo principal
		doc.setFillColor(...colors.secondary);
		doc.rect(0, 0, pageWidth, 28, 'F');

		// Banda decorativa superior
		doc.setFillColor(...colors.primary);
		doc.rect(0, 0, pageWidth, 4, 'F');

		// Logo/Nombre de empresa con mejor tipografía
		doc.setFont("helvetica", "bold")
			.setFontSize(16)
			.setTextColor(...colors.white);

		const empresaLinea1 = "Psicológicamente";
		const empresaLinea2 = "Hablando";

		// Centrar texto del logo
		const textWidth1 = doc.getTextWidth(empresaLinea1);
		const textWidth2 = doc.getTextWidth(empresaLinea2);

		doc.text(empresaLinea1, (pageWidth - textWidth1) / 2, 12);
		doc.setFontSize(14);
		doc.text(empresaLinea2, (pageWidth - textWidth2) / 2, 20);

		// Línea decorativa bajo el logo
		doc.setLineWidth(0.5)
			.setDrawColor(...colors.white)
			.line(margin + 10, 24, pageWidth - margin - 10, 24);

		currentY = 35;

		// === TÍTULO DE FACTURA CON ESTILO ===
		doc.setTextColor(...colors.dark);
		doc.setFont("helvetica", "bold")
			.setFontSize(18);

		const tituloFactura = "FACTURA";
		const tituloWidth = doc.getTextWidth(tituloFactura);
		doc.text(tituloFactura, (pageWidth - tituloWidth) / 2, currentY);

		// Subtítulo
		doc.setFont("helvetica", "normal")
			.setFontSize(10)
			.setTextColor(...colors.light);

		const subtitulo = "Cita Psicológica";
		const subtituloWidth = doc.getTextWidth(subtitulo);
		doc.text(subtitulo, (pageWidth - subtituloWidth) / 2, currentY + 5);

		currentY += 15;

		// === INFORMACIÓN DE FECHA CON DISEÑO MODERNO ===
		// Caja para la fecha
		doc.setFillColor(250, 250, 250);
		doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 8, 1, 1, 'F');

		doc.setFont("helvetica", "normal")
			.setFontSize(8)
			.setTextColor(...colors.light);

		const fechaTexto = `Generado: ${fechaDescarga}`;
		const fechaWidth = doc.getTextWidth(fechaTexto);
		doc.text(fechaTexto, (pageWidth - fechaWidth) / 2, currentY + 5);

		currentY += 18;

		// === SECCIÓN DE DETALLES CON CARDS MODERNAS ===
		const detalles = [
			{ label: "Paciente", value: cita.paciente, icon: "👤" },
			{ label: "profesional", value: cita.psicologa, icon: "👩‍⚕️" },
			{ label: "Fecha", value: cita.fecha, icon: "📅" },
			{ label: "Hora", value: cita.hora, icon: "🕐" },
			{ label: "Estado", value: cita.estado, icon: "✅" }
		];

		// Card container
		doc.setFillColor(...colors.background);
		doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 45, 2, 2, 'F');

		// Border sutil
		doc.setDrawColor(...colors.light);
		doc.setLineWidth(0.2);
		doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 45, 2, 2, 'S');

		currentY += 5;

		detalles.forEach((item, index) => {
			const yPos = currentY + (index * 8);

			// Label con estilo
			doc.setFont("helvetica", "bold")
				.setFontSize(9)
				.setTextColor(...colors.dark);
			doc.text(item.label + ":", margin + 3, yPos);

			// Value
			doc.setFont("helvetica", "normal")
				.setTextColor(...colors.dark);
			doc.text(item.value, margin + 25, yPos);

			// Separador sutil (excepto el último)
			if (index < detalles.length - 1) {
				doc.setDrawColor(230, 230, 230);
				doc.setLineWidth(0.1);
				doc.line(margin + 3, yPos + 2, pageWidth - margin - 3, yPos + 2);
			}
		});

		currentY += 50;

		// === DESCRIPCIÓN CON ESTILO ===
		doc.setFont("helvetica", "bold")
			.setFontSize(10)
			.setTextColor(...colors.dark);
		doc.text("Descripción del Servicio:", margin, currentY);

		currentY += 6;

		// Caja de descripción
		doc.setFillColor(252, 252, 252);
		doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 12, 1, 1, 'F');

		doc.setFont("helvetica", "normal")
			.setFontSize(9)
			.setTextColor(...colors.light);
		doc.text("Sesión de consulta psicológica profesional", margin + 3, currentY + 7);

		currentY += 20;

		// === TOTAL CON DISEÑO DESTACADO ===
		// Caja para el total
		doc.setFillColor(...colors.primary);
		doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 20, 3, 3, 'F');

		// Texto del total
		doc.setFont("helvetica", "bold")
			.setFontSize(12)
			.setTextColor(...colors.white);
		doc.text("TOTAL A PAGAR", margin + 4, currentY + 8);

		// Precio destacado
		doc.setFontSize(16);
		const precioTexto = `$${cita.precio}`;
		const precioWidth = doc.getTextWidth(precioTexto);
		doc.text(precioTexto, pageWidth - margin - precioWidth - 4, currentY + 14);

		currentY += 30;

		// === FOOTER MODERNO ===
		const footerY = pageHeight - 25;

		// Línea decorativa
		doc.setDrawColor(...colors.light);
		doc.setLineWidth(0.3);
		doc.line(margin + 10, footerY, pageWidth - margin - 10, footerY);

		// Mensaje de agradecimiento
		doc.setFont("helvetica", "normal")
			.setFontSize(8)
			.setTextColor(...colors.light);

		const mensajeGracias = "¡Gracias por confiar en nosotros!";
		const mensajeWidth = doc.getTextWidth(mensajeGracias);
		doc.text(mensajeGracias, (pageWidth - mensajeWidth) / 2, footerY + 6);

		// Información de contacto
		const contacto = "PsicologicamenteHablando.com";
		const contactoWidth = doc.getTextWidth(contacto);
		doc.setFontSize(7);
		doc.text(contacto, (pageWidth - contactoWidth) / 2, footerY + 12);

		// Número de factura en la esquina
		doc.setFontSize(6)
			.setTextColor(...colors.light);
		doc.text(`#${id}`, pageWidth - margin - 8, pageHeight - 3);

		// === GUARDAR ARCHIVO ===
		const nombreArchivo = `Factura-${cita.paciente.replace(/\s+/g, '')}-${id}.pdf`;
		doc.save(nombreArchivo);
	};

	if (loading) return <p className="p-4 text-center">Cargando...</p>;
	if (!cita) return <p className="p-4 text-center">Cita no encontrada</p>;

	return (
		<div className={`max-w-md mx-auto p-8 mt-10 rounded-2xl shadow-lg bg-white border border-gray-100`}>
			<motion.button
				onClick={() => navigate(-1)}
				className="flex items-center text-gray-600 hover:text-gray-800 mb-6 cursor-pointer focus:outline-none"
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.98 }}
				transition={{ type: "spring", stiffness: 200, damping: 15 }}
			>
				<ArrowLeft className="w-5 h-5 mr-2" color={primaryColor} />
				<span className="text-sm font-medium text-gray-700">Volver</span>
			</motion.button>

			<div className="mb-8">
				<h2 className={`text-3xl font-bold text-center text-[#${secondaryColor.substring(1)}] mb-4`}>
					Factura de Cita
				</h2>
				<p className="text-sm text-center text-gray-500">Generada el {new Date().toLocaleDateString()}</p>
			</div>

			<div className="space-y-6 text-lg text-gray-800">
				<div className="flex justify-between items-center">
					<span className="font-semibold text-gray-700">Paciente:</span>
					<p className="text-right">{cita.paciente}</p>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-semibold text-gray-700">Profesional:</span>
					<p className="text-right">{cita.psicologa}</p>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-semibold text-gray-700">Fecha:</span>
					<p className="text-right">{cita.fecha}</p>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-semibold text-gray-700">Hora:</span>
					<p className="text-right">{cita.hora}</p>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-semibold text-gray-700">Estado:</span>
					<p className="text-right text-[#${primaryColor.substring(1)}] font-medium">{cita.estado}</p>
				</div>
				{cita.paciente_telefono && (
					<div className="flex justify-between items-center">
						<span className="font-semibold text-gray-700">Teléfono Paciente:</span>
						<p className="text-right">{cita.paciente_telefono}</p>
					</div>
				)}
				{cita.psicologa_telefono && (
					<div className="flex justify-between items-center">
						<span className="font-semibold text-gray-700">Teléfono Psicóloga:</span>
						<p className="text-right">{cita.psicologa_telefono}</p>
					</div>
				)}
			</div>

			<div className="mt-10 flex justify-end">
				<div className="text-right">
					<p className="text-sm text-gray-600">Total a pagar:</p>
					<p className={`text-4xl font-bold text-[#${primaryColor.substring(1)}]`}>${cita.precio}</p>
				</div>
			</div>

			<motion.button
				onClick={descargarFactura}
				className={`mt-10 w-full flex items-center justify-center gap-3 py-3 bg-[#${secondaryColor.substring(1)}] text-white font-semibold rounded-xl hover:bg-[#${secondaryColor.substring(1)}]/90 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#${secondaryColor.substring(1)}]/50`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				whileHover={{ scale: 1.03 }}
				whileTap={{ scale: 0.97 }}
				transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
			>
				<Download className="w-5 h-5" color="white" />
				Descargar PDF
			</motion.button>
		</div>
	);
}
