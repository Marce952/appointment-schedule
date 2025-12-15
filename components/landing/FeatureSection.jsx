'use client'
import { Button, Card, CardBody } from '@heroui/react'
import React, { useState, useEffect, useCallback } from 'react';

// --- 1. Datos de Ejemplo para el Carrusel ---
const IMAGES = [
  '/img/vet-feature.jpg',
  '/img/barber-feature.jpg',
  '/img/doctor-feature.jpg',
  '/img/dentist-feature.jpg',
  '/img/physiotherapy-feature.jpg',
];

// --- 2. Componente de Carrusel Personalizado ---
const InfiniteCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = IMAGES.length;

  const advanceCarousel = useCallback(() => {
    // Al avanzar, el índice actual pasa a ser la imagen que se mueve.
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  }, [totalImages]);

  // Loop Infinito: se ejecuta cada 3 segundos
  useEffect(() => {
    const interval = setInterval(advanceCarousel, 3000);
    return () => clearInterval(interval);
  }, [advanceCarousel]);

  const getSmallImageIndex = () => currentIndex;
  const getLargeImageIndex = () => (currentIndex + 1) % totalImages;

  // (Opcional) La imagen que acaba de salir (para controlar si se debe ocultar completamente)
  const getExitingImageIndex = () => (currentIndex - 1 + totalImages) % totalImages;


  return (
    <div className="relative w-full h-96"> {/* Aumentado el tamaño para la animación */}
      {IMAGES.map((src, index) => {
        // Determina el estado de la imagen actual
        const isSmall = index === getSmallImageIndex();
        const isLarge = index === getLargeImageIndex();
        const isExiting = index === getExitingImageIndex();

        let positionClasses = 'transition-all duration-1000 ease-in-out absolute top-1/2 -translate-y-1/2 rounded-xl object-cover';
        let imageSizeClasses = '';

        if (isSmall) {
          // Posición izquierda (pequeña)
          // Se desplaza a left-0. El w-1/3 es el tamaño final de la imagen grande cuando se mueve
          positionClasses += ' left-0 z-10 opacity-100';
          imageSizeClasses = 'w-1/3 h-56 shadow-xl'; // Tamaño más pequeño
        } else if (isLarge) {
          // Posición derecha (grande)
          // Se desplaza a left-1/2. El w-1/2 es el tamaño inicial
          positionClasses += ' left-[60%] -translate-x-1/2 z-20 opacity-100'; // Ajuste la posición derecha para que no toque el borde
          imageSizeClasses = 'w-1/2 h-72 shadow-2xl'; // Tamaño más grande
        } else {
          // Oculta las demás (fuera de pantalla a la derecha o ya ocultas)
          positionClasses += ' left-[70%] z-0 opacity-0';
          imageSizeClasses = 'w-1/2 h-72';
        }

        return (
          <img
            key={index}
            src={src}
            alt={`Carrusel ${index + 1}`}
            className={`${positionClasses} ${imageSizeClasses} transform`}
            style={{
              // Oculta completamente (display: none) las imágenes que ya salieron y están invisibles,
              // excepto la que está a punto de entrar (aunque esto es opcional)
              display: !isSmall && !isLarge && !isExiting ? 'none' : 'block',
            }}
          />
        );
      })}
    </div>
  );
};


// --- 3. Componente Principal con el Carrusel Integrado ---
const FeatureSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* INICIO: Carrusel de imágenes implementado */}
        <div>
          <InfiniteCarousel />
        </div>
        {/* FIN: Carrusel de imágenes implementado */}

        <Card shadow="none" className="border-none">
          <CardBody>
            <h2 className="text-3xl font-bold">
              Nos adaptamos a tu negocio!
            </h2>
            <h3 className="text-xl font-bold">
              Citas para todo tipo de servicios
            </h3>
            <div className='w-14 h-2 rounded-2xl bg-blue-500 mb-4'></div>
            <p className="text-gray-500 mb-6">
              Peluqueria,
              Veterinaria,
              Nutricionista,
              Doctor,
              Estetica,
              Odontologia,
              Masajista,
              Fisioterapia,
              Psicologia,
              etc
            </p>
            <Button color="primary" radius="sm">Precios</Button>
          </CardBody>
        </Card>
      </div>
    </section >
  )
}

export default FeatureSection