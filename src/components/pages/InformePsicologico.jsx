import React, { useState, useRef, useEffect } from 'react';
import {
	ArrowLeftCircle,
	Save,
	DownloadCloud,
	FileText,
	Lightbulb,
	User2,
	Calendar,
	BookOpen,
	Activity,
	FileEdit
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { GUARDAR_INFORME_CITA, OBTENER_INFORME_CITA } from '../../api/registro';
import { useParams } from 'react-router-dom';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export const InformePsicologico = () => {
	const { idCita } = useParams();
	const [form, setForm] = useState({
		nombre: '',
		fechaNacimiento: '',
		edad: '',
		escolaridad: '',
		ocupacion: '',
		fechaEvaluacion: '',
		acompanantes: '',
		descripcionIngreso: '',
		fonotipo: '',
		motivo: '',
		antecedentes: '',
		observacion: '',
		evolucion: '',
		expresion: '',
		diagnostico: '',
		recomendaciones: '',
		cita_id: idCita
	});

	const [originalForm, setOriginalForm] = useState({});

	useEffect(() => {
		const obtenerInforme = async () => {
			try {
				const { data } = await axios.post(OBTENER_INFORME_CITA, { idCita });
				if (!data || !data.nombre) return;
				setForm(data);
				setOriginalForm(data);
			} catch (err) {
				console.error('Error al obtener informe', err);
			}
		};
		obtenerInforme();
	}, [idCita]);

	useEffect(() => {
		if (form.fechaNacimiento) {
			const birth = new Date(form.fechaNacimiento);
			const today = new Date();
			let age = today.getFullYear() - birth.getFullYear();
			if (
				today.getMonth() < birth.getMonth() ||
				(today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
			) age--;
			setForm(prev => ({ ...prev, edad: age }));

		}
	}, [form.fechaNacimiento]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleGuardarInforme = async () => {
		console.log("Enviando:", { ...form })

		const isChanged = Object.keys(form).some((key) => form[key] !== originalForm[key])
		if (!isChanged) {
			Swal.fire({
				title: 'Sin cambios',
				text: 'No se detectaron cambios en el informe',
				icon: 'info',
				timer: 2000,
				showConfirmButton: false
			})
			return
		}

		try {
			const res = await axios.post(GUARDAR_INFORME_CITA, { ...form })
			console.log("Respuesta backend:", res.data)
			Swal.fire('Guardado', 'Informe guardado con éxito', 'success')
			setOriginalForm(form)
		} catch (error) {
			console.error('Error al guardar el informe:', error)
			Swal.fire('Error', 'Ocurrió un error al guardar el informe', 'error')
		}
	}

	const limpiarTexto = (texto) => {
		return String(texto ?? '')
			.normalize("NFD")                     // separa tildes
			.replace(/[\u0300-\u036f]/g, '')     // elimina tildes
			.replace(/[^\x00-\x7F]/g, '')        // elimina todo lo no ASCII
			.replace(/\n/g, ' ')                 // elimina saltos de línea
	}

	const exportarPDF = async (form) => {
		const existingPdfBytes = await fetch('/planilla.pdf').then(res => res.arrayBuffer());
		const pdfDoc = await PDFDocument.load(existingPdfBytes);
		const [templatePage] = await pdfDoc.copyPages(pdfDoc, [0]);

		let page = pdfDoc.getPages()[0];
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

		// Configuración visual
		const fontSize = 10;
		const x = 20;
		const topMargin = 680;
		let y = topMargin;
		const maxWidth = 470;
		const lineHeight = 14;
		const minY = 100;

		const drawWrappedText = (label, content) => {
			const textoLimpio = limpiarTexto(content);
			const palabras = textoLimpio.split(' ');
			let linea = '';

			if (y < minY + lineHeight) {
				page = pdfDoc.addPage(templatePage);
				y = topMargin;
			}

			page.drawText(limpiarTexto(label), { x, y, size: fontSize, font: fontBold });
			y -= lineHeight;

			for (const palabra of palabras) {
				const testLinea = linea + palabra + ' ';
				const width = font.widthOfTextAtSize(testLinea, fontSize);

				if (width > maxWidth && linea !== '') {
					if (y < minY + lineHeight) {
						page = pdfDoc.addPage(templatePage);
						y = topMargin;
					}
					page.drawText(linea, { x, y, size: fontSize, font });
					linea = palabra + ' ';
					y -= lineHeight;
				} else {
					linea = testLinea;
				}
			}

			if (y < minY + lineHeight) {
				page = pdfDoc.addPage(templatePage);
				y = topMargin;
			}
			page.drawText(linea, { x, y, size: fontSize, font });
			y -= 30;
		};

		for (const [key, value] of Object.entries(form)) {
			if (key !== 'cita_id' && value?.toString().trim()) {
				const label = `${formatLabel(key)}:`;
				drawWrappedText(label, value);
			}
		}

		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: 'application/pdf' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `informe_${form.nombre}.pdf`;
		link.click();
	};

	const getIconForField = (key) => ({
		nombre: <User2 size={18} className="text-[#61CE70]" />,
		fechaNacimiento: <Calendar size={18} className="text-[#6EC1E4]" />,
		escolaridad: <BookOpen size={18} className="text-purple-400" />,
		diagnostico: <Activity size={18} className="text-red-400" />,
	}[key] || <FileEdit size={18} className="text-gray-400" />);

	const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

	const renderField = (key, value) => {
		const base = "w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6EC1E4] focus:border-transparent transition-all";
		if (key.includes('fecha')) return <input type="date" name={key} value={value} onChange={handleChange} className={`${base} bg-white/80`} />;
		if (key === 'edad') return <input type="number" name={key} value={value} readOnly className={`${base} bg-gray-100`} />;
		return <textarea name={key} value={value} onChange={handleChange} className={`${base} min-h-[80px]`} rows={key.length > 12 ? 3 : 1} />;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#f7fafc] to-[#e2e8f0] p-6">
			<div className="mb-8 text-center">
				<h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#61CE70] to-[#6EC1E4]">
					<FileText className="inline mr-3" size={28} /> Informe Psicológico
				</h2>
				<p className="text-gray-500 mt-2 flex items-center justify-center">
					<Lightbulb className="mr-2" size={16} /> Completa los campos con atención terapéutica
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				{Object.entries(form).map(([key, val]) => key !== 'cita_id' && (
					<div key={key} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-[#6EC1E4]">
						<label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
							{getIconForField(key)} {formatLabel(key)}
						</label>
						{renderField(key, val)}
					</div>
				))}
			</div>

			<div className="flex flex-wrap justify-center gap-4 mt-8">
				<button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 font-medium rounded-full shadow-sm hover:shadow-lg transition-all hover:bg-gray-50 border border-gray-200">
					<ArrowLeftCircle size={20} /> Retroceder
				</button>
				<button onClick={handleGuardarInforme} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#61CE70] to-[#6EC1E4] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
					<Save className="animate-pulse" size={20} /> Guardar Informe
				</button>
				<button onClick={() => exportarPDF(form)} className="flex items-center gap-2 px-6 py-3 bg-[#6EC1E4] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-[#5aa8c9]">
					<DownloadCloud size={20} /> Generar PDF
				</button>
			</div>


		</div>
	);
};
