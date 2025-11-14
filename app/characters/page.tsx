"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CustomCharacter } from "../lib/models/charactermodel";
import { useRouter } from "next/navigation";	

// Datos ficticios de personajes
const allCharacters = [
	{
		id: 1,
		name: "Sir Galahad",
		story: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit mauris. Nunc lacus sem, lobortis ac elit at, lacinia sollicitudin sapien. Vestibulum dui sapien, congue non viverra a, semper quis mi. Fusce eu felis lorem. Suspendisse ac elementum felis, eu sodales justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris venenatis, arcu sit amet iaculis lobortis, lorem augue elementum elit, a fringilla neque ante egestas ante. Aliquam ornare lobortis venenatis. Pellentesque ac odio nisl. Donec nec aliquet nulla, a pretium dolor. Etiam ut pellentesque dolor, et convallis magna. Vivamus sollicitudin, felis non egestas posuere, felis libero varius magna, eu luctus mauris massa sed erat. Donec nec eleifend urna. Quisque dignissim cursus arcu eu aliquam.",
		attributes: [
			{ label: "Robustez", value: 14 },
			{ label: "Inteligencia", value: 10 },
			{ label: "Fuerza", value: 14 },
			{ label: "Destreza", value: 10 },
			{ label: "Carisma", value: 12 },
			{ label: "Sabiduría", value: 14 },
		],
		img: "/images/placeholdercharacter.png",
	},
	{
		id: 2,
		name: "Character Two",
		story: "Backstory for Character Two",
		attributes: [
			{ label: "Robustez", value: 12 },
			{ label: "Inteligencia", value: 14 },
			{ label: "Fuerza", value: 10 },
			{ label: "Destreza", value: 12 },
			{ label: "Carisma", value: 14 },
			{ label: "Sabiduría", value: 15 },
		],
		img: "/images/character-2.png",
	},
	{
		id: 3,
		name: "Character Three",
		story: "Backstory for Character Three",
		attributes: [
			{ label: "Robustez", value: 12 },
			{ label: "Inteligencia", value: 14 },
			{ label: "Fuerza", value: 10 },
			{ label: "Destreza", value: 10 },
			{ label: "Carisma", value: 14 },
			{ label: "Sabiduría", value: 15 },
		],
		img: "/images/character-3.png",
	},
	{
		id: 4,
		name: "Character Four",
		story: "Backstory for Character Four",
		attributes: [
			{ label: "Robustez", value: 12 },
			{ label: "Inteligencia", value: 14 },
			{ label: "Fuerza", value: 10 },
			{ label: "Destreza", value: 12 },
			{ label: "Carisma", value: 14 },
			{ label: "Sabiduría", value: 15 },
		],
		img: "/images/character-4.png",
	},
];

export function handleEditCharacter(char: typeof allCharacters[0], router: any) {
	// Ejemplo de personaje harcodeado
	const exampleCharacter: CustomCharacter = {
		name: "Sir Galahad",
		class: "Paladin",
		currentAttributes: {
			strength: 14,
			dexterity: 10,
			constitution: 14,
			intelligence: 10,
			wisdom: 12,
			charisma: 14,
		},
		race: "Human",
		description: {
			alignment: "Legal Bueno",
			physicalDescription: "Alto, cabello rubio, armadura brillante y capa azul.",
			personalityTraits: "Valiente, honorable, siempre ayuda a los necesitados.",
			backstory: "Nacido en una familia noble, entrenado desde niño para proteger el reino y luchar contra el mal.",
		},
		skills: [
			{ name: "Persuasion", description: "Convencer a otros con palabras." },
			{ name: "Athletics", description: "Realizar hazañas físicas." },
			{ name: "Religion", description: "Conocimiento sobre dioses y rituales." },
		],
		imgsrc: "/images/placeholdercharacter.png",
		startItems: [
			{ name: "Bagpipes", description: "Una espada de acero templado." },
			{ name: "Dice Set", description: "Escudo con el emblema familiar." },
		],
	};

  // Guarda el personaje en localStorage
  localStorage.setItem("customCharacter", JSON.stringify(exampleCharacter));
  // Redirige al builder
  router.push("/characters/builder/summary");
}

export default function CharactersPage() {
	const [visibleCharacters, setVisibleCharacters] = useState(3);
	const [noMore, setNoMore] = useState(false);
	const createCharRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	// Para animación scroll reveal por personaje
	const charRefs = allCharacters.map(() => useRef<HTMLDivElement | null>(null));
	const [active, setActive] = useState<boolean[]>(
		allCharacters.map(() => false)
	);

	useEffect(() => {
		if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

		const observers: IntersectionObserver[] = [];

		charRefs.forEach((ref, i) => {
			const el = ref.current;
			if (!el) return;

			const obs = new window.IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						setActive((prev) => {
							const copy = [...prev];
							copy[i] = entry.isIntersecting;
							return copy;
						});
					});
				},
				{
					threshold: 0.25,
					rootMargin: "0px 0px -20% 0px",
				}
			);

			obs.observe(el);
			observers.push(obs);
		});

		return () => observers.forEach((o) => o.disconnect());
		// eslint-disable-next-line
	}, [visibleCharacters]);

	const fantasyGradientText =
		"bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-900 to-black";

	const scrollToCreateCharacter = () => {
		createCharRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
		createCharRef.current?.classList.add("ring-4", "ring-amber-500", "scale-105");
		setTimeout(() => {
			createCharRef.current?.classList.remove("ring-4", "ring-amber-500", "scale-105");
		}, 1000);
	};

	const handleLoadMore = () => {
		if (visibleCharacters + 2 >= allCharacters.length) {
			setVisibleCharacters(allCharacters.length);
			setNoMore(true);
		} else {
			setVisibleCharacters(visibleCharacters + 2);
		}
	};

	return (
		<main className="min-h-screen bg-[url('/images/background-bone.png')] px-2 md:px-0 pb-16 overflow-x-hidden">
      				{/* Header */}
				<header className="text-center mb-16 py-12">
					<h1
						className={`text-4xl md:text-6xl font-extrabold mb-4 ${fantasyGradientText}`}
					>
						Héroes de la Comunidad
					</h1>
					<p className="text-xl text-gray-400">
						Descubre personajes épicos creados por la comunidad o crea el tuyo propio.
					</p>
				</header>

			{/* Banner fuera del container */}
			<section className="mb-10 flex justify-center">
				<div className="relative w-screen h-[60vh] max-h-[80vh] flex items-center justify-center overflow-hidden shadow-xl">
					{/* Fondo tipo banner */}
					<Image
						src="/images/background.png"
						alt="Background"
						fill
						className="object-cover absolute inset-0 w-full h-full "
						priority
					/>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="relative w-80 h-96 flex items-center justify-center">
							<div className="absolute inset-0 flex items-center justify-center z-10">
							</div>
						</div>
					</div>
					{/* Contenido */}
					<div
						ref={createCharRef}
						className="absolute inset-0 flex flex-col items-center justify-center z-30 px-4"
					>
						<h2 className="text-4xl sm:text-5xl text-white drop-shadow-2xl text-center px-4 mb-6">
							Crea tu Personaje
						</h2>
						<p className="text-2xl text-gray-200 mb-6 text-center max-w-xl">
							Elige tu raza, clase y trasfondo. Forja un héroe único con habilidades y una historia personal.
						</p>
						<Link href="/characters/builder/class">
							<button className="mt-auto w-full md:w-auto bg-[#e40712] hover:bg-red-700 text-white py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
								Crear nuevo personaje
							</button>
						</Link>
					</div>
				</div>
			</section>

			{/* El resto del contenido sí va dentro del container */}
			<div className="container mx-auto px-4 py-1 max-w-7xl">
				{/* Personajes Destacados */}
				<section className="mb-20">
					<h2
						className={`text-5xl font-bold mb-10 text-center ${fantasyGradientText}`}
					>
						Personajes Destacados
					</h2>
          {allCharacters.slice(0, visibleCharacters).map((char, idx) => (
            <div
              key={char.id}
              ref={charRefs[idx]}
              className={`relative w-full md:w-screen md:left-1/2 md:right-1/2 md:-mx-[50vw] min-h-[60vh] flex items-center justify-center overflow-hidden shadow-xl transition-all duration-700 ease-out bg-gray-800 mb-2
                ${active[idx] 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"}
              `}
              style={{ willChange: "opacity, transform" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
                <Image
                  src="/images/background-characters.png"
                  alt="Background Characters"
                  fill
                  className="object-cover absolute inset-0 z-0 opacity-50"
                  priority={false}
                />
              {/* Contenido */}
              <div
                className={`relative z-10 max-w-4xl w-full px-6 flex flex-col md:flex-row items-center gap-10`}
              >
                {/* Imagen destacada */}
                <div className="relative w-64 h-64 flex items-center justify-center mt-8 md:mt-0">
                  {/* Marco dorado */}
                  <Image
                    src="/images/GoldenRing.png"
                    alt="Marco dorado"
                    fill
                    className="object-contain z-10 pointer-events-none"
                    priority={false}
                  />
                  {/* Imagen del personaje */}
                  <div className="absolute inset-9   rounded-full overflow-hidden z-20 bg-gray-800 flex items-center justify-center">
                    <Image
                      src={char.img}
                      alt={char.name}
                      fill
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                </div>
                {/* Info */}
                <div className="flex-1 text-white relative pb-0 md:pb-24 px-2 md:px-4">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 mt-6">{char.name}</h3>
                  <p className="text-gray-200 mb-4 max-h-40 overflow-y-auto px-4 py-3 rounded-lg bg-gray-700/50 border border-white/20 shadow-inner scroll-container">"{char.story}"</p>
                  <div className="text-sm">
                    <strong className="text-2xl text-[#e40712]">Atributos Clave:</strong>
                    <div className="flex flex-col md:flex-row gap-4 mt-2">
                      <ul className="list-disc list-inside text-xl text-gray-300 flex-1">
                        {char.attributes.slice(0, 3).map((a) => (
                          <li key={a.label}>{a.label}: {a.value}</li>
                        ))}
                      </ul>
                      <ul className="list-disc list-inside text-xl text-gray-300 flex-1">
                        {char.attributes.slice(3, 6).map((a) => (
                          <li key={a.label}>{a.label}: {a.value}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div
                    className="flex flex-col md:flex-row gap-4 mt-8 items-center md:items-end justify-center md:justify-end mb-6 md:absolute md:bottom-3 md:right-3 md:w-auto md:mt-0"
                  >
					<button onClick={()=>handleEditCharacter(char, router)} className="w-[220px] md:w-auto bg-[#e40712] hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow text-center">
					Editar personaje
					</button>
                    <Link href="/campaign">
                      <button className="w-[220px] md:w-auto bg-[#e40712] hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow text-center">
                        Usar personaje
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
					{/* Pie de Sección */}
					<div className="text-center mt-16">
						{!noMore ? (
							<button
								className="text-[#e40712] hover:text-red-300 text-lg mb-8 transition-colors"
								onClick={handleLoadMore}
							>
								Cargar Más Personajes...
							</button>
						) : (
							<>
								<p className="text-gray-400 mb-4">
									No hay más personajes que mostrar por ahora.
								</p>
								<button
									className="w-full md:w-auto bg-[#e40712] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
									onClick={scrollToCreateCharacter}
								>
									¡Forja tu Leyenda Hoy!
								</button>
							</>
						)}
					</div>
				</section>
			</div>
      {/* Oculta el scroll horizontal del carrusel */}
      <style>{`
        .scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
		</main>
	);
}