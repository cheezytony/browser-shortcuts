import type { Keybind } from '@/config';
import { ShortcutsManager, type ShortcutListener } from '@/core/shortcuts-manager';
import {
  createComponent,
  createContext,
  onCleanup,
  useContext,
  type FlowComponent,
} from 'solid-js';

export type { ShortcutListener } from '@/core/shortcuts-manager';

const ShortcutsContext = createContext<ShortcutsManager>();

/**
 * Provides global keyboard, mouse and wheel shortcut handling to its
 * subtree via Solid context.
 *
 * @example
 * ```ts
 * import { ShortcutsProvider } from 'browser-shortcuts/solid';
 *
 * createComponent(ShortcutsProvider, { get children() { return App(); } });
 * ```
 */
export const ShortcutsProvider: FlowComponent = (props) => {
  const manager = new ShortcutsManager();
  onCleanup(manager.attach());

  return createComponent(ShortcutsContext.Provider, {
    value: manager,
    get children() {
      return props.children;
    },
  });
};

/**
 * Subscribes `callback` to `shortcut` for as long as the calling component
 * is mounted. Must be used within a {@link ShortcutsProvider}.
 *
 * @example
 * ```ts
 * useShortcut('CTRL+SHIFT+F', () => setFullScreen((prev) => !prev));
 * ```
 */
export function useShortcut(shortcut: Keybind, callback: ShortcutListener) {
  const manager = useContext(ShortcutsContext);
  if (!manager) {
    throw new Error('useShortcut must be used within a ShortcutsProvider');
  }

  manager.on(shortcut, callback);
  onCleanup(() => manager.off(shortcut, callback));
}
