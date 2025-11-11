import { getListOfRaces } from "@/app/lib/services/characterServices";



export default async function RacePage() {
  const races = await getListOfRaces();
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-amber-900 dark:text-amber-100">
          Choose Your Race
        </h1>
      </div>
    </div>
  );
}
