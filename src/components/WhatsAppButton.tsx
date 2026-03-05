import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    // Show button after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Show speech bubble after 20 seconds
    const bubbleTimer = setTimeout(() => {
      setShowBubble(true);
    }, 20000);

    return () => {
      clearTimeout(timer);
      clearTimeout(bubbleTimer);
    };
  }, []);

  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>

      {/* Speech Bubble */}
      <div className={`mb-3 bg-white text-gray-800 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl rounded-tr-none shadow-2xl border border-gray-100 relative transition-all duration-500 transform origin-bottom-right max-w-[200px] sm:max-w-none ${showBubble ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-4'
        }`}>
        <button
          onClick={() => setShowBubble(false)}
          className="absolute -top-2 -left-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-0.5 transition-colors shadow-sm"
        >
          <X className="w-3 h-3" />
        </button>
        <p className="text-[10px] sm:text-sm font-medium pr-1 sm:pr-2 leading-tight">
          Olá! Precisa de um <span className="text-[#25d366] font-bold text-nowrap">orçamento grátis</span>?
        </p>
        {/* Triangle arrow */}
        <div className="absolute -bottom-2 right-0 w-0 h-0 border-l-[10px] sm:border-l-[12px] border-l-transparent border-t-[10px] sm:border-t-[12px] border-t-white" />
      </div>

      <a
        href="https://wa.me/5521965140612?text=Olá! Gostaria de saber mais sobre as películas de controle solar."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 sm:gap-3 w-14 h-14 sm:w-auto sm:px-6 sm:py-4 rounded-full bg-[#25d366] text-white shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl group relative overflow-visible"
        style={{
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        }}
        aria-label="Falar no WhatsApp"
      >
        {/* Pulse animation - softened and slower */}
        <span className="absolute inset-0 rounded-full bg-[#25d366] animate-soft-ping opacity-20 group-hover:animate-none" />

        {/* Icon */}
        <MessageCircle className="w-6 h-6 sm:w-6 sm:h-6 relative z-10" />

        {/* Text */}
        <span className="font-semibold text-sm relative z-10 hidden sm:inline whitespace-nowrap">
          Falar com Especialista
        </span>
      </a>
    </div>
  );
}
