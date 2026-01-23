"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { MdGroups, MdPersonOff, MdChevronRight, MdMenuBook, MdHistoryEdu } from "react-icons/md";

// Mock para simular usuarios y personajes
const mockUser = {
  id: "user-001",
  name: "S4NT1EC",
  avatar: "/images/Avatar1.png",
};

const mockCharacters = [
  {
    id: 1,
    name: "Dwarf Cleric",
    race: "Dwarf",
    class: "Cleric",
    level: 1,
    owner: mockUser.name,
    ownerId: mockUser.id,
    avatar: "/images/Avatar1.png",
    assigned: true,
    deactivated: false,
    invited: false,
  },
  {
    id: 2,
    name: "Resonick's Char",
    race: "Orc",
    class: "Barbarian",
    level: 1,
    owner: "Resonick",
    ownerId: "user-002",
    avatar: "/images/Avatar1.png",
    assigned: true,
    deactivated: false,
    invited: true,
  },
  {
    id: 3,
    name: "Elven Ranger",
    race: "Elf",
    class: "Ranger",
    level: 1,
    owner: mockUser.name,
    ownerId: mockUser.id,
    avatar: "/images/Avatar1.png",
    assigned: false,
    deactivated: false,
    invited: false,
  },
  {
    id: 4,
    name: "Orc Rogue",
    race: "Orc",
    class: "Rogue",
    level: 1,
    owner: "Resonick",
    ownerId: "user-002",
    avatar: "/images/Avatar1.png",
    assigned: false,
    deactivated: true,
    invited: true,
  },
];

// Función mock para recuperar usuarios del backend (listo para implementar)
export async function getUsersFromBackend() {
  return [
    { id: "user-001", name: "S4NT1EC", avatar: "/images/Avatar1.png" },
    { id: "user-002", name: "Resonick", avatar: "/images/Avatar1.png" },
  ];
}

export default function PlayPage() {
  const params = useParams();
  const campaignId = params.mycampaignid;

  if (campaignId !== "1") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-body">
        <h2 className="text-3xl font-bold mb-4">Campaña no encontrada</h2>
        <p className="text-lg text-gray-600">No existe una campaña con el id <span className="font-mono">{campaignId}</span>.</p>
      </div>
    );
  }

  const [characters, setCharacters] = useState(mockCharacters);

  // Separar personajes del usuario dueño y de invitados
  const isOwner = (char: any) => char.ownerId === mockUser.id && !char.invited;
  const isInvited = (char: any) => char.invited && char.ownerId !== mockUser.id;

  // Activos
  const activeOwnerCharacters = characters.filter((c) => isOwner(c) && c.assigned && !c.deactivated);
  const activeInvitedCharacters = characters.filter((c) => isInvited(c) && c.assigned && !c.deactivated);

  // No asignados (solo del dueño)
  const unassignedOwnerCharacters = characters.filter((c) => isOwner(c) && !c.assigned && !c.deactivated);

  // Desactivados (solo invitados)
  const deactivatedInvitedCharacters = characters.filter((c) => isInvited(c) && c.deactivated);

  // Acciones para personajes del dueño
  const handleUnassign = (id: number) => {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, assigned: false } : c
      )
    );
  };
  const handleAssign = (id: number) => {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, assigned: true } : c
      )
    );
  };
  const handleDelete = (id: number) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  // Acciones para personajes invitados
  const handleDeactivate = (id: number) => {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, assigned: false, deactivated: true } : c
      )
    );
  };
  const handleActivate = (id: number) => {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, assigned: true, deactivated: false } : c
      )
    );
  };
  const handleDeleteInvited = (id: number) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="font-body bg-[#fdfcf9] min-h-screen text-[#242527]">
      {/* Fondo papel */}
      <div className="fixed inset-0 pointer-events-none opacity-50 z-0" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb y acciones */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded px-3 py-2 shadow-sm">
            <div className="bg-red-600 text-white font-bold w-6 h-6 flex items-center justify-center rounded-sm text-xs">B</div>
            <MdChevronRight className="text-gray-400 text-xl" />
            <Link href="/my-campaigns" className="text-xs font-bold text-gray-700 uppercase tracking-wide hover:underline">
              Campañas
            </Link>
            <MdChevronRight className="text-gray-400 text-xl" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Prisoner 13</span>
          </div>
        </div>

        {/* Título y acción principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-[#0b87da] pb-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-0">Prisoner 13</h1>
          <div className="flex gap-2">
            <button className="bg-[#0b87da] hover:bg-[#0866a8] text-white text-sm font-bold py-2 px-4 rounded shadow flex items-center gap-2 uppercase transition">
              <MdMenuBook className="text-lg" /> Launch VTT
            </button>
          </div>
        </div>

        {/* Imagen y descripción de campaña */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md mb-4 relative group">
              <Image
                alt="Dark fantasy landscape"
                src="/images/DefaultCampaign.png"
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
                style={{ objectPosition: "center" }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            </div>
            <p className="text-gray-700 leading-relaxed text-sm bg-white rounded-lg p-4 shadow">
              Sumérgete en el mundo de la aventura. Tu misión: infiltrar la prisión Revel's End y contactar a un prisionero muy especial. El tiempo corre, así que reúne a tu grupo, toma tus herramientas y prepárate para el golpe definitivo.
            </p>
          </div>
          <div className="flex flex-col justify-start">
            <div className="border border-dashed border-[#0b87da] bg-blue-50 rounded p-6 text-center mb-4">
              <h4 className="text-[#0b87da] font-bold uppercase text-xs mb-2 tracking-wide">Invitar jugadores</h4>
              <div className="bg-white border border-gray-300 rounded p-2 mb-2 break-all text-xs text-gray-600 font-mono select-all">
                https://www.dndbeyond.com/campaigns/join/73172762630902240
              </div>
              <p className="text-gray-600 text-xs mb-4">Comparte este enlace para que otros jugadores se unan.</p>
              <div className="flex justify-center gap-4 text-xs font-bold uppercase tracking-wider">
                <button className="bg-[#0b87da]/10 hover:bg-[#0b87da]/20 text-[#0b87da] py-1 px-3 rounded transition">Copiar enlace</button>
                <button className="text-gray-500 hover:text-gray-700 transition">Resetear</button>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-gray-300">B</div>
              <div>
                <h3 className="text-base font-bold text-gray-900">S4NT1EC</h3>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Dungeon Master</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Columna principal */}
          <div className="flex-1 w-full">
            {/* Personajes activos del usuario */}
            <hr className="border-gray-300 mb-8" />
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MdGroups className="text-[#0b87da] text-2xl inline-block mr-2" />
                    Personajes activos (tuyos)
                  </h2>
                  <p className="text-gray-600 text-xs mt-1 font-bold">Tus personajes activos en esta campaña.</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{activeOwnerCharacters.length} Activos</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeOwnerCharacters.map((char) => (
                  <div key={char.id} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 flex flex-col group hover:border-[#0b87da] transition-colors duration-200">
                    <div className="relative h-28 bg-gray-800 overflow-hidden">
                      <div className="absolute inset-0 opacity-40" />
                      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent z-10" />
                      <div className="relative z-20 p-4 flex items-center gap-4 h-full">
                        <Image
                          alt="Character Portrait"
                          src={char.avatar}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded border-2 border-green-500 object-cover bg-gray-700 shadow-lg"
                        />
                        <div>
                          <h3 className="text-white text-lg font-bold leading-tight">{char.name}</h3>
                          <p className="text-gray-300 text-xs mt-1 font-display uppercase tracking-wide">
                            Lvl {char.level} | {char.race} | {char.class}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Jugador: <span className="text-white font-semibold">{char.owner}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex divide-x divide-gray-200 border-t border-gray-200 bg-gray-50">
                      <button className="flex-1 py-2 text-gray-600 text-xs font-bold uppercase hover:bg-white hover:text-[#0b87da] transition">Ver {/* TODO */}</button>
                      <button className="flex-1 py-2 text-gray-600 text-xs font-bold uppercase hover:bg-white hover:text-[#0b87da] transition">Editar {/* TODO */}</button>
                      <button
                        className="flex-1 py-2 text-yellow-600 text-xs font-bold uppercase hover:bg-white transition"
                        onClick={() => handleUnassign(char.id)}
                      >
                        Desasignar
                      </button>
                      <button
                        className="flex-1 py-2 text-red-600 text-xs font-bold uppercase hover:bg-white transition"
                        onClick={() => handleDelete(char.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personajes activos de invitados */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MdGroups className="text-[#0b87da] text-2xl inline-block mr-2" />
                    Personajes activos (invitados)
                  </h2>
                  <p className="text-gray-600 text-xs mt-1 font-bold">Personajes de usuarios invitados activos en esta campaña.</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{activeInvitedCharacters.length} Activos</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeInvitedCharacters.map((char) => (
                  <div key={char.id} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 flex flex-col group hover:border-[#0b87da] transition-colors duration-200">
                    <div className="relative h-28 bg-gray-800 overflow-hidden">
                      <div className="absolute inset-0 opacity-40" />
                      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent z-10" />
                      <div className="relative z-20 p-4 flex items-center gap-4 h-full">
                        <Image
                          alt="Character Portrait"
                          src={char.avatar}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded border-2 border-green-500 object-cover bg-gray-700 shadow-lg"
                        />
                        <div>
                          <h3 className="text-white text-lg font-bold leading-tight">{char.name}</h3>
                          <p className="text-gray-300 text-xs mt-1 font-display uppercase tracking-wide">
                            Lvl {char.level} | {char.race} | {char.class}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Jugador: <span className="text-white font-semibold">{char.owner}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex divide-x divide-gray-200 border-t border-gray-200 bg-gray-50">
                      <button className="flex-1 py-2 text-gray-600 text-xs font-bold uppercase hover:bg-white hover:text-[#0b87da] transition">Ver {/* TODO */}</button>
                      <button
                        className="flex-1 py-2 text-yellow-600 text-xs font-bold uppercase hover:bg-white transition"
                        onClick={() => handleDeactivate(char.id)}
                      >
                        Desactivar
                      </button>
                      <button
                        className="flex-1 py-2 text-red-600 text-xs font-bold uppercase hover:bg-white transition"
                        onClick={() => handleDeleteInvited(char.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personajes no asignados del usuario */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-500 flex items-center gap-2">
                    <MdPersonOff className="text-gray-400 text-2xl inline-block mr-2" />
                    Tus personajes no asignados
                  </h2>
                  <p className="text-gray-500 text-xs mt-1">Tus personajes disponibles que no están en la sesión.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {unassignedOwnerCharacters.map((char) => (
                  <div key={char.id} className="bg-gray-50 shadow-sm rounded-lg overflow-hidden border border-gray-300 flex flex-col opacity-90 hover:opacity-100 transition">
                    <div className="relative h-20 bg-gray-200 overflow-hidden flex items-center pl-4 gap-4">
                      <Image
                        alt="Character Portrait"
                        src={char.avatar}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-gray-800 text-base font-bold leading-tight">{char.name}</h3>
                        <p className="text-gray-500 text-xs mt-0.5 font-display uppercase tracking-wide">
                          Lvl {char.level} | {char.race} | {char.class}
                        </p>
                      </div>
                    </div>
                    <div className="flex divide-x divide-gray-200 border-t border-gray-200 bg-white">
                      <button className="flex-1 py-2 text-gray-500 text-xs font-bold uppercase hover:bg-gray-100 transition">Ver {/* TODO */}
                      </button>
                      <button className="flex-1 py-2 text-gray-600 text-xs font-bold uppercase hover:bg-white hover:text-[#0b87da] transition">Editar {/* TODO */}
                      </button>
                      <button
                        className="flex-1 py-2 text-white bg-[#0b87da] hover:bg-[#0866a8] text-xs font-bold uppercase transition"
                        onClick={() => handleAssign(char.id)}
                      >
                        Asignar
                      </button>
                      <button
                        className="flex-1 py-2 text-red-600 text-xs font-bold uppercase hover:bg-white transition"
                        onClick={() => handleDelete(char.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personajes desactivados de invitados */}
            {deactivatedInvitedCharacters.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-500 flex items-center gap-2">
                      <MdPersonOff className="text-gray-400 text-2xl inline-block mr-2" />
                      Personajes Desactivados (invitados)
                    </h2>
                    <p className="text-gray-500 text-xs mt-1">
                      Estos jugadores no ocupan ninguna de tus plazas de jugador. Desactivarlos es una excelente manera de eliminar a un jugador durante un tiempo, pero reactivarlos más tarde.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {deactivatedInvitedCharacters.map((char) => (
                    <div key={char.id} className="bg-gray-50 shadow-sm rounded-lg overflow-hidden border border-gray-300 flex flex-col opacity-90 hover:opacity-100 transition">
                      <div className="relative h-20 bg-gray-200 overflow-hidden flex items-center pl-4 gap-4">
                        <Image
                          alt="Character Portrait"
                          src={char.avatar}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-gray-800 text-base font-bold leading-tight">{char.name}</h3>
                          <p className="text-gray-500 text-xs mt-0.5 font-display uppercase tracking-wide">
                            Lvl {char.level} | {char.race} | {char.class}
                          </p>
                        </div>
                      </div>
                      <div className="flex divide-x divide-gray-200 border-t border-gray-200 bg-white">
                        <button className="flex-1 py-2 text-gray-500 text-xs font-bold uppercase hover:bg-gray-100 transition">Ver {/* TODO */}</button>
                        <button
                          className="flex-1 py-2 text-white bg-[#0b87da] hover:bg-[#0866a8] text-xs font-bold uppercase transition"
                          onClick={() => handleActivate(char.id)}
                        >
                          Activar
                        </button>
                        <button
                          className="flex-1 py-2 text-red-600 text-xs font-bold uppercase hover:bg-white transition"
                          onClick={() => handleDeleteInvited(char.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acciones finales */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 border-t border-[#0b87da]/20 pt-8 justify-center items-center">
              <Link href="/characters/builder/class">
                <button className="flex-1 border-2 border-[#0b87da] text-[#0b87da] hover:bg-blue-50 text-sm font-bold uppercase py-3 px-6 rounded transition text-center flex items-center justify-center gap-2">
                  Crear personaje
                </button>
              </Link>
              <Link href="/characters#destacados">
                <button className="flex-1 bg-[#0b87da] hover:bg-[#0866a8] text-white text-sm font-bold uppercase py-3 px-6 rounded shadow transition text-center flex items-center justify-center gap-2">
                  Crear personaje predefinido
                </button>
              </Link>
            </div>
          </div>

          {/* Game Log */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-4 h-[600px] flex flex-col bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider flex items-center gap-2">
                <MdHistoryEdu className="text-gray-500 text-sm" /> Game Log
              </h3>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
              <div className="text-center my-4">
                <span className="bg-gray-200 text-gray-600 text-[10px] uppercase font-bold px-2 py-1 rounded-full">Session Started</span>
              </div>
              {/* Mensajes de ejemplo */}
              <div className="flex gap-2 items-start">
                <div className="w-8 h-8 rounded bg-gray-800 border border-gray-600 shrink-0 overflow-hidden">
                  <Image 
                  className="w-full h-full object-cover" 
                  src={mockUser.avatar} 
                  width={32} 
                  height={32} 
                  alt="avatar" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-[#0b87da]">Dwarf Cleric</span>
                    <span className="text-[10px] text-gray-400">10:42 AM</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-snug">Reviso la puerta en busca de trampas.</p>
                </div>
              </div>
              <div className="ml-10 bg-gray-100 rounded border border-gray-200 p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-600 uppercase">Investigación</span>
                  <span className="text-xs font-bold text-gray-400">DC 12</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-purple-600 text-sm">casino</span>
                  <span className="font-bold text-lg text-purple-700">15</span>
                  <span className="text-xs text-green-600 font-bold uppercase">(Éxito)</span>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <div className="w-8 h-8 rounded-full bg-black border border-gray-600 shrink-0 flex items-center justify-center text-white text-[10px] font-bold">DM</div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-red-600">DM</span>
                    <span className="text-[10px] text-gray-400">10:44 AM</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-snug italic">El mecanismo hace clic suavemente. Parece seguro abrirla.</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <div className="w-8 h-8 rounded bg-gray-800 border border-gray-600 shrink-0 overflow-hidden">
                  <Image 
                    className="w-full h-full object-cover" 
                    src="/images/Avatar1.png" 
                    width={32} 
                    height={32} 
                    alt="avatar" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-[#0b87da]">Resonick</span>
                    <span className="text-[10px] text-gray-400">10:45 AM</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-snug">¡Por fin! La abro de una patada.</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="relative">
                <input className="w-full bg-gray-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-[#0b87da] placeholder-gray-500" placeholder="Escribe un mensaje..." type="text" />
                <button className="absolute right-1 top-1 p-1 text-[#0b87da] hover:text-[#0866a8] transition rounded-full">
                  <span className="material-icons text-lg">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}