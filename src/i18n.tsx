import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export const LINKS = {
  freelancehunt: 'https://freelancehunt.com/freelancer/m1rwana.html',
  github: 'https://github.com/M1rwana12',
  email: 'mailto:senja32083@gmail.com',
} as const;

export type Lang = 'ua' | 'en';

export interface BotNode {
  text: string;
  options: { label: string; to: string }[];
  showLinks?: boolean;
}

const ua = {
  nav: {
    services: 'Послуги',
    process: 'Процес',
    projects: 'Кейси',
    contact: 'Контакти',
  },
  hero: {
    badge: 'Вільний для нових проєктів',
    titleStart: 'Розробка під ключ:',
    words: ['сайти', 'telegram-боти', 'парсинг даних', 'автоматизація'],
    sub: 'Привіт! Я Андрій — full-stack розробник із Києва. Створюю зрозумілі, швидкі та надійні рішення для будь-якої задачі бізнесу: від лендінгу до бота, що працює за вас 24/7.',
    ctaPrimary: 'Обговорити проєкт',
    ctaSecondary: 'Мої роботи',
    meta: ['Київ, Україна', 'UTC+2'],
    metaLink: 'Профіль на Freelancehunt',
  },
  marquee: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'C#',
    'PostgreSQL',
    'MongoDB',
    'Telegram Bots',
    'Discord Bots',
    'API Integration',
    'Парсинг даних',
  ],
  services: {
    label: '01 — Послуги',
    title: 'Що я роблю',
    items: [
      {
        title: 'Веб-розробка',
        text: 'Лендінги, корпоративні сайти та веб-застосунки під ключ. Адаптивна верстка, швидке завантаження та акуратний код, який легко підтримувати.',
        tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      },
      {
        title: 'Telegram і Discord боти',
        text: 'Боти, що приймають заявки, продають, відповідають клієнтам і збирають дані — без вихідних і людського фактора.',
        tags: ['Python', 'Node.js', 'Bot API', 'Webhooks'],
      },
      {
        title: 'Автоматизація та парсинг',
        text: 'Збір даних із сайтів, інтеграції через API, скрипти для рутинних задач. Усе, що ви робите руками щодня, можна доручити коду.',
        tags: ['Python', 'C#', 'API Integration', 'MongoDB'],
      },
    ],
  },
  process: {
    label: '02 — Процес',
    title: 'Як я працюю',
    steps: [
      {
        title: 'Бриф',
        text: 'Обговорюємо задачу, я ставлю питання і фіксую вимоги. Безкоштовно оцінюю строки та бюджет.',
      },
      {
        title: 'План',
        text: 'Розбиваю проєкт на етапи з чіткими дедлайнами. Ви завжди знаєте, що відбувається.',
      },
      {
        title: 'Розробка',
        text: 'Пишу код і показую проміжні результати. Правки по ходу — спокійно і без драм.',
      },
      {
        title: 'Запуск',
        text: 'Деплой, тестування, передача коду. Залишаюсь на звʼязку після здачі проєкту.',
      },
    ],
  },
  projects: {
    label: '03 — Кейси',
    title: 'Проєкти',
    statusLive: 'онлайн',
    statusSoon: 'у розробці',
    items: [
      {
        title: 'Портфоліо-сайт',
        text: 'Цей сайт: React + TypeScript, двомовність UA/EN, бот-віджет та автодеплой через GitHub Actions.',
        status: 'live' as const,
        link: LINKS.github,
        linkLabel: 'Код на GitHub',
      },
      {
        title: 'Telegram-бот для бізнесу',
        text: 'Бот для прийому заявок та автоматизації спілкування з клієнтами. Наступний проєкт — скоро тут.',
        status: 'soon' as const,
      },
    ],
    ctaTitle: 'Тут може бути ваш проєкт',
    ctaText: 'Розкажіть про свою задачу — і за кілька тижнів вона стане наступним кейсом у цьому списку.',
    ctaBtn: 'Розповісти про задачу',
  },
  contact: {
    label: '04 — Контакти',
    title: 'Маєте задачу?',
    titleAccent: 'Обговорімо.',
    text: 'Опишіть, що потрібно зробити, — я відповім протягом кількох годин, поставлю правильні питання та безкоштовно оціню строки й бюджет.',
    fh: 'Написати на Freelancehunt',
    gh: 'GitHub',
    email: 'Email',
  },
  footer: {
    rights: '© 2026 Андрій Сенчишен',
    made: 'Зроблено вручну, без конструкторів',
  },
  bot: {
    name: 'Бот-помічник',
    online: 'онлайн',
    teaser: 'Маєте питання? 👋',
    openLabel: 'Відкрити чат',
    flow: {
      start: {
        text: 'Привіт! 👋 Я бот-помічник Андрія. До речі, такого бота він може зробити і для вашого бізнесу. Що вас цікавить?',
        options: [
          { label: '🌐 Потрібен сайт', to: 'site' },
          { label: '🤖 Потрібен бот', to: 'bots' },
          { label: '⚙️ Автоматизація', to: 'auto' },
          { label: '👀 Просто дивлюсь', to: 'browse' },
        ],
      },
      site: {
        text: 'Андрій робить сайти під ключ: від лендінгу до веб-застосунку. Дизайн, верстка, бекенд, деплой — усе в одних руках. Швидко, адаптивно і без шаблонних конструкторів.',
        options: [
          { label: '💰 Скільки коштує?', to: 'price' },
          { label: '✉️ Звʼязатися', to: 'contact' },
          { label: '← Назад', to: 'start' },
        ],
      },
      bots: {
        text: 'Telegram- і Discord-боти: прийом заявок, оплати, розсилки, інтеграції з CRM і таблицями. Цей віджет — маленьке демо того, як бот може спілкуватися з вашими клієнтами.',
        options: [
          { label: '💰 Скільки коштує?', to: 'price' },
          { label: '✉️ Звʼязатися', to: 'contact' },
          { label: '← Назад', to: 'start' },
        ],
      },
      auto: {
        text: 'Парсинг сайтів, інтеграції через API, скрипти для рутини. Якщо ваша команда щодня робить щось руками — найімовірніше, це можна автоматизувати.',
        options: [
          { label: '💰 Скільки коштує?', to: 'price' },
          { label: '✉️ Звʼязатися', to: 'contact' },
          { label: '← Назад', to: 'start' },
        ],
      },
      price: {
        text: 'Чесна відповідь: залежить від задачі. Невеликий бот чи лендінг — це дні, а не місяці. Опишіть задачу — Андрій безкоштовно оцінить строки та бюджет.',
        options: [
          { label: '✉️ Звʼязатися', to: 'contact' },
          { label: '← Назад', to: 'start' },
        ],
      },
      contact: {
        text: 'Найзручніше — написати на Freelancehunt або глянути код на GitHub. Відповідь зазвичай протягом кількох годин 👇',
        showLinks: true,
        options: [{ label: '↻ Почати спочатку', to: 'start' }],
      },
      browse: {
        text: 'Гарного перегляду! 😎 Зверніть увагу на розділ «Кейси» — він поповнюється. Якщо зʼявиться питання, я тут, у кутку.',
        options: [{ label: '← До початку', to: 'start' }],
      },
    } as Record<string, BotNode>,
    links: { fh: 'Freelancehunt', gh: 'GitHub' },
  },
};

export type Dict = typeof ua;

const en: Dict = {
  nav: {
    services: 'Services',
    process: 'Process',
    projects: 'Work',
    contact: 'Contact',
  },
  hero: {
    badge: 'Open to new projects',
    titleStart: 'Turn-key development:',
    words: ['websites', 'telegram bots', 'data parsing', 'automation'],
    sub: "Hi! I'm Andrii — a full-stack developer from Kyiv. I build clear, fast and reliable solutions for any business task: from a landing page to a bot working for you 24/7.",
    ctaPrimary: 'Discuss a project',
    ctaSecondary: 'My work',
    meta: ['Kyiv, Ukraine', 'UTC+2'],
    metaLink: 'Freelancehunt profile',
  },
  marquee: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'C#',
    'PostgreSQL',
    'MongoDB',
    'Telegram Bots',
    'Discord Bots',
    'API Integration',
    'Data Parsing',
  ],
  services: {
    label: '01 — Services',
    title: 'What I do',
    items: [
      {
        title: 'Web development',
        text: 'Landing pages, corporate sites and web apps — turn-key. Responsive layout, fast loading and clean code that is easy to maintain.',
        tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      },
      {
        title: 'Telegram & Discord bots',
        text: 'Bots that take orders, sell, answer customers and collect data — no days off, no human error.',
        tags: ['Python', 'Node.js', 'Bot API', 'Webhooks'],
      },
      {
        title: 'Automation & parsing',
        text: 'Website data scraping, API integrations, scripts for routine tasks. Everything you do by hand daily can be delegated to code.',
        tags: ['Python', 'C#', 'API Integration', 'MongoDB'],
      },
    ],
  },
  process: {
    label: '02 — Process',
    title: 'How I work',
    steps: [
      {
        title: 'Brief',
        text: 'We discuss the task, I ask questions and lock the requirements. Time & budget estimate is free.',
      },
      {
        title: 'Plan',
        text: 'I split the project into stages with clear deadlines. You always know what is going on.',
      },
      {
        title: 'Build',
        text: 'I write code and show intermediate results. Changes along the way — calmly, no drama.',
      },
      {
        title: 'Launch',
        text: 'Deploy, testing, code handover. I stay in touch after the project is delivered.',
      },
    ],
  },
  projects: {
    label: '03 — Work',
    title: 'Projects',
    statusLive: 'live',
    statusSoon: 'in progress',
    items: [
      {
        title: 'Portfolio website',
        text: 'This site: React + TypeScript, UA/EN localisation, a bot widget and auto-deploy via GitHub Actions.',
        status: 'live' as const,
        link: LINKS.github,
        linkLabel: 'Code on GitHub',
      },
      {
        title: 'Telegram bot for business',
        text: 'A bot for taking orders and automating customer communication. The next project — coming soon.',
        status: 'soon' as const,
      },
    ],
    ctaTitle: 'Your project could be here',
    ctaText: 'Tell me about your task — and in a few weeks it becomes the next case study on this list.',
    ctaBtn: 'Tell me about your task',
  },
  contact: {
    label: '04 — Contact',
    title: 'Got a task?',
    titleAccent: "Let's talk.",
    text: "Describe what needs to be done — I'll reply within a few hours, ask the right questions and estimate time & budget for free.",
    fh: 'Message on Freelancehunt',
    gh: 'GitHub',
    email: 'Email',
  },
  footer: {
    rights: '© 2026 Andrii Senchyshen',
    made: 'Handcrafted, no website builders',
  },
  bot: {
    name: 'Bot assistant',
    online: 'online',
    teaser: 'Have a question? 👋',
    openLabel: 'Open chat',
    flow: {
      start: {
        text: "Hi! 👋 I'm Andrii's bot assistant. By the way, he can build a bot like me for your business too. What are you interested in?",
        options: [
          { label: '🌐 Need a website', to: 'site' },
          { label: '🤖 Need a bot', to: 'bots' },
          { label: '⚙️ Automation', to: 'auto' },
          { label: '👀 Just looking', to: 'browse' },
        ],
      },
      site: {
        text: 'Andrii builds websites turn-key: from a landing page to a web app. Design, layout, backend, deploy — all in one pair of hands. Fast, responsive, no template builders.',
        options: [
          { label: '💰 How much?', to: 'price' },
          { label: '✉️ Get in touch', to: 'contact' },
          { label: '← Back', to: 'start' },
        ],
      },
      bots: {
        text: 'Telegram and Discord bots: orders, payments, broadcasts, CRM and spreadsheet integrations. This widget is a small demo of how a bot can talk to your customers.',
        options: [
          { label: '💰 How much?', to: 'price' },
          { label: '✉️ Get in touch', to: 'contact' },
          { label: '← Back', to: 'start' },
        ],
      },
      auto: {
        text: 'Website parsing, API integrations, scripts for routine work. If your team does something by hand every day — most likely it can be automated.',
        options: [
          { label: '💰 How much?', to: 'price' },
          { label: '✉️ Get in touch', to: 'contact' },
          { label: '← Back', to: 'start' },
        ],
      },
      price: {
        text: 'Honest answer: it depends on the task. A small bot or a landing page takes days, not months. Describe your task — Andrii will estimate time and budget for free.',
        options: [
          { label: '✉️ Get in touch', to: 'contact' },
          { label: '← Back', to: 'start' },
        ],
      },
      contact: {
        text: 'The easiest way is to message on Freelancehunt or check the code on GitHub. Reply usually within a few hours 👇',
        showLinks: true,
        options: [{ label: '↻ Start over', to: 'start' }],
      },
      browse: {
        text: "Enjoy! 😎 Check out the Projects section — it keeps growing. If a question comes up, I'm here in the corner.",
        options: [{ label: '← Back to start', to: 'start' }],
      },
    } as Record<string, BotNode>,
    links: { fh: 'Freelancehunt', gh: 'GitHub' },
  },
};

const dicts: Record<Lang, Dict> = { ua, en };

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const LangContext = createContext<LangCtx>({
  lang: 'ua',
  setLang: () => {},
  t: ua,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang');
    return saved === 'en' ? 'en' : 'ua';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: dicts[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
