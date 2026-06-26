'use client';

import { useState } from 'react';

export type WhatsAppTemplateType = 'generic' | 'retorno' | 'servico';

interface WhatsAppTemplateMenuProps {
  className?: string;
  getHref: (template: WhatsAppTemplateType) => string;
}

export function WhatsAppTemplateMenu({
  className = '',
  getHref,
}: WhatsAppTemplateMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const defaultHref = getHref('generic');

  if (!defaultHref) return null;

  const templates: Array<{ key: WhatsAppTemplateType; label: string }> = [
    { key: 'generic', label: 'Mensagem inicial' },
    { key: 'retorno', label: 'Cobrar retorno' },
    { key: 'servico', label: 'Confirmar serviço' },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
      >
        Templates WA
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-white/10 bg-[#07111d] p-2 shadow-2xl shadow-black/30">
          {templates.map((template) => (
            <a
              key={template.key}
              href={getHref(template.key)}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/[0.04] hover:text-emerald-300"
            >
              {template.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
