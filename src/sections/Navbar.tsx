import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { name: 'Início', href: '#hero' },
  { name: 'Produtos', href: '#produtos' },
  { name: 'Benefícios', href: '#beneficios' },
  { name: 'Contato', href: '#contato' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-effect border-b border-[#c9a227]/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container-lume">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="flex items-center gap-2 group"
          >
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-white font-['Montserrat']">
              LU<span className="text-gradient-gold">ME</span>
            </span>
            <span className="hidden sm:block text-xs text-gray-400 uppercase tracking-widest border-l border-gray-600 pl-2">
              Películas de<br />Controle Solar
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c9a227] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://wa.me/5521965140612"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 text-xs"
            >
              <Phone className="w-4 h-4" />
              Falar com Especialista
            </a>
          </div>

          {/* Mobile Menu Button */}
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
        className={`lg:hidden absolute top-full left-0 right-0 glass-effect border-b border-[#c9a227]/20 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="container-lume py-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-lg font-medium text-gray-300 hover:text-[#c9a227] transition-colors py-2"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://wa.me/5521965140612"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 mt-4"
            >
              <Phone className="w-4 h-4" />
              Falar com Especialista
            </a>
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a227] to-transparent transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </nav>
  );
}
