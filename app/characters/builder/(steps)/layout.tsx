import SwipeableTab from "@/app/components/swipeableTab";
import Image from "next/image";

const builderSteps = [
  { index: 1, title: "Clase", route: "/characters/builder/class" },
  { index: 2, title: "Raza", route: "/characters/builder/race" },
  { index: 3, title: "Habilidades", route: "/characters/builder/attributes" },
  { index: 4, title: "Detalles", route: "/characters/builder/details" },
  { index: 5, title: "Equipamiento", route: "/characters/builder/baseitems" },
];

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-100 ">
      <SwipeableTab items={builderSteps} />
      {/*Componente para editar nombre, se comparte en las demas pantallas*/}
      <div className="max-w-2xl mx-auto mt-6 mb-4 px-4">
        <div className="flex items-center gap-4">
          {/* Image Placeholder */}
          <div className="relative group shrink-0 w-24 h-24 cursor-pointer">
            <Image 
              src="/images/placeholdercharacter.png" 
              alt="Character Avatar" 
              width={96} 
              height={96} 
              className="object-cover w-full h-full rounded-lg border-2 border-gray-300 group-hover:border-blue-500 transition-colors"
            />
            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center rounded-lg">
              <span className="text-white text-5xl opacity-0 group-hover:opacity-100 font-bold">
                +
              </span>
            </div>
          </div>

          {/* Name Input */}
          <div className="flex-1">
            <label htmlFor="characterName" className="block text-sm font-medium text-gray-700 mb-1">
              Character Name
            </label>
            <input
              id="characterName"
              type="text"
              placeholder="Enter character name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
