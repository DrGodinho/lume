'use client';

import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { name: 'Produtos', href: '#produtos' },
  { name: 'Simulador', href: '/simulador' },
  { name: 'Portas de Vidro', href: '/insulfilm-para-portas-de-vidro' },
  { name: 'Guia', href: '/guia-insulfilm' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contato', href: '#contato' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      if (pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        router.push('/' + href);
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-effect border-b border-[#c9a227]/20 bg-[#04080f]/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-lume">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2 group">
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-white font-montserrat">
              LU<span className="text-gradient-gold">ME</span>
            </span>
            <span className="hidden sm:block text-xs text-gray-400 uppercase tracking-widest border-l border-gray-600 pl-2">
              Películas de
              <br />
              Controle Solar
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a
                  key={link.name}
                  href={link.href.startsWith('#') ? '/' + link.href : link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c9a227] transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <a
                  key={link.name}
                  href={link.href + (link.href === '/' ? '' : '/')}
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c9a227] transition-all duration-300 group-hover:w-full" />
                </a>
              )
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20de%20insulfilm."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 text-xs py-2.5 px-5 transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(201,162,39,0.25)]"
            >
              <MessageCircle size={15} />
              Pedir Orçamento
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-[#c9a227] transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 glass-effect border-b border-[#c9a227]/20 bg-[#04080f]/95 backdrop-blur-xl transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="container-lume py-6">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a
                  key={link.name}
                  href={link.href.startsWith('#') ? '/' + link.href : link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-left text-base font-medium text-gray-300 hover:text-[#c9a227] transition-colors py-2 border-b border-white/5"
                >
                  {link.name}
                </a>
              ) : (
                <a
                  key={link.name}
                  href={link.href + (link.href === '/' ? '' : '/')}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-300 hover:text-[#c9a227] transition-colors py-2 border-b border-white/5"
                >
                  {link.name}
                </a>
              )
            ))}
            <a
              href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20de%20insulfilm."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 mt-4 py-3 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageCircle size={18} />
              Pedir Orçamento no WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a227] to-transparent transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </nav>
  );
}
