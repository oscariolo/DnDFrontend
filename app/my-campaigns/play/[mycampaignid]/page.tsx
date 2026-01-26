'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MdChat, MdMap, MdPeople, MdVolumeUp } from 'react-icons/md';
import { useAuth } from '@/app/lib/context/AuthContext';
import { getGameSession } from '@/app/lib/services/gameSessionService';
import { getCampaignById } from '@/app/lib/services/campaingServices';
import { connectToGameSession, listenToGameSessionEvents, sendMessageToGameSession } from '@/app/lib/services/socketService';
import { getUserById } from '@/app/lib/services/userService';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  messageContent: string;
  timestamp: string;
}

interface GameSession {
  _id: string;
  baseCampaignId?: string;
  dungeonMasterId?: string;
  playerIds?: string[];
  status?: 'waiting' | 'active' | 'ended';
}

function ChatMessageComponent({ message }: { message: ChatMessage }) {
  return (
    <div className="flex gap-2 items-start mb-3">
      <div className="w-8 h-8 rounded-full bg-[#1fadad]/20 border border-[#1fadad]/40 shrink-0 flex items-center justify-center text-[#1fadad] text-[10px] font-bold overflow-hidden">
        {(message.senderName || message.senderId).substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#1fadad]">{(message.senderName || message.senderId).substring(0, 20)}</span>
          <span className="text-[10px] text-gray-400">{message.timestamp}</span>
        </div>
        <p className="text-sm text-gray-700 leading-snug mt-1 break-words">{message.messageContent}</p>
      </div>
    </div>
  );
}

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const { user, accessToken, isAuthenticated } = useAuth();

  const campaignId = params.mycampaignid as string;

  const [session, setSession] = useState<GameSession | null>(null);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [gameState, setGameState] = useState<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const userNameCache = useRef<Record<string,string>>({});
  const [userNameMap, setUserNameMap] = useState<Record<string,string>>({});

  useEffect(() => {
    if (!isAuthenticated || !user || !accessToken) {
      router.push('/auth');
      return;
    }

    loadGameData();
    startWebSocket();
  }, [isAuthenticated, user, accessToken, campaignId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const startWebSocket = async () => {
    if (!user || !accessToken) return;

    try {
      await connectToGameSession(accessToken, user.id, campaignId);
      const onPlayerJoined = async (data: any) => {
        try {
          if (data && data.session) {
            if (data.session.playerIds) data.session.playerIds = Array.from(new Set(data.session.playerIds));
            setSession(data.session);
          }
          if (data && data.session && data.session.status === 'active') {
            router.push(`/my-campaigns/play/${campaignId}`);
          }
        } catch (e) {
          console.error('Error handling player-joined in play page', e);
        }
      };

      const onPlayerLeft = async (data: any) => {
        try {
          if (data && data.playerId) {
            await loadGameData();
          }
        } catch (e) {
          console.error('Error handling player-left in play page', e);
        }
      };

      listenToGameSessionEvents(handleChatMessage, onPlayerJoined, onPlayerLeft);
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
    }
  };

  const loadGameData = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const sessionData = await getGameSession(campaignId, accessToken);
      setSession(sessionData);

      if (sessionData.baseCampaignId) {
        const campaignData = await getCampaignById(
          sessionData.baseCampaignId,
          accessToken
        );
        setCampaign(campaignData);
      }

      if (sessionData.status !== 'active') {
        router.push(`/my-campaigns/${campaignId}`);
      }
    } catch (error) {
      console.error('Error al cargar sesión:', error);
      router.push(`/my-campaigns/${campaignId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChatMessage = async (senderId: string, messageContent: string) => {
    const timestamp = new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    let senderName: string | undefined;
    try {
      if (senderId === user?.id) {
        senderName = user.username;
      } else if (userNameCache.current[senderId]) {
        senderName = userNameCache.current[senderId];
      } else if (accessToken) {
        const profile = await getUserById(senderId, accessToken);
        senderName = profile?.username || profile?.displayName;
        if (senderName) {
          userNameCache.current[senderId] = senderName;
          setUserNameMap(prev => ({ ...prev, [senderId]: senderName! }));
        }
      }
    } catch (e) {
      senderName = undefined;
    }

    const newMessage: ChatMessage = {
      id: `${senderId}-${Date.now()}`,
      senderId,
      senderName,
      messageContent,
      timestamp,
    };

    setChatMessages((prev) => [...prev, newMessage]);
  };

  useEffect(() => {
    if (!session?.playerIds || !accessToken) return;
    (async () => {
      for (const pid of session.playerIds!) {
        if (userNameMap[pid] || userNameCache.current[pid]) continue;
        try {
          const profile = await getUserById(pid, accessToken);
          const name = profile?.username || profile?.displayName;
          if (name) {
            userNameCache.current[pid] = name;
            setUserNameMap(prev => ({ ...prev, [pid]: name! }));
          }
        } catch (e) {
          // ignore
        }
      }
    })();
  }, [session?.playerIds, accessToken]);

  const handleGameEvent = (event: any) => {
    if (event.type === 'CHAT') {
      handleChatMessage(event.senderId || 'Sistema', event.message);
    } else if (event.type === 'GAME_STATE_UPDATE') {
      setGameState(event.data);
    }
  };

  const sendMessage = () => {
    const inputElement = document.getElementById('chat-input') as HTMLInputElement;
    const message = inputElement.value;

    if (message.trim()) {
      const success = sendMessageToGameSession(message);
      if (success) {
        inputElement.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f6f8f8] text-[#2b2218] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1fadad]"></div>
          </div>
          <p className="text-lg mt-4">Cargando sesión de juego...</p>
        </div>
      </div>
    );
  }

  const isDM = user?.id === session?.dungeonMasterId;
  const playerIds = session?.playerIds ?? [];

  return (
    <div className="bg-[#f6f8f8] text-[#2b2218] min-h-screen font-body flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#1fadad]/20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#2b2218]">
              {campaign?.name || 'Campaña'}
            </h1>
            <p className="text-xs text-[#2b2218]/60 uppercase tracking-wider font-bold">
              {isDM ? '🎲 Dungeon Master' : '⚔️ Jugador'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1fadad] bg-[#1fadad]/10 px-3 py-1 rounded-full">
              <MdPeople /> {playerIds.length} Jugadores
            </div>
            <button
              onClick={() => router.push(`/my-campaigns/${campaignId}`)}
              className="text-[#1fadad] hover:text-[#0f8a8a] font-bold text-sm transition"
            >
              Volver
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full flex gap-6 p-6">
        {/* Left: Game Canvas Area */}
        <div className="flex-1 bg-white rounded-lg border border-[#1fadad]/20 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-[#1fadad]/20 to-transparent p-6 flex-1 flex flex-col items-center justify-center">
              <MdMap className="text-6xl text-[#1fadad]/30 mb-4" />
            <h2 className="text-2xl font-bold text-[#2b2218] mb-2">Mapa de la Campaña</h2>
            <p className="text-[#2b2218]/60 text-sm text-center max-w-md">
              {isDM
                ? 'Aquí irán las herramientas del Dungeon Master para mostrar el mapa y controlar la campaña.'
                : 'Aquí verás el mapa de la campaña y tus acciones como jugador.'}
            </p>
            {isDM && (
              <div className="mt-6 flex gap-3">
                <button className="bg-[#1fadad] hover:bg-[#0f8a8a] text-white font-bold py-2 px-4 rounded text-sm transition">
                  <MdMap className="inline mr-2" /> Cargar Mapa
                </button>
                <button className="bg-[#1fadad]/20 hover:bg-[#1fadad]/30 text-[#1fadad] font-bold py-2 px-4 rounded text-sm transition">
                  Herramientas de Dibujo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat and Info */}
        <div className="w-80 flex flex-col gap-4">
          {/* Chat */}
          <div className="bg-white rounded-lg border border-[#1fadad]/20 shadow-sm overflow-hidden flex flex-col h-96">
            <div className="bg-gradient-to-r from-[#1fadad]/10 to-transparent p-3 border-b border-[#1fadad]/20 flex items-center gap-2">
              <MdChat className="text-[#1fadad]" />
              <h3 className="font-bold text-[#2b2218] text-sm">Chat de Sesión</h3>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-2 bg-white"
              ref={chatContainerRef}
            >
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-[#2b2218]/40">
                  <p className="text-xs">Sin mensajes aún</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <ChatMessageComponent key={msg.id} message={msg} />
                ))
              )}
            </div>

            <div className="border-t border-[#1fadad]/20 p-3 bg-[#f6f8f8]">
              <div className="flex gap-2">
                <input
                  id="chat-input"
                  type="text"
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-white border border-[#1fadad]/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1fadad]"
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={sendMessage}
                  className="bg-[#1fadad] hover:bg-[#0f8a8a] text-white font-bold px-3 py-2 rounded text-sm transition"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-white rounded-lg border border-[#1fadad]/20 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1fadad]/20">
              <MdPeople className="text-[#1fadad] text-lg" />
              <h3 className="font-bold text-[#2b2218]">Jugadores</h3>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {playerIds.length > 0 ? (
                playerIds.map((playerId, index) => {
                  const displayName = userNameMap[playerId] || userNameCache.current[playerId] || (playerId.substring(0, 12) + (playerId.length > 12 ? '...' : ''));
                  return (
                  <div key={index} className="flex items-center gap-2 text-xs p-2 bg-[#f6f8f8] rounded">
                    <div className="w-6 h-6 rounded-full bg-[#1fadad]/30 flex items-center justify-center text-[#1fadad] font-bold">
                      {displayName.substring(0, 1).toUpperCase()}
                    </div>
                    <span className="font-semibold text-[#2b2218]">{displayName}</span>
                    {session && playerId === session.dungeonMasterId && (
                      <span className="ml-auto bg-yellow-100 text-yellow-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        DM
                      </span>
                    )}
                  </div>
                  );
                })
              ) : (
                <p className="text-[#2b2218]/40 text-xs">No hay jugadores</p>
              )}
            </div>
          </div>

          {/* Actions */}
          {isDM && (
            <div className="bg-white rounded-lg border border-[#1fadad]/20 shadow-sm p-4 flex flex-col gap-2">
                <button className="w-full bg-[#1fadad] hover:bg-[#0f8a8a] text-white font-bold py-2 px-3 rounded text-sm transition flex items-center justify-center gap-2">
                <span className="text-xl">🎲</span> Tirador de Dados
              </button>
              <button className="w-full bg-[#1fadad]/10 hover:bg-[#1fadad]/20 text-[#1fadad] font-bold py-2 px-3 rounded text-sm transition flex items-center justify-center gap-2">
                <MdVolumeUp /> Sonidos Ambientales
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}