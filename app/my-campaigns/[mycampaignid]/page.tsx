"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdGroups, MdPersonOff, MdChevronRight, MdMenuBook, MdHistoryEdu } from "react-icons/md";
import { useAuth } from "@/app/lib/context/AuthContext";
import { getGameSession, getInviteLink } from "@/app/lib/services/gameSessionService";
import { getAllCharactersByUserId } from "@/app/lib/services/characterServices";
import { getCampaignById } from "@/app/lib/services/campaingServices";
import { connectToGameSession, listenToGameSessionEvents, sendMessageToGameSession } from "@/app/lib/services/socketService";
import { start } from "repl";

interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  owner: string;
  ownerId: string;
  avatar: string;
  assigned: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  messageContent: string;
  timestamp: string;
}

// Chat Message Component
function ChatMessageComponent({ message }: { message: ChatMessage }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-8 h-8 rounded bg-gray-800 border border-gray-600 shrink-0 flex items-center justify-center text-white text-[10px] font-bold overflow-hidden">
        {message.senderId.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-[#0b87da]">{message.senderId}</span>
          <span className="text-[10px] text-gray-400">{message.timestamp}</span>
        </div>
        <p className="text-sm text-gray-800 leading-snug">{message.messageContent}</p>
      </div>
    </div>
  );
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, accessToken, isAuthenticated } = useAuth();
  
  const campaignId = params.mycampaignid as string;
  
  const [session, setSession] = useState<any>(null);
  const [campaign, setCampaign] = useState<any>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message within chat container only
  useEffect(() => {
    if (chatContainerRef.current) {
      // Scroll only the chat container, not the entire page
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!isAuthenticated || !user || !accessToken) {
      router.push('/auth');
      return;
    }
    startWebSocket(accessToken, user.id, campaignId);
    loadCampaignData();

  }, [isAuthenticated, user, accessToken, campaignId]);


  // In the sendSessionMessage function, change to:
  const sendSessionMessage = async () => {
    const inputElement = document.getElementById('message-input') as HTMLInputElement;
    const message = inputElement.value;
    
    if (message.trim() !== '') {
      const success = sendMessageToGameSession(message);
      if (success) {
        inputElement.value = '';
      } else {
        console.error('Failed to send message: socket not authenticated');
      }
    }
  };

  // In the startWebSocket function, make it awaitable:
  const startWebSocket = async (token: string, userId: string, gameSessionId: string) => {
    try {
      await connectToGameSession(token, userId, gameSessionId);
      console.log('WebSocket connected and authenticated');
      listenToGameSessionEvents(onChatMessage);
    } catch (error) {
      console.error('Error al iniciar WebSocket:', error);
    }
  };

  const onChatMessage = (senderId: string, messageContent: string) => {
    const timestamp = new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const newMessage: ChatMessage = {
      id: `${senderId}-${Date.now()}`,
      senderId,
      messageContent,
      timestamp
    };
    setChatMessages(prev => [...prev, newMessage]);
  };



  const loadCampaignData = async () => {
    if (!user || !accessToken) return;
    
    try {
      setLoading(true);
      const sessionData = await getGameSession(campaignId, accessToken);
      setSession(sessionData);
      const link = getInviteLink(campaignId);
      setInviteLink(link);
      if (sessionData.baseCampaignId) {
        const campaignData = await getCampaignById(sessionData.baseCampaignId, accessToken);
        setCampaign({
          name: campaignData.name || 'Unnamed Campaign',
          description: campaignData.description || 'No description available.',
          image: campaignData.campaignZones?.[0]?.zoneImgUrls?.[0] || '/images/DefaultCampaign.png',
          dungeonMaster: user.username,
        });
      } else {
        setCampaign({
          name: 'Campaign',
          description: 'No description available.',
          image: '/images/DefaultCampaign.png',
          dungeonMaster: user.username,
        });
      }
      const userChars = await getAllCharactersByUserId(user.id, accessToken);
      const mappedChars = userChars.map((char: any) => ({
        id: char.id,
        name: char.characterName || 'Unnamed',
        race: char.characterRace || 'Unknown',
        class: char.characterClass || 'Unknown',
        level: char.level || 1,
        owner: user.username,
        ownerId: user.id,
        avatar: char.avatar || '/images/Avatar1.png',
        assigned: sessionData.availableCharacters?.[user.id]?.id === char.id || false,
      }));
      
      setCharacters(mappedChars);
    } catch (error) {
      console.error('Error al cargar campaña:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLaunchVTT = () => {
    router.push(`/my-campaigns/play/${campaignId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-body">
        <p className="text-lg">Cargando campaña...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-body">
        <h2 className="text-3xl font-bold mb-4">Campaña no encontrada</h2>
        <p className="text-lg text-gray-600">No existe una campaña con el id <span className="font-mono">{campaignId}</span>.</p>
        <button
          className="mt-4 bg-[#e40712] hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
          onClick={() => router.push('/my-campaigns')}
        >
          Volver a Mis Campañas
        </button>
      </div>
    );
  }

  const isDM = session.dungeonMasterId === user?.id;
  const activeCharacters = characters.filter((c) => c.assigned);
  const availableCharacters = characters.filter((c) => !c.assigned);

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
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{campaign?.name || 'Campaign'}</span>
          </div>
        </div>

        {/* Título y acción principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b-2 border-[#0b87da] pb-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-0">{campaign?.name || 'Campaign'}</h1>
          <div className="flex gap-2">
            {isDM && (
              <button 
                className="bg-[#0b87da] hover:bg-[#0866a8] text-white text-sm font-bold py-2 px-4 rounded shadow flex items-center gap-2 uppercase transition"
                onClick={handleLaunchVTT}
              >
                <MdMenuBook className="text-lg" /> Launch VTT
              </button>
            )}
          </div>
        </div>

        {/* Imagen y descripción de campaña */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md mb-4 relative group">
              <Image
                alt="Campaign image"
                src={campaign?.image || "/images/DefaultCampaign.png"}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
                style={{ objectPosition: "center" }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            </div>
            <p className="text-gray-700 leading-relaxed text-sm bg-white rounded-lg p-4 shadow">
              {campaign?.description || 'No description available.'}
            </p>
          </div>
          <div className="flex flex-col justify-start">
            {isDM && (
              <div className="border border-dashed border-[#0b87da] bg-blue-50 rounded p-6 text-center mb-4">
                <h4 className="text-[#0b87da] font-bold uppercase text-xs mb-2 tracking-wide">Invitar jugadores</h4>
                <div className="bg-white border border-gray-300 rounded p-2 mb-2 break-all text-xs text-gray-600 font-mono select-all">
                  {inviteLink}
                </div>
                <p className="text-gray-600 text-xs mb-4">Comparte este enlace para que otros jugadores se unan.</p>
                <div className="flex justify-center gap-4 text-xs font-bold uppercase tracking-wider">
                  <button 
                    className="bg-[#0b87da]/10 hover:bg-[#0b87da]/20 text-[#0b87da] py-1 px-3 rounded transition"
                    onClick={handleCopyInviteLink}
                  >
                    {copiedLink ? 'Copiado!' : 'Copiar enlace'}
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 p-4 bg-white rounded shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-gray-300">{campaign?.dungeonMaster?.charAt(0)?.toUpperCase() || 'B'}</div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{campaign?.dungeonMaster || 'Unknown'}</h3>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Dungeon Master</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Columna principal */}
          <div className="flex-1 w-full">
            {/* Personajes activos */}
            <hr className="border-gray-300 mb-8" />
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MdGroups className="text-[#0b87da] text-2xl inline-block mr-2" />
                    Personajes Activos
                  </h2>
                  <p className="text-gray-600 text-xs mt-1 font-bold">Personajes activos en esta campaña.</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{activeCharacters.length} Activos</span>
              </div>
              {activeCharacters.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay personajes activos en esta campaña.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeCharacters.map((char) => (
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
                        <button className="flex-1 py-2 text-gray-600 text-xs font-bold uppercase hover:bg-white hover:text-[#0b87da] transition">Ver</button>
                        <button className="flex-1 py-2 text-gray-600 text-xs font-bold uppercase hover:bg-white hover:text-[#0b87da] transition">Editar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Personajes disponibles */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-500 flex items-center gap-2">
                    <MdPersonOff className="text-gray-400 text-2xl inline-block mr-2" />
                    Personajes Disponibles
                  </h2>
                  <p className="text-gray-500 text-xs mt-1">Tus personajes que no están asignados a esta campaña.</p>
                </div>
              </div>
              {availableCharacters.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Todos tus personajes están asignados a esta campaña.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableCharacters.map((char) => (
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
                        <button className="flex-1 py-2 text-gray-500 text-xs font-bold uppercase hover:bg-gray-100 transition">Ver</button>
                        <button className="flex-1 py-2 text-gray-600 text-xs font-bold uppercase hover:bg-white hover:text-[#0b87da] transition">Editar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" ref={chatContainerRef}>
              {chatMessages.length === 0 ? (
                <div className="text-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-[10px] uppercase font-bold px-2 py-1 rounded-full">Session Started</span>
                </div>
              ) : (
                <>
                  <div className="text-center my-4">
                    <span className="bg-gray-200 text-gray-600 text-[10px] uppercase font-bold px-2 py-1 rounded-full">Session Started</span>
                  </div>
                  {chatMessages.map((msg) => (
                    <ChatMessageComponent key={msg.id} message={msg} />
                  ))}
                </>
              )}
            </div>
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="relative">
                <input id="message-input" className="w-full bg-gray-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-[#0b87da] placeholder-gray-500" placeholder="Escribe un mensaje..." type="text" />
                <button onClick={sendSessionMessage} className="absolute right-1 top-1 p-1 text-[#0b87da] hover:text-[#0866a8] transition rounded-full">
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