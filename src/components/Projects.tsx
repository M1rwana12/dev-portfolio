import { useLang } from '../i18n';
import { trackSpotlight } from '../fx';
import shotPortfolio from '../assets/shot-portfolio.jpg';

const shots: (string | null)[] = [shotPortfolio, null];

export default function Projects() {
  const { t } = useLang();

  return (
    <section className="section" id="projects">
      <div className="container">
        <p className="section-label reveal">{t.projects.label}</p>
        <h2 className="reveal">{t.projects.title}</h2>
        <div className="cards-grid">
          {t.projects.items.map((item, i) => (
            <article
              key={item.title}
              className="card project-card reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
              onMouseMove={trackSpotlight}
            >
              <span className={`status status-${item.status}`}>
                <i />
                {item.status === 'live' ? t.projects.statusLive : t.projects.statusSoon}
              </span>
              {shots[i] ? (
                <div className="shot">
                  <div className="shot-bar">
                    <i /><i /><i />
                  </div>
                  <img src={shots[i]} alt={item.title} loading="lazy" />
                </div>
              ) : (
                <div className="shot shot-soon" aria-hidden="true">
                  <span className="sk" style={{ width: '64%' }} />
                  <span className="sk sk-r" style={{ width: '46%' }} />
                  <span className="sk" style={{ width: '72%' }} />
                  <span className="sk sk-r" style={{ width: '38%' }} />
                </div>
              )}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              {item.link && (
                <a className="card-link" href={item.link} target="_blank" rel="noreferrer">
                  {item.linkLabel} ↗
                </a>
              )}
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
    </section>
  );
}
