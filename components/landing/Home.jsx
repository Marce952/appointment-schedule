'use client'
import { Button } from '@heroui/react'
import React from 'react'

const Home = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-500 to-blue-700 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Gestiona tus citas
            <br />
            De manera fácil y rápida
          </h1>
          <p className="text-white/80 mb-8 max-w-md">
            Simplifica la programación de tus citas con nuestra aplicación intuitiva y eficiente.
          </p>
          <Button size="lg" radius="sm">Info!</Button>
        </div>


        <div className="relative flex justify-center">
          <img
            src="/img/home-img.jpg"
            alt="App preview"
            className="w-[260px] md:w-[320px] drop-shadow-2xl rounded-2xl transition-transform duration-300 ease-out hover:-translate-x-4 hover:-translate-y-4"
          />
        </div>
      </div>


      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white rounded-t-[100%]" />
    </section>
  )
}

export default Home