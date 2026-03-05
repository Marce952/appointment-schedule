'use client';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importar español
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Card, Spinner } from "@heroui/react";

// Configurar dayjs en español
dayjs.locale('es');
const localizer = dayjsLocalizer(dayjs);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  source: 'local' | 'google';
  status?: string;
}

export default function TurnosPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const getEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/calendar');
      const data = response.data || [];

      const mapped = data.map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        start: new Date(ev.start),
        end: new Date(ev.end),
        source: ev.source || 'local',
        status: ev.status
      }));

      setEvents(mapped);
    } catch (err) {
      console.error('Error obteniendo eventos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const eventPropGetter = useCallback(
    (event: CalendarEvent) => ({
      style: {
        backgroundColor: event.source === 'local' ? '#3B82F6' : '#94A3B8',
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '0.85rem',
        padding: '2px 6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      },
    }),
    []
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] p-4 gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendario de Turnos</h1>
          <p className="text-default-500">Gestiona tus citas confirmadas y sincronización</p>
        </div>
        {loading && <Spinner size="sm" color="primary" />}
      </div>

      <Card className="flex-grow p-4 shadow-lg border-none bg-white/80 backdrop-blur-md">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          step={30}
          timeslots={2}
          eventPropGetter={eventPropGetter}
          messages={{
            next: "Sig.",
            previous: "Ant.",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "No hay turnos en este rango.",
          }}
          style={{ height: '100%' }}
        />
      </Card>

      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-header {
          padding: 12px 0;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          font-size: 0.75rem;
          border-bottom: 2px solid #f1f5f9;
        }
        .rbc-today {
          background-color: #f8fafc;
        }
        .rbc-event {
          transition: transform 0.2s ease;
        }
        .rbc-event:hover {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }
        .rbc-toolbar button {
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          margin: 0 2px;
          font-weight: 500;
        }
        .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
          background-color: #3b82f6;
          color: white;
          box-shadow: none;
        }
        .rbc-toolbar button:hover {
          background-color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}