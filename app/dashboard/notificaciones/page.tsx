import { Check, X } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className='flex justify-between items-center bg-white rounded-2xl shadow-sm py-4 px-6 m-4 w-[50%]'>
        <div className='flex flex-col'>
          <h2 className='font-bold'>👨 Marcelo Garrido | 🐶 Rocco</h2>
          <h3>🗓️ 10/12/25 15:30</h3>
          <p className='text-xs text-gray-400'>Mi mascota no come...</p>
        </div>

        <div className='flex gap-4'>
          <button className='bg-green-500 rounded-full cursor-pointer p-1 text-white'><Check /></button>
          <button className='bg-red-500 rounded-full cursor-pointer p-1 text-white'><X /></button>
        </div>
      </div>

      <div className='flex justify-between items-center bg-white rounded-2xl shadow-sm py-4 px-6 m-4 w-[50%]'>
        <div className='flex flex-col'>
          <h2 className='font-bold'>👨 Luz Garrido | 🐈 Kitty</h2>
          <h3>🗓️ 15/12/25 15:30</h3>
          <p className='text-xs text-gray-400'>Mi mascota mea computadoras...</p>
        </div>

        <div className='flex gap-4'>
          <button className='bg-green-500 rounded-full cursor-pointer p-1 text-white'><Check /></button>
          <button className='bg-red-500 rounded-full cursor-pointer p-1 text-white'><X /></button>
        </div>
      </div>
    </div>
  )
}

export default page