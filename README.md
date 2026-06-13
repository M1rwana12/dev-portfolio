# Портфоліо — Андрій Сенчишен

Преміум-лендінг full-stack розробника: сайти, Telegram-боти та автоматизація бізнесу під ключ.

**🇬🇧 EN:** Premium portfolio landing page of a full-stack developer: websites, Telegram bots and business automation, turn-key.

## ✨ Фішки

- 🌌 **3D-всесвіт** на React Three Fiber: камера летить крізь простір по мірі скролу,
  intro-морф частинок у логотип «AS», світні вузли-послуги, bloom, параллакс на курсор
- 🌗 Темна «midnight studio» естетика з бурштиновим акцентом
- 🌍 Двомовність UA/EN з перемикачем (зберігається в localStorage)
- 🤖 Інтерактивний бот-віджет у стилі Telegram — живе демо послуги «боти»
- ⌨️ Друкований ефект у hero, анімації при скролі, стрічка технологій
- 🚀 Автодеплой на GitHub Pages через GitHub Actions
- 📱 Адаптивний; на мобайлі / слабкому GPU / `prefers-reduced-motion`
  3D-сцена не вантажиться — лишається легкий CSS-фон

## 🛠 Стек

React 19 · TypeScript · Vite 8 · чистий CSS (без UI-бібліотек)
3D: three.js · @react-three/fiber · @react-three/drei · @react-three/postprocessing · GSAP

## 🌌 Про 3D-шар

Уся 3D-логіка ізольована в [`src/three/`](src/three/) і вантажиться **лениво окремим
chunk'ом** (`React.lazy`) — основний бандл лишається ~69 КБ gzip, three (~283 КБ gzip)
тягнеться лише коли клієнт справді потягне сцену. Рішення приймає
[`useCapability`](src/three/useCapability.ts): десктоп + WebGL + без reduced-motion → `full`,
інакше `reduced` (статичний фон). FPS тримається 60 завдяки інстансингу, одному bloom-проходу
та адаптивному DPR (`PerformanceMonitor`).

## 🚀 Запуск

```bash
npm install
npm run dev      # локальна розробка → http://localhost:5173
npm run build    # продакшн-збірка в dist/
npm run preview  # перегляд збірки
```

## 📦 Деплой на GitHub Pages

1. Запуште код у репозиторій на GitHub (гілка `main`)
2. У налаштуваннях репозиторію: **Settings → Pages → Source → GitHub Actions**
3. Воркфлоу `.github/workflows/deploy.yml` збере та опублікує сайт автоматично при кожному пуші

## 👤 Автор

**Андрій Сенчишен** — Full-Stack розробник, Київ
[Freelancehunt](https://freelancehunt.com/freelancer/m1rwana.html) · [GitHub](https://github.com/M1rwana12)
