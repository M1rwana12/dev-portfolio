import { useLang, LINKS } from '../i18n';
import avatar from '../assets/avatar.png';

export default function About() {
  const { t } = useLang();

  return (
    <section className="section" id="about">
      <div className="container about-inner">
        <div className="about-photo reveal">
          <img src={avatar} alt="Андрій Сенчишен" loading="lazy" />
          <span className="about-status">
            <i className="dot" />
            {t.about.status}
          </span>
        </div>
        <div className="about-body">
          <p className="section-label reveal">{t.about.label}</p>
          <h2 className="reveal">{t.about.title}</h2>
          <p className="about-text reveal" style={{ transitionDelay: '90ms' }}>
            {t.about.p1}
          </p>
          <p className="about-text reveal" style={{ transitionDelay: '160ms' }}>
            {t.about.p2}
          </p>
          <div className="about-facts reveal" style={{ transitionDelay: '230ms' }}>
            {t.about.facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
          <div className="about-cta reveal" style={{ transitionDelay: '300ms' }}>
            {LINKS.telegram && (
              <a className="btn btn-primary" href={LINKS.telegram} target="_blank" rel="noreferrer">
                {t.about.ctaTg}
              </a>
            )}
            <a className="btn btn-ghost" href={LINKS.email}>
              {t.about.ctaEmail}
            </a>
            <a className="btn btn-ghost" href={LINKS.freelancehunt} target="_blank" rel="noreferrer">
              {t.about.ctaFh}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
