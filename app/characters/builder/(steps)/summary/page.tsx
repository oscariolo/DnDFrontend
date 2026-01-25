"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CharacterClass, Attributes } from "@/app/lib/models/classmodel";
import { CustomCharacter, DescriptionContent } from "@/app/lib/models/charactermodel";
import { mockClasses } from "@/app/lib/consts/mockClasses";
import { getFullRaceData, createCharacter } from "@/app/lib/services/characterServices";
import { useAuth } from "@/app/lib/context/AuthContext";
import { addPendingCharacter } from "@/app/lib/utils/db";

export default function SummaryPage() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated } = useAuth();
  const [character, setCharacter] = useState<CustomCharacter | null>(null);
  const [classDetails, setClassDetails] = useState<CharacterClass | null>(null);
  const [raceName, setRaceName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load complete character from customCharacter
    const savedCharacter = localStorage.getItem("customCharacter");
    if (savedCharacter) {
      const parsedCharacter: CustomCharacter = JSON.parse(savedCharacter);
      setCharacter(parsedCharacter);
      
      // Find class details for attribute breakdown
      if (parsedCharacter.class) {
        const foundClass = mockClasses.find(c => c.name === parsedCharacter.class);
        setClassDetails(foundClass || null);
      }
      
      // Set race name
      if (parsedCharacter.race) {
        setRaceName(parsedCharacter.race);
      }
    }
  }, []);

  const calculateBonus = (attr: keyof Attributes): number => {
    if (!character || !classDetails) return 0;
    return (character.currentAttributes[attr] || 0) - classDetails.attributes[attr];
  };

  const handleFinish = async () => {
    if (!character || isLoading) return;
    
    if (!isAuthenticated || !accessToken || !user) {
      alert("Debes iniciar sesión para crear un personaje.");
      router.push('/auth');
      return;
    }

    setIsLoading(true);

    // Arma el objeto para el backend
    const backendCharacter = {
      characterType: "playable",
      creatorId: user.id,
      name: character.name,
      characterDescription: character.description?.backstory || "",
      attributes: character.currentAttributes,
      characterClass: character.class,
      race: character.race,
      skills: character.skills?.map(s => s.name) || [],
      inventoryItems: character.startItems?.map(i => i.name) || [],
    };

    try {
      if (!navigator.onLine) {
        await addPendingCharacter(backendCharacter);
        alert("Estás sin conexión. El personaje se guardó localmente y se subirá cuando recuperes conexión.");
        localStorage.removeItem("customCharacter");
        router.push("/characters");
        return;
      }
      await createCharacter(backendCharacter, accessToken);
      localStorage.removeItem("customCharacter");
      alert("¡Personaje creado exitosamente!");
      router.push("/characters");
    } catch (error) {
      alert("Error al crear el personaje. Intenta de nuevo.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (section: string) => {
    router.push(`/characters/builder/${section}`);
  };

  const attributeLabels: { key: keyof Attributes; label: string; iconUrl: string }[] = [
    { key: "strength", label: "Fuerza", iconUrl: "/icons/weight-lifting-up.svg" },
    { key: "dexterity", label: "Destreza", iconUrl: "/icons/bullseye.svg" },
    { key: "constitution", label: "Robustez", iconUrl: "/icons/fist.svg" },
    { key: "intelligence", label: "Inteligencia", iconUrl: "/icons/brain.svg" },
    { key: "wisdom", label: "Sabiduria", iconUrl: "/icons/owl.svg" },
    { key: "charisma", label: "Carisma", iconUrl: "/icons/duality-mask.svg" },
  ];

  if (!character) {
    return (
      <div className="p-8 min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Resumen de características
        </h1>

        {/* Character Name & Basic Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Información Básica</h2>
            <button
              onClick={() => handleEdit("class")}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              Editar
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600 font-semibold">Clase:</span>
              <p className="text-xl text-gray-800">{character.class || "Sin clase"}</p>
            </div>
            <div>
              <span className="text-gray-600 font-semibold">Raza:</span>
              <p className="text-xl text-gray-800">{raceName || "Sin raza"}</p>
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Atributos</h2>
            <button
              onClick={() => handleEdit("attributes")}
              className="text-amber-600 hover:text-amber-700 font-semibold"
            >
              Editar
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {attributeLabels.map(({ key, label, iconUrl }) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 relative shrink-0">
                    <Image src={iconUrl} alt={label} fill className="object-contain" />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 uppercase">
                    {label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  {character.currentAttributes[key] || 0}
                </div>
                <div className="text-xs text-gray-500">
                  Base: {classDetails?.attributes[key] || 0} + Bonus: {calculateBonus(key)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {character.description && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Descripción</h2>
              <button
                onClick={() => handleEdit("details")}
                className="text-amber-600 hover:text-amber-700 font-semibold"
              >
                Editar
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-gray-600 font-semibold">Alineación:</span>
                <p className="text-gray-800">{character.description.alignment}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Descripción Física:</span>
                <p className="text-gray-800">{character.description.physicalDescription}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Rasgos de Personalidad:</span>
                <p className="text-gray-800">{character.description.personalityTraits}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Historia:</span>
                <p className="text-gray-800">{character.description.backstory}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tools & Skills */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Herramientas</h2>
              <button
                onClick={() => handleEdit("baseitems")}
                className="text-amber-600 hover:text-amber-700 font-semibold"
              >
                Editar
              </button>
            </div>
            {character.startItems && character.startItems.length > 0 ? (
              <ul className="space-y-2">
                {character.startItems.map((tool, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-800">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    {tool.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No se seleccionaron herramientas</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Habilidades</h2>
              <button
                onClick={() => handleEdit("baseitems")}
                className="text-amber-600 hover:text-amber-700 font-semibold"
              >
                Editar
              </button>
            </div>
            {character.skills && character.skills.length > 0 ? (
              <ul className="space-y-2">
                {character.skills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-800">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No se seleccionaron habilidades</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleFinish}
            disabled={isLoading}
            className="px-8 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors text-lg shadow-lg"
          >
            {isLoading ? "Creando Personaje..." : "Crear Personaje"}
          </button>
        </div>
      </div>
    </div>
  );
}
