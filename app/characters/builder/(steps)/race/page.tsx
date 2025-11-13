"use client";

import { getFullRaceData, RaceResponse } from "@/app/lib/services/characterServices";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import RaceModal from "./detailedRacePopup";

interface RaceCardProps {
  race: RaceResponse;
  onClick: () => void;
}

function RaceCard({ race, onClick }: RaceCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center p-4 gap-4"
    >
      <div className="relative h-12 w-12 shrink-0 bg-linear-to-b from-amber-200 to-orange-300 rounded-lg">
        <Image
          src="/images/placeholdercharacter.png"
          alt={race.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-800">{race.name}</h3>
      </div>
      <div className="ml-auto">
        <ChevronRight color="#4b8ed7" strokeWidth={3} size={30} />
      </div>
    </div>
  );
}

export default function RacePage() {
  const [races, setRaces] = useState<RaceResponse[]>([]);
  const [detailRace, setDetailRace] = useState<RaceResponse | null>(null);
  const [selectedRace, setSelectedRace] = useState<RaceResponse | null>(null);
  const [showRaceList, setShowRaceList] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchRaces() {
      try {
        const data = await getFullRaceData();
        setRaces(data);
        
        // Check if race was already selected
        const savedRaceLocal = localStorage.getItem('selectedRace');
        if (savedRaceLocal) {
          const parsedRace: RaceResponse = JSON.parse(savedRaceLocal);
          setSelectedRace(parsedRace);
          setShowRaceList(false);
        }
      } catch (error) {
        console.error("Failed to load races:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRaces();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-100 p-7 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading races...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-100 p-7">
      <div className="max-w-3xl mx-auto ">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Escoge tu raza</h1>
        <p className="text-lg font-semibold text-gray-700 mb-6 text-center">
          La raza de tu personaje guía el aspecto de tu personaje y alineación con otros personajes
        </p>
        
        {showRaceList && (
          <div className="flex flex-col gap-4">
            {races.map((race) => (
              <RaceCard
                key={race.name}
                race={race}
                onClick={() => setDetailRace(race)}
              />
            ))}
          </div>
        )}

        {!showRaceList && selectedRace && (
          <RaceModal
            race={selectedRace}
            onClose={() => setShowRaceList(true)}
            onRaceSelected={() => {
              router.push('/characters/builder/attributes');
            }}
            onChangeRace={() => {
              setSelectedRace(null);
              setShowRaceList(true);
              localStorage.removeItem('selectedRace');
            }}
            isInline={true}
          />
        )}

        {detailRace && (
          <RaceModal
            race={detailRace}
            onClose={() => setDetailRace(null)}
            onRaceSelected={() => {
              setSelectedRace(detailRace);
              setShowRaceList(false);
              localStorage.setItem('selectedRace', JSON.stringify(detailRace));
              router.push('/characters/builder/attributes');
            }}
          />
        )}
      </div>
    </div>
  );
}
