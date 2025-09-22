import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { obtenerMiTiempo } from "../../services/citas/citas";
import { useAuth } from "../../context/AuthContext";

export default function MiTiempo() {
  const { usuario } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const cargarDisponibilidades = async () => {
      try {
        setLoading(true);
        const { success, data } = await obtenerMiTiempo(usuario.id);
        
        if (success) {
          const tz = localStorage.getItem("user_tz") || "UTC";

          const mapped = data.map((d) => {
            const date = new Date(d.fecha_hora_utc);
            const localDate = new Date(date.toLocaleString("en-US", { timeZone: tz }));

            return {
              id: d.id,
              title: d.disponible ? "📅 Disponible" : "⏰ Ocupado",
              start: localDate.toISOString(),
              allDay: false,
              backgroundColor: d.disponible ? 
                "linear-gradient(135deg, #10b981 0%, #059669 100%)" : 
                "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              borderColor: d.disponible ? "#059669" : "#d97706",
              textColor: "#ffffff",
              className: d.disponible ? "event-available" : "event-busy",
              extendedProps: {
                disponible: d.disponible,
                originalDate: d.fecha_hora_utc
              }
            };
          });

          setEvents(mapped);
        }
      } catch (err) {
        console.error("Error cargando disponibilidades:", err);
      } finally {
        setLoading(false);
      }
    };

    if (usuario) {
      cargarDisponibilidades();
    }
  }, [usuario]);

  const handleDateClick = (arg) => {
    console.log("Fecha clickeada:", arg.dateStr);
    // Aquí podrías abrir un modal para agregar nueva disponibilidad
  };

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();
    
    // Efecto visual al hacer click
    info.el.style.transform = "scale(0.95)";
    setTimeout(() => {
      info.el.style.transform = "scale(1)";
    }, 150);

    console.log("Evento clickeado:", info.event);
  };

  const handleViewChange = (viewInfo) => {
    setCurrentView(viewInfo.view.type);
    setCurrentDate(viewInfo.view.currentStart);
  };

  const navigateToToday = () => {
    const calendarApi = document.querySelector('.modern-calendar')?.getApi();
    if (calendarApi) {
      calendarApi.today();
      setCurrentDate(new Date());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando tu agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      {/* Header Moderno */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Mi Agenda
            </h1>
            <p className="text-slate-600 mt-2">
              Gestiona tu disponibilidad de forma intuitiva
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={navigateToToday}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-slate-700 hover:bg-slate-50"
            >
              Hoy
            </button>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-slate-700 font-medium">
                {currentDate.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <FullCalendar
          className="modern-calendar"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          events={events}
          locale="es"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          nowIndicator={true}
          selectable={true}
          editable={true}
          droppable={true}
          dayMaxEvents={true}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
          }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          viewDidMount={handleViewChange}
          height="auto"
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          allDaySlot={false}
          expandRows={true}
          stickyHeaderDates={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
        />
      </div>

      {/* Leyenda */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <span className="text-sm text-slate-600">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <span className="text-sm text-slate-600">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-dashed border-slate-300"></div>
          <span className="text-sm text-slate-600">Horario laboral</span>
        </div>
      </div>

      <style jsx>{`
        :global(.fc) {
          --fc-border-color: #f1f5f9;
          --fc-today-bg-color: #f0fdf4;
          --fc-page-bg-color: white;
          --fc-neutral-bg-color: #f8fafc;
        }

        :global(.fc .fc-toolbar) {
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          margin: 0;
        }

        @media (min-width: 768px) {
          :global(.fc .fc-toolbar) {
            flex-direction: row;
          }
        }

        :global(.fc .fc-toolbar-title) {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        :global(.fc .fc-button) {
          background: white;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-weight: 500;
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }

        :global(.fc .fc-button:hover) {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        :global(.fc .fc-button-primary:not(:disabled).fc-button-active) {
          background: #10b981;
          border-color: #059669;
          color: white;
        }

        :global(.fc .fc-daygrid-day.fc-day-today) {
          background-color: #f0fdf4 !important;
        }

        :global(.fc .fc-timegrid-now-indicator-line) {
          border-color: #ef4444;
          border-width: 2px;
        }

        :global(.event-available) {
          backdrop-filter: blur(8px);
          border-left: 4px solid #10b981 !important;
        }

        :global(.event-busy) {
          backdrop-filter: blur(8px);
          border-left: 4px solid #f59e0b !important;
        }

        :global(.fc-event) {
          border: none;
          border-radius: 0.75rem;
          padding: 0.5rem;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        :global(.fc-event:hover) {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}