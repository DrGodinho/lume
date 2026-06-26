'use client';

import { useRef } from 'react';
import { Calendar } from 'lucide-react';

interface DateFieldWithPickerProps {
  className: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}

export function DateFieldWithPicker({
  ariaLabel,
  className,
  onChange,
  required = false,
  value,
}: DateFieldWithPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="date"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        onClick={openPicker}
        aria-label={ariaLabel}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/45 transition hover:text-[#f5d77a] focus:outline-none"
      >
        <Calendar className="h-4 w-4" />
      </button>
    </div>
  );
}
