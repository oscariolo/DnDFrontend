"use client";

import { CharacterClass } from "@/app/lib/classmodel";
import { useState } from "react";
import Image from "next/image";

// mock classes for testing
const mockClasses: CharacterClass[] = [
  {
    name: "Warrior",
    description: "A fierce combatant with exceptional strength and combat prowess. Masters of weapons and armor.",
    attributes: {
      strength: 16,
      dexterity: 12,
      constitution: 14,
      intelligence: 8,
      wisdom: 10,
      charisma: 10,
    },
  },
  {
    name: "Mage",
    description: "A wielder of arcane magic with vast knowledge. Commands the elements and reality itself.",
    attributes: {
      strength: 8,
      dexterity: 12,
      constitution: 10,
      intelligence: 16,
      wisdom: 14,
      charisma: 10,
    },
  },
  {
    name: "Rogue",
    description: "A cunning and agile character skilled in stealth and precision. Expert in ambush tactics.",
    attributes: {
      strength: 10,
      dexterity: 16,
      constitution: 12,
      intelligence: 12,
      wisdom: 10,
      charisma: 12,
    },
  },
  {
    name: "Cleric",
    description: "A divine spellcaster devoted to a deity. Heals allies and smites enemies with holy power.",
    attributes: {
      strength: 12,
      dexterity: 10,
      constitution: 12,
      intelligence: 10,
      wisdom: 16,
      charisma: 12,
    },
  },
  {
    name: "Ranger",
    description: "A skilled hunter and tracker, master of ranged combat and nature magic.",
    attributes: {
      strength: 12,
      dexterity: 14,
      constitution: 12,
      intelligence: 10,
      wisdom: 14,
      charisma: 10,
    },
  },
  {
    name: "Paladin",
    description: "A holy warrior bound by sacred oaths. Combines martial prowess with divine magic.",
    attributes: {
      strength: 14,
      dexterity: 10,
      constitution: 14,
      intelligence: 10,
      wisdom: 12,
      charisma: 14,
    },
  },
];

interface ClassCardProps {
  characterClass: CharacterClass;
  onClick: () => void;
}

function ClassCard({ characterClass, onClick }: ClassCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center p-4 gap-4"
    >
      <div className="relative h-16 w-16 shrink-0 bg-linear-to-b from-amber-200 to-orange-300 rounded-lg">
        <Image
          src="/images/placeholdercharacter.png"
          alt={characterClass.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-800">{characterClass.name}</h3>
      </div>
    </div>
  );
}

interface ClassModalProps { 
  characterClass: CharacterClass;
  onClose: () => void;
}

function ClassModal({ characterClass, onClose }: ClassModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">{characterClass.name}</h2>
          
          <div className="flex gap-4 mb-6">
            <div className="relative h-32 w-32 shrink-0 bg-linear-to-b from-amber-200 to-orange-300 rounded-lg">
              <Image
                src="/images/placeholdercharacter.png"
                alt={characterClass.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{characterClass.description}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Attributes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 uppercase">Strength</div>
                <div className="text-2xl font-bold text-red-600">{characterClass.attributes.strength}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 uppercase">Dexterity</div>
                <div className="text-2xl font-bold text-green-600">{characterClass.attributes.dexterity}</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 uppercase">Constitution</div>
                <div className="text-2xl font-bold text-orange-600">{characterClass.attributes.constitution}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 uppercase">Intelligence</div>
                <div className="text-2xl font-bold text-blue-600">{characterClass.attributes.intelligence}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 uppercase">Wisdom</div>
                <div className="text-2xl font-bold text-purple-600">{characterClass.attributes.wisdom}</div>
              </div>
              <div className="bg-pink-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 uppercase">Charisma</div>
                <div className="text-2xl font-bold text-pink-600">{characterClass.attributes.charisma}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
            >
              Select Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CharacterBuilderClassPage() {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-100 p-7">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Escoge tu clase</h1>
        
        <div className="flex flex-col gap-4">
          {mockClasses.map((characterClass, index) => (
            <ClassCard
              key={index}
              characterClass={characterClass}
              onClick={() => setSelectedClass(characterClass)}
            />
          ))}
        </div>
      </div>

      {selectedClass && (
        <ClassModal
          characterClass={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
}