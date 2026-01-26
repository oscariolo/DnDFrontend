const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:80';

export interface CampaignRun {
  _id: string;
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

import { apiFetch } from '@/app/lib/utils/apiFetch';

const GAME_SESSION_BASE_API = `/api/game-sessions`;

export async function createGameSession(
  data: CreateGameSessionRequest,
  token?: string
): Promise<CampaignRun> {
  const response = await apiFetch(`${GAME_SESSION_BASE_API}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error('Error al crear la sesión de juego');
  }

  const jsonResponse = await response.json();
  const sessionData = jsonResponse['data'];
  if (!sessionData) {
    throw new Error('Empty response from server');
  }

  return sessionData;
}

export async function getGameSession(sessionId: string, token?: string): Promise<CampaignRun> {
  const response = await apiFetch(`${GAME_SESSION_BASE_API}/${sessionId}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Error al obtener la sesión de juego: ${response.status} ${errorText}`);
  }

  const jsonResponse = await response.json();
  const data = jsonResponse['data'];
  if (!data) {
    throw new Error('Empty response from server');
  }

  return data;
}

export async function getUserGameSessions(userId: string, token: string): Promise<CampaignRun[]> {
  try {
    const response = await apiFetch(`${GAME_SESSION_BASE_API}/player/${userId}`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      console.error('Error al obtener sesiones de juego, estado:', response.status);
      return [];
    }

    const jsonResponse = await response.json();
    const data = jsonResponse['data'];

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
  token?: string
): Promise<CampaignRun> {
  const response = await apiFetch(`/api/campaigns/game/character`, {
    method: 'POST',
    body: JSON.stringify({
      gameId: sessionId,
      characterId,
      playerId,
    }),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error('Error al agregar personaje a la sesión');
  }

  const jsonResponse = await response.json().catch(() => null);
  if (!jsonResponse) {
    throw new Error('Empty response from server when adding character');
  }
  return (jsonResponse.data || jsonResponse) as CampaignRun;
}

export async function addPlayerToSession(
  sessionId: string,
  playerId: string,
  token: string
): Promise<CampaignRun> {
  const res = await apiFetch(`${GAME_SESSION_BASE_API}/${sessionId}/players`, {
    method: 'POST',
    body: JSON.stringify({ playerId }),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    let msg = `Error al agregar jugador a la sesión (${res.status})`;
    try {
      const err = await res.json();
      if (err && err.message) msg = `${msg}: ${err.message}`;
    } catch (e) {
      try {
        const text = await res.text();
        if (text) msg = `${msg}: ${text}`;
      } catch {}
    }
    throw new Error(msg);
  }

  const json = await res.json();
  return json.data || json;

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
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  const baseUrl = envUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const normalized = baseUrl.replace(/\/$/, '');
  return `${normalized}/my-campaigns/invite/${token}`;
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
  try {
    await addPlayerToSession(decoded.sessionId, userId, authToken);
  } catch (e) {
    console.error('addPlayerToSession failed:', e);
    throw e;
  }

  try {
    const added = await addCharacterToSession(decoded.sessionId, characterId, userId, authToken);
    return added as CampaignRun;
  } catch (e) {
    console.error('addCharacterToSession failed:', e);
    throw e;
  }
}
