
import RedirectCard from "../../components/redirectCard";

export default function CharacterBuilderPage() {
  return (
    <div className="min-h-screen flex bg-linear-to-br from-amber-50 to-orange-100">
      <div className="max-w-max mx-auto text-5xl text-black">
        Método de creacion de personajes
        <span className="block text-2xl text-gray-600 dark:text-gray-400 mt-2 mb-6">
          Escoje la forma de crear tu personaje
        </span>
        
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <RedirectCard srcimg={"/images/createCharacterOption.jpg"} buttonText={"Crear personaje"} title={"Desde cero"} description={"Personaliza tu personaje desde cero escogiendo tu clase"} link={"/characters/builder/class"}></RedirectCard>
          <RedirectCard srcimg={"/images/createCharacterOption.jpg"} buttonText={"Personalizar"} title={"Precreados"} description={"Escoge uno de los personajes creados y personalizalo a tu gusto"} link={""}></RedirectCard>
        </div>
      </div>
    </div>
  );
}
