'use client';
import Image from 'next/image';
import React from 'react';

interface ClassCardProps {
  title: string;
  description: string;
  srcimg?: string;
  buttonText?: string;
  onSelect?: () => void;
}

export default function ClassCard({
  title,
  description,
  srcimg,
  buttonText, // optional
  onSelect,
}: ClassCardProps) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}
      className="w-70 h-80 border-2 bg-outer border-gray-600 rounded-lg overflow-hidden hover:outline hover:outline-blue-500 cursor-pointer flex flex-col"
    >
      {srcimg && (
        <div className="relative w-full h-24 shrink-0">
          <Image src={srcimg} fill className="object-cover" alt={title} />
        </div>
      )}
      <div className="p-6 flex flex-col grow border-gray-600 border-t-2">
        <h2 className="text-3xl mb-1 text-white">{title}</h2>
        <p className="text-lg text-white mb-4 overflow-hidden">{description}</p>
      </div>
      {buttonText && (
        <div className="flex justify-end bg-white p-1.5">
          <span className="text-2xl text-black">
            {buttonText}
            <span className="ml-2">&gt;</span>
          </span>
        </div>
      )}
    </div>
  );
}