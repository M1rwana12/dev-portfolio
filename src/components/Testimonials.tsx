import { useLang } from '../i18n';
import { trackSpotlight } from '../fx';

/** Рендериться лише коли зʼявляться справжні відгуки (t.testimonials.items). */
export default function Testimonials() {
  const { t } = useLang();

  if (t.testimonials.items.length === 0) return null;

  return (
    <section className="section section-alt" id="testimonials">
      <div className="container">
        <p className="section-label reveal">{t.testimonials.label}</p>
        <h2 className="reveal">{t.testimonials.title}</h2>
        <div className="cards-grid">
          {t.testimonials.items.map((item, i) => (
            <figure
              key={item.name}
              className="card quote-card reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
              onMouseMove={trackSpotlight}
            >
              <blockquote>“{item.text}”</blockquote>
              <figcaption>
                <strong>{item.name}</strong>
                <small>{item.role}</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
