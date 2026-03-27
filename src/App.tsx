import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Products } from './sections/Products';
import { Benefits } from './sections/Benefits';
import { About } from './sections/About';
import { Coverage } from './sections/Coverage';
// import { Reviews } from './sections/Reviews';
import { ContactCTA } from './sections/ContactCTA';
import { Footer } from './sections/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { QuotePage } from './pages/QuotePage';
import { AdminCalculator } from './pages/AdminCalculator';
import { SimulatorPage } from './pages/Simulator';
import { NanoCeramicaPage } from './pages/NanoCeramica';
import { CarbonoPage } from './pages/Carbono';
import { DuplaCamadaPage } from './pages/DuplaCamada';
import { RefletivaPage } from './pages/Refletiva';
import { JateadoPage } from './pages/Jateado';
import { GuiaInsulfilm } from './pages/GuiaInsulfilm';
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
      <Hero />
      <Products />
      <Benefits />
      <About />
      <Coverage />
      {/* <Reviews /> */}
      <ContactCTA />
    </>
  );
}

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    return () => {
      // Cleanup ScrollTrigger instances on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

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
