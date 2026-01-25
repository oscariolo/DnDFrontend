"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllCampaigns } from "../lib/services/campaingServices";
import { urlToFile, saveZoneImage } from "@/app/lib/utils/db";

const DEFAULT_IMG = "/images/campaign1.jpg";

export default function CampaignPage() {
  const [communityCampaigns, setCommunityCampaigns] = useState<any[]>([]);
  const router = useRouter();
  const createCampRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllCampaigns().then(setCommunityCampaigns).catch(() => setCommunityCampaigns([]));
  }, []);

  const fantasyGradientText = "bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-900 to-black";

  const scrollToCreateCampaign = () => {
    createCampRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    createCampRef.current?.classList.add('ring-4', "ring-fuchsia-500", "scale-105");
    setTimeout(() => {
    createCampRef.current?.classList.remove('ring-4', "ring-fuchsia-500", "scale-105");
    }, 1000);
  };
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.classList.add("cursor-grabbing");
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDown = false;
    const carousel = carouselRef.current;
    if (carousel) carousel.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    isDown = false;
    const carousel = carouselRef.current;
    if (carousel) carousel.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const carousel = carouselRef.current;
    if (carousel) {
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5; // velocidad de arrastre
      carousel.scrollLeft = scrollLeft - walk;
    }
  };

  const handleUseCampaign = async (campaign: any) => {
    const basicInfo = {
      name: campaign.name,
      description: campaign.description,
      numberOfPlayers: campaign.maxPlayers,
    };

    // Descarga imágenes y guárdalas en IndexedDB
    await Promise.all(
      (campaign.campaignZones || []).map(async (zone: any, idx: number) => {
        if (zone.zoneImgUrls && zone.zoneImgUrls.length > 0) {
          const url = zone.zoneImgUrls[0];
          const file = await urlToFile(url, `zone_${idx}.jpg`, "image/jpeg");
          await saveZoneImage(`${Date.now()}_${idx}`, 0, file);
        }
      })
    );

    localStorage.setItem("campaignBasicInfo", JSON.stringify(basicInfo));
    localStorage.setItem("campaignZones", JSON.stringify(
      campaign.campaignZones?.map((zone: any, idx: number) => ({
        id: `${Date.now()}_${idx}`,
        name: zone.zoneName,
        description: zone.description,
        images: [], // Las imágenes estarán en IndexedDB
      })) || []
    ));
    router.push("/campaign/builder/basicInfo");
  };

  return (
    <main className="min-h-screen px-2 md:px-0 pb-4 overflow-x-hidden">
      {/* Header */}
      <header className="text-center mb-10 py-5">
        <h1 className={`text-4xl md:text-6xl font-extrabold mb-4 ${fantasyGradientText}`}>Campañas Populares</h1>
        <p className="text-xl text-gray-400">
          Explora campañas creadas por la comunidad o crea la tuya propia.
        </p>
      </header>
      {/* Banner fuera del container */}
      <section className="mb-10 flex justify-center">
        <div className="relative w-screen h-[60vh] max-h-[80vh] flex items-center justify-center overflow-hidden shadow-xl">
          {/* Fondo tipo banner */}
          <Image
            src="/images/background.png"
            alt="Background"
            fill
            className="object-cover absolute inset-0 w-full h-full"
            priority
          />
          {/* Contenido */}
          <div
            ref={createCampRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 px-4"
          >
            <h2 className="text-5xl text-white mb-4 drop-shadow-2xl text-center">
              Crea tu Campaña
            </h2>
            <p className="text-2xl text-gray-200 mb-6 text-center max-w-xl">
              Diseña mundos épicos, tramas intrigantes y desafíos mortales. Conviértete en el Dungeon Master que guía la historia y da vida a la aventura para tus jugadores.
            </p>
            <Link href="/campaign/builder/basicInfo">
              <button className="mt-auto w-full md:w-auto bg-[#e40712] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Empezar Nueva Campaña
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* El resto del contenido sí va dentro del container */}
      <div className="container mx-auto px-4 py-1 max-w-7xl">
        {/* Carrusel de campañas de la comunidad */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-10 text-center">Campañas de la Comunidad</h2>
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex overflow-x-auto space-x-6 pb-6 scroll-container cursor-grab select-none"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {communityCampaigns.map((c) => {
                // Busca la primera imagen de cualquier zona
                let img = DEFAULT_IMG;
                for (const zone of c.campaignZones || []) {
                  if (zone.zoneImgUrls && zone.zoneImgUrls.length > 0) {
                    img = zone.zoneImgUrls[0];
                    break;
                  }
                }
                return (
                  <div key={c.id} className="shrink-0 w-80 bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">{c.name}</h3>
                      <div className="relative h-32 bg-gray-700 rounded-md mb-4 flex items-center justify-center text-gray-500">
                        <Image fill 
                        src={img} 
                        alt={c.name} 
                        className="rounded-t-xl h-32 object-cover" />
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{c.description.length > 120 
                      ? c.description.substring(0, 120) + "..." 
                      : c.description}</p>
                    </div>
                    <button
                      className="mt-4 w-full bg-[#e40712] hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow"
                      onClick={() => handleUseCampaign(c)}
                    >
                      Usar campaña
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
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