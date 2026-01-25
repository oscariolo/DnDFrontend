// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:80';

export async function getAllCampaigns() {
  const res = await fetch(`${BACKEND_URL}/api/campaigns`);
  if (!res.ok) throw new Error('Error al obtener campañas');
  return res.json();
}

export async function getCampaignsByUserId(userId: string, accessToken?: string) {
  const headers: HeadersInit = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BACKEND_URL}/api/campaigns/user/${userId}`, { headers });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error al obtener campañas del usuario:', res.status, errorText);
    throw new Error(`Error al obtener campañas del usuario (${res.status})`);
  }
  
  return res.json();
}

export async function uploadCampaign(campaignDetails: any, files: File[], accessToken?: string) {
  const formData = new FormData();
  formData.append(
    'campaignDetails',
    new Blob([JSON.stringify(campaignDetails)], { type: 'application/json' })
  );
  files.forEach((file) => {
    formData.append('files', file);
  });

  const headers: HeadersInit = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BACKEND_URL}/api/campaigns/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (res.status === 401) {
    throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
  }
  
  if (!res.ok) {
    throw new Error('Error al subir campaña');
  }
  
  return res.json();
}

export async function getCampaignById(campaignId: string, accessToken?: string) {
  const headers: HeadersInit = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BACKEND_URL}/api/campaigns/${campaignId}`, { headers });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error al obtener campaña por ID:', res.status, errorText);
    throw new Error(`Error al obtener la campaña (${res.status})`);
  }
  
  return res.json();
}