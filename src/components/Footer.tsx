import { useLang } from '../i18n';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>{t.footer.rights}</span>
        <span>{t.footer.made}</span>
      </div>
    </footer>
  );
}
