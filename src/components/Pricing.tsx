import { useLang, LINKS } from '../i18n';
import { trackSpotlight, trackContact } from '../fx';

const check = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function Pricing() {
  const { t } = useLang();

  return (
    <section className="section" id="pricing">
      <div className="container">
        <p className="section-label reveal">{t.pricing.label}</p>
        <h2 className="reveal">{t.pricing.title}</h2>
        <p className="section-sub reveal">{t.pricing.sub}</p>

        <div className="price-grid">
          {t.pricing.plans.map((plan, i) => (
            <article
              key={plan.name}
              className={`price-card reveal${plan.featured ? ' price-card-featured' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
              onMouseMove={trackSpotlight}
            >
              {plan.featured && (
                <span className="price-badge">{t.pricing.popular}</span>
              )}
              <h3>{plan.name}</h3>
              <p className="price-amount">{plan.price}</p>
              <p className="price-desc">{plan.desc}</p>
              <ul className="price-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    {check}
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={LINKS.telegram}
                target="_blank"
                rel="noreferrer"
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}
                aria-label={`${t.pricing.cta}: ${plan.name}`}
                onClick={() => trackContact(`telegram_pricing_${plan.name}`)}
              >
                {t.pricing.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
