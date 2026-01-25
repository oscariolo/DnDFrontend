import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost';

export const socket = io(BACKEND_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 60000,
  autoConnect: false, // Don't auto-connect, we'll control it
});

let isAuthenticated = false;
let authPromise: Promise<void> | null = null;
let listenersRegistered = false;

export function connectToGameSession(token: string, userId: string, gameSessionId: string): Promise<void> {
  // Return cached promise if already authenticating
  if (authPromise) {
    return authPromise;
  }

  // Return immediately if already authenticated
  if (isAuthenticated && socket.connected) {
    return Promise.resolve();
  }

  authPromise = new Promise((resolve, reject) => {
    // Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    // Set a timeout for authentication
    const authTimeout = setTimeout(() => {
      authPromise = null;
      reject(new Error('Authentication timeout'));
    }, 100000);

    // Emit authentication data
    socket.emit('authenticate', {
      token,
      userId,
      gameSessionId,
    });

    // Listen for success response (only once)
    socket.once('auth-success', (data) => {
      clearTimeout(authTimeout);
      isAuthenticated = true;
      console.log('Authenticated successfully', data);
      
      // Register event listeners only once
      if (!listenersRegistered) {
        listenToGameSessionEvents();
        listenersRegistered = true;
      }
      
      authPromise = null;
      resolve();
    });

    // Listen for error response (only once)
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
  // Remove old listeners first to prevent duplicates
  socket.off('join-success');
  socket.off('chat-message-sent');

  socket.on('join-success', (data) => {
    console.log('Player joined:', data);
  });

  socket.on('chat-message-sent', (data) => {
    const {senderId, messageContent} = data;
    onChatMessage && onChatMessage(senderId, messageContent);
  });
}

export function disconnectFromGameSession() {
  isAuthenticated = false;
  listenersRegistered = false;
  authPromise = null;
  socket.off('join-success');
  socket.off('chat-message-sent');
  socket.disconnect();
}

export function isSocketAuthenticated(): boolean {
  return isAuthenticated && socket.connected;
}



