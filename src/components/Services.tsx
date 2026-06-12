import { useLang } from '../i18n';
import { trackSpotlight } from '../fx';

const icons = [
  // глобус — веб-розробка
  <svg key="web" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
  </svg>,
  // бот
  <svg key="bot" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="16" height="11" rx="3" />
    <path d="M12 8V4m0 0h3" />
    <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
    <path d="M9.5 16.5h5" />
  </svg>,
  // шестерня — автоматизація
  <svg key="auto" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5v3m0 13v3m9.5-9.5h-3m-13 0h-3m16.2-6.7-2.1 2.1M7.4 16.6l-2.1 2.1m13.4 0-2.1-2.1M7.4 7.4 5.3 5.3" />
  </svg>,
];

export default function Services() {
  const { t } = useLang();

  return (
    <section className="section" id="services">
      <div className="container">
        <p className="section-label reveal">{t.services.label}</p>
        <h2 className="reveal">{t.services.title}</h2>
        <div className="cards-grid">
          {t.services.items.map((item, i) => (
            <article
              key={item.title}
              className="card reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
              onMouseMove={trackSpotlight}
            >
              <div className="card-head">
                <span className="card-icon">{icons[i]}</span>
                <span className="card-num">0{i + 1}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="card-meta">{item.meta}</span>
              <div className="tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className="services-note reveal">{t.services.note}</p>
      </div>
    </section>
  );
}
