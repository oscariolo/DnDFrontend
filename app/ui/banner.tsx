'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

const characterImages = [
  '/images/character-1.png',
  '/images/character-2.png',
  '/images/character-3.png',
  '/images/character-4.png',
  '/images/character-5.png',
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="bg-[#090809] relative w-screen h-[70vh] sm:h-[65vh] lg:h-[70vh] min-h-[480px] overflow-hidden">
      <Image
        src="/images/background.png"
        alt="Background"
        fill
        className="object-cover object-center absolute inset-0 w-full h-full opacity-25"
        priority
        sizes="100vw"
      />

      <div className="absolute inset-0 flex items-center justify-center pt-8 sm:pt-0">
        <div className="relative w-full max-w-5xl px-4">
          <Splide
            options={{
              type: 'loop',
              perPage: 3,
              focus: 'center',
              pagination: false,
              arrows: false,
              gap: '2rem',
              autoplay: true,
              interval: 4000,
              breakpoints: {
                640: { perPage: 1, gap: '1rem' },
                768: { perPage: 2, gap: '1.25rem' },
              },
            }}
            onMove={(splide: any) => {
              const len = characterImages.length;
              const normalized = ((splide.index % len) + len) % len;
              setCurrent(normalized);
            }}
            onMoved={(splide: any) => {
              const len = characterImages.length;
              const normalized = ((splide.index % len) + len) % len;
              setCurrent(normalized);
            }}
          >
            {characterImages.map((image, index) => {
              const len = characterImages.length;
              const isActive = index === current;
              const isNext = index === (current + 1) % len;
              const isPrev = index === (current - 1 + len) % len;

              // Bigger + higher opacity on mobile
              let sizeClass =
                'aspect-[3/4] w-64 object-contain sm:object-cover opacity-30 transition-all duration-300';

              if (isPrev || isNext) {
                sizeClass =
                  'aspect-[3/4] w-72 sm:w-80 sm:h-[24rem] object-contain sm:object-cover opacity-30 transition-all duration-300';
              }
              if (isActive) {
                sizeClass =
                  'aspect-[3/4] w-80 sm:w-[26rem] sm:h-[32rem] object-contain sm:object-cover opacity-60 drop-shadow-xl transition-all duration-300';
              }

              return (
                <SplideSlide key={index}>
                  <div className="flex items-center justify-center">
                    <img
                      src={image}
                      alt={`Character ${index + 1}`}
                      className={sizeClass}
                      loading="lazy"
                    />
                  </div>
                </SplideSlide>
              );
            })}
          </Splide>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-4 pointer-events-none">
        <Image
          src="/images/logo.png"
          alt="D&D Maker Logo"
          width={100}
          height={100}
          className="mb-4 sm:mb-6 pointer-events-auto"
          priority
        />
        <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-2xl text-center px-2 sm:px-4 mb-4 sm:mb-6">
          Forge your worlds, create your legends.
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pointer-events-auto">
          <Link
            href="/characters/builder"
            className="px-8 sm:px-10 py-4 bg-[#E40712] hover:opacity-90 text-white font-bold rounded-xl transition-colors duration-200 shadow-lg text-base sm:text-xl tracking-wide"
          >
            Create Character
          </Link>
          <Link
            href="/campaign"
            className="px-8 sm:px-10 py-4 bg-[#E40712] hover:opacity-90 text-white font-bold rounded-xl transition-colors duration-200 shadow-lg text-base sm:text-xl tracking-wide"
          >
            Create Campaign
          </Link>
        </div>
      </div>
    </div>
  );
}