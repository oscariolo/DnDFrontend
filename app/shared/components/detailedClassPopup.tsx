import { CharacterClass } from "@/app/lib/models/classmodel";
import Image from "next/image";

interface ClassModalProps {
  characterClass: CharacterClass;
  onClose: () => void;
  onClassSelected: () => void;
  isInline?: boolean;
  onChangeClass?: () => void;
}

interface AttributeCardProps {
  name: string;
  value: number;
  iconPath: string;
  bgColor: string;
  textColor: string;
}

function AttributeCard({ name, value, iconPath, bgColor, textColor }: AttributeCardProps) {
  return (
    <div className={`${bgColor} rounded-lg overflow-hidden`}>
      <div className="flex items-center gap-2 bg-gray-300 px-3 py-2">
        <div className="w-6 h-6 relative shrink-0">
          <Image src={iconPath} alt={name} fill className="object-contain" />
        </div>
        <div className="text-sm text-gray-600 uppercase font-semibold">{name}</div>
      </div>
      <div className={`text-2xl font-bold ${textColor} p-3`}>{value}</div>
    </div>
  );
}

export default function ClassModal({ 
  characterClass, 
  onClose, 
  onClassSelected, 
  isInline = false,
  onChangeClass 
}: ClassModalProps) {
  const content = (
    <div className="p-6 relative">
      {!isInline && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Descripción</h3>
          <p className="text-gray-600 leading-relaxed">{characterClass.description}</p>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Atributos base</h3>
        <div className="grid grid-cols-2 gap-4">
          <AttributeCard 
            name="Fuerza" 
            value={characterClass.attributes.strength} 
            iconPath="/icons/weight-lifting-up.svg"
            bgColor="bg-red-50"
            textColor="text-red-600"
          />
          <AttributeCard 
            name="Destreza" 
            value={characterClass.attributes.dexterity} 
            iconPath="/icons/bullseye.svg"
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <AttributeCard 
            name="Robustez" 
            value={characterClass.attributes.constitution} 
            iconPath="/icons/fist.svg"
            bgColor="bg-orange-50"
            textColor="text-orange-600"
          />
          <AttributeCard 
            name="Inteligencia" 
            value={characterClass.attributes.intelligence} 
            iconPath="/icons/brain.svg"
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <AttributeCard 
            name="Sabiduria" 
            value={characterClass.attributes.wisdom} 
            iconPath="/icons/owl.svg"
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <AttributeCard 
            name="Carisma" 
            value={characterClass.attributes.charisma} 
            iconPath="/icons/duality-mask.svg"
            bgColor="bg-pink-50"
            textColor="text-pink-600"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {isInline && onChangeClass ? (
          <>
            <button
              onClick={onChangeClass}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cambiar clase
            </button>
            <button
              onClick={onClassSelected}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Continuar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={onClassSelected}
              className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 transition-colors font-semibold"
            >
              Seleccionar clase
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (isInline) {
    return (
      <div className="bg-white rounded-lg shadow-2xl w-full">
        {content}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black opacity-95 bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
}
