"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

interface SwipeableTabItem {
  index: number;
  title: string;
  route: string;
}

interface SwipeableTabProps {
  items: SwipeableTabItem[];
}

export default function SwipeableTab({ items }: SwipeableTabProps) {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const centerActive = () => {
      if (activeRef.current && containerRef.current && itemsRef.current) {
        const container = containerRef.current;
        const itemsContainer = itemsRef.current;
        const item = activeRef.current;
        
        // Only apply transform on mobile (less than sm breakpoint: 640px)
        if (window.innerWidth < 640) {
          const containerWidth = container.offsetWidth;
          const itemLeft = item.offsetLeft;
          const itemWidth = item.offsetWidth;
          
          // Calculate the offset needed to center the item
          const itemCenter = itemLeft + (itemWidth / 2);
          const containerCenter = containerWidth / 2;
          const offset = containerCenter - itemCenter;
          
          // Apply transform to shift the entire items container
          itemsContainer.style.transform = `translateX(${offset}px)`;
          itemsContainer.style.transition = 'transform 0.3s ease-out';
        } else {
          // Reset transform on desktop
          itemsContainer.style.transform = 'none';
        }
      }
    };

    // Center on pathname change
    centerActive();

    // Re-center on window resize
    window.addEventListener("resize", centerActive);
    
    return () => window.removeEventListener("resize", centerActive);
  }, [pathname]);

  return (
    <div className="bg-black opacity-95 border-b border-gray-700">
      <div 
        ref={containerRef}
        className="overflow-hidden sm:flex sm:justify-center"
      >
        <div 
          ref={itemsRef}
          className="flex gap-4 sm:gap-0"
        >
        {items.map((item) => {
          const isActive = pathname === item.route;
          return (
            <Link
              key={item.index}
              ref={isActive ? activeRef : null}
              href={item.route}
              className={`
                 px-6 py-3 whitespace-nowrap font-bold text-sm uppercase sm:flex-none shrink-0 rounded-lg sm:rounded-none text-center
                ${
                  isActive
                    ? "text-white underline decoration-blue-950"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }
              `}
            >
              {item.index}. {item.title}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1" />
              )}
            </Link>
          );
        })}
        </div>
      </div>
    </div>
  );
}