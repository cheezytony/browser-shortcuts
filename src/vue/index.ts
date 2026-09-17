import type { Keybind } from '@/config';
import { ShortcutsManager, type ShortcutListener } from '@/core/shortcuts-manager';
import {
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  watch,
  type App,
  type InjectionKey,
} from 'vue';

export type { ShortcutListener } from '@/core/shortcuts-manager';

export const ShortcutsInjectionKey: InjectionKey<ShortcutsManager> = Symbol(
  'browser-shortcuts',
);

/**
 * Vue plugin that installs a single {@link ShortcutsManager} for the whole
 * app and attaches its listeners for the app's lifetime.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue';
 * import { ShortcutsPlugin } from 'browser-shortcuts/vue';
 *
 * createApp(App).use(ShortcutsPlugin).mount('#app');
 * ```
 */
export const ShortcutsPlugin = {
  install(app: App) {
    const manager = new ShortcutsManager();
    manager.attach();
    app.provide(ShortcutsInjectionKey, manager);
  },
};

/**
 * Returns the app-wide {@link ShortcutsManager}. If the plugin was not
 * installed (e.g. in a component test), a local instance is created and
 * attached/detached with the component's lifecycle.
 */
export function useShortcutsManager(): ShortcutsManager {
  const injected = inject(ShortcutsInjectionKey, null);
  if (injected) {
    return injected;
  }

  const manager = new ShortcutsManager();

  if (getCurrentInstance()) {
    onMounted(() => {
      const dispose = manager.attach();
      onBeforeUnmount(dispose);
    });
    provide(ShortcutsInjectionKey, manager);
  } else {
    manager.attach();
  }

  return manager;
}

/**
 * Subscribes `callback` to `shortcut` for as long as the calling component
 * is mounted.
 *
 * @example
 * ```ts
 * useShortcut('CTRL+SHIFT+F', () => (fullScreen.value = !fullScreen.value));
 * ```
 */
export function useShortcut(
  shortcut: Keybind,
  callback: ShortcutListener,
): void {
  const manager = useShortcutsManager();

  onMounted(() => {
    manager.on(shortcut, callback);
  });

  onBeforeUnmount(() => {
    manager.off(shortcut, callback);
  });

  watch(
    () => shortcut,
    (next, prev) => {
      manager.off(prev, callback);
      manager.on(next, callback);
    },
  );
}
