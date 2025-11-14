"use client";


import { use, useEffect, useState } from "react";
import Image from "next/image";
import ClassModal from "../../../../shared/components/detailedClassPopup";
import { ChevronRight } from "lucide-react";
import { mockClasses } from "@/app/lib/consts/mockClasses";
import { useRouter } from "next/navigation";
import { CustomCharacter } from "@/app/lib/models/charactermodel";
import { CharacterClass } from "@/app/lib/models/classmodel";

interface ClassCardProps {
  characterClass: CharacterClass;
  imgsrc?: string;
  onClick: () => void;
}

function ClassCard({ characterClass, imgsrc, onClick }: ClassCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center p-4 gap-4"
    >
      <div className="relative h-12 w-12 shrink-0 bg-linear-to-b from-amber-200 to-orange-300 rounded-lg">
        <Image
          src={imgsrc || "/images/placeholdercharacter.png"}
          alt={characterClass.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-800">{characterClass.name}</h3>
      </div>
      <div className="ml-auto">
        <ChevronRight color="#4b8ed7" strokeWidth={3} size={30} />
      </div>
    </div>
  );
}

export default function CharacterBuilderClassPage() {
  const [detailClass, setDetailClass] = useState<CharacterClass | null>(null);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [showClassList, setShowClassList] = useState(true);
  const router= useRouter();

  useEffect(() => {
    const savedCharacter = localStorage.getItem('customCharacter');
    if (savedCharacter) {
      const parsedCustomCharacter: CustomCharacter = JSON.parse(savedCharacter);
      if (parsedCustomCharacter.class) {
        const characterDetails = mockClasses.find(c => c.name === parsedCustomCharacter.class);
        setSelectedClass(characterDetails || null);
        setShowClassList(false);
      }
    }
  }, []);

  const saveChosenClass = (characterClass: CharacterClass) => {
    const savedCharacter = localStorage.getItem('customCharacter');
    const character: CustomCharacter = savedCharacter 
      ? JSON.parse(savedCharacter)
      : {
          name: "",
          class: "",
          currentAttributes: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
          race: "",
          description: { alignment: "", physicalDescription: "", personalityTraits: "", backstory: "" },
          skills: [],
          startItems: [],
        };
    
    character.class = characterClass.name;
    // Initialize base attributes from class
    character.currentAttributes = { ...characterClass.attributes };
    localStorage.setItem('customCharacter', JSON.stringify(character));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl text-center font-bold text-gray-800 mb-8">Escoge tu clase</h1>
        <h1 className="text-lg text-center font-semibold text-gray-700 mb-6">Según tu clase tendrás atributos base con los cuales tendras mas proficiencia al inicio de la campaña</h1>

        
        {showClassList &&(
          <div className="flex flex-col gap-4">
            {mockClasses.map((characterClass, index) => (
              <ClassCard
                key={index}
                characterClass={characterClass}
                onClick={() => setDetailClass(characterClass)}
              />
            ))}
          </div>
        )
        }
        
        {!showClassList && selectedClass && (
          <ClassModal
            characterClass={selectedClass}
            onClose={() => {setShowClassList(true);}}
            onClassSelected={()=>{
              router.push('/characters/builder/race');
            }}
            onChangeClass={()=>{
              setSelectedClass(null);
              setShowClassList(true);
              saveChosenClass(selectedClass);
            
            }}
            isInline={true}
          ></ClassModal>
        )
        }
        
        {detailClass  &&  (
          <ClassModal
            characterClass={detailClass}
            onClose={() => setDetailClass(null)}
            onClassSelected={()=>{
              // Selecciona la clase y cierra el modal
              setSelectedClass(detailClass);
              setShowClassList(false);
              saveChosenClass(detailClass);
              router.push('/characters/builder/race');
            }}
          />
        )}  
      </div>
    </div>
  );
}