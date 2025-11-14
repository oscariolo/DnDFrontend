import SwipeableTab from "@/app/shared/components/swipeableTab";
import CharacterNameInput from "@/app/characters/builder/components/characterNameInput";

const builderSteps = [
  { index: 1, title: "Clase", route: "/characters/builder/class" },
  { index: 2, title: "Raza", route: "/characters/builder/race" },
  { index: 3, title: "Habilidades", route: "/characters/builder/attributes" },
  { index: 4, title: "Detalles", route: "/characters/builder/details" },
  { index: 5, title: "Equipamiento", route: "/characters/builder/baseitems" },
  { index: 6, title: "Resumen", route: "/characters/builder/summary" },
];

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen ">
      <SwipeableTab items={builderSteps} />
      <CharacterNameInput />
      <main>{children}</main>
    </div>
  );
}
