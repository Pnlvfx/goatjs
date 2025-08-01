/* eslint-disable @typescript-eslint/no-deprecated */
/* eslint-disable unicorn/prefer-keyboard-event-key */
import type { Page } from 'puppeteer-core';

/**  This injects a box into the page that moves with the mouse. */
export const installMouseHelper = async (page: Page) => {
  await page.evaluateOnNewDocument(() => {
    // Install mouse helper only for top-level frame.
    // eslint-disable-next-line unicorn/prefer-global-this
    if (window !== globalThis.parent) return;
    globalThis.addEventListener(
      'DOMContentLoaded',
      () => {
        const box = document.createElement('puppeteer-mouse-pointer');
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
        puppeteer-mouse-pointer {
          pointer-events: none;
          position: absolute;
          top: 0;
          z-index: 10000;
          left: 0;
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,.4);
          border: 1px solid white;
          border-radius: 10px;
          margin: -10px 0 0 -10px;
          padding: 0;
          transition: background .2s, border-radius .2s, border-color .2s;
        }
        puppeteer-mouse-pointer.button-1 {
          transition: none;
          background: rgba(0,0,0,0.9);
        }
        puppeteer-mouse-pointer.button-2 {
          transition: none;
          border-color: rgba(0,0,255,0.9);
        }
        puppeteer-mouse-pointer.button-3 {
          transition: none;
          border-radius: 4px;
        }
        puppeteer-mouse-pointer.button-4 {
          transition: none;
          border-color: rgba(255,0,0,0.9);
        }
        puppeteer-mouse-pointer.button-5 {
          transition: none;
          border-color: rgba(0,255,0,0.9);
        }
      `;
        document.head.append(styleElement);
        document.body.append(box);
        document.addEventListener(
          'mousemove',
          (event) => {
            box.style.left = event.pageX.toString() + 'px';
            box.style.top = event.pageY.toString() + 'px';
            updateButtons(event.buttons);
          },
          true,
        );
        document.addEventListener(
          'mousedown',
          (event) => {
            updateButtons(event.buttons);
            box.classList.add('button-' + event.which.toString());
          },
          true,
        );
        document.addEventListener(
          'mouseup',
          (event) => {
            updateButtons(event.buttons);
            box.classList.remove('button-' + event.which.toString());
          },
          true,
        );
        function updateButtons(buttons: number) {
          for (let i = 0; i < 5; i++) box.classList.toggle('button-' + i.toString(), (buttons & (1 << i)) as unknown as boolean);
        }
      },
      false,
    );
  });
};
