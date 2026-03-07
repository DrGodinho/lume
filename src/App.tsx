import { useEffect, useState } from 'react';
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
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'quote' | 'admin' | 'simulator' | 'nano-ceramica'>('landing');

  useEffect(() => {
    // Basic "router" without extra dependencies
    const handleHashChange = () => {
      if (window.location.hash === '#orcamento') {
        setCurrentPage('quote');
      } else if (window.location.hash === '#admincalculator') {
        setCurrentPage('admin');
      } else if (window.location.hash === '#simulador') {
        setCurrentPage('simulator');
      } else if (window.location.hash === '#nano-ceramica') {
        setCurrentPage('nano-ceramica');
      } else {
        setCurrentPage('landing');
      }
    };

    // Check on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  if (currentPage === 'admin') {
    return <AdminCalculator />;
  }

  if (currentPage === 'quote') {
    return <QuotePage />;
  }

  if (currentPage === 'simulator') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <SimulatorPage />
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (currentPage === 'nano-ceramica') {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <Navbar />
        <NanoCeramicaPage />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Products Section */}
        <Products />

        {/* Benefits Section */}
        <Benefits />

        {/* About Section */}
        <About />

        {/* Coverage Section */}
        <Coverage />

        {/* Reviews Section */}
        <Reviews />

        {/* Contact CTA Section */}
        <ContactCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}

export default App;
