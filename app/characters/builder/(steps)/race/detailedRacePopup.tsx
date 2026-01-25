import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { RaceDetails } from "@/app/lib/models/charactermodel";

interface RaceModalProps {
  race: RaceDetails;
  onClose: () => void;
  onRaceSelected: () => void;
  isInline?: boolean;
  onChangeRace?: () => void;
}

export default function RaceModal({ 
  race, 
  onClose, 
  onRaceSelected, 
  isInline = false,
  onChangeRace 
}: RaceModalProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // 1. Declara handleSelect ANTES de usarlo
  const handleSelect = () => {
    onClose(); // Esto desmonta el modal y limpia el overflow
    setTimeout(() => {
      onRaceSelected(); // O navega al siguiente paso
    }, 0);
  };

  // 2. Luego define el contenido
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

      <h2 className="text-3xl font-bold text-gray-800 mb-4">{race.name}</h2>
      
      <div className="flex gap-4 mb-6">
        <div className="relative h-32 w-32 shrink-0 bg-linear-to-b from-amber-200 to-orange-300 rounded-lg">
          <Image
            src="/images/placeholdercharacter.png"
            alt={race.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Descripción</h3>
          <p className="text-gray-600 leading-relaxed">{race.alignment}</p>
        </div>
      </div>

      {/* Age Dropdown */}
      {race.size_description && (
        <div className="mb-4 border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('size_dec')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-700">Edad</span>
            <ChevronDown 
              className={`transition-transform ${openSections.has('size_dec') ? 'rotate-180' : ''}`}
              size={20}
            />
          </button>
          {openSections.has('size_dec') && (
            <div className="p-4 pt-0 text-gray-600">
              {race.size_description}
            </div>
          )}
        </div>
      )}

      {/* Edad description dropdown */}
      {race.age && (
        <div className="mb-4 border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('age')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-700">Descripción de apariencia</span>
            <ChevronDown 
              className={`transition-transform ${openSections.has('age') ? 'rotate-180' : ''}`}
              size={20}
            />
          </button>
          {openSections.has('age') && (
            <div className="p-4 pt-0 text-gray-600">
              {race.age}
            </div>
          )}
        </div>
      )}

      {/* Traits Dropdown */}
      {race.traits && race.traits.length > 0 && (
        <div className="mb-4 border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('traits')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-700">Rasgos ({race.traits.length})</span>
            <ChevronDown 
              className={`transition-transform ${openSections.has('traits') ? 'rotate-180' : ''}`}
              size={20}
            />
          </button>
          {openSections.has('traits') && (
            <div className="p-4 pt-0">
              {race.traits.map((trait, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h4 className="font-semibold text-gray-700 mb-1">{trait.name}</h4>
                  <p className="text-gray-600 text-sm">{trait.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        {isInline && onChangeRace ? (
          <>
            <button
              onClick={onChangeRace}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cambiar raza
            </button>
            <button
              onClick={handleSelect}
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
              onClick={handleSelect}
              className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 transition-colors font-semibold"
            >
              Seleccionar raza
            </button>
          </>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    setMounted(true);
    // Opcional: bloquear scroll del body
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (isInline) {
    return (
      <div className="bg-white rounded-lg shadow-2xl w-full">
        {content}
      </div>
    );
  }

  const modal = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-99999"
      onClick={onClose}
      style={{ overscrollBehavior: "contain" }}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full h-[90vh] overflow-y-auto z-100000"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );

  // Solo renderiza el portal en el cliente
  if (!mounted) return null;

  return createPortal(modal, document.body);
}
