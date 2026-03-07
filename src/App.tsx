import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Products } from './sections/Products';
import { Benefits } from './sections/Benefits';
import { About } from './sections/About';
import { Coverage } from './sections/Coverage';
import { Reviews } from './sections/Reviews';
import { ContactCTA } from './sections/ContactCTA';
import { Footer } from './sections/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { QuotePage } from './pages/QuotePage';
import { AdminCalculator } from './pages/AdminCalculator';
import { SimulatorPage } from './pages/Simulator';
import { NanoCeramicaPage } from './pages/NanoCeramica';
import { CarbonoPage } from './pages/Carbono';
import { DuplaCamadaPage } from './pages/DuplaCamada';
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
      <Reviews />
      <ContactCTA />
    </>
  );
}

function App() {
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
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/orcamento" element={<QuotePage />} />
          <Route path="/admin" element={<AdminCalculator />} />
          <Route path="/simulador" element={<SimulatorPage />} />
          <Route path="/nano-ceramica" element={<NanoCeramicaPage />} />
          <Route path="/carbono" element={<CarbonoPage />} />
          <Route path="/dupla-camada" element={<DuplaCamadaPage />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;
