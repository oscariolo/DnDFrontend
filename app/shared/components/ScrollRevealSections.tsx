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
            if (entry.isIntersecting) {
              setActive((prev) => {
                const copy = [...prev];
                copy[i] = true;
                return copy;
              });
            } else {
              setActive((prev) => {
                const copy = [...prev];
                copy[i] = false;
                return copy;
              });
            }
          });
        },
        {
          threshold: 0.25,
          rootMargin: '0px 0px -20% 0px',
        }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []); 

  return (
    <section className="w-full">
      <section
        ref={(el) => {
          refs[0].current = el;
        }}
        className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
        aria-labelledby="sec1-title"
      >
        <div
          className={`absolute inset-0 z-0 transition-all duration-700 ease-out pointer-events-none ${
            active[0] ? 'opacity-100 translate-x-0' : 'opacity-20 -translate-x-8'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          <Image src="/images/section-1.png" alt="Section 1 visual" fill className="object-cover" priority={false} />
        </div>
        <div className="relative z-10 max-w-6xl w-full px-6 flex justify-end">
          <div
            className={`w-full md:w-1/2 py-16 transition-all duration-700 ease-out ${
              active[0] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            aria-hidden={!active[0]}
          >
            <h2 id="sec1-title" className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Character Creation
            </h2>
            <p className="text-gray-700 mb-6">
              Build unique heroes with customizable attributes, gear and backstory. Start shaping your legend now.
            </p>
            <Link
              href="/characters/builder"
              className="inline-block bg-[#E40712] hover:opacity-90 text-white font-medium px-5 py-3 rounded-lg shadow"
            >
              Create Your Character
            </Link>
          </div>
        </div>
      </section>
      <section
        ref={(el) => {
          refs[1].current = el;
        }}
        className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
        aria-labelledby="sec2-title"
      >
        <div
          className={`absolute inset-0 z-0 transition-all duration-700 ease-out pointer-events-none ${
            active[1] ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-8'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          <Image src="/images/section-2.png" alt="Section 2 visual" fill className="object-cover" priority={false} />
        </div>

        <div className="relative z-10 max-w-6xl w-full px-6 flex justify-start">
          <div
            className={`w-full md:w-1/2 py-16 transition-all duration-700 ease-out ${
              active[1] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            aria-hidden={!active[1]}
          >
            <h2 id="sec2-title" className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 text-left">
              Campaigns & Worlds
            </h2>
            <p className="text-gray-700 mb-6 text-left">
              Create sprawling adventures, design encounters and guide players through unforgettable stories.
            </p>
            <Link
              href="/campaign"
              className="inline-block bg-[#E40712] hover:opacity-90 text-white font-medium px-5 py-3 rounded-lg shadow"
            >
              Create Your Campaign
            </Link>
          </div>
        </div>
      </section>

      <section
        ref={(el) => {
          refs[2].current = el;
        }}
        className="relative w-full min-h-[60vh] flex items-center justify-center bg-black overflow-hidden"
        aria-labelledby="sec3-title"
      >
        <div
          className={`absolute inset-0 z-0 transition-all duration-700 ease-out pointer-events-none ${
            active[2] ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-8'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          <Image src="/images/section-3.png" alt="Final visual" fill className="object-cover" priority={false} />
        </div>

        <div
          className={`relative z-10 text-center transition-all duration-700 ease-out ${
            active[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          aria-hidden={!active[2]}
        >
          <h2 id="sec3-title" className="sr-only">Play Now</h2>
          <Link
            href="/play"
            className="inline-block bg-[#E40712] hover:opacity-90 text-white font-semibold px-6 py-3 rounded-md shadow-lg"
          >
            Play Now
          </Link>
        </div>
      </section>
    </section>
  );
}