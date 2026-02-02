import { useEffect } from 'react';

/**
 * Remove overlays injetados por extensões (ex: Vercel Toolbar) que criam
 * linhas diagonais tracejadas ou barras visíveis na página.
 */
export function useRemoveOverlays() {
  useEffect(() => {
    const hide = () => {
      // Iframes da Vercel Toolbar
      document.querySelectorAll('iframe[src*="vercel"]').forEach((el) => {
        const parent = el.parentElement;
        if (parent) {
          (parent as HTMLElement).style.cssText = 'display:none!important;visibility:hidden!important;width:0!important;height:0!important;';
        }
      });

      // Elementos com atributos Vercel
      document.querySelectorAll('[id*="vercel"], [class*="vercel-toolbar"], [data-vercel]').forEach((el) => {
        (el as HTMLElement).style.cssText = 'display:none!important;';
      });

      // SVGs com linhas tracejadas fora de gráficos (possível overlay)
      document.querySelectorAll('body > div > svg line[stroke-dasharray], body > svg line[stroke-dasharray]').forEach((el) => {
        const svg = el.closest('svg');
        if (svg && !svg.closest('main') && !svg.closest('[data-chart]')) {
          (svg.parentElement as HTMLElement)?.style.setProperty('display', 'none', 'important');
        }
      });
    };

    hide();
    const obs = new MutationObserver(hide);
    obs.observe(document.body, { childList: true, subtree: true });
    const t1 = setTimeout(hide, 300);
    const t2 = setTimeout(hide, 1000);
    return () => {
      obs.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
}
