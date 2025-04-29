import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { DETALLE_CITA } from "../../api/registro";

export default function DetalleCita() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [cita, setCita] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios.get(`${DETALLE_CITA}?id=${id}`)
			.then((res) => {
				if (res.data.success) {
					setCita(res.data.cita);
				} else {
					console.error("Cita no encontrada");
				}
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error al obtener la cita", err);
				setLoading(false);
			}); 
	}, [id]);

	const descargarFactura = () => {
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: [90, 120],
		});

		const titulo = "Factura de Cita";
		const pageWidth = doc.internal.pageSize.getWidth();
		const textWidth = doc.getTextWidth(titulo);
		const centerX = (pageWidth - textWidth) / 2;
		

		const fechaDescarga = new Date().toLocaleString("es-CO", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});

		// Encabezado
		doc.setFont("helvetica");
		doc.setFontSize(16);
		doc.setTextColor(40, 40, 40);
		doc.text("PsicologicamenteHablando", 10, 15);
		doc.setFontSize(12);
		doc.text("soportewebhablando@gmail.com", 10, 21);

		// Línea
		doc.setLineWidth(0.5);
		doc.line(5, 25, 75, 25);

		// Cuerpo
		doc.setFontSize(10);
		doc.setTextColor(50);
		doc.text(titulo, centerX, 32);
		doc.text(`Paciente: ${cita.paciente}`, 10, 40);
		doc.text(`Psicóloga: ${cita.psicologa}`, 10, 47);
		doc.text(`Fecha: ${cita.fecha}`, 10, 54);
		doc.text(`Hora: ${cita.hora}`, 10, 61);
		doc.text(`Estado: ${cita.estado}`, 10, 68);
		doc.text(`Descripción: Sesión psicológica`, 10, 75);

		// Precio grande
		doc.setFontSize(14);
		doc.setTextColor(0, 128, 0);
		doc.text(`Total: $${cita.precio}`, 10, 90);

		// Fecha de descarga
		doc.setFontSize(8);
		doc.setTextColor(100);
		doc.text(`Generado: ${fechaDescarga}`, 10, 100);

		// Footer
		doc.text("Gracias por confiar en nosotros", 10, 110);

		doc.save(`factura-cita-${id}.pdf`);
	};

	if (loading) return <p className="p-4">Cargando...</p>;
	if (!cita) return <p className="p-4">Cita no encontrada</p>;

	return (
		<div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6 border border-gray-200">
			<button
				onClick={() => navigate(-1)}
				className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
			>
				<ArrowLeft className="w-5 h-5 mr-2" />
				Volver
			</button>
	
			<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
				Factura de Cita
			</h2>
	
			<div className="space-y-3 text-gray-700 text-lg">
				<p><span className="font-semibold">Paciente:</span> {cita.paciente}</p>
				<p><span className="font-semibold">Psicóloga:</span> {cita.psicologa}</p>
				<p><span className="font-semibold">Fecha:</span> {cita.fecha}</p>
				<p><span className="font-semibold">Hora:</span> {cita.hora}</p>
				<p><span className="font-semibold">Estado:</span> {cita.estado}</p>
				<p><span className="font-semibold">Teléfono Paciente:</span> {cita.paciente_telefono}</p>
				<p><span className="font-semibold">Teléfono Psicóloga:</span> {cita.psicologa_telefono}</p>
			</div>
	
			{/* Precio en esquina derecha grande */}
			<div className="mt-8 flex justify-end">
				<div className="text-right">
					<p className="text-gray-600 text-sm">Total a pagar:</p>
					<p className="text-4xl font-bold text-green-700">${cita.precio}</p>
				</div>
			</div>
	
			<button
				onClick={descargarFactura}
				className="mt-8 w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition cursor-pointer"
			>
				<Download className="w-5 h-5" />
				Descargar PDF
			</button>
		</div>
	);
}
