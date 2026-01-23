"use client";

import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center border border-[#1fadad]">
        <p className="mb-6 text-lg text-[#2b2218]">{message}</p>
        <div className="flex gap-4 justify-center">
          <button
            className="bg-[#1fadad] text-white px-4 py-2 rounded font-bold hover:bg-[#158a8a] transition"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            className="bg-gray-100 text-[#2b2218] px-4 py-2 rounded font-bold hover:bg-gray-200 transition"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}