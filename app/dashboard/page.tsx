'use client'
import React from 'react'
import DashboardLayout from './layout'
import { RangeCalendar } from '@heroui/react';

export default function DashboardPage() {
  return (
    <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 ">
      <div className=' col-span-2'>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Panel principal
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjetas de ejemplo */}
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="font-medium text-gray-700">Usuarios</h2>
            <p className="text-3xl font-bold text-indigo-600">124</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="font-medium text-gray-700">Turnos</h2>
            <p className="text-3xl font-bold text-indigo-600">38</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h2 className="font-medium text-gray-700">Ingresos</h2>
            <p className="text-3xl font-bold text-indigo-600">$12.300</p>
          </div>
        </div>

        {/* Contenido adicional */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Proximos turnos
          </h2>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col'>
              <h2 className='font-bold'>👨 Marcelo Garrido | 🐶 Rocco</h2>
              <h3>🗓️ 10/12/25 15:30</h3>
              <p className='text-xs text-gray-400'>Mi mascota no come...</p>
            </div>
            <div className='flex flex-col'>
              <h2 className='font-bold'>👨 Luz Garrido | 🐈 Kitty</h2>
              <h3>🗓️ 15/12/25 15:30</h3>
              <p className='text-xs text-gray-400'>Mi mascota mea computadoras...</p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white flex justify-center rounded-2xl inset-shadow-sm shadow-sm py-4'>
        <RangeCalendar aria-label="Date (No Selection)" />
      </div>
    </div>
  );
}