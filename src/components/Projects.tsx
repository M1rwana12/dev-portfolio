import { useEffect, useState } from 'react';
import { useLang } from '../i18n';
import { trackSpotlight } from '../fx';
import shotPortfolio from '../assets/shot-portfolio.jpg';

const shots: (string | null)[] = [shotPortfolio, null];

export default function Projects() {
  const { t } = useLang();
  const [openCase, setOpenCase] = useState<number | null>(null);

  useEffect(() => {
    if (openCase === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenCase(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [openCase]);

  const statusLabel = (s: string) =>
    s === 'live' ? t.projects.statusLive : s === 'demo' ? t.projects.statusDemo : t.projects.statusSoon;

  const item = openCase !== null ? t.projects.items[openCase] : null;

  return (
    <section className="section" id="projects">
      <div className="container">
        <p className="section-label reveal">{t.projects.label}</p>
        <h2 className="reveal">{t.projects.title}</h2>
        <div className="cards-grid">
          {t.projects.items.map((p, i) => (
            <article
              key={p.title}
              className="card project-card reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
              onMouseMove={trackSpotlight}
            >
              <span className={`status status-${p.status}`}>
                <i />
                {statusLabel(p.status)}
              </span>
              {shots[i] ? (
                <div className="shot">
                  <div className="shot-bar">
                    <i /><i /><i />
                  </div>
                  <img src={shots[i]} alt={p.title} loading="lazy" />
                </div>
              ) : (
                <div className="shot shot-soon" aria-hidden="true">
                  <span className="sk" style={{ width: '64%' }} />
                  <span className="sk sk-r" style={{ width: '46%' }} />
                  <span className="sk" style={{ width: '72%' }} />
                  <span className="sk sk-r" style={{ width: '38%' }} />
                </div>
              )}
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <div className="card-actions">
                <button className="card-link card-details" onClick={() => setOpenCase(i)}>
                  {t.projects.detailsBtn} →
                </button>
                {p.link && (
                  <a className="card-link" href={p.link} target="_blank" rel="noreferrer">
                    {p.linkLabel} ↗
                  </a>
                )}
              </div>
            </article>
          ))}
          <article
            className="card project-card card-cta reveal"
            style={{ transitionDelay: '200ms' }}
            onMouseMove={trackSpotlight}
          >
            <h3>{t.projects.ctaTitle}</h3>
            <p>{t.projects.ctaText}</p>
            <a className="btn btn-primary" href="#contact">
              {t.projects.ctaBtn}
            </a>
          </article>
        </div>
      </div>

      {item && (
        <div className="modal-backdrop" onClick={() => setOpenCase(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setOpenCase(null)} aria-label="Close">
              ✕
            </button>
            <span className={`status status-${item.status}`}>
              <i />
              {statusLabel(item.status)}
            </span>
            <h3>{item.title}</h3>

            <h4>{t.projects.caseLabels.problem}</h4>
            <p>{item.case.problem}</p>

            <h4>{t.projects.caseLabels.solution}</h4>
            <p>{item.case.solution}</p>

            <h4>{t.projects.caseLabels.results}</h4>
            <ul>
              {item.case.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>

            {item.link && (
              <a className="btn btn-ghost" href={item.link} target="_blank" rel="noreferrer">
                {item.linkLabel} ↗
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
