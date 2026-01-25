'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
  { href: '/clases', label: 'Clases' }, 
  { href: '/campaign', label: 'Campañas' },
  { href: '/characters', label: 'Personajes' },
  { href: '/my-campaigns', label: 'Jugar' },
];

export default function Menu({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('menuOpen') === 'true';
    } catch {
      return false;
    }
  });

  // NUEVO: Estado para saber si ya está montado en cliente
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    try {
      localStorage.setItem('menuOpen', String(open));
    } catch {}
  }, [open]);

  const pathname = usePathname() || '/';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className={`w-full bg-[#26282A] ${className}`}>
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-18">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center p-3 rounded-md text-white hover:bg:white/6 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <nav className="hidden md:flex gap-8 items-center justify-center w-full" aria-label="Primary">
            {MENU_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={
                    `text-base md:text-lg font-semibold transition-colors duration-150 ` +
                    (active
                      ? 'text-white underline decoration-2 decoration-white/40'
                      : 'text-white hover:underline')
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="md:hidden w-7" />
        </div>
      </div>

      {/* SOLO renderiza el menú móvil si está montado en cliente */}
      {mounted && (
        <>
          <div
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setOpen(false)}
            aria-hidden={!open}
          />
          <aside
            className={`fixed top-0 left-0 h-full w-72 bg-[#26282A] backdrop-blur-md z-50 transform transition-transform duration-300 md:hidden ${
              open ? 'translate-x-0' : '-translate-x-full'
            }`} 
            aria-hidden={!open}
          >
            <div className="h-16 flex items-center px-4">
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-3 rounded-md text-white hover:bg-white/6 focus:outline-none"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="px-4 mt-2 flex flex-col gap-2.5" aria-label="Mobile">
              {MENU_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={
                      `px-4 py-3 rounded-md text-lg font-semibold transition-colors duration-150 ` +
                      (active ? 'bg-white/6 text-white' : 'text-white hover:bg-white/6')
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}