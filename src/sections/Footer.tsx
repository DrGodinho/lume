import { useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { name: 'Início', href: '#hero' },
  { name: 'Produtos', href: '#produtos' },
  { name: 'Benefícios', href: '#beneficios' },
  { name: 'Contato', href: '#contato' },
];

const products = [
  'Nano Cerâmica',
  'Linha Carbono',
  'Linha Refletiva',
  'Linha Smoke',
  'Jateados',
];

const contactInfo = [
  { icon: MapPin, text: 'Estrada do Realengo, 973 - Bangu, Rio de Janeiro' },
  { icon: Phone, text: '(21) 96514-0612' },
  { icon: Mail, text: 'drgodinho@gmail.com' },
  { icon: Clock, text: 'Seg - Sáb: 8h às 20h' },
];

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.querySelectorAll('.footer-col') || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#070f1a] pt-20 pb-8 overflow-hidden"
    >
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201, 162, 39, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 162, 39, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container-lume relative z-10">
        <div
          ref={contentRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-16"
        >
          {/* Column 1: Logo & About */}
          <div className="footer-col sm:col-span-2 lg:col-span-1">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }} className="inline-block mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-white font-['Montserrat']">
                LU<span className="text-gradient-gold">ME</span>
              </span>
            </a>
            <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
              Películas de Controle Solar
            </p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              Especialistas em insulfilm residencial na Zona Oeste do Rio.
              8 anos de experiência, garantia de 5 anos.
            </p>
            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1a3a5c]/50 flex items-center justify-center text-gray-400 hover:bg-[#c9a227] hover:text-[#0a1628] transition-all duration-300 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://www.instagram.com/lumecontrolesolar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1a3a5c]/50 flex items-center justify-center text-gray-400 hover:bg-[#c9a227] hover:text-[#0a1628] transition-all duration-300 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://wa.me/5521965140612"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1a3a5c]/50 flex items-center justify-center text-gray-400 hover:bg-[#25d366] hover:text-white transition-all duration-300 hover:-translate-y-1"
                aria-label="WhatsApp"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="text-white font-semibold mb-4 sm:mb-6 text-sm sm:text-base font-['Montserrat']">
              Links Rápidos
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-gray-400 hover:text-[#c9a227] transition-colors text-xs sm:text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-[#c9a227] transition-all duration-300 group-hover:w-3" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products */}
          <div className="footer-col">
            <h4 className="text-white font-semibold mb-4 sm:mb-6 text-sm sm:text-base font-['Montserrat']">
              Nossos Produtos
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {products.map((product) => (
                <li key={product}>
                  <a
                    href="#produtos"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('#produtos');
                    }}
                    className="text-gray-400 hover:text-[#c9a227] transition-colors text-xs sm:text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-[#c9a227] transition-all duration-300 group-hover:w-3" />
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-col">
            <h4 className="text-white font-semibold mb-4 sm:mb-6 text-sm sm:text-base font-['Montserrat']">
              Entre em Contato
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a227] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-xs sm:text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#1a3a5c] to-transparent mb-6 sm:mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
            © {new Date().getFullYear()} Lume Controle Solar. Todos os direitos reservados.
          </p>

          {/* SEO Text */}
          <p className="text-gray-600 text-[10px] sm:text-xs text-center md:text-right max-w-xl">
            Insulfilm residencial em Bangu e Zona Oeste do Rio de Janeiro.
            Atendemos Bangu, Campo Grande, Realengo, Barra da Tijuca,
            Recreio dos Bandeirantes e Jacarepaguá.
          </p>
        </div>
      </div>
    </footer>
  );
}
