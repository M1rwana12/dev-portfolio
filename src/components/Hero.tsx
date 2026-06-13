import { useEffect, useRef, useState, type MouseEvent } from 'react';
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

function Counter({
  to,
  suffix,
  label,
  delay,
}: {
  to: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1300;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <div className="stat reveal" style={{ transitionDelay: `${delay}ms` }} ref={ref}>
      <strong>
        {val}
        <span>{suffix}</span>
      </strong>
      <small>{label}</small>
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();
  const typed = useTypewriter(t.hero.words);
  // найдовше слово ротації — резервує ширину рядка, щоб текст не обрізався
  const longestWord = t.hero.words.reduce((a, b) => (b.length > a.length ? b : a), '');

  const spot = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--hx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--hy', `${e.clientY - r.top}px`);
  };

  const tilt = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 12;
    el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
  };

  const untilt = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <header className="hero" id="top" onMouseMove={spot}>
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-spot" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-content">
          <div className="hero-badge reveal">
            <span className="dot" />
            {t.hero.badge}
          </div>
          <h1 className="reveal" style={{ transitionDelay: '90ms' }}>
            {t.hero.titleStart}
            <br />
            <span className="typed-wrap">
              <span className="typed-ghost" aria-hidden="true">
                {longestWord}
              </span>
              <span className="typed">
                {typed}
                <span className="caret" aria-hidden="true" />
              </span>
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
          <div className="hero-stats">
            <Counter to={15} suffix="+" label={t.hero.stats[0]} delay={400} />
            <Counter to={3} suffix="" label={t.hero.stats[1]} delay={490} />
            <Counter to={24} suffix="/7" label={t.hero.stats[2]} delay={580} />
          </div>
        </div>

        <div className="hero-visual reveal" style={{ transitionDelay: '300ms' }} aria-hidden="true">
          <div className="hero-card" onMouseMove={tilt} onMouseLeave={untilt}>
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
          <span className="chip chip-1">React</span>
          <span className="chip chip-2">Python</span>
          <span className="chip chip-3">Node.js</span>
          <span className="chip chip-4">Telegram API</span>
        </div>
      </div>
    </header>
  );
}
