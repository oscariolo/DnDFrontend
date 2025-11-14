'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const TABS = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'characters', label: 'Characters' },
];

export default function ProfilePage() {
  const [active, setActive] = useState<string>(TABS[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: React.KeyboardEvent) {
    const idx = TABS.findIndex((t) => t.id === active);
    if (e.key === 'ArrowRight') {
      const next = TABS[(idx + 1) % TABS.length].id;
      setActive(next);
      tabRefs.current[(idx + 1) % TABS.length]?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prev = TABS[(idx - 1 + TABS.length) % TABS.length].id;
      setActive(prev);
      tabRefs.current[(idx - 1 + TABS.length) % TABS.length]?.focus();
    }
  }

  useEffect(() => {}, [active]);

  return (
    <main className="min-h-screen px-6 py-12 bg-[#FEFEFC]">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold text-gray-900 mb-8">User&apos;s Profile</h1>
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#F4F4F4' }}>
          <div
            role="tablist"
            aria-label="Profile tabs"
            onKeyDown={onKeyDown}
            className="flex gap-4 p-6"
          >
            {TABS.map((tab, i) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  onClick={() => setActive(tab.id)}
                  className={
                    'px-8 py-4 rounded-lg text-lg font-semibold tracking-wide focus:outline-none transition ' +
                    (isActive
                      ? 'bg-white text-black shadow-md'
                      : 'bg-transparent text-black hover:bg-white/50')
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="p-8">
            <section
              id="panel-campaigns"
              role="tabpanel"
              aria-labelledby="tab-campaigns"
              hidden={active !== 'campaigns'}
              className={active === 'campaigns' ? 'block' : 'hidden'}
            >
              <div className="rounded-xl bg-white shadow-md p-8">
                <h2 className="text-2xl font-semibold mb-4 text-black">Your Campaigns</h2>
                <p className="text-black mb-6 text-lg">No campaigns yet. Create and manage your campaigns here.</p>
                <Link
                  href="/campaign/builder"
                  className="inline-block px-8 py-4 bg-[#E40712] hover:opacity-90 text-white text-lg font-bold rounded-lg shadow-lg"
                >
                  Create Campaign
                </Link>
              </div>
            </section>

            <section
              id="panel-characters"
              role="tabpanel"
              aria-labelledby="tab-characters"
              hidden={active !== 'characters'}
              className={active === 'characters' ? 'block' : 'hidden'}
            >
              <div className="rounded-xl bg-white shadow-md p-8">
                <h2 className="text-2xl font-semibold mb-4 text-black">Your Characters</h2>
                <p className="text-black mb-6 text-lg">No characters yet. Start creating heroes for your adventures.</p>
                <Link
                  href="/characters/builder"
                  className="inline-block px-8 py-4 bg-[#E40712] hover:opacity-90 text-white text-lg font-bold rounded-lg shadow-lg"
                >
                  Create Character
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}