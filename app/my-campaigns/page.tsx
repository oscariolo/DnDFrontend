"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdChevronRight } from "react-icons/md";
import { useAuth } from "../lib/context/AuthContext";
import { getUserGameSessions, createGameSession, getInviteLink } from "../lib/services/gameSessionService";
import { getCampaignsByUserId } from "../lib/services/campaingServices";

interface GameSession {
  id: string;
  baseCampaignId: string;
  campaignName?: string;
  startDate: string;
  playerIds: string[];
  role: string;
  status: 'waiting' | 'active' | 'ended';
  inviteLink?: string;
  dungeonMasterId?: string;
}

export default function MyCampaignsPage() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated } = useAuth();
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  

  useEffect(() => {
    if (isAuthenticated && user && accessToken) {
      loadUserCampaigns();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, accessToken]);

  const loadUserCampaigns = async () => {
    if (!user || !accessToken) return;
    
    try {
      setLoading(true);
      const sessions = await getUserGameSessions(user.id, accessToken);
      const userCampaigns = await getCampaignsByUserId(user.id, accessToken);
      const mappedSessions: GameSession[] = sessions.map((session: any) => {
        const campaign = userCampaigns.find((c: any) => c.id === session.baseCampaignId);
        const isDM = session.dungeonMasterId === user.id || 
                    (campaign && campaign.dungeonMasterId === user.id);
        
        return {
          id: session._id,
          baseCampaignId: session.baseCampaignId,
          campaignName: campaign?.name || 'Unknown Campaign',
          startDate: session.startedAt ? new Date(session.startedAt).toLocaleDateString() : '',
          playerIds: session.playerIds || [],
          role: isDM ? 'Dungeon Master' : 'Player',
          status: session.status || 'waiting',
          inviteLink: isDM ? getInviteLink(session._id) : undefined,
          dungeonMasterId: session.dungeonMasterId,
        };
      });
      
      setGameSessions(mappedSessions);
      setCampaigns(userCampaigns);
    } catch (error) {
      console.error('Error al cargar campañas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromTemplate = async (campaignId: string) => {
    if (!user || !accessToken) return;
    
    try {
      const newSession = await createGameSession(
        {
          baseCampaignId: campaignId,
          dungeonMasterId: user.id,
          playerIds: [user.id],
          status: 'active',
        },
        accessToken
      );
      router.push(`/my-campaigns/${newSession._id}`);
    } catch (error) {
      console.error('Error al crear sesión de juego:', error);
      alert('Error al crear la sesión de juego');
    }
  };

  const handleCopyInviteLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleStartSession = (sessionId: string) => {
    router.push(`/my-campaigns/${sessionId}`);
  };

  const handleJoinSession = (sessionId: string) => {
    router.push(`/my-campaigns/wait/${sessionId}`);
  };

  // Simula crear una campaña
  const handleCreateCampaign = () => {
    router.push('/campaign/builder/basicInfo');
  };

  const handleCreateFromPrebuilt = () => {
    router.push('/campaign#destacados');
  }

  // Campañas activas y no activas
  const activeSessions = gameSessions.filter((s) => s.status === 'active' || s.status === 'waiting');
  const endedSessions = gameSessions.filter((s) => s.status === 'ended');

  // Campañas del usuario que NO tienen sesión activa
  const campaignIdsWithSession = new Set(gameSessions.map(s => s.baseCampaignId));
  const campaignsWithoutSession = campaigns.filter(c => !campaignIdsWithSession.has(c.id));

  return (
    <div className="font-body bg-[#fdfcf9] min-h-screen text-[#242527]">
      <div className="fixed inset-0 pointer-events-none opacity-50 z-0" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded px-3 py-2 shadow-sm w-fit mb-4">
          <div className="bg-red-600 text-white font-bold w-6 h-6 flex items-center justify-center rounded-sm text-xs">B</div>
          <MdChevronRight className="text-gray-400 text-xl" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Mis Campañas</span>
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-2 border-b-2 border-blue-500 pb-2">Mis Campañas</h1>

        {loading ? (
          <div className="flex items-center justify-center mt-12">
            <p className="text-lg">Cargando...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <h2 className="text-3xl font-bold text-center mb-4">Debes iniciar sesión</h2>
            <p className="text-lg text-center mb-8">
              Inicia sesión para ver tus campañas o crear nuevas aventuras.
            </p>
            <button
              className="bg-[#e40712] hover:bg-red-700 text-white font-bold py-3 px-8 rounded text-lg uppercase transition"
              onClick={() => router.push('/auth')}
            >
              Iniciar Sesión
            </button>
          </div>
        ) : gameSessions.length === 0 && campaigns.length === 0 ? (
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
              onClick={handleCreateFromPrebuilt}
            >
              Crear Desde Campañas Prediseñadas
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button
                className="bg-[#e40712] hover:bg-red-700 text-white font-bold py-2 px-8 rounded text-base uppercase transition"
                onClick={handleCreateCampaign}
              >
                Crear Nueva Campaña
              </button>
            </div>
            {campaigns.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mt-8 mb-2">Mis Plantillas de Campaña</h2>
                <p className="text-sm text-gray-600 mb-4">Crea una sesión de juego desde tus plantillas</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white rounded-lg shadow border border-gray-200 p-8 flex flex-col items-center">
                      <h3 className="text-2xl font-bold mb-2">{campaign.name || 'Sin nombre'}</h3>
                      <p className="text-gray-500 mb-4 text-sm text-center">{campaign.description || 'Sin descripción'}</p>
                      <hr className="w-full border-gray-300 mb-4" />
                      <button
                        onClick={() => handleCreateFromTemplate(campaign.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded text-sm uppercase transition"
                      >
                        Crear Sesión de Juego
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Campañas activas */}
            <h2 className="text-2xl font-bold mt-8 mb-2">Campañas Activas</h2>
            {activeSessions.length === 0 ? (
              <div className="text-gray-500 italic mb-8">No hay campañas activas.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {activeSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-lg shadow border border-gray-200 p-8 flex flex-col items-center">
                    <h3 className="text-2xl font-bold mb-2">{session.campaignName}</h3>
                    <p className="text-gray-500 mb-2 text-sm">Iniciada {session.startDate}</p>
                    <p className="font-bold text-lg mb-2">{session.playerIds.length} <span className="text-xs font-normal">Jugadores</span></p>
                    <p className="uppercase text-xs font-bold mb-2">Rol: {session.role}</p>
                    <p className="text-xs text-gray-500 mb-4">Estado: {session.status === 'waiting' ? 'En espera' : 'Activa'}</p>
                    
                    {session.role === 'Dungeon Master' && session.inviteLink && (
                      <div className="w-full mb-4">
                        <label className="text-xs font-bold text-gray-600 mb-1 block">Enlace de Invitación:</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            readOnly 
                            value={session.inviteLink} 
                            className="flex-1 text-xs px-2 py-1 border rounded bg-gray-50"
                          />
                          <button
                            onClick={() => handleCopyInviteLink(session.inviteLink!)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          >
                            {copiedLink === session.inviteLink ? 'Copiado!' : 'Copiar'}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <hr className="w-full border-gray-300 mb-4" />
                    <div className="flex flex-wrap gap-4 justify-center w-full">
                      {session.role === 'Dungeon Master' ? (
                        <>
                          <button 
                            className="text-[#2196f3] font-bold uppercase text-sm hover:underline"
                            onClick={() => handleStartSession(session.id)}
                          >
                            Gestionar Campaña
                          </button>
                          {session.status === 'waiting' && (
                            <button className="text-green-600 font-bold uppercase text-sm hover:underline">
                              Iniciar Partida
                            </button>
                          )}
                        </>
                      ) : (
                        <button 
                          className="text-[#2196f3] font-bold uppercase text-sm hover:underline"
                          onClick={() => handleJoinSession(session.id)}
                        >
                          {session.status === 'waiting' ? 'Sala de Espera' : 'Entrar a Jugar'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Campañas finalizadas */}
            {endedSessions.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mt-8 mb-2">Campañas Finalizadas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {endedSessions.map((session) => (
                    <div key={session.id} className="bg-gray-100 rounded-lg shadow border border-gray-200 p-8 flex flex-col items-center opacity-75">
                      <h3 className="text-2xl font-bold mb-2">{session.campaignName}</h3>
                      <p className="text-gray-500 mb-2 text-sm">Iniciada {session.startDate}</p>
                      <p className="font-bold text-lg mb-2">{session.playerIds.length} <span className="text-xs font-normal">Jugadores</span></p>
                      <p className="uppercase text-xs font-bold mb-4">Rol: {session.role}</p>
                      <p className="text-xs text-red-600 font-bold mb-4">FINALIZADA</p>
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