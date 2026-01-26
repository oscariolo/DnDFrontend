const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:80';
import { apiFetch } from '@/app/lib/utils/apiFetch';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  keycloakId?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export async function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiFetch(`/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        emailOrUsername: credentials.username,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
      throw new Error(error.message || 'Login failed');
    }

    const json = await response.json();
    const data = (json && json.data) ? json.data : json;

    const user: User = data.user || {
      id: data.userId || '',
      username: data.username || credentials.username,
      email: data.email || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      keycloakId: data.keycloakId,
    };

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend at ${BACKEND_URL}. Make sure your Spring backend is running.`);
    }
    throw error;
  }
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await apiFetch(`/api/users/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend at ${BACKEND_URL}. Make sure your Spring backend is running.`);
    }
    throw error;
  }
}

export async function logoutUser(token: string): Promise<void> {
  try {
    await apiFetch(`/api/users/logout`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  accessToken: string
): Promise<Response> {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
  };

  return apiFetch(url, { ...options, headers });
}

export async function refreshAuth(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number; }> {
  try {
    const response = await apiFetch(`/api/auth/refresh`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
      throw new Error(err.message || 'Refresh failed');
    }

    const json = await response.json();
    const data = (json && json.data) ? json.data : json;

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    };
  } catch (error) {
    throw error;
  }
}
