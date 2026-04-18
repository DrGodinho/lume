import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Capacitor } from '@capacitor/core';
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Products } from './sections/Products';
import { Benefits } from './sections/Benefits';
import { About } from './sections/About';
import { Coverage } from './sections/Coverage';
import { GoogleReviews } from './components/GoogleReviews';
// import { Reviews } from './sections/Reviews';
import { ContactCTA } from './sections/ContactCTA';
import { Footer } from './sections/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { QuotePage } from './views/QuotePage';
import { AdminCalculator } from './views/AdminCalculator';
import { SimulatorPage } from './views/Simulator';
import { NanoCeramicaPage } from './views/NanoCeramica';
import { CarbonoPage } from './views/Carbono';
import { DuplaCamadaPage } from './views/DuplaCamada';
import { RefletivaPage } from './views/Refletiva';
import { JateadoPage } from './views/Jateado';
import { GuiaInsulfilm } from './views/GuiaInsulfilm';
import { BanguPage } from './views/BanguPage';
import { RealengoPage } from './views/RealengoPage';
import { CampoGrandePage } from './views/CampoGrandePage';
import { JacarepaguaPage } from './views/JacarepaguaPage';
import { BarraPage } from './views/BarraPage';
import { RecreioPage } from './views/RecreioPage';
import { NotFound } from './views/NotFound';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
}

function LandingPage() {
  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://lumecontrolesolar.com.br/" />
      </Helmet>
      <Hero />
      <Products />
      <Benefits />
      <About />
      <Coverage />
      <GoogleReviews />
      <ContactCTA />
    </>
  );
}

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    // PWA: Só registrar e gerenciar instalação se for Admin
    if (isAdmin) {
      import('virtual:pwa-register').then(({ registerSW }) => {
        registerSW({ immediate: true });
      }).catch(() => {
        // Ignora erro se o módulo não estiver disponível (ex: em dev sem plugin)
      });
    }

    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    return () => {
      // Cleanup ScrollTrigger instances on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-x-hidden">
      <ScrollToTop />
      {!isAdmin && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={Capacitor.isNativePlatform() ? <Navigate to="/admin" replace /> : <LandingPage />} />
          <Route path="/orcamento" element={<QuotePage />} />
          <Route path="/admin" element={<AdminCalculator />} />
          <Route path="/simulador" element={<SimulatorPage />} />
          <Route path="/nano-ceramica" element={<NanoCeramicaPage />} />
          <Route path="/carbono" element={<CarbonoPage />} />
          <Route path="/dupla-camada" element={<DuplaCamadaPage />} />
          <Route path="/refletiva" element={<RefletivaPage />} />
          <Route path="/jateado" element={<JateadoPage />} />
          <Route path="/guia-insulfilm" element={<GuiaInsulfilm />} />
          <Route path="/insulfilm-em-bangu" element={<BanguPage />} />
          <Route path="/insulfilm-em-realengo" element={<RealengoPage />} />
          <Route path="/insulfilm-em-campo-grande" element={<CampoGrandePage />} />
          <Route path="/insulfilm-em-jacarepagua" element={<JacarepaguaPage />} />
          <Route path="/insulfilm-na-barra-da-tijuca" element={<BarraPage />} />
          <Route path="/insulfilm-no-recreio" element={<RecreioPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdmin && (
        <>
          <Footer />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
}


export default App;
