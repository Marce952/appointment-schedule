'use client'
import React from 'react'
import DashboardLayout from './layout'
import { RangeCalendar } from '@heroui/react';

export default function DashboardPage() {
  return (
    <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
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
            Actividades recientes
          </h2>
          <ul className="space-y-3">
            <li className="text-gray-600">✔️ Nuevo turno agendado por Juan Pérez</li>
            <li className="text-gray-600">👥 Se registró un nuevo usuario</li>
            <li className="text-gray-600">💰 Pago recibido de María López</li>
          </ul>
        </div>
      </div>

      <div>
        <RangeCalendar aria-label="Date (No Selection)" />
      </div>
    </div>
  );
}