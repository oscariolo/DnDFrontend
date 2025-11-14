"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DescriptionContent } from '@/app/lib/models/charactermodel';

const ALIGNMENT_LIST = [
  {item:"Cáotico Malvado", description:"Tiende a actuar según sus propios deseos y caprichos, sin importar las reglas o leyes. Busca su propio beneficio a expensas de los demás."},
  {item:"Cáotico Neutral", description:"Valora la libertad personal y la independencia, actuando según sus propios deseos sin seguir reglas estrictas ni preocuparse por el bien o el mal."},
  {item:"Cáotico Bueno", description:"Actúa según sus propios deseos y caprichos, pero generalmente busca hacer el bien y ayudar a los demás, incluso si eso significa romper las reglas."},
  {item:"Neutral Malvado", description:"Busca su propio beneficio sin preocuparse por las reglas o el bienestar de los demás. No se siente obligado a seguir leyes, pero tampoco busca activamente el caos."},
  {item:"Neutral Puro", description:"No se inclina ni hacia el bien ni hacia el mal, ni hacia el orden ni hacia el caos. Actúa según lo que considere más apropiado en cada situación."},
  {item:"Neutral Bueno", description:"Busca hacer el bien y ayudar a los demás, pero no se siente obligado a seguir reglas estrictas. Actúa según lo que considere correcto en cada situación."},
  {item:"Legal Malvado", description:"Sigue un código de conducta estricto, pero utiliza las reglas para su propio beneficio, a menudo a expensas de los demás."},
  {item:"Legal Neutral", description:"Sigue un código de conducta estricto y respeta las leyes y tradiciones, sin inclinarse hacia el bien o el mal."},
  {item:"Legal Bueno", description:"Sigue un código de conducta estricto y busca hacer el bien dentro del marco de las leyes y tradiciones."},
];

export default function DetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DescriptionContent>({
    alignment: '',
    physicalDescription: '',
    personalityTraits: '',
    backstory: '',
  });

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('characterDescription');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const selectedAlignment = ALIGNMENT_LIST.find(a => a.item === formData.alignment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('characterDescription', JSON.stringify(formData));
    router.push('/characters/builder/baseitems');
  };

  const handleChange = (field: keyof DescriptionContent, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    localStorage.setItem('characterDescription', JSON.stringify(updatedData));
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">Detalles del personaje</h1>
        <p className="text-lg mb-8 text-gray-600 text-center">
          Describe las características físicas, ideologías, y forma de vida de tu personaje
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alignment Dropdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <label htmlFor="alignment" className="block text-xl font-semibold mb-3 text-gray-800">
              Alineación
            </label>
            <select
              id="alignment"
              value={formData.alignment}
              onChange={(e) => handleChange('alignment', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800"
            >
              <option value="">Selecciona una alineación</option>
              {ALIGNMENT_LIST.map((alignment) => (
                <option key={alignment.item} value={alignment.item}>
                  {alignment.item}
                </option>
              ))}
            </select>
            
            {selectedAlignment && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-gray-700">{selectedAlignment.description}</p>
              </div>
            )}
          </div>

          {/* Physical Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <label htmlFor="physicalDescription" className="block text-xl font-semibold mb-3 text-gray-800">
              Descripción Física
            </label>
            <textarea
              id="physicalDescription"
              value={formData.physicalDescription}
              onChange={(e) => handleChange('physicalDescription', e.target.value)}
              placeholder="Describe la apariencia de tu personaje..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 resize-none"
              required
            />
          </div>

          {/* Personality Traits */}
          <div className="bg-white rounded-lg shadow p-6">
            <label htmlFor="personalityTraits" className="block text-xl font-semibold mb-3 text-gray-800">
              Rasgos de Personalidad
            </label>
            <textarea
              id="personalityTraits"
              value={formData.personalityTraits}
              onChange={(e) => handleChange('personalityTraits', e.target.value)}
              placeholder="Describe la personalidad de tu personaje..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 resize-none"
              required
            />
          </div>

          {/* Backstory */}
          <div className="bg-white rounded-lg shadow p-6">
            <label htmlFor="backstory" className="block text-xl font-semibold mb-3 text-gray-800">
              Historia de Fondo
            </label>
            <textarea
              id="backstory"
              value={formData.backstory}
              onChange={(e) => handleChange('backstory', e.target.value)}
              placeholder="Cuenta la historia de tu personaje..."
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 resize-none"
              required
            />
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
