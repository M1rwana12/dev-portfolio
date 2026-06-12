import { useLang } from '../i18n';

export default function Marquee() {
  const { t } = useLang();
  const row = (key: string, hidden: boolean) => (
    <div className="marquee-row" aria-hidden={hidden} key={key}>
      {t.marquee.map((item) => (
        <span key={item}>
          {item} <i>✦</i>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee">
      <div className="marquee-track">{[row('a', false), row('b', true)]}</div>
    </div>
  );
}
