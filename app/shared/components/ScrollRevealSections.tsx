'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ScrollRevealSections() {
  const refs = [
    useRef<HTMLElement | null>(null),
    useRef<HTMLElement | null>(null),
    useRef<HTMLElement | null>(null),
  ];
  const [active, setActive] = useState([false, false, false]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const observers: IntersectionObserver[] = [];
    refs.forEach((rRef, i) => {
      const el = rRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setActive((prev) => {
              const copy = [...prev];
              copy[i] = entry.isIntersecting;
              return copy;
            });
          });
        },
        { threshold: 0.25, rootMargin: '0px 0px -20% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="w-full">
      <section
        ref={(el) => { refs[0].current = el; }}
        className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#FEFEFC]"
        aria-labelledby="sec1-title"
      >
        {/* Background image */}
        <div
          className={`absolute inset-0 z-0 transition-all duration-700 ease-out pointer-events-none ${
            active[0] ? 'opacity-100 translate-x-0' : 'opacity-20 -translate-x-8'
          }`}
        >
          <Image src="/images/section-1.png" alt="Section 1 visual" fill className="object-cover" />
        </div>
        {/* Gradient mask (solid near text, reveals image away) */}
        <div
          className={`absolute inset-0 z-[5] pointer-events-none transition-opacity duration-700 ${
            active[0] ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          <div className="w-full h-full bg-gradient-to-l from-[#FEFEFC] via-[#FEFEFC]/95 to-transparent" />
        </div>

        {/* Text block */}
        <div className="relative z-10 max-w-6xl w-full px-6 flex justify-end">
          <div
            className={`w-full md:w-1/2 py-20 transition-all duration-700 ease-out ${
              active[0] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            aria-hidden={!active[0]}
          >
            <h2 id="sec1-title" className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
              Character Creation
            </h2>
            <p className="text-gray-700 mb-8 text-lg md:text-xl leading-relaxed">
              Build unique heroes with customizable attributes, gear and backstory. Start shaping your legend now.
            </p>
            <Link
              href="/characters/builder/class"
              className="inline-block bg-[#E40712] hover:opacity-90 text-white font-bold px-8 py-4 rounded-xl shadow text-lg md:text-xl tracking-wide"
            >
              Crea tu propio personaje
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 (text on left, gradient from left (#FEFEFC) to image right) */}
      <section
        ref={(el) => { refs[1].current = el; }}
        className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#FEFEFC]"
        aria-labelledby="sec2-title"
      >
        {/* Background image */}
        <div
          className={`absolute inset-0 z-0 transition-all duration-700 ease-out pointer-events-none ${
            active[1] ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-8'
          }`}
        >
          <Image src="/images/section-2.png" alt="Section 2 visual" fill className="object-cover" />
        </div>
        {/* Gradient mask */}
        <div
          className={`absolute inset-0 z-[5] pointer-events-none transition-opacity duration-700 ${
            active[1] ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          <div className="w-full h-full bg-gradient-to-r from-[#FEFEFC] via-[#FEFEFC]/95 to-transparent" />
        </div>

        {/* Text block */}
        <div className="relative z-10 max-w-6xl w-full px-6 flex justify-start">
          <div
            className={`w-full md:w-1/2 py-20 transition-all duration-700 ease-out ${
              active[1] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            aria-hidden={!active[1]}
          >
            <h2 id="sec2-title" className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 text-left">
              Campaigns & Worlds
            </h2>
            <p className="text-gray-700 mb-8 text-lg md:text-xl leading-relaxed text-left">
              Create sprawling adventures, design encounters and guide players through unforgettable stories.
            </p>
            <Link
              href="/campaign/builder/basicInfo"
              className="inline-block bg-[#E40712] hover:opacity-90 text-white font-bold px-8 py-4 rounded-xl shadow text-lg md:text-xl tracking-wide"
            >
              Create tu campaña épica
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3 (unchanged except context) */}
      <section
        ref={(el) => { refs[2].current = el; }}
        className="relative w-full min-h-[60vh] flex items-center justify-center bg-black overflow-hidden"
        aria-labelledby="sec3-title"
      >
        <div
          className={`absolute inset-0 z-0 transition-all duration-700 ease-out pointer-events-none ${
            active[2] ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-8'
          }`}
        >
          <Image src="/images/section-3.png" alt="Final visual" fill className="object-cover" />
        </div>
        <div
          className={`relative z-10 text-center transition-all duration-700 ease-out ${
            active[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          aria-hidden={!active[2]}
        >
          <h2 id="sec3-title" className="sr-only">
            Empezar aventura
          </h2>
          <Link
            href="/my-campaigns"
            className="inline-block bg-[#E40712] hover:opacity-90 text-white font-extrabold px-16 py-8 rounded-3xl shadow-2xl text-3xl md:text-5xl tracking-wide"
          >
            Empezar aventura
          </Link>
        </div>
      </section>
    </section>
  );
}