
export async function getAllCampaigns() {
  const res = await fetch('http://localhost:8080/api/campaigns');
  if (!res.ok) throw new Error('Error al obtener campañas');
  return res.json();
}

export async function getCampaignsByUserId(userId: string) {
  const res = await fetch(`http://localhost:8080/api/campaigns/user/${userId}`);
  if (!res.ok) throw new Error('Error al obtener campañas del usuario');
  return res.json();
}

// export async function createCampaign(data: any) {
//   const res = await fetch('http://localhost:8080/api/campaigns', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error('Error al crear campaña');
//   return res.json();
// }

export async function uploadCampaign(campaignDetails: any, files: File[]) {
  const formData = new FormData();
  formData.append(
    'campaignDetails',
    new Blob([JSON.stringify(campaignDetails)], { type: 'application/json' })
  );
  files.forEach((file) => {
    formData.append('files', file);
  });

  const res = await fetch('http://localhost:8080/api/campaigns/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Error al subir campaña');
  return res.json();
}