import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SvelteToolbar from './fixtures/SvelteToolbar.svelte';

describe('svelte adapter', () => {
  let instance: ReturnType<typeof mount> | undefined;

  afterEach(() => {
    if (instance) {
      unmount(instance);
      instance = undefined;
    }
  });

  it('invokes useShortcut callback when the shortcut fires', () => {
    const onFire = vi.fn();
    const target = document.createElement('div');

    instance = mount(SvelteToolbar, { target, props: { onFire } });
    flushSync();

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(onFire).toHaveBeenCalledTimes(1);
  });

  it('stops dispatching once the component unmounts', () => {
    const onFire = vi.fn();
    const target = document.createElement('div');

    instance = mount(SvelteToolbar, { target, props: { onFire } });
    flushSync();
    unmount(instance);
    instance = undefined;

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(onFire).not.toHaveBeenCalled();
  });

  it('creates its own manager when setupShortcuts was never called', () => {
    const onFire = vi.fn();
    const target = document.createElement('div');

    instance = mount(SvelteToolbar, {
      target,
      props: { onFire, skipSetup: true },
    });
    flushSync();

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(onFire).toHaveBeenCalledTimes(1);
  });
});
