"use client";

import Link from "next/link";
import { useRef } from "react";

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

  const fantasyGradientText = "bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-900 to-black";

  const scrollToCreateCampaign = () => {
    createCampRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    createCampRef.current?.classList.add('ring-4', "ring-fuchsia-500", "scale-105");
    setTimeout(() => {
      createCampRef.current?.classList.remove('ring-4', "ring-fuchsia-500", "scale-105");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#f7f7e3] px-2 md:px-0 pb-16">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className={`text-4xl md:text-6xl font-extrabold mb-4 ${fantasyGradientText}`}>Campañas Populares</h1>
          <p className="text-xl text-gray-400">
            Explora campañas creadas por la comunidad o crea la tuya propia.
          </p>
        </header>

        {/* Tarjeta Crear Campaña */}
        <section className="mb-20 flex justify-center">
          <div ref={createCampRef} className="bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-fuchsia-900/40 hover:scale-[1.02] max-w-xl w-full">
            <div className="p-4 bg-gray-700 rounded-full mb-4">
              <svg className="w-10 h-10 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Crea tu Campaña</h2>
            <p className="text-gray-400 mb-6">
              Diseña mundos épicos, tramas intrigantes y desafíos mortales. Conviértete en el Dungeon Master que guía la historia y da vida a la aventura para tus jugadores.
            </p>
            <Link href="/campaign/builder">
              <button className="mt-auto w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                Empezar Nueva Campaña
              </button>
            </Link>
          </div>
        </section>

        {/* Campañas Populares */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center fantasy-gradient-text">Campañas de la Comunidad</h2>
          <div className="relative">
            <div className="flex overflow-x-auto space-x-6 pb-6 scroll-container">  
              {campaigns.map((c) => (
                <div key={c.id} className="flex-shrink-0 w-80 bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:shadow-lg hover:scale-105">
                  <h3 className="text-xl font-bold mb-2 text-white">{c.title}</h3>
                  <div className="h-32 bg-gray-700 rounded-md mb-4 flex items-center justify-center text-gray-500">
                    <img src={c.img} alt={c.title} className="rounded-t-xl h-36 object-cover" />
                  </div>
                  <p className="text-sm text-gray-400">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Botón para hacer scroll a crear campaña */}
        <div className="text-center mt-16">
          <button
            className="w-full md:w-auto bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
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