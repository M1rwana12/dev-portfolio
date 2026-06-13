import { useLang } from '../i18n';

export default function Faq() {
  const { t } = useLang();

  return (
    <section className="section" id="faq">
      <div className="container">
        <p className="section-label reveal">{t.faq.label}</p>
        <h2 className="reveal">{t.faq.title}</h2>

        <div className="faq-list">
          {t.faq.items.map((item, i) => (
            <details
              key={item.q}
              className="faq-item reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <summary>
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
