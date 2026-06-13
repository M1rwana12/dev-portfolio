import { useEffect, useState } from 'react';
import { useLang, type Lang } from '../i18n';

const SECTIONS = ['services', 'process', 'projects', 'pricing', 'about', 'contact'];

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // scrollspy — підсвічує активну секцію в навігації
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      // активною стає секція, що перетнула верхню третину екрана
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const links = [
    { href: '#services', id: 'services', label: t.nav.services },
    { href: '#process', id: 'process', label: t.nav.process },
    { href: '#projects', id: 'projects', label: t.nav.projects },
    { href: '#pricing', id: 'pricing', label: t.nav.pricing },
    { href: '#about', id: 'about', label: t.nav.about },
    { href: '#contact', id: 'contact', label: t.nav.contact },
  ];

  const langs: Lang[] = ['ua', 'en'];

  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="nav-logo">
          AS<span>.</span>dev
        </a>
        <div className="nav-links">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.id ? 'active' : ''}
              aria-current={active === l.id ? 'true' : undefined}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div
          className="lang-toggle"
          role="group"
          aria-label="Language"
          data-active={lang}
        >
          <span className="lang-thumb" aria-hidden="true" />
          {langs.map((l) => (
            <button
              key={l}
              className={lang === l ? 'active' : ''}
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
