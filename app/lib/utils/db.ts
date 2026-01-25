import { openDB } from 'idb';

export const getDbPromise = () => {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB solo está disponible en el cliente");
  }
  return openDB('DnDAppDB', 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('characters')) {
        db.createObjectStore('characters');
      }
      if (!db.objectStoreNames.contains('pendingActions')) {
        db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images');
      }
    },
  });
};

// Guardar acción pendiente
export async function addPendingAction(action: any) {
  const db = await getDbPromise();
  await db.add('pendingActions', action);
}

export async function addPendingCampaign(campaign: any, files: File[]) {
  const db = await getDbPromise();
  await db.add('pendingActions', {
    type: 'createCampaign',
    data: campaign,
    files: await Promise.all(files.map(async (file) => ({
      name: file.name,
      type: file.type,
      lastModified: file.lastModified,
      buffer: await file.arrayBuffer(),
    }))),
    timestamp: Date.now(),
  });
}

// Guarda todos los personajes en IndexedDB
export async function saveCharactersToDB(characters: any[]) {
  const db = await getDbPromise();
  const tx = db.transaction("characters", "readwrite");
  const store = tx.objectStore("characters");
  await store.clear();
  for (const char of characters) {
    await store.put(char, char.id || char._id?.$oid);
  }
  await tx.done;
}

// Recupera un personaje por ID
export async function getCharacterFromDB(id: string) {
  const db = await getDbPromise();
  return db.get("characters", id);
}

export async function addPendingCharacter(character: any) {
  const db = await getDbPromise();
  await db.add('pendingActions', {
    type: 'createCharacter',
    data: character,
    timestamp: Date.now(),
  });
}

export async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudo descargar la imagen (CORS)");
    const buffer = await res.arrayBuffer();
    return new File([buffer], filename, { type: mimeType });
  } catch (e) {
    alert("No se pudo copiar la imagen de la campaña por restricciones de CORS.");
    throw e;
  }
}

// Obtener todas las acciones pendientes
export async function getPendingActions() {
  const db = await getDbPromise();
  return db.getAll('pendingActions');
}

// Eliminar acción pendiente
export async function removePendingAction(id: number) {
  const db = await getDbPromise();
  await db.delete('pendingActions', id);
}

// Guarda una imagen de zona
export async function saveZoneImage(zoneId: string, imageIndex: number, file: File) {
  const db = await getDbPromise();
  await db.put('images', file, `${zoneId}_${imageIndex}`);
}

// Recupera una imagen de zona
export async function getZoneImage(zoneId: string, imageIndex: number): Promise<File | undefined> {
  const db = await getDbPromise();
  return db.get('images', `${zoneId}_${imageIndex}`);
}

// Elimina una imagen de zona
export async function removeZoneImage(zoneId: string, imageIndex: number) {
  const db = await getDbPromise();
  await db.delete('images', `${zoneId}_${imageIndex}`);
}