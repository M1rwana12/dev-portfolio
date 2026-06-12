import { useEffect, useRef, useState } from 'react';
import { useLang, LINKS } from '../i18n';

interface Msg {
  from: 'bot' | 'user';
  text: string;
}

const PlaneIcon = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4z" />
  </svg>
);

const CloseIcon = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export default function BotWidget() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [wasOpened, setWasOpened] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [nodeId, setNodeId] = useState('start');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const flow = t.bot.flow;

  useEffect(() => {
    if (wasOpened) return;
    const id = window.setTimeout(() => setTeaser(true), 5000);
    return () => clearTimeout(id);
  }, [wasOpened]);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    setTyping(true);
    const id = window.setTimeout(() => {
      setTyping(false);
      setMessages([{ from: 'bot', text: flow.start.text }]);
    }, 900);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, typing]);

  const toggle = () => {
    setOpen((v) => !v);
    setWasOpened(true);
    setTeaser(false);
  };

  const choose = (label: string, to: string) => {
    if (typing) return;
    setMessages((m) => [...m, { from: 'user', text: label }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: 'bot', text: flow[to].text }]);
      setNodeId(to);
    }, 700 + Math.random() * 500);
  };

  const node = flow[nodeId];

  return (
    <div className="bot">
      {teaser && !open && (
        <button className="bot-teaser" onClick={toggle}>
          {t.bot.teaser}
        </button>
      )}

      {open && (
        <div className="bot-panel" role="dialog" aria-label={t.bot.name}>
          <div className="bot-header">
            <span className="bot-avatar">A</span>
            <div>
              <strong>{t.bot.name}</strong>
              <small>
                <i className="dot" /> {t.bot.online}
              </small>
            </div>
          </div>

          <div className="bot-messages" ref={listRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`msg msg-${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="msg msg-bot msg-typing">
                <span /><span /><span />
              </div>
            )}
            {!typing && node.showLinks && messages.length > 0 && (
              <div className="msg-links">
                <a href={LINKS.telegram} target="_blank" rel="noreferrer">
                  Telegram ↗
                </a>
                <a href={LINKS.freelancehunt} target="_blank" rel="noreferrer">
                  {t.bot.links.fh} ↗
                </a>
                <a href={LINKS.github} target="_blank" rel="noreferrer">
                  {t.bot.links.gh} ↗
                </a>
              </div>
            )}
          </div>

          {!typing && messages.length > 0 && (
            <div className="bot-options">
              {node.options.map((opt) => (
                <button key={opt.label} onClick={() => choose(opt.label, opt.to)}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        className={`bot-launcher ${open ? 'open' : ''}`}
        onClick={toggle}
        aria-label={t.bot.openLabel}
      >
        {open ? CloseIcon : PlaneIcon}
      </button>
    </div>
  );
}
