const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export interface CampaignRun {
  id: string;
  baseCampaignId: string;
  playerIds: string[];
  playersProgress?: any;
  availableCharacters?: Record<string, any>;
  inviteToken?: string;
  dungeonMasterId?: string;
  status?: 'waiting' | 'active' | 'ended';
}

export interface CreateGameSessionRequest {
  baseCampaignId: string;
  dungeonMasterId: string;
  playerIds?: string[];
}

export interface JoinSessionRequest {
  inviteToken: string;
  characterId: string;
  userId: string;
}
export async function createGameSession(
  data: CreateGameSessionRequest,
  token: string
): Promise<CampaignRun> {
  const response = await fetch(`${BACKEND_URL}/api/campaigns/game`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear la sesión de juego');
  }

  return response.json();
}
export async function getGameSession(sessionId: string, token: string): Promise<CampaignRun> {
  const response = await fetch(`${BACKEND_URL}/api/campaigns/game/${sessionId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Error al obtener la sesión de juego: ${response.status} ${errorText}`);
  }

  const text = await response.text();
  if (!text) {
    throw new Error('Empty response from server');
  }
  
  return JSON.parse(text);
}
export async function getUserGameSessions(userId: string, token: string): Promise<CampaignRun[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/campaigns/game/user/playing/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      console.error('Error al obtener sesiones de juego, estado:', response.status);
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error al obtener sesiones de juego:', error);
    return [];
  }
}
export async function addCharacterToSession(
  sessionId: string,
  characterId: string,
  playerId: string,
  token: string
): Promise<CampaignRun> {
  const response = await fetch(`${BACKEND_URL}/api/campaigns/game/character`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      gameId: sessionId,
      characterId,
      playerId,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al agregar personaje a la sesión');
  }

  return response.json();
}
export async function addPlayerToSession(
  sessionId: string,
  playerId: string,
  token: string
): Promise<CampaignRun> {
  const response = await fetch(`${BACKEND_URL}/api/campaigns/game/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      gameId: sessionId,
      playerId,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al agregar jugador a la sesión');
  }

  return response.json();
}
export function generateInviteToken(sessionId: string): string {
  const data = JSON.stringify({
    sessionId,
    timestamp: Date.now(),
  });
  return btoa(data).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
export function decodeInviteToken(token: string): { sessionId: string; timestamp: number } | null {
  try {
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error al decodificar el token de invitación:', error);
    return null;
  }
}
export function getInviteLink(sessionId: string): string {
  const token = generateInviteToken(sessionId);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  return `${baseUrl}/my-campaigns/invite/${token}`;
}
export async function joinGameSession(
  token: string,
  characterId: string,
  userId: string,
  authToken: string
): Promise<CampaignRun> {
  const decoded = decodeInviteToken(token);
  if (!decoded) {
    throw new Error('Invalid invite token');
  }
  await addPlayerToSession(decoded.sessionId, userId, authToken);
  return addCharacterToSession(decoded.sessionId, characterId, userId, authToken);
}
