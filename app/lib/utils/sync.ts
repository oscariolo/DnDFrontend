import { getPendingActions, removePendingAction } from './db';
import { uploadCampaign } from '../services/campaingServices';
import { createCharacter } from '../services/characterServices';

export async function syncPendingCampaigns(accessToken: string) {
  const actions = await getPendingActions();
  for (const action of actions) {
    if (action.type === 'createCampaign') {
      // Reconstruir los archivos File a partir del buffer
      const files = action.files.map((f: any) =>
        new File([new Uint8Array(f.buffer)], f.name, { type: f.type, lastModified: f.lastModified })
      );
      try {
        await uploadCampaign(action.data, files, accessToken);
        await removePendingAction(action.id);
      } catch (e) {
        // Si falla, lo dejas en la cola
        console.error('Error sincronizando campaña pendiente:', e);
      }
    }
  }
}

export async function syncPendingCharacters(accessToken: string) {
  const actions = await getPendingActions();
  for (const action of actions) {
    if (action.type === 'createCharacter') {
      try {
        await createCharacter(action.data, accessToken);
        await removePendingAction(action.id);
      } catch (e) {
        // Si falla, lo dejas en la cola
        console.error('Error sincronizando personaje pendiente:', e);
      }
    }
  }
}

// Escuchar reconexión
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) syncPendingCampaigns(accessToken);
  });
}