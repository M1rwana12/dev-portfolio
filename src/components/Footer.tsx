import { useLang } from '../i18n';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>{t.footer.rights}</span>
        <a href="./blog/" className="footer-blog">
          {t.footer.blog} ↗
        </a>
        <span>{t.footer.made}</span>
      </div>
    </footer>
  );
}
