import { Shield, Sun, Thermometer, CheckCircle, ArrowRight, Eye, SunDim, Star, PiggyBank, Lock, MapPin, Zap, MessageCircle, Droplets } from 'lucide-react';
import { WhatsAppButton } from './WhatsAppButton';
import { GoogleReviews } from './GoogleReviews';
import { Particles } from './Particles';
import { AnimatedCounter } from './AnimatedCounter';
import { NavigationBreadcrumbs } from './NavigationBreadcrumbs';
import Link from 'next/link';
import { NeighborhoodData } from '../data/neighborhoods';
import { NeighborhoodAnimations } from './NeighborhoodAnimations';
import Image from 'next/image';

interface Props {
  data: NeighborhoodData;
}

export function NeighborhoodTemplate({ data }: Props) {
  const healthFaqs = [
    {
      q: "O insulfilm ajuda a prevenir o câncer de pele em ambientes internos?",
      a: "Sim, nossas películas bloqueiam 99% dos raios UVA e UVB, principais responsáveis por danos à pele, proporcionando proteção essencial para quem passa muito tempo próximo a janelas com incidência solar."
    },
    {
      q: "A película de controle solar reduz a fadiga ocular?",
      a: "Sim, ao reduzir o brilho excessivo e equilibrar a luminosidade, as películas diminuem o esforço visual, prevenindo dores de cabeça e cansaço ocular em ambientes de trabalho e descanso."
    },
    {
      q: "Como o insulfilm contribui para o bem-estar térmico?",
      a: "Ao manter a temperatura interna estável e evitar picos de calor, as películas promovem um ambiente mais relaxante, reduzindo o estresse térmico e aumentando o conforto dos moradores."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": `LUME Controle Solar - ${data.neighborName}`,
        "image": "https://lumecontrolesolar.com.br/og-image.jpg",
        "description": data.metaDescription,
        "@id": `https://lumecontrolesolar.com.br/${data.slug}`,
        "url": `https://lumecontrolesolar.com.br/${data.slug}`,
        "telephone": "+5521965140612",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": data.location.address,
          "addressLocality": data.neighborName,
          "addressRegion": "RJ",
          "addressCountry": "BR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": data.location.lat,
          "longitude": data.location.lng
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "08:00",
          "closes": "18:00"
        },
        "sameAs": [
          "https://www.instagram.com/lumecontrolesolar"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          ...data.faq.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a
            }
          })),
          ...healthFaqs.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a
            }
          }))
        ]
      }
    ]
  };

  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <NeighborhoodAnimations />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <Image src={data.heroBg} alt={`Instalação de insulfilm profissional em ${data.neighborName}`} fill sizes="100vw" priority className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#04080f]/95 via-[#04080f]/80 to-[#04080f]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-[#04080f]/50" />
        </div>

        <Particles />
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04080f] to-transparent z-10" />
        <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#c9a227]/5 blur-3xl animate-float z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#04080f]/30 blur-3xl animate-float z-10" style={{ animationDelay: '2s' }} />

        <div className="container-lume relative z-20 page-entrance text-center md:text-left pt-24 pb-12">
          <NavigationBreadcrumbs 
            items={[
              { label: 'Início', href: '/' },
              { label: data.neighborName }
            ]}
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse flex-shrink-0" />
            <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider">{data.region}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-montserrat mb-6 leading-tight">
            {data.heroTitle} <span className="text-gradient-gold">{data.heroHighlight}</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed font-light">
            {data.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href={`https://wa.me/5521965140612?text=${encodeURIComponent(data.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8 transform transition hover:scale-105"
            >
              {data.heroButtonText} <ArrowRight size={20} />
            </a>
            <a
              href="#tipos"
              className="btn-outline inline-flex items-center justify-center gap-3 text-lg py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-widest text-sm"
            >
              {data.secondaryButtonText}
            </a>
          </div>
        </div>
      </section>

      {/* Auto-Scroll Info Strip */}
      <div className="bg-[#c9a227] py-4 overflow-hidden border-y border-white/10 whitespace-nowrap">
        <div className="flex animate-scroll-slow gap-12 items-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-12 items-center">
              <span className="flex items-center gap-3 text-[#04080f] font-black uppercase text-sm tracking-tighter">
                <CheckCircle size={18} /> Orçamento Gratuito em {data.neighborName}
              </span>
              <span className="flex items-center gap-3 text-[#04080f] font-black uppercase text-sm tracking-tighter">
                <Zap size={18} /> Instalação Express 24h
              </span>
              <span className="flex items-center gap-3 text-[#04080f] font-black uppercase text-sm tracking-tighter">
                <Shield size={18} /> 5 Anos de Garantia
              </span>
              <span className="flex items-center gap-3 text-[#04080f] font-black uppercase text-sm tracking-tighter">
                <Star size={18} /> Qualidade Premium LUME
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section className="py-24 relative px-4 overflow-hidden">
        <div className="container-lume">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="page-entrance">
              <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-8 leading-tight tracking-tight uppercase">
                A melhor solução de <span className="text-[#c9a227]">Insulfilm Residencial</span> para sua casa em {data.neighborName}
              </h2>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
                <p>
                  Morar em {data.neighborName} exige soluções inteligentes contra o calor intenso do Rio de Janeiro. Nossas películas não são apenas "filmes escuros"; são barreiras térmicas de alta tecnologia desenvolvidas para refletir o calor antes mesmo que ele entre no seu ambiente.
                </p>
                <p>
                  Com a LUME, você garante muito mais do que estética. Nossas linhas <strong>Nano Cerâmica</strong> e <strong>Carbono</strong> oferecem bloqueio de 99% dos raios UV, protegendo sua família e evitando que seus móveis, pisos e cortinas desbotem com o sol.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <Thermometer className="text-[#c9a227]" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Menos Calor</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <Lock className="text-[#c9a227]" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">+ Privacidade</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <Shield className="text-[#c9a227]" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Proteção UV</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <PiggyBank className="text-[#c9a227]" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Economia</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative page-entrance">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#c9a227]/20 to-transparent rounded-3xl blur-2xl" />
              <Image src="/about_residential.webp" alt={`Insulfilm em ${data.neighborName}`} fill sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" className="rounded-3xl border border-white/10 shadow-2xl relative z-10 w-full" />
              <div className="absolute -bottom-6 -right-6 bg-[#c9a227] p-8 rounded-2xl z-20 shadow-xl hidden md:block">
                <p className="text-[#04080f] font-black text-4xl leading-none">
                  <AnimatedCounter target="1000" suffix="+" />
                </p>
                <p className="text-[#04080f] font-bold text-xs uppercase tracking-widest mt-2">Instalações em 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Película - Condensed from main sections but customized */}
      <section id="tipos" className="py-24 bg-[#04080f] px-4">
        <div className="container-lume">
          <div className="text-center mb-16 page-entrance">
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">PELÍCULAS DE ALTA PERFORMANCE</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Conheça as tecnologias mais procuradas em {data.neighborName} para controle térmico e privacidade.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Nano Cerâmica", selo: "Top de Linha", icon: Star, path: "/nano-ceramica", desc: "Privacidade e frescor total. Rejeita o calor invisível (IR) sem alterar a fachada original." },
              { title: "Carbono Premium", selo: "Privacidade", icon: SunDim, path: "/carbono", desc: "O preto intenso que nunca fica roxo. Oferece elegância e bloqueio térmico de 80%." },
              { title: "Refletiva / Silver", selo: "Alta Rejeição", icon: Sun, path: "/refletiva", desc: "Efeito espelhado clássico. Máxima rejeição de calor para sol direto o dia todo." },
              { title: "Jateado Design", selo: "Decoração", icon: Eye, path: "/jateado", desc: "Estética fosca para privacidade em banheiros e divisórias de escritórios." },
              { title: "Dupla Camada", selo: "Favorito", icon: Droplets, path: "/dupla-camada", desc: "Alta redução de calor com tecnologia especial: refletiva fora, fumê dentro." }
            ].map((product, idx) => (
              <div key={idx} className="product-card group relative bg-[#04080f]/60 rounded-2xl p-8 border border-white/5 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full">
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#c9a227] text-[#04080f] text-[10px] font-bold uppercase rounded-full">{product.selo}</div>
                <product.icon size={48} className="text-[#c9a227] mb-6" />
                <h3 className="text-2xl font-bold mb-4">{product.title}</h3>
                <p className="text-gray-400 mb-8 flex-grow leading-relaxed">{product.desc}</p>
                <Link href={product.path} className="btn-outline py-3 text-center text-xs tracking-widest font-bold uppercase border border-white/10 hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl">Detalhes Técnicos</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Coverage Section */}
      <section className="py-24 relative overflow-hidden px-4">
        <div className="container-lume">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="page-entrance order-2 lg:order-1">
              <div className="bg-[#04080f]/30 p-8 md:p-12 rounded-3xl border border-[#04080f]/50">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                  <MapPin className="text-[#c9a227]" size={32} /> ATENDIMENTO EM {data.neighborName.toUpperCase()}
                </h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Nossa equipe de instalação atende diariamente em todas as regiões de {data.neighborName} e arredores. Se você está em um condomínio ou prédio comercial na região, garantimos uma aplicação rápida e profissional.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.regionsList.map((region, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-400 hover:text-[#c9a227] transition-colors cursor-default group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]/30 group-hover:bg-[#c9a227] flex-shrink-0" />
                      <span className="text-sm font-medium">{region}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-12 p-6 bg-[#c9a227]/10 rounded-2xl border border-[#c9a227]/20">
                  <p className="text-[#c9a227] font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Zap size={16} /> Instalação Express em 24h
                  </p>
                  <p className="text-gray-400 text-sm italic">
                    "Moradores de {data.neighborName} possuem prioridade na agenda de instalação para orçamentos fechados via WhatsApp hoje."
                  </p>
                </div>
              </div>
            </div>
            <div className="page-entrance order-1 lg:order-2">
              <h3 className="text-2xl font-bold text-[#c9a227] mb-6 uppercase tracking-widest">Onde estamos</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Além de {data.neighborName}, a LUME Controle Solar possui unidades volantes que atendem toda a Zona Oeste e Zona Sul do Rio de Janeiro.
              </p>
              <div className="space-y-6">
                {[
                  { icon: MessageCircle, title: "Suporte 24h", desc: "Tire suas dúvidas agora pelo WhatsApp." },
                  { icon: Shield, title: "Empresa Legalizada", desc: "Emitimos nota fiscal e certificado de garantia." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center flex-shrink-0 border border-[#c9a227]/20">
                      <item.icon className="text-[#c9a227]" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoogleReviews />

      {/* FAQ Section */}
      <section className="py-24 bg-[#04080f] px-4">
        <div className="container-lume max-w-4xl mx-auto page-entrance">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight text-white">FAQ</h2>
            <p className="text-gray-500 font-medium">Esclareça suas principais dúvidas sobre aplicação e durabilidade.</p>
          </div>

          <div className="space-y-4">
            {data.faq.map((item, idx) => (
              <div key={idx} className="bg-[#1a3a5c]/20 border border-[#1a3a5c]/50 rounded-2xl p-6 md:p-8">
                <h4 className="text-xl font-bold mb-4 text-[#c9a227]">{item.q}</h4>
                <p className="text-gray-400 leading-relaxed font-light">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-lume text-center px-4">
          <div className="bg-gradient-to-br from-[#1a3a5c]/80 to-[#04080f]/95 p-12 md:p-20 rounded-[3rem] border border-[#c9a227]/20 relative overflow-hidden page-entrance">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a227]/5 blur-3xl rounded-full -mr-48 -mt-48" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight uppercase">
                VAMOS TRANSFORMAR OS <span className="text-[#c9a227]">VIDROS</span> DA SUA CASA?
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Garanta o conforto térmico que sua família merece. Orçamento rápido, sem custo e instalação profissional em até 24h em {data.neighborName}.
              </p>
              <a
                href={`https://wa.me/5521965140612?text=${encodeURIComponent(data.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-4 text-xl py-6 px-12 transform transition hover:scale-105"
              >
                QUERO UM ORÇAMENTO <ArrowRight />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
