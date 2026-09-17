import { ShortcutsContextProvider, useShortcut } from '@/react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function Toolbar({ onFire }: { onFire: () => void }) {
  useShortcut('CTRL+SHIFT+F', onFire);
  return null;
}

describe('react adapter', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('invokes useShortcut callback when the shortcut fires', () => {
    const onFire = vi.fn();

    act(() => {
      root.render(
        <ShortcutsContextProvider>
          <Toolbar onFire={onFire} />
        </ShortcutsContextProvider>,
      );
    });

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'f',
          ctrlKey: true,
          shiftKey: true,
        }),
      );
    });

    expect(onFire).toHaveBeenCalledTimes(1);
  });

  it('stops invoking the callback after the component unmounts', () => {
    const onFire = vi.fn();

    act(() => {
      root.render(
        <ShortcutsContextProvider>
          <Toolbar onFire={onFire} />
        </ShortcutsContextProvider>,
      );
    });

    act(() => {
      root.render(<ShortcutsContextProvider>{null}</ShortcutsContextProvider>);
    });

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'f',
          ctrlKey: true,
          shiftKey: true,
        }),
      );
    });

    expect(onFire).not.toHaveBeenCalled();
  });

  it('stops dispatching once the provider unmounts', () => {
    const onFire = vi.fn();

    act(() => {
      root.render(
        <ShortcutsContextProvider>
          <Toolbar onFire={onFire} />
        </ShortcutsContextProvider>,
      );
    });

    act(() => root.unmount());

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(onFire).not.toHaveBeenCalled();
  });
});
