import { CharacterClass } from "@/app/lib/classmodel";
import Image from "next/image";

interface ClassModalProps {
  characterClass: CharacterClass;
  onClose: () => void;
  onClassSelected: () => void;
  isInline?: boolean;
  onChangeClass?: () => void;
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
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 uppercase">Fuerza</div>
            <div className="text-2xl font-bold text-red-600">{characterClass.attributes.strength}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 uppercase">Destreza</div>
            <div className="text-2xl font-bold text-green-600">{characterClass.attributes.dexterity}</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 uppercase">Robustez</div>
            <div className="text-2xl font-bold text-orange-600">{characterClass.attributes.constitution}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 uppercase">Inteligencia</div>
            <div className="text-2xl font-bold text-blue-600">{characterClass.attributes.intelligence}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 uppercase">Sabiduria</div>
            <div className="text-2xl font-bold text-purple-600">{characterClass.attributes.wisdom}</div>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 uppercase">Carisma</div>
            <div className="text-2xl font-bold text-pink-600">{characterClass.attributes.charisma}</div>
          </div>
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
