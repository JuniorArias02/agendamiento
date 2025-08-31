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
  FileEdit,
  Brain,
  Heart,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import Swal from 'sweetalert2';
import { guardarInformeCita, obtenerInformeCita } from '../../services/informes/informes';
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
  const [activeSection, setActiveSection] = useState('datos-basicos');

  useEffect(() => {
    const obtenerInforme = async () => {
      try {
        const data = await obtenerInformeCita(idCita);
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
    const isChanged = Object.keys(form).some((key) => form[key] !== originalForm[key]);
    if (!isChanged) {
      Swal.fire({
        title: 'Sin cambios',
        text: 'No se detectaron cambios en el informe',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    try {
      await guardarInformeCita(form);
      Swal.fire('Guardado', 'Informe guardado con éxito', 'success');
      setOriginalForm(form);
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al guardar el informe', 'error');
    }
  };

  const limpiarTexto = (texto) => {
    return String(texto ?? '')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/\n/g, ' ')
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
    nombre: <User2 size={18} className="text-[#5D87FF]" />,
    fechaNacimiento: <Calendar size={18} className="text-[#49BEFF]" />,
    escolaridad: <BookOpen size={18} className="text-[#5D87FF]" />,
    ocupacion: <Activity size={18} className="text-[#49BEFF]" />,
    fechaEvaluacion: <Calendar size={18} className="text-[#5D87FF]" />,
    acompanantes: <User2 size={18} className="text-[#49BEFF]" />,
    descripcionIngreso: <ClipboardList size={18} className="text-[#5D87FF]" />,
    fonotipo: <Stethoscope size={18} className="text-[#49BEFF]" />,
    motivo: <Heart size={18} className="text-[#5D87FF]" />,
    antecedentes: <Brain size={18} className="text-[#49BEFF]" />,
    observacion: <FileEdit size={18} className="text-[#5D87FF]" />,
    evolucion: <Activity size={18} className="text-[#49BEFF]" />,
    expresion: <Stethoscope size={18} className="text-[#5D87FF]" />,
    diagnostico: <Brain size={18} className="text-[#49BEFF]" />,
    recomendaciones: <Lightbulb size={18} className="text-[#5D87FF]" />,
  }[key] || <FileEdit size={18} className="text-gray-400" />);

  const formatLabel = (key) => {
    const labels = {
      nombre: 'Nombre completo',
      fechaNacimiento: 'Fecha de nacimiento',
      escolaridad: 'Escolaridad',
      ocupacion: 'Ocupación',
      fechaEvaluacion: 'Fecha de evaluación',
      acompanantes: 'Acompañantes',
      descripcionIngreso: 'Descripción de ingreso',
      fonotipo: 'Fonotipo',
      motivo: 'Motivo de consulta',
      antecedentes: 'Antecedentes relevantes',
      observacion: 'Observaciones',
      evolucion: 'Evolución',
      expresion: 'Expresión',
      diagnostico: 'Diagnóstico',
      recomendaciones: 'Recomendaciones'
    };
    return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  };

  const renderField = (key, value) => {
    const base = "w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#5D87FF] focus:border-transparent transition-all bg-white";
    if (key.includes('fecha')) return <input type="date" name={key} value={value} onChange={handleChange} className={base} />;
    if (key === 'edad') return <input type="number" name={key} value={value} readOnly className={`${base} bg-gray-50`} />;
    return <textarea name={key} value={value} onChange={handleChange} className={`${base} min-h-[100px]`} />;
  };

  // Agrupar campos por secciones
  const fieldGroups = {
    'datos-basicos': ['nombre', 'fechaNacimiento', 'edad', 'escolaridad', 'ocupacion', 'fechaEvaluacion', 'acompanantes'],
    'evaluacion': ['descripcionIngreso', 'fonotipo', 'motivo', 'antecedentes'],
    'observaciones': ['observacion', 'evolucion', 'expresion'],
    'diagnostico': ['diagnostico', 'recomendaciones']
  };

  const sectionTitles = {
    'datos-basicos': 'Datos Básicos',
    'evaluacion': 'Evaluación Inicial',
    'observaciones': 'Observaciones y Evolución',
    'diagnostico': 'Diagnóstico y Recomendaciones'
  };

  const sectionIcons = {
    'datos-basicos': <User2 size={20} />,
    'evaluacion': <ClipboardList size={20} />,
    'observaciones': <FileEdit size={20} />,
    'diagnostico': <Brain size={20} />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e2e8f0] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center bg-white rounded-xl p-6 shadow-sm">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-[#5D87FF] to-[#49BEFF] rounded-full mb-4">
            <FileText className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Informe Psicológico
          </h2>
          <p className="text-gray-500 mt-2 flex items-center justify-center">
            <Lightbulb className="mr-2" size={16} /> Complete los campos con atención terapéutica
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navegación lateral */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              <h3 className="font-semibold text-gray-700 mb-4 text-lg">Secciones del Informe</h3>
              <nav className="space-y-2">
                {Object.keys(fieldGroups).map(section => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${activeSection === section 
                      ? 'bg-gradient-to-r from-[#5D87FF] to-[#49BEFF] text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span className="text-lg">
                      {sectionIcons[section]}
                    </span>
                    <span className="font-medium">{sectionTitles[section]}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Formulario principal */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-[#5D87FF]">{sectionIcons[activeSection]}</span>
                {sectionTitles[activeSection]}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {fieldGroups[activeSection].map(key => (
                  <div key={key} className={`${['observacion', 'evolucion', 'expresion', 'diagnostico', 'recomendaciones', 'motivo', 'antecedentes', 'descripcionIngreso'].includes(key) ? 'md:col-span-2' : ''}`}>
                    <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                      {getIconForField(key)} {formatLabel(key)}
                    </label>
                    {renderField(key, form[key])}
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 bg-white p-5 rounded-xl shadow-sm">
              <button 
                onClick={() => window.history.back()} 
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 font-medium rounded-full shadow-sm hover:shadow-lg transition-all hover:bg-gray-50 border border-gray-200"
              >
                <ArrowLeftCircle size={20} /> Retroceder
              </button>
              
              <button 
                onClick={handleGuardarInforme} 
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5D87FF] to-[#49BEFF] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <Save size={20} /> Guardar Informe
              </button>
              
              <button 
                onClick={() => exportarPDF(form)} 
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#26C6DA] to-[#00ACC1] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <DownloadCloud size={20} /> Generar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};