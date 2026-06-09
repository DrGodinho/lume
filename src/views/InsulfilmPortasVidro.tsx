'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle,
  Clock,
  Eye,
  Home,
  Layers,
  Lock,
  MapPin,
  MessageCircle,
  Shield,
  Sparkles,
  Store,
  Sun,
  Thermometer,
  Wand2,
} from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Particles } from '../components/Particles';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { GoogleReviews } from '../components/GoogleReviews';

const whatsapp =
  'https://wa.me/5521965140612?text=Ola! Quero um orcamento de insulfilm para porta de vidro.';

const painPoints = [
  'Muito calor entrando pela porta de vidro',
  'Falta de privacidade em portas voltadas para rua ou vizinhos',
  'Claridade excessiva durante o dia',
  'Reflexo em TV, computador e vitrines',
  'Moveis, pisos e cortinas desbotando com o sol',
  'Vidros comerciais muito expostos',
];

const benefits = [
  {
    title: 'Mais conforto termico',
    text: 'A pelicula reduz a entrada de calor pela porta de vidro e deixa sala, varanda, loja ou escritorio mais agradavel.',
    icon: Thermometer,
  },
  {
    title: 'Mais privacidade',
    text: 'Modelos como jateado, carbono e refletiva ajudam a controlar a visao de fora para dentro conforme o objetivo do ambiente.',
    icon: Eye,
  },
  {
    title: 'Protecao UV',
    text: 'Peliculas de qualidade ajudam a bloquear raios UV e proteger moveis, sofas, cortinas, pisos e objetos decorativos.',
    icon: Shield,
  },
  {
    title: 'Acabamento moderno',
    text: 'A porta fica mais sofisticada: discreta, espelhada, fume, fosca ou com visual decorativo sob medida.',
    icon: Sparkles,
  },
  {
    title: 'Mais seguranca',
    text: 'Peliculas de seguranca ajudam a manter fragmentos unidos em caso de quebra e reduzem riscos em areas vulneraveis.',
    icon: Lock,
  },
  {
    title: 'Sem obra',
    text: 'A aplicacao e feita sobre o vidro existente, sem trocar porta, esquadria ou fazer sujeira pesada no imovel.',
    icon: Clock,
  },
];

const filmTypes = [
  {
    title: 'Nano ceramica',
    subtitle: 'Conforto termico sem escurecer demais',
    text: 'Indicada para portas de varanda, salas, areas gourmet e fachadas modernas onde a claridade natural precisa continuar entrando.',
    summary: 'Melhor opcao premium para calor sem escurecer demais.',
    image: '/product-nano-ceramica.webp',
    href: '/nano-ceramica/',
    tags: ['porta de varanda', 'porta de sala', 'sol forte', 'ambiente claro'],
  },
  {
    title: 'Jateada',
    subtitle: 'Privacidade total com passagem de luz',
    text: 'Ideal para banheiro, cozinha, lavanderia, escritorio, consultorio, portas internas e divisorias que precisam bloquear a visao direta.',
    summary: 'Melhor escolha para privacidade 24 horas.',
    image: '/product-jateado-v2.webp',
    href: '/jateado/',
    tags: ['banheiro', 'consultorio', 'cozinha', 'divisoria'],
  },
  {
    title: 'Refletiva',
    subtitle: 'Reducao forte de calor e privacidade diurna',
    text: 'Cria efeito espelhado quando ha mais luz do lado de fora. Funciona muito bem em portas externas, fachadas e lojas.',
    summary: 'Boa escolha para sol forte, fachada e privacidade durante o dia.',
    image: '/product-refletiva.webp',
    href: '/refletiva/',
    tags: ['loja', 'fachada', 'sol da tarde', 'privacidade diurna'],
  },
  {
    title: 'Carbono',
    subtitle: 'Visual escuro, moderno e confortavel',
    text: 'Boa opcao para quem quer tom grafite, menor luminosidade e mais conforto visual em salas, quartos e escritorios.',
    summary: 'Boa opcao para escurecimento, privacidade diurna e custo-beneficio.',
    image: '/product-carbono.webp',
    href: '/carbono/',
    tags: ['sala', 'quarto', 'escritorio', 'visual grafite'],
  },
  {
    title: 'Seguranca',
    subtitle: 'Mais protecao para portas de vidro',
    text: 'Indicada para lojas, recepcoes, portas externas e acessos vulneraveis. Nao torna o vidro inquebravel, mas dificulta a ruptura imediata.',
    summary: 'Melhor opcao quando a prioridade e reforco e protecao.',
    image: '/product-smoke.webp',
    href: whatsapp,
    tags: ['porta comercial', 'recepcao', 'acesso externo', 'blindex'],
  },
];

const environments = [
  ['Porta de varanda', 'Nano ceramica, refletiva ou carbono para reduzir calor sem perder a vista.'],
  ['Porta de sala', 'Controle de calor, reflexo na TV e desbotamento de moveis.'],
  ['Porta de banheiro', 'Jateado para privacidade total sem deixar o ambiente escuro.'],
  ['Cozinha ou lavanderia', 'Jateado para privacidade ou nano ceramica quando o problema principal e calor.'],
  ['Porta de loja', 'Refletiva, seguranca ou jateado parcial conforme fachada e exposicao.'],
  ['Escritorio ou consultorio', 'Jateado para privacidade e nano ceramica para sol forte com visual profissional.'],
];

const comparison = [
  {
    need: 'Reduzir calor sem escurecer muito',
    options: [{ label: 'Nano ceramica', href: '/nano-ceramica/' }],
  },
  {
    need: 'Privacidade total',
    options: [{ label: 'Jateado', href: '/jateado/' }],
  },
  {
    need: 'Sol forte e fachada exposta',
    options: [{ label: 'Refletiva', href: '/refletiva/' }],
  },
  {
    need: 'Visual escuro e moderno',
    options: [{ label: 'Carbono', href: '/carbono/' }],
  },
  {
    need: 'Porta comercial mais protegida',
    options: [{ label: 'Seguranca / antivandalismo', href: whatsapp }],
  },
  {
    need: 'Porta de banheiro',
    options: [{ label: 'Jateado', href: '/jateado/' }],
  },
  {
    need: 'Porta de varanda',
    options: [
      { label: 'Nano ceramica', href: '/nano-ceramica/' },
      { label: 'Refletiva', href: '/refletiva/' },
      { label: 'Carbono', href: '/carbono/' },
    ],
  },
  {
    need: 'Porta de loja',
    options: [
      { label: 'Refletiva', href: '/refletiva/' },
      { label: 'Seguranca', href: whatsapp },
      { label: 'Jateado parcial', href: '/jateado/' },
    ],
  },
];

const faqs = [
  ['Pode colocar insulfilm em qualquer porta de vidro?', 'Na maioria dos casos, sim. O ideal e avaliar tipo de vidro, estado da superficie, tamanho da porta e exposicao ao sol.'],
  ['Qual a melhor pelicula para porta de vidro?', 'Depende do objetivo. Nano ceramica e excelente para calor sem escurecer; jateada para privacidade total; refletiva para fachada com sol forte; carbono para visual escuro e moderno.'],
  ['Insulfilm em porta de vidro da privacidade a noite?', 'Peliculas refletivas e carbono dao mais privacidade durante o dia. Para privacidade 24 horas, a jateada e a opcao mais segura.'],
  ['A pelicula jateada deixa o ambiente escuro?', 'Nao. Ela bloqueia a visao direta, mas mantem a entrada de luz difusa.'],
  ['Insulfilm reduz o calor da porta de vidro?', 'Sim. Peliculas de controle solar reduzem a entrada de calor, principalmente quando a porta recebe sol direto.'],
  ['A instalacao faz sujeira?', 'A instalacao e limpa e feita diretamente no vidro, sem obra e sem trocar a porta.'],
  ['Quanto custa insulfilm para porta de vidro?', 'O valor depende do tamanho da porta, tipo de pelicula e dificuldade. Envie uma foto ou medidas para receber uma estimativa.'],
  ['A LUME atende quais bairros?', 'Atendemos principalmente a Zona Oeste do Rio, incluindo Bangu, Campo Grande, Realengo, Jacarepagua, Barra da Tijuca, Recreio e regioes proximas.'],
];

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center page-entrance sm:mb-12">
      <div className="mb-4 flex items-center justify-center gap-4">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c9a227]">
          {eyebrow}
        </span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
      </div>
      <h2 className="font-montserrat text-2xl font-black leading-tight text-white sm:text-3xl md:text-5xl">
        {title}
      </h2>
      {text && <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base md:text-lg">{text}</p>}
    </div>
  );
}

export function InsulfilmPortasVidro() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      heroTl.fromTo(
        '.animate-hero',
        { opacity: 0, y: 26, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.75, stagger: 0.12 }
      );

      gsap.utils.toArray<HTMLElement>('.page-entrance').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.animated-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 36, rotateX: 8 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.75,
            delay: (index % 6) * 0.055,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        '.float-panel',
        { y: 0 },
        { y: -14, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.18 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#04080f] text-white">
      <WhatsAppButton />

      <section className="relative flex min-h-[88svh] items-center overflow-hidden px-4 pb-12 pt-28 sm:min-h-[92vh] sm:pb-16 sm:pt-32">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg-v2.png"
            alt="Porta de vidro com pelicula de controle solar instalada pela LUME"
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#04080f] via-[#04080f]/86 to-[#04080f]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-[#04080f]/60" />
        </div>
        <Particles />

        <div className="container-lume relative z-10">
          <div className="max-w-4xl">
            <NavigationBreadcrumbs
              showVisualTrail={false}
              items={[{ label: 'Inicio', href: '/' }, { label: 'Portas de vidro' }]}
            />
            <div className="animate-hero mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9a227] shadow-[0_0_25px_rgba(201,162,39,0.2)] sm:px-4 sm:text-xs sm:tracking-[0.28em]">
              <Sun size={16} />
              Residencial e comercial no Rio
            </div>
            <h1 className="animate-hero font-montserrat text-[2.45rem] font-black leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl">
              Insulfilm para <span className="text-gradient-gold">Portas de Vidro</span>
            </h1>
            <p className="animate-hero mt-6 max-w-3xl text-base leading-relaxed text-gray-300 sm:mt-7 sm:text-lg md:text-xl">
              Mais privacidade, conforto termico e protecao solar para portas de vidro
              residenciais e comerciais, com instalacao profissional no Rio de Janeiro.
            </p>
            <p className="animate-hero mt-5 max-w-3xl text-sm leading-relaxed text-gray-400 sm:text-base md:text-lg">
              Transforme sua porta de vidro sem trocar o vidro: peliculas de controle solar,
              privacidade, seguranca e acabamento decorativo com aplicacao limpa e precisa.
            </p>
            <div className="animate-hero mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex w-full items-center justify-center gap-3 sm:w-auto">
                Solicitar orcamento <MessageCircle size={19} />
              </a>
              <a href="#tipos" className="btn-secondary inline-flex w-full items-center justify-center gap-3 sm:w-auto">
                Ver tipos de pelicula <ArrowRight size={18} />
              </a>
            </div>
            <div className="animate-hero mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
              {['Garantia de 5 anos', 'Zona Oeste do Rio', 'Instalacao limpa', 'Orcamento gratuito'].map((item) => (
                <div key={item} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-xs text-gray-200 backdrop-blur sm:justify-start sm:px-4 sm:text-sm">
                  <CheckCircle size={16} className="shrink-0 text-[#c9a227]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#070f1a] py-5">
        <div className="container-lume">
          <div className="flex flex-wrap items-center justify-center gap-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-gray-300 sm:gap-4 sm:text-xs sm:tracking-[0.18em] md:justify-between">
            <span className="animated-card flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 sm:w-auto"><Shield size={16} className="text-[#c9a227]" /> Protecao UV</span>
            <span className="animated-card flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 sm:w-auto"><Thermometer size={16} className="text-[#c9a227]" /> Controle de calor</span>
            <span className="animated-card flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 sm:w-auto"><Eye size={16} className="text-[#c9a227]" /> Privacidade sob medida</span>
            <span className="animated-card flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 sm:w-auto"><Sparkles size={16} className="text-[#c9a227]" /> Acabamento premium</span>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#070f1a] px-4">
        <div className="container-lume grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="page-entrance">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
              Problema comum
            </p>
            <h2 className="font-montserrat text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
              Sua porta de vidro esta deixando entrar calor, claridade ou olhares demais?
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-400 sm:mt-7 sm:space-y-5 sm:text-lg">
              <p>
                Portas de vidro sao lindas, modernas e valorizam o imovel. O problema aparece
                quando recebem sol direto, ficam voltadas para rua, corredor, varanda, area comum
                do predio ou fachada comercial.
              </p>
              <p>
                O vidro pode transformar o ambiente em uma estufa, causar reflexo em telas,
                desbotar moveis e tirar a privacidade. O insulfilm resolve isso sem obra, sem
                sujeira pesada e sem mudar a estrutura da porta.
              </p>
            </div>
          </div>
          <div className="grid gap-3 page-entrance sm:grid-cols-2">
            {painPoints.map((item, index) => (
              <div
                key={item}
                className="animated-card float-panel rounded-lg border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/40 hover:bg-white/[0.06]"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9a227]/10 text-[#c9a227]">
                  <Wand2 size={19} />
                </div>
                <p className="font-semibold leading-snug text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#04080f] px-4">
        <div className="container-lume">
          <SectionHeader
            eyebrow="Vantagens"
            title="Vantagens do insulfilm em portas de vidro"
            text="A pelicula certa muda a sensacao do ambiente, melhora a privacidade e protege o que esta dentro, mantendo o vidro existente."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="animated-card page-entrance group rounded-lg border border-white/10 bg-gradient-to-b from-[#0a1628]/80 to-[#04080f] p-7 transition duration-500 hover:-translate-y-2 hover:border-[#c9a227]/50">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#c9a227]/10 text-[#c9a227] transition group-hover:bg-[#c9a227] group-hover:text-[#04080f]">
                  <benefit.icon size={24} />
                </div>
                <h3 className="mb-3 font-montserrat text-xl font-bold text-white">{benefit.title}</h3>
                <p className="leading-relaxed text-gray-400">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tipos" className="section-padding overflow-hidden border-y border-white/5 bg-[#070f1a] px-4">
        <div className="container-lume">
          <SectionHeader
            eyebrow="Tipos de pelicula"
            title="Qual o melhor tipo de insulfilm para porta de vidro?"
            text="A melhor escolha depende do objetivo: reduzir calor, ganhar privacidade, escurecer, manter transparencia, decorar ou reforcar a seguranca."
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {filmTypes.map((film) => (
              <article key={film.title} className="animated-card page-entrance group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-[#04080f] transition duration-500 hover:-translate-y-2 hover:border-[#c9a227]/50">
                <a href={film.href} target={film.href.startsWith('http') ? '_blank' : undefined} rel={film.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex h-full flex-col">
                  <div className="relative h-40 overflow-hidden sm:h-44">
                    <Image src={film.image} alt={`${film.title} para porta de vidro`} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw" className="object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-montserrat text-xl font-bold text-white">{film.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-[#c9a227]">{film.subtitle}</p>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-400">{film.text}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {film.tags.map((tag) => (
                        <span key={tag} className="rounded-lg border border-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-gray-400 sm:text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-5 border-t border-white/10 pt-4 text-sm font-semibold text-white">{film.summary}</p>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#04080f] px-4">
        <div className="container-lume grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="page-entrance">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
              Ambientes
            </p>
            <h2 className="font-montserrat text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
              Onde instalar insulfilm em portas de vidro?
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-400 sm:text-lg">
              Em cada ambiente a prioridade muda. Algumas portas precisam de conforto termico,
              outras de privacidade total, outras de seguranca ou acabamento decorativo.
            </p>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 inline-flex w-full items-center justify-center gap-3 sm:w-auto">
              Enviar foto da porta <ArrowRight size={18} />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {environments.map(([name, text], index) => {
              const Icon = [Home, Sun, Lock, Layers, Store, Building2][index] || CheckCircle;
              return (
                <div key={name} className="animated-card page-entrance rounded-lg border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:border-[#c9a227]/40 hover:bg-white/[0.055]">
                  <Icon className="mb-4 text-[#c9a227]" size={24} />
                  <h3 className="mb-2 font-montserrat text-lg font-bold text-white">{name}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-white/5 bg-[#070f1a] px-4">
        <div className="container-lume">
          <SectionHeader
            eyebrow="Comparativo"
            title="Comparativo rapido: qual pelicula escolher?"
          />
          <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-white/10 page-entrance">
            {comparison.map(({ need, options }, index) => (
              <div key={need} className={`animated-card grid gap-3 p-4 sm:p-5 md:grid-cols-[1fr_0.8fr] ${index % 2 === 0 ? 'bg-white/[0.035]' : 'bg-white/[0.015]'}`}>
                <p className="font-semibold text-white">{need}</p>
                <div className="flex flex-wrap items-start gap-2">
                  <BadgeCheck size={18} className="text-[#c9a227]" />
                  {options.map((option) => (
                    <a
                      key={`${need}-${option.label}`}
                      href={option.href}
                      target={option.href.startsWith('http') ? '_blank' : undefined}
                      rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="rounded-lg border border-[#c9a227]/25 bg-[#c9a227]/10 px-3 py-1.5 text-xs font-semibold text-[#c9a227] transition hover:border-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] sm:text-sm"
                    >
                      {option.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-white/5 bg-[#070f1a] px-4">
        <div className="container-lume grid items-center gap-12 lg:grid-cols-2">
          <div className="page-entrance">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#c9a227]">
              LUME Controle Solar
            </p>
            <h2 className="font-montserrat text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
              Por que instalar com a LUME?
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-400 sm:text-lg">
              A LUME e especializada em peliculas de controle solar para residencias e
              comercios no Rio de Janeiro. Avaliamos o ambiente, entendemos o problema
              e indicamos a pelicula que faz sentido para seu vidro, seu sol e seu bolso.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 page-entrance">
            {[
              '8 anos de experiencia',
              'Mais de 500 residencias atendidas',
              'Garantia de 5 anos',
              'Atendimento na Zona Oeste',
              'Orcamento gratuito',
              'Instalacao limpa e cuidadosa',
            ].map((item) => (
              <div key={item} className="animated-card group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 transition duration-500 hover:-translate-y-2 hover:border-[#c9a227]/45 hover:bg-white/[0.06]">
                <CheckCircle size={18} className="shrink-0 text-[#c9a227]" />
                <span className="font-semibold text-gray-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#04080f] px-4">
        <div className="container-lume">
          <SectionHeader
            eyebrow="Regioes atendidas"
            title="Instalacao de insulfilm para portas de vidro na Zona Oeste do Rio"
            text="Atendemos residencias, apartamentos, lojas, escritorios e comercios em diversos bairros do Rio de Janeiro."
          />
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3 page-entrance">
            {['Bangu', 'Campo Grande', 'Realengo', 'Padre Miguel', 'Sulacap', 'Jacarepagua', 'Barra da Tijuca', 'Recreio', 'Vargem Grande', 'Vargem Pequena', 'Guaratiba', 'Santa Cruz', 'Regioes proximas'].map((area) => (
              <span key={area} className="animated-card inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-gray-300 transition hover:-translate-y-1 hover:border-[#c9a227]/40">
                <MapPin size={16} className="text-[#c9a227]" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-[#c9a227]/20 bg-[#c9a227] px-4 text-[#04080f]">
        <div className="container-lume grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div className="page-entrance">
            <h2 className="font-montserrat text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
              Quer saber qual pelicula combina com sua porta de vidro?
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#04080f]/80 sm:text-lg">
              Mande uma foto pelo WhatsApp. A gente avalia tipo de vidro, posicao do sol
              e nivel de privacidade desejado para indicar a melhor opcao.
            </p>
          </div>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="page-entrance inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#04080f] px-8 py-5 text-sm font-black uppercase tracking-wider text-white transition hover:-translate-y-1 hover:bg-[#111e33] sm:w-auto"
          >
            Enviar foto da porta <MessageCircle size={19} />
          </a>
        </div>
      </section>

      <section className="section-padding bg-[#070f1a] px-4">
        <div className="container-lume">
          <SectionHeader
            eyebrow="FAQ"
            title="Perguntas frequentes sobre insulfilm para portas de vidro"
          />
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {faqs.map(([question, answer]) => (
              <details key={question} className="animated-card page-entrance group rounded-lg border border-white/10 bg-white/[0.035] p-5 open:border-[#c9a227]/40">
                <summary className="cursor-pointer list-none font-montserrat text-base font-bold text-white sm:text-lg">
                  {question}
                </summary>
                <p className="mt-4 leading-relaxed text-gray-400">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <GoogleReviews />
    </div>
  );
}
