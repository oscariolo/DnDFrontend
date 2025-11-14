"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Image from "next/image";

// Datos ficticios de campañas
const campaigns = [
  { id: 1, img:"/campaign1.png", title: "Campaign One", description: "Description for Campaign One" },
  { id: 2, img:"/campaign2.png", title: "Campaign Two", description: "Description for Campaign Two" },
  { id: 3, img:"/campaign3.png", title: "Campaign Three", description: "Description for Campaign Three" },
  { id: 4, img:"/campaign4.png", title: "Campaign Four", description: "Description for Campaign Four" },
  { id: 5, img:"/campaign5.png", title: "Campaign Five", description: "Description for Campaign Five" },
];

export default function CampaignPage() {
  const createCampRef = useRef<HTMLDivElement>(null);
  const [showCommunityGrid, setShowCommunityGrid] = useState(false);

  const fantasyGradientText = "bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-900 to-black";

  const scrollToCreateCampaign = () => {
    createCampRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    createCampRef.current?.classList.add('ring-4', "ring-fuchsia-500", "scale-105");
    setTimeout(() => {
      createCampRef.current?.classList.remove('ring-4', "ring-fuchsia-500", "scale-105");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#f7f7e3] px-2 md:px-0 pb-16 overflow-x-hidden">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className={`text-4xl md:text-6xl font-extrabold mb-4 ${fantasyGradientText}`}>Campañas Populares</h1>
          <p className="text-xl text-gray-400">
            Explora campañas creadas por la comunidad o crea la tuya propia.
          </p>
        </header>

        {/* Tarjeta Crear Campaña estilo banner */}
        <section className="mb-20 flex justify-center">
          <div className="relative w-screen h-[60vh] max-h-[80vh] flex items-center justify-center overflow-hidden shadow-xl">
            {/* Fondo tipo banner */}
            <Image
              src="/images/background.png"
              alt="Background"
              fill
              className="object-cover absolute inset-0 w-full h-full"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-80 h-96 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Image
                    src="/campaign1.png"
                    alt="Campaign"
                    fill
                    className="object-cover absolute inset-0 rounded-lg opacity-50"
                  />
                </div>
              </div>
            </div>
            {/* Contenido */}
            <div
              ref={createCampRef}
              className="absolute inset-0 flex flex-col items-center justify-center z-30 px-4"
            >
              <h2 className="text-4xl text-white mb-4 drop-shadow-2xl text-center">
                Crea tu Campaña
              </h2>
              <p className="text-gray-200 mb-6 text-center max-w-xl">
                Diseña mundos épicos, tramas intrigantes y desafíos mortales. Conviértete en el Dungeon Master que guía la historia y da vida a la aventura para tus jugadores.
              </p>
              <Link href="/campaign/builder">
                <button className="mt-auto w-full md:w-auto bg-[#e40712] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Empezar Nueva Campaña
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Botón para mostrar campañas de la comunidad */}
        {!showCommunityGrid && (
          <div className="text-center mb-12">
            <button
              className="w-full md:w-auto bg-[#e40712] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => setShowCommunityGrid(true)}
            >
              Crear campaña usando la de la comunidad
            </button>
          </div>
        )}

        {/* Carrusel de campañas de la comunidad */}
        {showCommunityGrid && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Campañas de la Comunidad</h2>
            <div className="relative">
              <div className="flex overflow-x-auto space-x-6 pb-6 scroll-container">
                {campaigns.map((c) => (
                  <div key={c.id} className="flex-shrink-0 w-80 bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">{c.title}</h3>
                      <div className="h-32 bg-gray-700 rounded-md mb-4 flex items-center justify-center text-gray-500">
                        <img src={c.img} alt={c.title} className="rounded-t-xl h-32 object-cover" />
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{c.description}</p>
                    </div>
                    <button
                      className="mt-4 w-full bg-[#e40712] hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow"
                    >
                      Usar campaña
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Botón para hacer scroll a crear campaña */}
        <div className="text-center mt-16">
          <button
            className="w-full md:w-auto bg-[#e40712] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            onClick={scrollToCreateCampaign}
          >
            ¡Crea tu Campaña!
          </button>
        </div>
      </div>
      <footer className="text-center py-8 ">
        <p className="text-gray-500">D&D Hub - Un proyecto de pasión. 2025.</p>
      </footer>
      {/* Oculta el scroll horizontal del carrusel */}
      <style>{`
        .scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}