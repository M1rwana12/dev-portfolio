import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Process from './components/Process';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BotWidget from './components/BotWidget';
import ScrollProgress from './components/ScrollProgress';
import UniverseHost from './three/UniverseHost';
import { useReveal } from './useReveal';
import { useLang } from './i18n';

export default function App() {
  const { t } = useLang();
  useReveal();

  return (
    <>
      <a href="#main" className="skip-link">
        {t.a11y.skip}
      </a>
      <UniverseHost />
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <Projects />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BotWidget />
    </>
  );
}
