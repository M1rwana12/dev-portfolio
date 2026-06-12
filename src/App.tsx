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
import { useReveal } from './useReveal';

export default function App() {
  useReveal();

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
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
