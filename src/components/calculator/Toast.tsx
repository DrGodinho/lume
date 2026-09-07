'use client';

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface ToastData {
    msg: string;
    tone: 'success' | 'error';
}

/** Toast do DS (substitui `alert` de sucesso/erro). */
export function Toast({ toast }: { toast: ToastData | null }) {
    if (!toast) return null;
    const isSuccess = toast.tone === 'success';
    return (
        <div
            role={isSuccess ? 'status' : 'alert'}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 font-black text-xs uppercase px-6 py-3 rounded-full z-[100] animate-bounce flex items-center gap-2 max-w-[95%] ${
                isSuccess
                    ? 'bg-green-500 text-black shadow-[0_0_40px_rgba(34,197,94,0.4)]'
                    : 'bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.4)]'
            }`}
        >
            {isSuccess ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span className="truncate">{toast.msg}</span>
        </div>
    );
}
