"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CustomCharacter } from "@/app/lib/models/charactermodel";

export default function CharacterNameInput() {
  const [characterName, setCharacterName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("/images/placeholdercharacter.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load character name and avatar from customCharacter object
    const savedCharacter = localStorage.getItem("customCharacter");
    if (savedCharacter) {
      const character: CustomCharacter = JSON.parse(savedCharacter);
      setCharacterName(character.name || "");
      if (character.avatarFile) {
        // Recupera el avatar como base64 temporalmente para previsualización
        setAvatarUrl(character.avatarFile);
      }
    }
  }, []);

  // Cuando cambia el archivo, crea una URL para previsualizar
  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setAvatarUrl(url);

      // Guarda el archivo como base64 temporalmente en localStorage
      const reader = new FileReader();
      reader.onload = () => {
        const savedCharacter = localStorage.getItem("customCharacter");
        const character: any = savedCharacter ? JSON.parse(savedCharacter) : {};
        character.avatarFile = reader.result; // base64 temporal para persistencia
        localStorage.setItem("customCharacter", JSON.stringify(character));
      };
      reader.readAsDataURL(avatarFile);
    }
  }, [avatarFile]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCharacterName(newName);

    const savedCharacter = localStorage.getItem("customCharacter");
    const character: CustomCharacter = savedCharacter
      ? JSON.parse(savedCharacter)
      : {
          name: "",
          class: "",
          currentAttributes: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
          race: "",
          description: { alignment: "", physicalDescription: "", personalityTraits: "", backstory: "" },
          skills: [],
          startItems: [],
        };

    character.name = newName;
    localStorage.setItem("customCharacter", JSON.stringify(character));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 mb-4 px-4">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative group shrink-0 w-24 h-24 cursor-pointer" onClick={handleAvatarClick}>
          <Image
            src={avatarUrl}
            alt="Character Avatar"
            width={96}
            height={96}
            className="object-cover w-full h-full rounded-lg border-2 border-gray-300 group-hover:border-blue-500 transition-colors"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center rounded-lg">
            <span className="text-white text-5xl opacity-0 group-hover:opacity-100 font-bold">
              +
            </span>
          </div>
        </div>

        {/* Name Input */}
        <div className="flex-1">
          <label
            htmlFor="characterName"
            className="block text-xl font-medium text-gray-700 mb-1"
          >
            Nombre del personaje
          </label>
          <input
            id="characterName"
            type="text"
            value={characterName}
            onChange={handleNameChange}
            placeholder="Enter character name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
