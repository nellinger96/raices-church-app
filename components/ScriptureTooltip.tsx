"use client";

import { useState } from "react";

type ScriptureTooltipProps = {
  reference: string;
  text: string;
};

export default function ScriptureTooltip({
  reference,
  text,
}: ScriptureTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="font-semibold text-[#2F5D50] underline decoration-[#9A7B4F]/40 underline-offset-4 hover:text-[#9A7B4F]"
      >
        {reference}
      </button>

      {isOpen && (
        <span className="absolute bottom-full left-1/2 z-20 mb-3 w-72 -translate-x-1/2 rounded-2xl border border-[#EFE3D1] bg-white p-4 text-left shadow-xl">
          <span className="block text-sm font-bold text-[#9A7B4F]">
            {reference}
          </span>

          <span className="mt-2 block text-sm leading-6 text-[#4B5563]">
            {text}
          </span>

          <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[#EFE3D1] bg-white" />
        </span>
      )}
    </span>
  );
}