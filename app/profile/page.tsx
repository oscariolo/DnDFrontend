'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import { useRouter } from 'next/navigation';

const TABS = [
  { id: 'campaigns', label: 'Campañas' },
  { id: 'characters', label: 'Personajes' },
];

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState<string>(TABS[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

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

  return (
    <main className="min-h-screen px-6 py-12 bg-[#FEFEFC]">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900">Welcome, {user.firstName}!</h1>
            <p className="text-gray-600 mt-2">@{user.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
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
                <h2 className="text-2xl font-semibold mb-4 text-black">Mis campañas</h2>
                <p className="text-black mb-6 text-lg">No campaigns yet. Create and manage your campaigns here.</p>
                <Link
                  href="/campaign/builder/basicInfo"
                  className="inline-block px-8 py-4 bg-[#E40712] hover:opacity-90 text-white text-lg font-bold rounded-lg shadow-lg"
                >
                  Crear Campaña
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
                <h2 className="text-2xl font-semibold mb-4 text-black">Mis personajes</h2>
                <p className="text-black mb-6 text-lg">No characters yet. Start creating heroes for your adventures.</p>
                <Link
                  href="/characters/builder/class"
                  className="inline-block px-8 py-4 bg-[#E40712] hover:opacity-90 text-white text-lg font-bold rounded-lg shadow-lg"
                >
                  Crear Personaje
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}