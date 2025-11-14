"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CharacterClass, Attributes } from "@/app/lib/models/classmodel";
import { DescriptionContent } from "@/app/lib/models/charactermodel";
import { RaceResponse } from "@/app/lib/services/characterServices";

export default function SummaryPage() {
  const router = useRouter();
  const [characterName, setCharacterName] = useState("");
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [selectedRace, setSelectedRace] = useState<RaceResponse | null>(null);
  const [baseAttributes, setBaseAttributes] = useState<Attributes | null>(null);
  const [bonusAttributes, setBonusAttributes] = useState<Attributes | null>(null);
  const [description, setDescription] = useState<DescriptionContent | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    // Load all character data from localStorage
    const name = localStorage.getItem("characterName") || "Sin nombre";
    const classData = localStorage.getItem("selectedClass");
    const raceString = localStorage.getItem("selectedRace") || "Sin raza";
    const race:RaceResponse = JSON.parse(raceString);
    const bonus = localStorage.getItem("attributeBonus");
    const desc = localStorage.getItem("characterDescription");
    const tools = localStorage.getItem("selectedTools");
    const skills = localStorage.getItem("selectedSkills");

    setCharacterName(name);
    setSelectedRace(race);

    if (classData) {
      const parsedClass: CharacterClass = JSON.parse(classData);
      setSelectedClass(parsedClass);
      setBaseAttributes(parsedClass.attributes);
    }

    if (bonus) {
      setBonusAttributes(JSON.parse(bonus));
    }

    if (desc) {
      setDescription(JSON.parse(desc));
    }

    if (tools) {
      setSelectedTools(JSON.parse(tools));
    }

    if (skills) {
      setSelectedSkills(JSON.parse(skills));
    }
  }, []);

  const calculateTotal = (attr: keyof Attributes): number => {
    const base = baseAttributes?.[attr] || 0;
    const bonus = bonusAttributes?.[attr] || 0;
    return base + bonus;
  };

  const handleFinish = () => {
    // TODO: Send data to backend
    router.push("/characters");
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

  return (
    <div className="p-8 min-h-screen bg-gray-50">
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
              <p className="text-xl text-gray-800">{selectedClass?.name || "Sin clase"}</p>
            </div>
            <div>
              <span className="text-gray-600 font-semibold">Raza:</span>
              <p className="text-xl text-gray-800">{selectedRace?.name}</p>
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
                  {calculateTotal(key)}
                </div>
                <div className="text-xs text-gray-500">
                  Base: {baseAttributes?.[key] || 0} + Bonus: {bonusAttributes?.[key] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {description && (
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
                <p className="text-gray-800">{description.alignment}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Descripción Física:</span>
                <p className="text-gray-800">{description.physicalDescription}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Rasgos de Personalidad:</span>
                <p className="text-gray-800">{description.personalityTraits}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Historia:</span>
                <p className="text-gray-800">{description.backstory}</p>
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
            {selectedTools.length > 0 ? (
              <ul className="space-y-2">
                {selectedTools.map((tool, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-800">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    {tool}
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
            {selectedSkills.length > 0 ? (
              <ul className="space-y-2">
                {selectedSkills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-800">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    {skill}
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
            className="px-8 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors text-lg shadow-lg"
          >
            Volver a mis personajes
          </button>
        </div>
      </div>
    </div>
  );
}
