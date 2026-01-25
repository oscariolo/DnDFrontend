const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:80';
import { refreshAuth } from '@/app/lib/services/authService';

let refreshing: Promise<void> | null = null;
let latestAccessToken: string | null = null;

function getStoredAccessToken() {
  return localStorage.getItem('accessToken');
}

function getStoredRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function saveTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem('accessToken', accessToken);
  latestAccessToken = accessToken;
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  try {
    window.dispatchEvent(new CustomEvent('tokensUpdated', { detail: { accessToken, refreshToken } }));
  } catch (e) {
    
  }
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  latestAccessToken = null;
  try {
    window.dispatchEvent(new CustomEvent('tokensUpdated', { detail: { accessToken: null, refreshToken: null } }));
  } catch (e) {

  }
}
export function setApiTokens(accessToken: string, refreshToken?: string) {
  saveTokens(accessToken, refreshToken);
}

export function clearApiTokens() {
  clearTokens();
}

async function doRefreshIfNeeded() {
  if (refreshing) return refreshing;

  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  refreshing = (async () => {
    try {
      const tokens = await refreshAuth(refreshToken);
      if (tokens && tokens.accessToken) {
        saveTokens(tokens.accessToken, tokens.refreshToken);
      } else {
        clearTokens();
        throw new Error('Refresh failed: no tokens returned');
      }
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const url = typeof input === 'string' && input.startsWith('/') ? `${BACKEND_URL}${input}` : input;

  const access = latestAccessToken || getStoredAccessToken();

  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;
  const headers = {
    ...(init.headers || {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  } as Record<string, string>;

  if (access) headers['Authorization'] = `Bearer ${access}`;

  let res = await fetch(url, { ...init, headers, credentials: (init && (init as any).credentials) || 'include' });

  if (res.status === 401) {
    try {
      await doRefreshIfNeeded();
      const newAccess = latestAccessToken || getStoredAccessToken();
      if (!newAccess) throw new Error('Unable to refresh token');
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newAccess}`,
      } as Record<string, string>;

      res = await fetch(url, { ...init, headers: retryHeaders, credentials: (init && (init as any).credentials) || 'include' });
    } catch (e) {
      clearTokens();
      throw new Error('Authentication required');
    }
  }

  return res;
}
