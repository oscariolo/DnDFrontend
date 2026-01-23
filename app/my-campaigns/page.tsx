"use client";

import { useState } from "react";
import { MdChevronRight } from "react-icons/md";

const mockCampaigns = [
  {
    id: "1",
    name: "Prisoner 13",
    startDate: "12/24/2025",
    players: 0,
    role: "Dungeon Master",
    active: true,
  },
  {
    id: "2",
    name: "Lost Mines",
    startDate: "01/10/2026",
    players: 3,
    role: "Dungeon Master",
    active: false,
  },
];

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showMock, setShowMock] = useState(false);

  // Simula crear una campaña
  const handleCreateCampaign = () => {
    setCampaigns(mockCampaigns);
    setShowMock(true);
  };

  // Simula desactivar una campaña
  const handleDeactivate = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: false } : c))
    );
  };

  // Simula activar una campaña
  const handleActivate = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: true } : c))
    );
  };

  // Simula eliminar una campaña
  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  // Campañas activas y no activas
  const activeCampaigns = campaigns.filter((c) => c.active);
  const inactiveCampaigns = campaigns.filter((c) => !c.active);

  return (
    <div className="font-body bg-[#fdfcf9] min-h-screen text-[#242527]">
      <div className="fixed inset-0 pointer-events-none opacity-50 z-0" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded px-3 py-2 shadow-sm w-fit mb-4">
          <div className="bg-red-600 text-white font-bold w-6 h-6 flex items-center justify-center rounded-sm text-xs">B</div>
          <MdChevronRight className="text-gray-400 text-xl" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Mis Campañas</span>
        </div>

        {/* Título */}
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-2 border-b-2 border-blue-500 pb-2">Mis Campañas</h1>

        {/* Si no hay campañas */}
        {!showMock || campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <h2 className="text-4xl font-bold text-center mb-4">No has creado o unido a alguna campaña aún.</h2>
            <p className="text-lg text-center mb-8">
              Si tu estas buscando una partida, pide a tu Dungeon Master que te envíe un enlace de invitación o crea tu propia aventura.
            </p>
            <button
              className="bg-[#e40712] hover:bg-red-700 text-white font-bold py-3 px-8 rounded mb-4 text-lg uppercase transition"
              onClick={handleCreateCampaign}
            >
              Crear Nueva Campaña
            </button>
            <button
              className="bg-[#e40712] hover:bg-red-700 text-white font-bold py-3 px-8 rounded text-lg uppercase transition"
              onClick={handleCreateCampaign}
            >
              Crear Desde Campañas Prediseñadas
            </button>
          </div>
        ) : (
          <>
            {/* Botones de crear */}
            <div className="flex flex-wrap gap-4 justify-end mb-6">
              <button
                className="bg-[#e40712] hover:bg-red-700 text-white font-bold py-2 px-8 rounded text-base uppercase transition"
                onClick={handleCreateCampaign}
              >
                Crear Nueva Campaña
              </button>
              <button
                className="bg-[#e40712] hover:bg-red-700 text-white font-bold py-2 px-8 rounded text-base uppercase transition"
                onClick={handleCreateCampaign}
              >
                Crear Desde Campañas Prediseñadas
              </button>
            </div>

            {/* Campañas activas */}
            <h2 className="text-2xl font-bold mt-8 mb-2">Campañas Activas</h2>
            {activeCampaigns.length === 0 ? (
              <div className="text-gray-500 italic mb-8">No hay campañas activas.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {activeCampaigns.map((c) => (
                  <div key={c.id} className="bg-white rounded-lg shadow border border-gray-200 p-8 flex flex-col items-center">
                    <h3 className="text-2xl font-bold mb-2">{c.name}</h3>
                    <p className="text-gray-500 mb-2 text-sm">Campaña iniciada {c.startDate}</p>
                    <p className="font-bold text-lg mb-2">{c.players} <span className="text-xs font-normal">Jugadores</span></p>
                    <p className="uppercase text-xs font-bold mb-4">Rol: {c.role}</p>
                    <hr className="w-full border-gray-300 mb-4" />
                    <div className="flex flex-wrap gap-4 justify-center w-full">
                      <button className="text-[#2196f3] font-bold uppercase text-sm hover:underline">Ver Campaña</button>
                      <button className="text-[#2196f3] font-bold uppercase text-sm hover:underline">Lanzar VTT</button>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center w-full mt-4">
                      <button
                        className="text-blue-700 font-bold uppercase text-sm hover:underline"
                        onClick={() => handleDeactivate(c.id)}
                      >
                        Desactivar
                      </button>
                      <button
                        className="text-red-600 font-bold uppercase text-sm hover:underline"
                        onClick={() => handleDelete(c.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Campañas no activas */}
            {inactiveCampaigns.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mt-8 mb-2">Inactive Campaigns</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {inactiveCampaigns.map((c) => (
                    <div key={c.id} className="bg-white rounded-lg shadow border border-gray-200 p-8 flex flex-col items-center">
                      <h3 className="text-2xl font-bold mb-2">{c.name}</h3>
                      <p className="text-gray-500 mb-2 text-sm">Campaign Started {c.startDate}</p>
                      <p className="font-bold text-lg mb-2">{c.players} <span className="text-xs font-normal">Players</span></p>
                      <p className="uppercase text-xs font-bold mb-4">Role: {c.role}</p>
                      <hr className="w-full border-gray-300 mb-4" />
                      <div className="flex flex-wrap gap-4 justify-center w-full mt-4">
                        <button
                          className="text-green-700 font-bold uppercase text-sm hover:underline"
                          onClick={() => handleActivate(c.id)}
                        >
                          Activar
                        </button>
                        <button
                          className="text-red-600 font-bold uppercase text-sm hover:underline"
                          onClick={() => handleDelete(c.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}