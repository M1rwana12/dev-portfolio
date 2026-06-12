import { useEffect, useState } from 'react';
import { useLang, LINKS } from '../i18n';

function useTypewriter(words: string[]) {
  const [text, setText] = useState('');
  const key = words.join('|');

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: number;

    const tick = () => {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        setText(word.slice(0, charIndex));
        if (charIndex === word.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1900);
          return;
        }
        timer = window.setTimeout(tick, 70);
      } else {
        charIndex--;
        setText(word.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timer = window.setTimeout(tick, 350);
          return;
        }
        timer = window.setTimeout(tick, 38);
      }
    };

    timer = window.setTimeout(tick, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return text;
}

export default function Hero() {
  const { t } = useLang();
  const typed = useTypewriter(t.hero.words);

  return (
    <header className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-content">
          <div className="hero-badge reveal">
            <span className="dot" />
            {t.hero.badge}
          </div>
          <h1 className="reveal" style={{ transitionDelay: '90ms' }}>
            {t.hero.titleStart}
            <br />
            <span className="typed">
              {typed}
              <span className="caret" aria-hidden="true" />
            </span>
          </h1>
          <p className="hero-sub reveal" style={{ transitionDelay: '180ms' }}>
            {t.hero.sub}
          </p>
          <div className="hero-cta reveal" style={{ transitionDelay: '270ms' }}>
            <a href="#contact" className="btn btn-primary">
              {t.hero.ctaPrimary}
            </a>
            <a href="#projects" className="btn btn-ghost">
              {t.hero.ctaSecondary}
            </a>
          </div>
          <div className="hero-meta reveal" style={{ transitionDelay: '360ms' }}>
            {t.hero.meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
            <a href={LINKS.freelancehunt} target="_blank" rel="noreferrer">
              {t.hero.metaLink} ↗
            </a>
          </div>
        </div>

        <div className="hero-card reveal" style={{ transitionDelay: '300ms' }} aria-hidden="true">
          <div className="hero-card-bar">
            <i /><i /><i />
            <span>developer.ts</span>
          </div>
          <pre>
            <code>
              <span className="c-kw">const</span> <span className="c-var">andrii</span> = {'{'}
              {'\n'}  location: <span className="c-str">"Kyiv, UA"</span>,
              {'\n'}  stack: [<span className="c-str">"TS"</span>, <span className="c-str">"Node"</span>, <span className="c-str">"Python"</span>, <span className="c-str">"C#"</span>],
              {'\n'}  focus: [<span className="c-str">"web"</span>, <span className="c-str">"bots"</span>, <span className="c-str">"automation"</span>],
              {'\n'}  status: <span className="c-acc">"open_to_work"</span>,
              {'\n'}{'}'};
            </code>
          </pre>
        </div>
      </div>
    </header>
  );
}
