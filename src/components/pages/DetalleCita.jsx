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
				}
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, [id]);

	const descargarFactura = () => {
		const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [90, 120] });
		const titulo = "Factura de Cita";
		const centerX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(titulo)) / 2;

		const fechaDescarga = new Date().toLocaleString("es-CO", {
			day: "2-digit", month: "2-digit", year: "numeric",
			hour: "2-digit", minute: "2-digit", hour12: true,
		});

		doc.setFont("helvetica").setFontSize(16).setTextColor(40, 40, 40);
		doc.text("PsicologicamenteHablando", 10, 15);
		doc.setFontSize(12).text("soportewebhablando@gmail.com", 10, 21);
		doc.setLineWidth(0.5).line(5, 25, 75, 25);
		doc.setFontSize(10).setTextColor(50);
		doc.text(titulo, centerX, 32);
		doc.text(`Paciente: ${cita.paciente}`, 10, 40);
		doc.text(`Psicóloga: ${cita.psicologa}`, 10, 47);
		doc.text(`Fecha: ${cita.fecha}`, 10, 54);
		doc.text(`Hora: ${cita.hora}`, 10, 61);
		doc.text(`Estado: ${cita.estado}`, 10, 68);
		doc.text(`Descripción: Sesión psicológica`, 10, 75);
		doc.setFontSize(14).setTextColor(0, 128, 0);
		doc.text(`Total: $${cita.precio}`, 10, 90);
		doc.setFontSize(8).setTextColor(100);
		doc.text(`Generado: ${fechaDescarga}`, 10, 100);
		doc.text("Gracias por confiar en nosotros", 10, 110);
		doc.save(`factura-cita-${id}.pdf`);
	};

	if (loading) return <p className="p-4 text-center">Cargando...</p>;
	if (!cita) return <p className="p-4 text-center">Cita no encontrada</p>;

	return (
		<div className="max-w-2xl mx-auto px-4 py-8">
			<button
				onClick={() => navigate(-1)}
				className="flex items-center text-custom-green hover:text-custom-marron-1 mb-6"
			>
				<ArrowLeft className="w-5 h-5 mr-2" />
				Volver
			</button>

			<h2 className="text-3xl font-bold text-center text-custom-green mb-6">
				Factura de Cita
			</h2>

			<div className="space-y-4 text-custom-green text-lg">
				<p><span className="font-semibold">Paciente:</span> {cita.paciente}</p>
				<p><span className="font-semibold">Psicóloga:</span> {cita.psicologa}</p>
				<p><span className="font-semibold">Fecha:</span> {cita.fecha}</p>
				<p><span className="font-semibold">Hora:</span> {cita.hora}</p>
				<p><span className="font-semibold">Estado:</span> {cita.estado}</p>
				<p><span className="font-semibold">Teléfono Paciente:</span> {cita.paciente_telefono}</p>
				<p><span className="font-semibold">Teléfono Psicóloga:</span> {cita.psicologa_telefono}</p>
			</div>

			<div className="mt-8 flex justify-end">
				<div className="text-right">
					<p className="text-sm text-custom-green-1">Total a pagar:</p>
					<p className="text-4xl font-bold text-green-700">${cita.precio}</p>
				</div>
			</div>

			<button
				onClick={descargarFactura}
				className="mt-10 w-full flex items-center justify-center gap-2 py-3 bg-custom-green text-white font-semibold rounded-xl hover:bg-custom-green-1 transition"
			>
				<Download className="w-5 h-5" />
				Descargar PDF
			</button>
		</div>
	);
}
