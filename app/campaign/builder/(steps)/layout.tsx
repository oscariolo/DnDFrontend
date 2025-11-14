import SwipeableTab from "@/app/shared/components/swipeableTab";

const builderSteps = [
  { index: 1, title: "Información Básica", route: "/campaign/builder/basicInfo" },
  { index: 2, title: "Zonas", route: "/campaign/builder/zones" },
];

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen ">
      <SwipeableTab items={builderSteps} />
      <main>{children}</main>
    </div>
  );
}
