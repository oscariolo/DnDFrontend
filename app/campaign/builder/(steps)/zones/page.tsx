"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadCampaign } from "@/app/lib/services/campaingServices";

interface Zone {
  id: string;
  name: string;
  description: string;
  images: File[];
}

export default function ZoneCreationPage() {
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [currentZone, setCurrentZone] = useState({
    name: "",
    description: "",
    images: [] as File[],
  });

  useEffect(() => {
    const savedZones = localStorage.getItem("campaignZones");
    if (savedZones) {
      // Solo recupera los datos básicos y deja images vacío
      const parsed = JSON.parse(savedZones).map((zone: any) => ({
        ...zone,
        images: [],
      }));
      setZones(parsed);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setCurrentZone((prev) => ({
      ...prev,
      images: [...prev.images, ...fileArray],
    }));
  };

  const removeImage = (index: number) => {
    setCurrentZone((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleCreateZone = () => {
    if (!currentZone.name.trim()) {
      alert("Por favor ingresa un nombre para la zona");
      return;
    }

    if (!currentZone.description.trim()) {
      alert("Por favor ingresa una descripción para la zona");
      return;
    }

    let updatedZones: Zone[];

    if (editingZoneId) {
      updatedZones = zones.map((zone) =>
        zone.id === editingZoneId
          ? { ...zone, name: currentZone.name, description: currentZone.description, images: currentZone.images }
          : zone
      );
      setEditingZoneId(null);
    } else {
      const newZone: Zone = {
        id: Date.now().toString(),
        name: currentZone.name,
        description: currentZone.description,
        images: currentZone.images,
      };
      updatedZones = [newZone, ...zones];
    }

    setZones(updatedZones);
    localStorage.setItem(
      "campaignZones", 
      JSON.stringify(
        updatedZones.map(({ id, name, description }) => ({ id, name, description }))
      )
    );

    setCurrentZone({ name: "", description: "", images: [] });
    setIsCreating(false);
  };

  const handleEditZone = (zone: Zone) => {
    setCurrentZone({
      name: zone.name,
      description: zone.description,
      images: zone.images, 
    });
    setEditingZoneId(zone.id);
    setIsCreating(true);
  };

  const handleDeleteZone = (id: string) => {
    const updatedZones = zones.filter((zone) => zone.id !== id);
    setZones(updatedZones);
    localStorage.setItem("campaignZones", JSON.stringify(updatedZones));
  };

  const handleContinue = async () => {
    if (zones.length === 0) {
      alert("Por favor crea al menos una zona para la campaña");
      return;
    }

    try {
      const savedBasicInfo = localStorage.getItem("campaignBasicInfo");
      if (!savedBasicInfo) {
        alert("No se encontró la información básica de la campaña");
        return;
      }

      const basicInfo = JSON.parse(savedBasicInfo);

      const formattedZones = [];
      const allFiles: File[] = [];
      let imageCounter = 0;

      for (const zone of zones) {
        const zoneImages = [];

        for (const file of zone.images) {
          const filename = `image_${imageCounter}.png`;
          // Renombra el archivo para el backend si lo deseas
          const renamedFile = new File([file], filename, { type: file.type });
          allFiles.push(renamedFile);

          zoneImages.push({
            fileNameReference: filename,
          });

          imageCounter++;
        }

        formattedZones.push({
          zoneName: zone.name,
          description: zone.description,
          images: zoneImages,
        });
      }

      const campaignData = {
        dungeonMasterId: "user-hardcoded-001",
        name: basicInfo.name,
        description: basicInfo.description,
        maxPlayers: basicInfo.numberOfPlayers,
        zones: formattedZones,
      };

      await uploadCampaign(campaignData, allFiles);

      localStorage.removeItem("campaignBasicInfo");
      localStorage.removeItem("campaignZones");

      alert("¡Campaña creada exitosamente!");
      router.push("/campaign");
    } catch (error) {
      alert("Error al crear la campaña. Intenta de nuevo.");
      console.error(error);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Zonas de la Campaña
        </h1>
        <p className="text-lg mb-8 text-gray-600 text-center">
          Crea las diferentes zonas o ubicaciones de tu campaña
        </p>

        {!isCreating && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors shadow-lg flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Nueva Zona
            </button>
          </div>
        )}

        {isCreating && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingZoneId ? "Editar Zona" : "Nueva Zona"}
            </h2>

            <div className="mb-4">
              <label htmlFor="zoneName" className="block text-lg font-semibold mb-2 text-gray-800">
                Nombre de la Zona
              </label>
              <input
                id="zoneName"
                type="text"
                value={currentZone.name}
                onChange={(e) => setCurrentZone({ ...currentZone, name: e.target.value })}
                placeholder="Ej: El Bosque Encantado"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="zoneDescription" className="block text-lg font-semibold mb-2 text-gray-800">
                Descripción
              </label>
              <textarea
                id="zoneDescription"
                value={currentZone.description}
                onChange={(e) => setCurrentZone({ ...currentZone, description: e.target.value })}
                placeholder="Describe esta zona, sus características y peligros..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Imágenes
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
              />

              {currentZone.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {currentZone.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Zone image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingZoneId(null);
                  setCurrentZone({ name: "", description: "", images: [] });
                }}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateZone}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                {editingZoneId ? "Actualizar Zona" : "Guardar Zona"}
              </button>
            </div>
          </div>
        )}

        {zones.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Zonas Creadas ({zones.length})</h2>
            {zones.map((zone) => (
              <div key={zone.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{zone.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditZone(zone)}
                      className="text-amber-600 hover:text-amber-700 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteZone(zone.id)}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{zone.description}</p>

                {zone.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {zone.images.map((file, index) => (
                      <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`${zone.name} image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {zones.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors text-lg shadow-lg"
            >
              Finalizar Campaña
            </button>
          </div>
        )}
      </div>
    </div>
  );
}