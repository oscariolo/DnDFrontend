"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadCampaign } from "@/app/lib/services/campaingServices";

interface CampaignBasicInfo {
  name: string;
  description: string;
  numberOfPlayers: number;
}

export default function BasicInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CampaignBasicInfo>({
    name: "",
    description: "",
    numberOfPlayers: 4,
  });

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem("campaignBasicInfo");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (field: keyof CampaignBasicInfo, value: string | number) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    localStorage.setItem("campaignBasicInfo", JSON.stringify(updatedData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Por favor ingresa un nombre para la campaña");
      return;
    }

    if (!formData.description.trim()) {
      alert("Por favor ingresa una descripción para la campaña");
      return;
    }

    if (formData.numberOfPlayers < 1 || formData.numberOfPlayers > 12) {
      alert("El número de jugadores debe estar entre 1 y 12");
      return;
    }

    // Solo navegamos al siguiente paso, NO enviamos al backend aún
    router.push("/campaign/builder/zones");
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Información Básica de la Campaña
        </h1>
        <p className="text-lg mb-8 text-gray-600 text-center">
          Define los aspectos fundamentales de tu campaña
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label htmlFor="campaignName" className="block text-xl font-semibold mb-3 text-gray-800">
              Nombre de la Campaña
            </label>
            <input
              id="campaignName"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej: La Leyenda del Dragón Olvidado"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800"
              required
            />
          </div>

          {/* Campaign Description */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label htmlFor="campaignDescription" className="block text-xl font-semibold mb-3 text-gray-800">
              Descripción de la Campaña
            </label>
            <textarea
              id="campaignDescription"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe la historia, el escenario y los objetivos de tu campaña..."
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 resize-none"
              required
            />
          </div>

          {/* Number of Players */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label htmlFor="numberOfPlayers" className="block text-xl font-semibold mb-3 text-gray-800">
              Número de Jugadores
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => formData.numberOfPlayers > 1 && handleChange("numberOfPlayers", formData.numberOfPlayers - 1)}
                disabled={formData.numberOfPlayers <= 1}
                className="w-12 h-12 rounded-lg bg-red-500 text-white font-bold text-2xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                -
              </button>
              <input
                id="numberOfPlayers"
                type="number"
                value={formData.numberOfPlayers}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  if (value >= 1 && value <= 12) {
                    handleChange("numberOfPlayers", value);
                  }
                }}
                min="1"
                max="12"
                className="w-24 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 text-center text-3xl font-bold"
                required
              />
              <button
                type="button"
                onClick={() => formData.numberOfPlayers < 12 && handleChange("numberOfPlayers", formData.numberOfPlayers + 1)}
                disabled={formData.numberOfPlayers >= 12}
                className="w-12 h-12 rounded-lg bg-green-500 text-white font-bold text-2xl hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                +
              </button>
              <p className="text-gray-600 text-sm ml-2">
                Jugadores que participarán en esta campaña (1-12)
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors text-lg shadow-lg"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}