'use client'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const page = () => {
  const [events, setEvents] = useState<Array<{ id?: string; title: string; start: Date; end: Date }>>([])

  const getEvents = async () => {
    try {
      const response = await axios.get('/pages/api/calendar') // ruta correcta del API
      const data = response.data || []

      const mapped = data.map((ev: any) => ({
        id: ev.id,
        title: ev.title || ev.summary || 'Evento',
        start: ev.start ? new Date(ev.start) : new Date(),
        end: ev.end ? new Date(ev.end) : new Date(ev.start || undefined),
      }))

      setEvents(mapped)
      console.log('Eventos cargados:', mapped)
    } catch (err) {
      console.error('Error obteniendo eventos:', err)
    }
  }

  useEffect(() => {
    getEvents()
  },[])

  const localizer = dayjsLocalizer(dayjs)
  return (
    <div className='h-screen'>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: 500,
        }}
      />
    </div>
  )
}

export default page