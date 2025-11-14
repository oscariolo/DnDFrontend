"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getListOfSkills, getListOfTools } from "@/app/lib/services/characterServices";

interface ItemData {
  name: string;
  description: string;
}

export default function BaseItemsPage() {
  const router = useRouter();
  const [tools, setTools] = useState<ItemData[]>([]);
  const [skills, setSkills] = useState<ItemData[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [toolsData, skillsData] = await Promise.all([
          getListOfTools(),
          getListOfSkills()
        ]);
        setTools(toolsData);
        setSkills(skillsData);

        // Load saved selections from localStorage
        const savedTools = localStorage.getItem('selectedTools');
        const savedSkills = localStorage.getItem('selectedSkills');
        if (savedTools) setSelectedTools(JSON.parse(savedTools));
        if (savedSkills) setSelectedSkills(JSON.parse(savedSkills));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleToolToggle = (toolName: string) => {
    setSelectedTools(prev => {
      let updated: string[];
      if (prev.includes(toolName)) {
        updated = prev.filter(t => t !== toolName);
      } else if (prev.length < 3) {
        updated = [...prev, toolName];
      } else {
        return prev;
      }
      localStorage.setItem('selectedTools', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSkillToggle = (skillName: string) => {
    setSelectedSkills(prev => {
      let updated: string[];
      if (prev.includes(skillName)) {
        updated = prev.filter(s => s !== skillName);
      } else if (prev.length < 3) {
        updated = [...prev, skillName];
      } else {
        return prev;
      }
      localStorage.setItem('selectedSkills', JSON.stringify(updated));
      return updated;
    });
  };

  const handleContinue = () => {
    if (selectedTools.length === 0 || selectedSkills.length === 0) {
      alert('Por favor selecciona al menos una herramienta y una habilidad');
      return;
    }
    router.push('/characters/builder/summary');
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Herramientas y Habilidades
        </h1>
        <p className="text-lg mb-8 text-gray-600 text-center">
          Selecciona hasta 3 herramientas y 3 habilidades para tu personaje
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Tools Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Herramientas</h2>
              <span className="text-lg font-semibold text-amber-600">
                {selectedTools.length}/3
              </span>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {tools.map((tool) => {
                const isSelected = selectedTools.includes(tool.name);
                const isDisabled = !isSelected && selectedTools.length >= 3;
                return (
                  <div
                    key={tool.name}
                    onClick={() => !isDisabled && handleToolToggle(tool.name)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                        : 'border-gray-300 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{tool.name}</h3>
                        {tool.description && (
                          <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Habilidades</h2>
              <span className="text-lg font-semibold text-amber-600">
                {selectedSkills.length}/3
              </span>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill.name);
                const isDisabled = !isSelected && selectedSkills.length >= 3;
                return (
                  <div
                    key={skill.name}
                    onClick={() => !isDisabled && handleSkillToggle(skill.name)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                        : 'border-gray-300 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{skill.name}</h3>
                        {skill.description && (
                          <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleContinue}
            disabled={selectedTools.length === 0 || selectedSkills.length === 0}
            className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors text-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
