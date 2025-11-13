"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Datos ficticios de personajes
const allCharacters = [
	{
		id: 1,
		name: "Character One",
		story: "Backstory for Character One",
		attributes: [
			{ label: "Strength", value: 10 },
			{ label: "Dexterity", value: 12 },
			{ label: "Intelligence", value: 14 },
		],
		img: "/character1.png",
	},
	{
		id: 2,
		name: "Character Two",
		story: "Backstory for Character Two",
		attributes: [
			{ label: "Strength", value: 14 },
			{ label: "Dexterity", value: 10 },
			{ label: "Intelligence", value: 12 },
		],
		img: "/character2.png",
	},
	{
		id: 3,
		name: "Character Three",
		story: "Backstory for Character Three",
		attributes: [
			{ label: "Strength", value: 12 },
			{ label: "Dexterity", value: 14 },
			{ label: "Intelligence", value: 10 },
		],
		img: "/character3.png",
	},
	{
		id: 4,
		name: "Character Four",
		story: "Backstory for Character Four",
		attributes: [
			{ label: "Strength", value: 8 },
			{ label: "Dexterity", value: 16 },
			{ label: "Intelligence", value: 14 },
		],
		img: "/character4.png",
	},
];

export default function CharactersPage() {
	const [visibleCharacters, setVisibleCharacters] = useState(3);
	const [noMore, setNoMore] = useState(false);
	const createCharRef = useRef<HTMLDivElement>(null);

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
		<main className="min-h-screen bg-[#f7f7e3] px-2 md:px-0 pb-16">
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
			<section className="mb-20 flex justify-center">
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
						<h2 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-2xl text-center px-4 mb-6">
							Crea tu Personaje
						</h2>
						<p className="text-gray-200 mb-6 text-center max-w-xl">
							Elige tu raza, clase y trasfondo. Forja un héroe único con habilidades y una historia personal.
						</p>
						<Link href="/characters/builder">
							<button className="mt-auto w-full md:w-auto bg-[#e40712] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
								Crear nuevo personaje
							</button>
						</Link>
					</div>
				</div>
			</section>

			{/* El resto del contenido sí va dentro del container */}
			<div className="container mx-auto px-4 py-12 max-w-7xl">
				{/* Personajes Destacados */}
				<section className="mb-20">
					<h2
						className={`text-3xl font-bold mb-12 text-center ${fantasyGradientText}`}
					>
						Personajes Destacados
					</h2>
					<div className="space-y-1">
						{allCharacters.slice(0, visibleCharacters).map((char, idx) => (
							<div
								key={char.id}
								ref={charRefs[idx]}
								className={`relative w-screen left-1/2 right-1/2 -mx-[50vw] min-h-[60vh] flex items-center justify-center overflow-hidden shadow-xl transition-all duration-700 ease-out bg-gray-800 ${
									active[idx]
										? "opacity-100 translate-y-0"
										: "opacity-0 translate-y-8"
								}`}
								style={{ willChange: "opacity, transform" }}
							>
								{/* Fondo con imagen si existe */}
								{char.img && (
									<>
										<Image
											src={char.img}
											alt={char.name}
											fill
											className="object-cover absolute inset-0 z-0 opacity-30"
											priority={false}
										/>
										<div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
									</>
								)}
								{/* Contenido */}
								<div
									className={`relative z-10 max-w-4xl w-full px-6 flex flex-col md:flex-row items-center gap-10`}
								>
									{/* Imagen destacada */}
									<div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-gray-800 flex items-center justify-center">
										<Image
											src={char.img}
											alt={char.name}
											width={256}
											height={256}
											className="object-cover w-full h-full"
											priority={false}
										/>
									</div>
									{/* Info */}
									<div className="flex-1 text-white">
										<h3 className="text-2xl md:text-3xl font-bold mb-3">{char.name}</h3>
										<p className="text-gray-200 mb-4">"{char.story}"</p>
										<div className="text-sm">
											<strong className="text-[#e40712]">Atributos Clave:</strong>
											<ul className="list-disc list-inside text-gray-300 mt-2">
												{char.attributes.map((a) => (
													<li key={a.label}>
														{a.label}: {a.value}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

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
			<footer className="text-center py-8 ">
				<p className="text-gray-500">D&D Hub - Un proyecto de pasión. 2025.</p>
			</footer>
		</main>
	);
}