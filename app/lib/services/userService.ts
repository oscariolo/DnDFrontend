import { apiFetch } from '@/app/lib/utils/apiFetch';

export interface UserProfile {
  id: string;
  username?: string;
  displayName?: string;
}

export async function getUserById(userId: string, token?: string): Promise<UserProfile | null> {
  try {
    const res = await apiFetch(`/api/users`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    const users: any[] = json?.data || json || [];
    if (!Array.isArray(users)) return null;
    let found = users.find(u => u.id === userId || u.keycloakId === userId || u.username === userId);
    if (!found) {
      found = users.find(u => userId.includes(u.id) || userId.includes(u.keycloakId || ''));
    }

    if (!found) return null;
    return {
      id: found.id,
      username: found.username,
      displayName: found.firstName ? `${found.firstName} ${found.lastName || ''}`.trim() : undefined,
    } as UserProfile;
  } catch (e) {
    console.error('getUserById error', e);
    return null;
  }
}
