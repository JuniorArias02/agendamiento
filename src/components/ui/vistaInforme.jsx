import React, { forwardRef } from 'react';
import { Instagram, MessageCircle } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export const VistaInforme = forwardRef(({ form }, ref) => {

  const exportarPDF = async (form) => {
    const existingPdfBytes = await fetch('/planilla.pdf').then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 10

    // Aquí es donde insertas los textos (ajusta las coordenadas según tu PDF)
    firstPage.drawText(`Nombre: ${form.nombre}`, { x: 60, y: 700, size: fontSize, font, color: rgb(0, 0, 0) })
    firstPage.drawText(`Diagnóstico: ${form.diagnostico}`, { x: 60, y: 680, size: fontSize, font, color: rgb(0, 0, 0) })
    firstPage.drawText(`Recomendaciones: ${form.recomendaciones}`, { x: 60, y: 660, size: fontSize, font, color: rgb(0, 0, 0) })

    const pdfBytes = await pdfDoc.save()

    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `informe_${form.nombre}.pdf`
    link.click()
  }

  return (
    <div
      ref={ref}
      className="w-[210mm] min-h-[297mm] p-10 text-black bg-white font-sans text-[12px] leading-relaxed"
    >
      {/* Encabezado principal */}
      <div className="flex justify-between items-center mb-6">
        {/* Logo y nombre */}
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="h-16" />
          <div className="border-l-2 border-gray-300 pl-4">
            <p className="text-xl font-bold text-gray-800 leading-snug">Dra. Luz Marina Sepúlveda</p>
            <p className="text-sm text-gray-600 font-medium">Psicóloga</p>
          </div>
        </div>

        {/* Redes */}
        <div className="flex items-center justify-center space-x-2 p-2 rounded-lg">
          {/* Instagram */}
          <div className="bg-white p-1.5 rounded-full border border-gray-200">
            <Instagram
              size={20}
              strokeWidth={1.2}
              className="text-blue-500 m-0"
            />
          </div>
          <a
            href="https://www.instagram.com/psicologicamentehablando"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center rounded-lg border border-transparent transition-colors duration-300
      bg-gradient-to-r from-green-50 to-blue-100 hover:from-green-100 hover:to-blue-200
      text-gray-700 hover:text-gray-900"
          >
            <div className="ml-1 text-left">
              <p className="font-semibold text-sm">INSTAGRAM</p>
              <p className="text-xs text-gray-600">@psicologicamentehablando</p>
            </div>
          </a>


          <div className="bg-white p-1.5 rounded-full border border-gray-200">
            <MessageCircle
              size={20}
              strokeWidth={1.2}
              className="text-green-500 m-0"
            />
          </div>
          <a
            href="https://api.whatsapp.com/send?phone=573133889938"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-lg border border-transparent transition-colors duration-300
      bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200
      text-gray-700 hover:text-gray-900 min-w-[120px]"
          >
            <div className="ml-1 text-left">
              <p className="font-semibold text-sm">WHATSAPP</p>
              <p className="text-xs text-gray-600">3133889938</p>
            </div>
          </a>
        </div>
      </div>

      <h2 className="text-center font-semibold text-base uppercase mb-4 underline">Informe de Valoración</h2>


      <div className="mb-6 space-y-1 text-sm">
        {[
          ['Apellidos y Nombre', 'nombre'],
          ['Fecha de Nacimiento', 'fechaNacimiento'],
          ['Edad Actual', 'edad'],
          ['Escolaridad', 'escolaridad'],
          ['Ocupación', 'ocupacion'],
          ['Fecha de Evaluación', 'fechaEvaluacion'],
          ['Acompañantes', 'acompanantes'],
        ].map(([label, key]) => (
          <p key={key} className="break-words">
            <strong>{label}:</strong> {form[key]}
          </p>
        ))}
      </div>

      {/* Cuerpo del informe */}
      <div className="space-y-4 text-sm">
        {[
          ['Descripción del usuario en el momento del ingreso', 'descripcionIngreso'],
          ['Fonotipo físico', 'fonotipo'],
          ['Motivo de consulta', 'motivo'],
          ['Antecedentes relevantes', 'antecedentes'],
          ['Observación de conducta', 'observacion'],
          ['Evolución de la conducta', 'evolucion'],
          ['Expresión facial', 'expresion'],
          ['Impresión diagnóstica', 'diagnostico'],
          ['Recomendaciones', 'recomendaciones'],
        ].map(([label, key]) => (
          <div key={key} className="break-inside-avoid">
            <p className="font-semibold">{label.toUpperCase()}:</p>
            <p className="whitespace-pre-wrap break-words">{form[key]}</p>
          </div>
        ))}
      </div>
    </div >
  );
});
