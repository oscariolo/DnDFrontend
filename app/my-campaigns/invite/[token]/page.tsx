"use client";

import ConfirmDialog from "@/app/shared/components/ConfirmDialog";
import { useState } from "react";
import { MdPerson2, MdAdd, MdShield, MdCheck } from "react-icons/md";

// Mock de campaña
const mockCampaign = {
  id: "1",
  name: "The Shadow Over Waterdeep",
  image: "", // Si está vacío, se usará la imagen por defecto
  description: "La ciudad de los esplendores esconde un oscuro secreto bajo sus muelles. Los héroes son convocados para descubrir la verdad antes de que el eclipse sumerja los reinos en la noche eterna.",
  dm: "Aethelred",
  players: "4 / 6 Plazas",
};

const campaignImage = mockCampaign.image || "/images/DefaultCampaign.png";

// Mock de personajes
const mockCharacters = [
  {
    id: 1,
    name: "Tharivol",
    race: "Elfo",
    class: "Explorador",
    level: 5,
    avatar: "/images/Avatar1.png",
    attributes: [
      { label: "ROB", value: 10 }, // Robustez
      { label: "INT", value: 18 }, // Inteligencia
      { label: "FUE", value: 12 }, // Fuerza
      { label: "DES", value: 15 }, // Destreza
      { label: "CAR", value: 13 }, // Carisma
      { label: "SAB", value: 14 }, // Sabiduría
    ],
  },
  {
    id: 2,
    name: "Grog",
    race: "Medio-Orco",
    class: "Bárbaro",
    level: 3,
    avatar: "/images/char-grog.png",
    attributes: [
      { label: "ROB", value: 18 },
      { label: "INT", value: 12 },
      { label: "FUE", value: 16 },
      { label: "DES", value: 11 },
      { label: "CAR", value: 8 },
      { label: "SAB", value: 10 },
    ],
  },
  {
    id: 3,
    name: "Valerius",
    race: "Humano",
    class: "Paladín",
    level: 4,
    avatar: "/images/char-valerius.png",
    attributes: [
      { label: "ROB", value: 16 },
      { label: "INT", value: 10 },
      { label: "FUE", value: 14 },
      { label: "DES", value: 12 },
      { label: "CAR", value: 16 },
      { label: "SAB", value: 13 },
    ],
  },
  {
    id: 4,
    name: "Valerius",
    race: "Humano",
    class: "Paladín",
    level: 4,
    avatar: "/images/char-valerius.png",
    attributes: [
      { label: "ROB", value: 16 },
      { label: "INT", value: 10 },
      { label: "FUE", value: 14 },
      { label: "DES", value: 12 },
      { label: "CAR", value: 16 },
      { label: "SAB", value: 13 },
    ],
  },
];

function getAttributeBarHeight(value: number) {
  // Suponiendo que el valor máximo de atributo es 20
  const max = 20;
  const minHeight = 16; // px
  const maxHeight = 48; // px
  return `${minHeight + ((value / max) * (maxHeight - minHeight))}px`;
}

export default function CampaignInvitePage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSelect, setPendingSelect] = useState<number | null>(null);

  function handleConfirm() {
    setShowConfirm(false);
    setSelected(pendingSelect);
    // Aquí puedes hacer la lógica para unir al usuario y redirigir a la pantalla de espera
  }

  function handleCancel() {
    setShowConfirm(false);
    setPendingSelect(null);
  }

  return (
    <div className="bg-[#f6f8f8] text-[#2b2218] min-h-screen bg-repeat font-body">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Banner campaña */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-white mb-10 border border-[#d4c5a9]">
          <div
            className="h-48 md:h-64 w-full bg-cover bg-center relative"
            style={{ backgroundImage: `url('${campaignImage}')` }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:left-10 text-white z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#1fadad]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Invitación</span>
                <span className="text-white/80 text-xs uppercase tracking-wide flex items-center gap-1">
                  <MdPerson2 className="text-sm" /> DM {mockCampaign.dm}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white shadow-black drop-shadow-md">{mockCampaign.name}</h1>
            </div>
          </div>
          <div className="bg-white p-6 md:px-10 flex flex-col md:flex-row gap-6 md:items-center justify-between border-t border-[#1fadad]/20">
            <div className="flex-1">
              <p className="text-[#2b2218]/80 italic font-serif text-lg leading-relaxed">
                {mockCampaign.description}
              </p>
            </div>
            <div className="flex gap-6 text-sm font-semibold uppercase tracking-wide text-[#2b2218]/60 shrink-0 border-l border-gray-200 pl-6 md:border-l-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#2b2218]/40">Jugadores</span>
                <span className="text-[#1fadad]">{mockCampaign.players}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selección de personaje */}
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-[#2b2218]">Selecciona tu personaje</h2>
            <p className="text-[#2b2218]/60 text-sm mt-1">Elige un héroe existente para vincular a esta campaña.</p>
          </div>
        </div>
        <div className="mb-12">
          <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
            {mockCharacters.map((char) => (
              <div key={char.id} className="group relative min-w-[270px] max-w-[270px] shrink-0">
                <input
                  className="peer sr-only"
                  name="character_select"
                  type="radio"
                  checked={selected === char.id}
                  readOnly
                />
                <div className={`bg-white rounded-lg overflow-hidden border border-[#5cc9c9] shadow-sm hover:shadow-md transition-all h-full flex flex-col ${selected === char.id ? "ring-2 ring-[#1fadad] border-[#1fadad]" : ""}`}>
                  <div className="h-48 bg-cover bg-top relative" style={{ backgroundImage: `url('${char.avatar}')` }}>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60"></div>
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <MdShield className="text-sm text-[#1fadad]" /> Lvl {char.level}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col grow relative">
                    <div className={`absolute -top-3 right-4 bg-[#1fadad] text-white rounded-full p-1 shadow-lg transform ${selected === char.id ? "scale-100" : "scale-0"} transition-transform duration-200`}>
                      <MdCheck className="text-lg" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#2b2218] truncate">{char.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#2b2218]/50 mb-3">{char.race} {char.class}</p>
                    <div className="flex justify-between items-end gap-1 mb-4">
                      {char.attributes.map((attr) => (
                        <div key={attr.label} className="flex flex-col items-center w-8">
                          <div
                            className="w-3 rounded bg-[#1fadad] mb-1 transition-all"
                            style={{
                              height: getAttributeBarHeight(attr.value),
                              minHeight: "16px",
                              maxHeight: "48px",
                            }}
                            title={`${attr.label}: ${attr.value}`}
                          />
                          <span className="text-[10px] font-bold text-[#2b2218]">{attr.value}</span>
                          <span className="text-[10px] text-[#2b2218]/60 font-bold">{attr.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        className={`w-full text-center py-2 rounded border border-[#1fadad]/20 text-[#1fadad] text-xs font-bold uppercase tracking-wider group-hover:bg-[#1fadad] group-hover:text-white transition-colors ${selected === char.id ? "bg-[#1fadad] text-white" : ""}`}
                        onClick={() => {
                          setPendingSelect(char.id);
                          setShowConfirm(true);
                        }}
                        disabled={selected === char.id}
                      >
                        {selected === char.id ? "Seleccionado" : "Seleccionar"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Botón para crear nuevo personaje */}
            <button className="group min-w-[270px] max-w-[270px] h-full min-h-[340px] bg-white/50 border-2 border-dashed border-[#1fadad] rounded-lg flex flex-col items-center justify-center p-6 hover:border-[#1fadad]/60 hover:bg-white/80 transition-all text-[#1fadad]/90 hover:text-[#1fadad] shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#1fadad]/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MdAdd className="text-3xl" /> 
              </div>
              <span className="font-display font-bold text-lg">Crear Nuevo</span>
              <span className="text-xs mt-2 text-center max-w-[150px]">Forja un nuevo héroe para esta aventura</span>
            </button>
          </div>
        </div>

        <ConfirmDialog
          open={showConfirm}
          message="¿Estás seguro de que quieres seleccionar este personaje para la campaña? Esta acción no se puede deshacer."
          confirmText="Sí, seleccionar"
          cancelText="Cancelar"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}