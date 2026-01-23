"use client";

import { MdSync, MdHistoryEdu } from "react-icons/md";

export default function WaitForDMPage() {
  return (
    <div className="bg-[#f6f8f8] text-[#2b2218] min-h-screen bg-repeat font-body flex flex-col items-center justify-center">
      <main className="max-w-2xl mx-auto px-6 py-10 w-full">
        <div className="relative bg-white border border-[#d4c5a9] rounded-xl p-8 shadow-lg overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#1fadad] to-transparent opacity-50"></div>
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-[#2b2218]">
            <MdHistoryEdu className="text-[200px] rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-6 max-w-md mx-auto">
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold text-[#2b2218]">Esperando al Dungeon Master</h3>
              <p className="text-[#2b2218]/70">
                La partida está en preparación.<br />
                Cuando el Dungeon Master la inicie, entrarás automáticamente.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 w-full max-w-md">
              <button className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-400 font-bold py-4 px-8 rounded-lg border border-gray-200 cursor-not-allowed select-none transition-all" disabled>
                <MdSync className="animate-spin text-xl" />
                <span className="uppercase tracking-wider text-sm">Esperando al DM</span>
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1fadad]/60">Estado: En espera</span>
            </div>
          </div>
        </div>
        <div className="mt-16 flex items-center justify-center opacity-30 gap-4">
          <div className="h-px bg-[#2b2218] w-24"></div>
          <MdHistoryEdu className="text-[#2b2218]" />
          <div className="h-px bg-[#2b2218] w-24"></div>
        </div>
      </main>
    </div>
  );
}