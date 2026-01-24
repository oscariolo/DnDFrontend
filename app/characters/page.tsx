"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getAllCharacters } from "../lib/services/characterServices";
import { useRouter } from "next/navigation";

function mapAttributes(attributes: any) {
	if (!attributes) return [];
	return [
		{ label: "Robustez", value: attributes.constitution },
		{ label: "Inteligencia", value: attributes.intelligence },
		{ label: "Fuerza", value: attributes.strength },
		{ label: "Destreza", value: attributes.dexterity },
		{ label: "Carisma", value: attributes.charisma },
		{ label: "Sabiduría", value: attributes.wisdom },
	];
}

// Nueva función para editar personaje seleccionado
function handleEditCharacter(char: any, router: any) {
  // Guarda el personaje seleccionado en localStorage (puedes adaptar esto a tu modelo real)
  localStorage.setItem("customCharacter", JSON.stringify(char));
  // Redirige al builder de edición
  router.push("/characters/builder/class");
}

export default function CharactersPage() {
	const [characters, setCharacters] = useState<any[]>([]);
	const [visibleCharacters, setVisibleCharacters] = useState(0);
	const [noMore, setNoMore] = useState(false);
	const createCharRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	// Para animación scroll reveal por personaje
	const charRefs = useRef<(HTMLDivElement | null)[]>([]);
	const [active, setActive] = useState<boolean[]>(
		characters.map(() => false)
	);

	useEffect(() => {
		if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
		getAllCharacters()
		.then((data) => {
			// Mapea los datos recibidos para adaptarlos al frontend
			const mapped = data.map((char: any) => ({
			id: char.id,
			name: char.name,
			creatorName: char.creatorId,
			story: char.characterDescription,
			attributes: mapAttributes(char.attributes),
			img: "/images/placeholdercharacter.png", // Puedes cambiar esto si tienes imágenes por personaje
			}));
			setCharacters(mapped);
			setVisibleCharacters(Math.min(3, mapped.length)); // Muestra 3 o menos si hay menos personajes
		})
		.catch(() => setCharacters([]));

		const observers: IntersectionObserver[] = [];

		charRefs.current.forEach((ref, i) => {
			const el = ref;
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

	useEffect(() => {
		if (typeof window !== "undefined" && window.location.hash === "#destacados") {
			const el = document.getElementById("destacados");
			if (el) {
			const y = el.getBoundingClientRect().top + window.scrollY - 120; // Ajusta -120 según lo que necesites
			window.scrollTo({ top: y, behavior: "smooth" });
			}
		}
	}, []);

	useEffect(() => {
		setActive(characters.map(() => false));
	}, [characters]);

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
		if (visibleCharacters + 2 >= characters.length) {
			setVisibleCharacters(characters.length);
			setNoMore(true);
		} else {
			setVisibleCharacters(visibleCharacters + 2);
		}
	};

	return (
		<main className="min-h-screen px-2 md:px-0 pb-16 overflow-x-hidden">
			{/* Header */}
			<header className="text-center mb-16 py-12">
				<h1 className={`text-4xl md:text-6xl font-extrabold mb-4 ${fantasyGradientText}`}>
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
						id ="destacados"
						className={`text-5xl font-bold mb-10 text-center ${fantasyGradientText}`}
					>
						Personajes Destacados
					</h2>
					{characters.slice(0, visibleCharacters).map((char, idx) => (
						<div
						key={char.id}
						ref={el => { charRefs.current[idx] = el; }}
						className={`relative w-full md:w-screen md:left-1/2 md:right-1/2 md:-mx-[50vw] min-h-[60vh] flex items-center justify-center overflow-hidden shadow-xl transition-all duration-700 ease-out bg-gray-800 mb-2
						${active[idx] 
						? "opacity-100 translate-y-0" 
						: "opacity-0 translate-y-8"}`
						}
						style={{ willChange: "opacity, transform" }}>
							<div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
								<Image
								src="/images/background-characters.png"
								alt="Background Characters"
								fill
								className="object-cover absolute inset-0 z-0 opacity-50"
								priority={false}
								/>
								{/* Contenido */}
								<div className={`relative z-10 max-w-4xl w-full px-6 flex flex-col md:flex-row items-center gap-10`}>
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
										<div className="absolute inset-9 rounded-full overflow-hidden z-20 bg-gray-800 flex items-center justify-center">
											<Image
												src={char.img}
												alt={char.name}
												fill
												className="object-cover"
												priority={false}
											/>
										</div>
										{/* Nombre del usuario creador */}
										<div className="absolute left-1/2 -translate-x-1/2 -bottom-8 w-full text-center z-30">
											<span className="text-lg text-gray-300 font-semibold drop-shadow">
												@{char.creatorName ?? "Usuario Anónimo"}
											</span>
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
													{char.attributes.slice(0, 3).map((a: { label: string; value: number }) => (
														<li key={a.label}>{a.label}: {a.value}</li>
													))}
												</ul>
												<ul className="list-disc list-inside text-xl text-gray-300 flex-1">
													{char.attributes.slice(3, 6).map((a: { label: string; value: number }) => (
														<li key={a.label}>{a.label}: {a.value}</li>
													))}
												</ul>
											</div>
										</div>
										<div className="flex flex-col md:flex-row gap-4 mt-8 items-center md:items-end justify-center md:justify-end mb-6 md:absolute md:bottom-3 md:right-3 md:w-auto md:mt-0">
											<button
												onClick={() => handleEditCharacter(char, router)}
												className="w-[220px] md:w-auto bg-[#e40712] hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow text-center"
											>
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
							<button className="text-[#e40712] hover:text-red-300 text-lg mb-8 transition-colors"
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