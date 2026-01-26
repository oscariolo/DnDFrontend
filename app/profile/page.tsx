'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getCampaignsByUserId } from '@/app/lib/services/campaingServices';
import { getAllCharactersByUserId } from '@/app/lib/services/characterServices';
import { FaDiceD20, FaUserAlt, FaSignOutAlt, FaBookOpen, FaPlus } from "react-icons/fa";

const TABS = [
  { id: 'campaigns', label: 'Campañas', icon: <FaBookOpen className="inline mr-2" /> },
  { id: 'characters', label: 'Personajes', icon: <FaUserAlt className="inline mr-2" /> },
];

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState<string>(TABS[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoadingData(true);
      try {
        const accessToken = localStorage.getItem('accessToken') || '';
        const [camps, chars] = await Promise.all([
          getCampaignsByUserId(user.id, accessToken),
          getAllCharactersByUserId(user.id, accessToken),
        ]);
        setCampaigns(camps);
        setCharacters(chars);
      } catch {
        setCampaigns([]);
        setCharacters([]);
      }
      setLoadingData(false);
    }
    if (user) fetchData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

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
            <h1 className="text-4xl font-extrabold text-[#e40712] flex items-center gap-2">
              <FaDiceD20 className="text-3xl text-[#0b87da]" /> ¡Bienvenido, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-2 font-mono">@{user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 bg-[#0b87da] text-white rounded-lg font-semibold hover:bg-[#0866a8] transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg bg-white">
          <div
            role="tablist"
            aria-label="Profile tabs"
            onKeyDown={onKeyDown}
            className="flex gap-4 p-6 border-b border-gray-200 bg-gray-100"
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
                    'px-8 py-4 rounded-lg text-lg font-semibold tracking-wide focus:outline-none transition flex items-center ' +
                    (isActive
                      ? 'bg-[#e40712] text-white shadow-md scale-105'
                      : 'bg-transparent text-black hover:bg-[#e40712]/10')
                  }
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
          </div>
          <div className="p-8 min-h-[350px]">
            {/* Campañas */}
            <section
              id="panel-campaigns"
              role="tabpanel"
              aria-labelledby="tab-campaigns"
              hidden={active !== 'campaigns'}
              className={active === 'campaigns' ? 'block' : 'hidden'}
            >
              <h2 className="text-2xl font-bold mb-6 text-[#0b87da] flex items-center gap-2">
                <FaBookOpen /> Mis campañas
              </h2>
              {loadingData ? (
                <div className="text-gray-500">Cargando...</div>
              ) : campaigns.length === 0 ? (
                <p className="text-black mb-6 text-lg">No tienes campañas aún.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {campaigns.map((camp) => {
                    // Busca la primera imagen de cualquier zona
                    let img = "/images/campaign1.jpg";
                    if (camp.campaignZones && camp.campaignZones.length > 0) {
                      for (const zone of camp.campaignZones) {
                        if (zone.zoneImgUrls && zone.zoneImgUrls.length > 0) {
                          img = zone.zoneImgUrls[0];
                          break;
                        }
                      }
                    }
                    return (
                      <div key={camp.id} className="bg-white rounded-xl shadow p-6 flex flex-col border border-gray-100 hover:shadow-lg transition">
                        <div className="relative h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500 overflow-hidden">
                          <img
                            src={img}
                            alt={camp.name}
                            className="object-cover w-full h-full rounded-md"
                            style={{ maxHeight: "8rem" }}
                          />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <FaBookOpen className="text-[#e40712]" />
                          <span className="font-bold text-lg">{camp.name}</span>
                        </div>
                        <span className="text-gray-500 text-sm mb-2">{camp.description || "Sin descripción"}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link
                href="/campaign/builder/basicInfo"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E40712] hover:opacity-90 text-white text-lg font-bold rounded-lg shadow-lg"
              >
                <FaPlus /> Crear Campaña
              </Link>
            </section>

            {/* Personajes */}
            <section
              id="panel-characters"
              role="tabpanel"
              aria-labelledby="tab-characters"
              hidden={active !== 'characters'}
              className={active === 'characters' ? 'block' : 'hidden'}
            >
              <h2 className="text-2xl font-bold mb-6 text-[#e40712] flex items-center gap-2">
                <FaUserAlt /> Mis personajes
              </h2>
              {loadingData ? (
                <div className="text-gray-500">Cargando...</div>
              ) : characters.length === 0 ? (
                <p className="text-black mb-6 text-lg">No tienes personajes aún.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {characters.map((char) => (
                    <div key={char.id} className="bg-white rounded-xl shadow p-6 flex flex-col border border-gray-100 hover:shadow-lg transition">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUserAlt className="text-[#0b87da]" />
                        <span className="font-bold text-lg">{char.name}</span>
                      </div>
                      <span className="text-gray-500 text-sm mb-4">{char.race || "Sin raza"} - {char.characterClass || "Sin clase"}</span>
                      <Link
                        href={`/characters/builder/summary?id=${char.id}`}
                        className="mt-auto inline-block px-4 py-2 bg-[#e40712] text-white rounded-lg font-semibold hover:bg-[#b3060e] transition"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              <Link
                href="/characters/builder/class"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0b87da] hover:opacity-90 text-white text-lg font-bold rounded-lg shadow-lg"
              >
                <FaPlus /> Crear Personaje
              </Link>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}