import React, { forwardRef } from 'react';

export const VistaInforme = forwardRef(({ form }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[210mm] min-h-[297mm] p-10 text-black bg-white font-sans text-[13px] leading-relaxed"
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        {/* Logo a la izquierda */}
        <div className="w-1/4">
          <img src="/logo.png" alt="Logo" className="h-24 object-contain" />
        </div>

        {/* Info de la doctora a la derecha */}
        <div className="w-3/4 text-center">
          <p className="text-lg font-bold uppercase tracking-wide">Dra. Luz Marina Sepúlveda Rojas</p>
          <p className="text-sm">Especialista en Neurodesarrollo</p>
          <p className="text-sm">Trastornos del Aprendizaje</p>
          <p className="text-sm">Trastornos del Ánimo</p>
          <p className="text-sm">Terapia Cognitiva Conductual</p>
          <p className="mt-2 text-sm font-medium">Registro Profesional: 146821</p>
        </div>
      </div>

      {/* Datos del usuario */}
      <div className="mb-10">
        <h2 className="text-center font-semibold text-base uppercase mb-5 underline decoration-1">Informe de Valoración</h2>
        <div className="space-y-1 text-sm">
          {[
            ['Apellidos y Nombre', 'nombre'],
            ['Fecha de Nacimiento', 'fechaNacimiento'],
            ['Edad Actual', 'edad'],
            ['Escolaridad', 'escolaridad'],
            ['Ocupación', 'ocupacion'],
            ['Fecha de Evaluación', 'fechaEvaluacion'],
            ['Acompañantes', 'acompanantes'],
          ].map(([label, key]) => (
            <p key={key} className="whitespace-pre-wrap break-words">
              <strong>{label}:</strong> {form[key]}
            </p>
          ))}
        </div>
      </div>

      {/* Cuerpo del informe */}
      <div className="space-y-5 text-sm">
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
    </div>
  );
});
