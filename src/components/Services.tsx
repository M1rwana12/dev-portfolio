import { useLang } from '../i18n';

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
            >
              <span className="card-num">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
