/**
 * Заглушка карточки на время загрузки курса: без неё место виджета на сайте школы пустует,
 * пока не придёт ответ. Обычный DOM, а не React, — чтобы появиться сразу, до отложенного рендера.
 * Повторяет форму и габариты карточки WidgetOrder (max-width и отступы её обёртки),
 * чтобы при подмене не прыгала вёрстка, и берёт цвета из тех же атрибутов эмбеда.
 */

const STYLE_ID = 'widget-order-skeleton-style';

// Совпадают с умолчаниями @procraft/widget-order (constants/colors)
const TITLE_BG_DEFAULT_COLOR = '#233D78';
const MAIN_BG_DEFAULT_COLOR = '#F1F5F9';
const CONTENT_BG_DEFAULT_COLOR = '#FFFFFF';

const css = `
.wo-skeleton {
  box-sizing: border-box;
  width: 100%;
  max-width: 350px;
  margin: 0 15px 30px;
  border: 1px solid #dae7f4;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.wo-skeleton * { box-sizing: border-box; }
.wo-skeleton__head { height: 21px; flex: none; }
.wo-skeleton__body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.wo-skeleton__content { border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.wo-skeleton__bar {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(29, 50, 71, 0.08) 25%, rgba(29, 50, 71, 0.16) 37%, rgba(29, 50, 71, 0.08) 63%);
  background-size: 400% 100%;
  animation: wo-skeleton-shimmer 1.4s ease infinite;
}
.wo-skeleton__bar--title { height: 22px; width: 60%; align-self: center; }
.wo-skeleton__button { height: 44px; border-radius: 4px; opacity: 0.35; }
@keyframes wo-skeleton-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .wo-skeleton__bar { animation: none; }
}
`;

const ensureStyle = () => {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);
};

const div = (className: string, color?: string) => {
  const el = document.createElement('div');
  el.className = className;
  if (color) el.style.backgroundColor = color;
  return el;
};

export interface SkeletonColors {
  titleBg: string | null;
  mainBg: string | null;
  contentBg: string | null;
}

/** Показывает заглушку внутри host и возвращает функцию, которая её убирает */
export const showSkeleton = (host: HTMLElement, colors: SkeletonColors) => {
  ensureStyle();
  const titleBg = colors.titleBg || TITLE_BG_DEFAULT_COLOR;

  const root = div('wo-skeleton', colors.mainBg || MAIN_BG_DEFAULT_COLOR);
  root.setAttribute('aria-busy', 'true');
  root.setAttribute('aria-label', 'Загрузка');

  const body = div('wo-skeleton__body');
  const content = div(
    'wo-skeleton__content',
    colors.contentBg || CONTENT_BG_DEFAULT_COLOR,
  );
  ['85%', '70%', '78%'].forEach(width => {
    const line = div('wo-skeleton__bar');
    line.style.width = width;
    content.appendChild(line);
  });

  body.append(
    div('wo-skeleton__bar wo-skeleton__bar--title'),
    content,
    div('wo-skeleton__button', titleBg),
  );
  root.append(div('wo-skeleton__head', titleBg), body);
  host.appendChild(root);

  return () => root.remove();
};
