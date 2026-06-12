import { useLang, LINKS } from '../i18n';

export default function Contact() {
  const { t } = useLang();

  return (
    <section className="section section-alt" id="contact">
      <div className="container contact-inner">
        <p className="section-label reveal">{t.contact.label}</p>
        <h2 className="contact-title reveal">
          {t.contact.title} <span>{t.contact.titleAccent}</span>
        </h2>
        <p className="contact-text reveal" style={{ transitionDelay: '100ms' }}>
          {t.contact.text}
        </p>
        <div className="contact-links reveal" style={{ transitionDelay: '200ms' }}>
          <a className="btn btn-primary" href={LINKS.freelancehunt} target="_blank" rel="noreferrer">
            {t.contact.fh}
          </a>
          <a className="btn btn-ghost" href={LINKS.github} target="_blank" rel="noreferrer">
            {t.contact.gh}
          </a>
          <a className="btn btn-ghost" href={LINKS.email}>
            {t.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
