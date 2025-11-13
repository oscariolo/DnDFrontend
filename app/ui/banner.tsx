'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const characterImages = [
  '/images/character-1.png',
  '/images/character-2.png',
  '/images/character-3.png',
  '/images/character-4.png',
  '/images/character-5.png',
];

export default function Banner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % characterImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-[60vh] max-h-[80vh] overflow-hidden">
      <Image
        src="/images/background.png"
        alt="Background"
        fill
        className="object-cover absolute inset-0 w-full h-full opacity-25"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-80 h-96 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {characterImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Character ${index + 1}`}
                fill
                className={`object-cover absolute inset-0 rounded-lg transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-50' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-4">
        <Image src="/images/logo.png" alt="D&D Maker Logo" width={100} height={100} className="mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-2xl text-center px-4 mb-6">
          Forge your worlds, create your legends.
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link
            href="/characters/builder"
            className="px-8 py-3 bg-[#E40712] hover:opacity-90 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg text-center"
          >
            Create Character
          </Link>
          <Link
            href="/campaign"
            className="px-8 py-3 bg-[#E40712] hover:opacity-90 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg text-center"
          >
            Create Campaign
          </Link>
        </div>
      </div>
    </div>
  );
}