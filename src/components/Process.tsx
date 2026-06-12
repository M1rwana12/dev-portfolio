import { useLang } from '../i18n';

export default function Process() {
  const { t } = useLang();

  return (
    <section className="section section-alt" id="process">
      <div className="container">
        <p className="section-label reveal">{t.process.label}</p>
        <h2 className="reveal">{t.process.title}</h2>
        <div className="steps">
          {t.process.steps.map((step, i) => (
            <div
              key={step.title}
              className="step reveal"
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              <span className="step-num">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
