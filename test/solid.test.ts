import { ShortcutsProvider, useShortcut } from '@/solid';
import { createComponent, createRoot } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';

function Toolbar(props: { onFire: () => void }) {
  useShortcut('CTRL+SHIFT+F', props.onFire);
  return null;
}

// Components here render nothing to the DOM, so the tree is driven directly
// through solid-js's own `createRoot` rather than `solid-js/web`'s `render`.
// Vitest's dep pre-bundling can otherwise load `solid-js` and `solid-js/web`
// as two separate module instances, each with its own reactive-core owner,
// which silently breaks onCleanup/disposal wiring across the two.
function mount(fn: () => void): () => void {
  let dispose!: () => void;
  createRoot((d) => {
    dispose = d;
    fn();
  });
  return dispose;
}

describe('solid adapter', () => {
  it('invokes useShortcut callback when the shortcut fires', () => {
    const onFire = vi.fn();

    const dispose = mount(() => {
      createComponent(ShortcutsProvider, {
        get children() {
          return createComponent(Toolbar, { onFire });
        },
      });
    });

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(onFire).toHaveBeenCalledTimes(1);
    dispose();
  });

  it('stops dispatching once the provider unmounts', () => {
    const onFire = vi.fn();

    const dispose = mount(() => {
      createComponent(ShortcutsProvider, {
        get children() {
          return createComponent(Toolbar, { onFire });
        },
      });
    });

    dispose();

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(onFire).not.toHaveBeenCalled();
  });

  it('throws when used outside a ShortcutsProvider', () => {
    expect(() => {
      mount(() => {
        createComponent(Toolbar, { onFire: () => {} });
      });
    }).toThrow(/ShortcutsProvider/);
  });
});
