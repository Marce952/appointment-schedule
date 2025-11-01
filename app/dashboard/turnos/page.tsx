'use client'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import dayjs from 'dayjs'
import React from 'react'

const page = () => {
  const localizer = dayjsLocalizer(dayjs)
  return (
    <div className='h-screen w-screen'>
      <Calendar
        localizer={localizer}
        style={{
          height: 500,
          width: 700
        }}
      />
    </div>
  )
}

export default page