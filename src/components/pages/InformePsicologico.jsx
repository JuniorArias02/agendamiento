import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, Download } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import { GUARDAR_INFORME_CITA, OBTENER_INFORME_CITA } from '../../api/registro';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { VistaInforme } from '../ui/vistaInforme';
import html2canvas from 'html2canvas';

export const InformePsicologico = () => {
	const { idCita } = useParams(); // Esto extrae el idCita de la URL
	const vistaRef = useRef(); // Referencia para el componente VistaInforme

	// Estado para almacenar los datos del formulario
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
		cita_id: idCita, // Aseguramos que el cita_id esté en el estado, pero no sea editable
	});

	// Estado para almacenar los datos originales y detectar cambios
	const [originalForm, setOriginalForm] = useState({});

	// Efecto para obtener los datos del informe cuando se carga el componente
	useEffect(() => {
		const obtenerInforme = async () => {
			try {
				const response = await axios.post(OBTENER_INFORME_CITA, { idCita });
				if (!response.data || !response.data.nombre) {
					setForm({
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
						cita_id: idCita, // Mantener el cita_id
					});
				} else {
					setForm(response.data);
					setOriginalForm(response.data); // Guardamos los datos originales
				}
			} catch (error) {
				console.error('Error al obtener el informe:', error);
			}
		};

		obtenerInforme();
	}, [idCita]);

	// Efecto para calcular la edad cuando cambia la fecha de nacimiento
	useEffect(() => {
		if (form.fechaNacimiento) {
			const birthDate = new Date(form.fechaNacimiento);
			const today = new Date();
			const age = today.getFullYear() - birthDate.getFullYear();
			const month = today.getMonth() - birthDate.getMonth();
			if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
				setForm({ ...form, edad: age - 1 });
			} else {
				setForm({ ...form, edad: age });
			}
		}
	}, [form.fechaNacimiento]);

	// Función para manejar el cambio de los campos del formulario
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Detectar si hay cambios en los campos
	const handleDetectarCambios = () => {
		const isChanged = Object.keys(form).some((key) => form[key] !== originalForm[key]);
		if (isChanged) {
			// Si hay cambios, mostramos una alerta
			Swal.fire({
				title: '¿Deseas guardar los cambios?',
				text: `Se detectaron cambios en el campo: ${Object.keys(form).find(key => form[key] !== originalForm[key])}`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Guardar',
				cancelButtonText: 'Cancelar',
			}).then((result) => {
				if (result.isConfirmed) {
					handleGuardarInforme();
				}
			});
		}
	};

	// Función para guardar el informe
	const handleGuardarInforme = async () => {
		try {
			const response = await axios.post(GUARDAR_INFORME_CITA, { ...form });
			console.log(response.data);
			alert('Informe guardado con éxito');
		} catch (error) {
			console.error('Error al guardar el informe:', error);
			alert('Ocurrió un error al guardar el informe');
		}
	};

	// Función para descargar el informe en PDF
	const handleDescargarPDF = async () => {
		const input = vistaRef.current;

		const canvas = await html2canvas(input, { scale: 2 });
		const imgData = canvas.toDataURL('image/png');

		const pdf = new jsPDF('p', 'mm', 'a4');
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

		pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
		pdf.save('informe_psicologico.pdf');
	};
	return (
		<div className="p-4 bg-gray-100 min-h-screen">
			<h2 className="text-xl font-bold mb-4">Llenar Informe Psicológico</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				{/* Mapear los campos del formulario */}
				{Object.entries(form).map(([key, value]) => (
					// Aseguramos que cita_id no sea editable ni visible en el formulario
					key !== 'cita_id' && (
						<div key={key}>
							<label className="block font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</label>
							{key === 'fechaNacimiento' || key === 'fechaEvaluacion' ? (
								<input
									type="date"
									name={key}
									value={value}
									onChange={handleChange}
									onBlur={handleDetectarCambios} // Detectamos cambios cuando se sale del campo
									className="w-full p-2 border border-gray-400 rounded"
								/>
							) : key === 'edad' ? (
								<input
									type="number"
									name={key}
									value={value}
									onChange={handleChange}
									onBlur={handleDetectarCambios} // Detectamos cambios cuando se sale del campo
									className="w-full p-2 border border-gray-400 rounded"
									readOnly
								/>
							) : (
								<textarea
									name={key}
									value={value}
									onChange={handleChange}
									onBlur={handleDetectarCambios} // Detectamos cambios cuando se sale del campo
									className="w-full p-2 border border-gray-400 rounded resize-y"
									rows={key.length > 12 ? 3 : 1}
								/>
							)}
						</div>
					)
				))}
			</div>

			{/* Botones de acción */}
			<div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">

				<button
					onClick={() => window.history.back()}
					className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white font-semibold rounded shadow-md hover:bg-gray-600 transition cursor-pointer"
				>
					<ArrowLeft size={18} />
					<span>Retroceder</span>
				</button>
				<button
					onClick={handleGuardarInforme}
					className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded shadow-md hover:bg-green-700 transition cursor-pointer"
				>
					<Save size={18} />
					<span>Guardar Informe</span>
				</button>
				{/* Botón para descargar PDF */}
				<button
					onClick={handleDescargarPDF}
					className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded shadow-md hover:bg-blue-700 transition cursor-pointer"
				>
					<Download size={18} />
					<span>Descargar PDF</span>
				</button>
			</div>
			<div className="overflow-auto p-2 mt-5 flex items-center justify-center">

				<VistaInforme ref={vistaRef} form={form} />
			</div>

		</div>
	);
};
