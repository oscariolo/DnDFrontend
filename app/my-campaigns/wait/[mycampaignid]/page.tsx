"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdSync, MdHistoryEdu } from "react-icons/md";
import { useAuth } from "@/app/lib/context/AuthContext";
import { getGameSession } from "@/app/lib/services/gameSessionService";
import { connectToGameSession, listenToGameSessionEvents, sendMessageToGameSession } from "@/app/lib/services/socketService";

interface ChatMessage {
  id: string;
  senderId: string;
  messageContent: string;
  timestamp: string;
}

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

export default function WaitForDMPage() {
  const params = useParams();
  const router = useRouter();
  const { user, accessToken, isAuthenticated } = useAuth();
  
  const sessionId = params.mycampaignid as string;
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated || !user || !accessToken) {
      router.push('/auth');
      return;
    }
    
    loadSession();
    const interval = setInterval(() => {
      loadSession();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, user, accessToken, sessionId]);

  useEffect(() => {
    if (!isAuthenticated || !user || !accessToken) return;
    startWebSocket(accessToken, user.id, sessionId);
  }, [isAuthenticated, user, accessToken, sessionId]);

  const loadSession = async () => {
    if (!accessToken) return;
    
    try {
      const sessionData = await getGameSession(sessionId, accessToken);
      setSession(sessionData);
      if (sessionData.status === 'active') {
        router.push(`/my-campaigns/play/${sessionId}`);
      }
    } catch (error) {
      console.error('Error al cargar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const startWebSocket = async (token: string, userId: string, gameSessionId: string) => {
    try {
      await connectToGameSession(token, userId, gameSessionId);
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (loading) {
    return (
      <div className="bg-[#f6f8f8] text-[#2b2218] min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }
  return (
    <div className="bg-[#f6f8f8] text-[#2b2218] min-h-screen bg-repeat font-body flex flex-col items-center justify-center">
      <main className="max-w-2xl mx-auto px-6 py-10 w-full">
        <div className="relative bg-white border border-[#d4c5a9] rounded-xl p-8 shadow-lg overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#1fadad] to-transparent opacity-50"></div>
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-[#2b2218]">
            <MdHistoryEdu className="text-[200px] rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-6 max-w-md mx-auto">
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold text-[#2b2218]">Esperando al Dungeon Master</h3>
              <p className="text-[#2b2218]/70">
                La partida está en preparación.<br />
                Cuando el Dungeon Master la inicie, entrarás automáticamente.
              </p>
              {session && (
                <p className="text-xs text-[#1fadad] font-bold mt-4">
                  Jugadores en sala: {session.playerIds?.length || 0}
                </p>
              )}
            </div>
            <div className="flex flex-col items-center gap-3 w-full max-w-md">
              <button className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-400 font-bold py-4 px-8 rounded-lg border border-gray-200 cursor-not-allowed select-none transition-all" disabled>
                <MdSync className="animate-spin text-xl" />
                <span className="uppercase tracking-wider text-sm">Esperando al DM</span>
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1fadad]/60">
                Estado: {session?.status === 'waiting' ? 'En espera' : 'Preparando...'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-16 flex items-center justify-center opacity-30 gap-4">
          <div className="h-px bg-[#2b2218] w-24"></div>
          <MdHistoryEdu className="text-[#2b2218]" />
          <div className="h-px bg-[#2b2218] w-24"></div>
        </div>
        <div className="w-full max-w-xl mx-auto mt-10 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider flex items-center gap-2">
              <MdHistoryEdu className="text-gray-500 text-sm" /> Chat de la sesión
            </h3>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" ref={chatContainerRef} style={{maxHeight: 300}}>
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
      </main>
    </div>
  );
}