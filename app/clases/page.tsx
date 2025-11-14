'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClassCard from './classCard';
import { mockClasses } from '../lib/consts/mockClasses';
import ClassModal from '../shared/components/detailedClassPopup';
import type { CharacterClass } from '../lib/models/classmodel';

export default function ClasesPage() {
  const [selected, setSelected] = useState<CharacterClass | null>(null);
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FEFEFC' }}>
      <div className="w-full max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-semibold mb-4">Clases</h1>
        <p className="text-gray-700 mb-8">
          Browse available classes, learn abilities and start building your hero.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClasses.map((cls) => (
            <ClassCard
              key={cls.name}
              title={cls.name}
              description={cls.description}
              srcimg={`/images/${cls.name.toLowerCase().replace(/\s+/g, '-')}.png`}
              onSelect={() => setSelected(cls)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <ClassModal
          characterClass={selected}
          onClose={() => setSelected(null)}
          onClassSelected={() => {
            // Optional: persist full class object for later steps
            try {
              localStorage.setItem('selectedClass', JSON.stringify(selected));
            } catch {}
            router.push(`/characters/builder/race?class=${encodeURIComponent(selected.name)}`);
          }}
        />
      )}
    </main>
  );
}