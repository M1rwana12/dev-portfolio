import { useLang } from '../i18n';

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
            >
              <span className={`status status-${item.status}`}>
                <i />
                {item.status === 'live' ? t.projects.statusLive : t.projects.statusSoon}
              </span>
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
