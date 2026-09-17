/** @jsxImportSource preact */
import { ShortcutsContextProvider, useShortcut } from '@/preact';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function Toolbar({ onFire }: { onFire: () => void }) {
  useShortcut('CTRL+SHIFT+F', onFire);
  return null;
}

describe('preact adapter', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => render(null, container));
    container.remove();
  });

  it('invokes useShortcut callback when the shortcut fires', () => {
    const onFire = vi.fn();

    act(() => {
      render(
        <ShortcutsContextProvider>
          <Toolbar onFire={onFire} />
        </ShortcutsContextProvider>,
        container,
      );
    });

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(onFire).toHaveBeenCalledTimes(1);
  });

  it('stops dispatching once the provider unmounts', () => {
    const onFire = vi.fn();

    act(() => {
      render(
        <ShortcutsContextProvider>
          <Toolbar onFire={onFire} />
        </ShortcutsContextProvider>,
        container,
      );
    });

    act(() => render(null, container));

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
