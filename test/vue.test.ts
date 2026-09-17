import { ShortcutsPlugin, useShortcut } from '@/vue';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

function Toolbar(onFire: () => void) {
  return defineComponent({
    setup() {
      useShortcut('CTRL+SHIFT+F', onFire);
      return () => h('div');
    },
  });
}

describe('vue adapter', () => {
  it('invokes useShortcut callback when the shortcut fires', () => {
    const onFire = vi.fn();
    const wrapper = mount(Toolbar(onFire), {
      global: { plugins: [ShortcutsPlugin] },
    });

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(onFire).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('stops invoking the callback after the component unmounts', () => {
    const onFire = vi.fn();
    const wrapper = mount(Toolbar(onFire), {
      global: { plugins: [ShortcutsPlugin] },
    });

    wrapper.unmount();

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(onFire).not.toHaveBeenCalled();
  });

  it('falls back to a local manager when the plugin is not installed', () => {
    const onFire = vi.fn();
    const wrapper = mount(Toolbar(onFire));

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(onFire).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
