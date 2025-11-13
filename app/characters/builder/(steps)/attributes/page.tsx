"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CharacterClass, Attributes } from "@/app/lib/models/classmodel";
import Image from "next/image";

export default function AttributesPage() {
  const router = useRouter();
  const [baseAttributes, setBaseAttributes] = useState<Attributes>({
    constitution: 0,
    intelligence: 0,
    strength: 0,
    dexterity: 0,
    charisma: 0,
    wisdom: 0,
  });
  const [bonusPoints, setBonusPoints] = useState<Attributes>({
    constitution: 0,
    intelligence: 0,
    strength: 0,
    dexterity: 0,
    charisma: 0,
    wisdom: 0,
  });
  const [remainingPoints, setRemainingPoints] = useState(5);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);

  useEffect(() => {
    // Load selected class from localStorage
    const storedClass = localStorage.getItem("selectedClass");
    if (storedClass) {
      const parsedClass: CharacterClass = JSON.parse(storedClass);
      setSelectedClass(parsedClass);
      setBaseAttributes(parsedClass.attributes);
    }

    // Load saved bonus points if any
    const storedBonus = localStorage.getItem("attributeBonus");
    if (storedBonus) {
      setBonusPoints(JSON.parse(storedBonus));
      const parsed = JSON.parse(storedBonus);
      const usedPoints = Object.values(parsed).reduce((sum: number, val) => sum + (val as number), 0);
      setRemainingPoints(5 - usedPoints);
    }
  }, []);

  const handleIncrement = (attribute: keyof Attributes) => {
    if (remainingPoints > 0) {
      setBonusPoints((prev) => {
        const updated = { ...prev, [attribute]: prev[attribute] + 1 };
        localStorage.setItem("attributeBonus", JSON.stringify(updated));
        return updated;
      });
      setRemainingPoints((prev) => prev - 1);
    }
  };

  const handleDecrement = (attribute: keyof Attributes) => {
    if (bonusPoints[attribute] > 0) {
      setBonusPoints((prev) => {
        const updated = { ...prev, [attribute]: prev[attribute] - 1 };
        localStorage.setItem("attributeBonus", JSON.stringify(updated));
        return updated;
      });
      setRemainingPoints((prev) => prev + 1);
    }
  };

  const handleContinue = () => {
    router.push("/characters/builder/details");
  };

  const attributes: { key: keyof Attributes; label: string; iconUrl:string }[] = [
    { key: "constitution", label: "Constitution", iconUrl: "/icons/fist.svg" },
    { key: "intelligence", label: "Intelligence" , iconUrl: "/icons/brain.svg"},
    { key: "strength", label: "Strength" , iconUrl: "/icons/weight-lifting-up.svg" },
    { key: "dexterity", label: "Dexterity", iconUrl: "/icons/bullseye.svg" },
    { key: "charisma", label: "Charisma", iconUrl: "/icons/duality-mask.svg" },
    { key: "wisdom", label: "Wisdom", iconUrl: "/icons/owl.svg" },
  ];

  return (
    <div className="p-8 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          Bonus de atributos
        </h1>
        
        {selectedClass ? (
          <p className="text-center text-gray-700 mb-8">
            Atributos base de clase: <span className="font-semibold">{selectedClass.name}</span>
          </p>
        ) : (
          <p className="text-center text-red-600 mb-8">
            No se ha seleccionado aun una clase base....
          </p>
        )}

        <div className="bg-gray-50 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Puntos de habilidad
            </h2>
            <div className="text-xl font-bold text-amber-700">
              Restantes: {remainingPoints}/5
            </div>
          </div>

          <div className="space-y-4">
            {attributes.map(({ key, label, iconUrl }) => {
              const base = baseAttributes[key];
              const bonus = bonusPoints[key];
              const total = base + bonus;

              return (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row items-center sm:justify-between p-4 bg-gray-300 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-4 mb-3 sm:mb-0 w-full sm:w-auto justify-center sm:justify-start sm:flex-1">
                    <div className="w-12 h-12 relative shrink-0">
                      <Image
                        src={iconUrl}
                        alt={label}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Base: {base} + Bonus: {bonus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDecrement(key)}
                      disabled={bonus === 0}
                      className="w-10 h-10 rounded-full bg-red-500 text-black font-bold text-xl hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>

                    <div className="text-3xl font-bold text-gray-900 min-w-[60px] text-center">
                      {total}
                    </div>

                    <button
                      onClick={() => handleIncrement(key)}
                      disabled={remainingPoints === 0}
                      className="w-10 h-10 rounded-full bg-green-500 text-white font-bold text-xl hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
