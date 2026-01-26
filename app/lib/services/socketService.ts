import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:80';

export const socket = io(BACKEND_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 60000,
  autoConnect: false,
});

let isAuthenticated = false;
let authPromise: Promise<void> | null = null;
let listenersRegistered = false;
const recentChatKeys = new Set<string>();
const RECENT_CHAT_TTL = 5000; // ms

export function connectToGameSession(token: string, userId: string, gameSessionId: string): Promise<void> {
  if (authPromise) {
    return authPromise;
  }
  if (isAuthenticated && socket.connected) {
    return Promise.resolve();
  }

  authPromise = new Promise((resolve, reject) => {
    if (!socket.connected) {
      socket.connect();
    }
    const authTimeout = setTimeout(() => {
      authPromise = null;
      reject(new Error('Authentication timeout'));
    }, 100000);
    socket.emit('authenticate', {
      token,
      userId,
      gameSessionId,
    });
    socket.once('auth-success', (data) => {
      clearTimeout(authTimeout);
      isAuthenticated = true;
      console.log('Authenticated successfully', data);
      if (!listenersRegistered) {
        try {
          socket.emit('player-join', { playerId: userId, sessionId: gameSessionId });
        } catch (e) {
          console.warn('Failed to emit player-join', e);
        }
        listenToGameSessionEvents();
        listenersRegistered = true;
      }
      
      authPromise = null;
      resolve();
    });
    socket.once('auth-error', (error) => {
      clearTimeout(authTimeout);
      isAuthenticated = false;
      listenersRegistered = false;
      console.error('Authentication error', error);
      authPromise = null;
      reject(new Error(error.message || 'Authentication failed'));
    });
  });

  return authPromise;
}

export function sendMessageToGameSession(message: string): boolean {
  if (!isAuthenticated) {
    console.warn('Cannot send message: not authenticated');
    return false;
  }

  socket.emit('chat-message', { "messageContent": message });
  return true;
}

export function listenToGameSessionEvents(onChatMessage?: (senderId: string, messageContent: string) => void, 
    onPlayerJoined?: (data: any) => void, onPlayerLeft?: (data: any) => void
) {
  socket.off('join-success');
  socket.off('chat-message-sent');
  socket.off('player-joined');
  socket.off('player-left');
  socket.off('session-started');

  socket.on('join-success', (data) => {
    console.log('Player joined (join-success):', data);
  });

  socket.on('chat-message-sent', (data) => {
    const {senderId, messageContent} = data;
    try {
      const key = `${senderId}::${messageContent}`;
      if (recentChatKeys.has(key)) {
        console.debug('Ignored duplicate chat message', key);
        return;
      }
      recentChatKeys.add(key);
      setTimeout(() => recentChatKeys.delete(key), RECENT_CHAT_TTL);
      onChatMessage && onChatMessage(senderId, messageContent);
    } catch (e) {
      console.error('Error processing chat-message-sent', e);
    }
  });

  socket.on('player-joined', (data) => {
    onPlayerJoined && onPlayerJoined(data);
  });

  socket.on('player-left', (data) => {
    onPlayerLeft && onPlayerLeft(data);
  });

  socket.on('session-started', (data) => {
    console.log('Session started event received', data);
    onPlayerJoined && onPlayerJoined(data);
  });

  listenersRegistered = true;
}

export function disconnectFromGameSession() {
  try {
    socket.emit('player-leave');
  } catch (e) {
    console.warn('Failed to emit player-leave', e);
  }
  isAuthenticated = false;
  listenersRegistered = false;
  authPromise = null;
  socket.off('join-success');
  socket.off('chat-message-sent');
  socket.off('player-joined');
  socket.off('player-left');
  socket.off('session-started');
  try {
    socket.removeAllListeners();
  } catch (e) {}
  socket.disconnect();
}

export function isSocketAuthenticated(): boolean {
  return isAuthenticated && socket.connected;
}
