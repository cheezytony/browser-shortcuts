import type { Keybind } from '@/config';
import { ShortcutsManager, type ShortcutListener } from '@/core/shortcuts-manager';
import { getContext, hasContext, onMount, setContext } from 'svelte';

export type { ShortcutListener } from '@/core/shortcuts-manager';

const CONTEXT_KEY = 'browser-shortcuts';

/**
 * Creates a {@link ShortcutsManager}, attaches it for the lifetime of the
 * calling component, and makes it available to descendants via Svelte
 * context. Call this once, near the root of your component tree.
 *
 * @example
 * ```svelte
 * <script>
 *   import { setupShortcuts } from 'browser-shortcuts/svelte';
 *   setupShortcuts();
 * </script>
 * ```
 */
export function setupShortcuts(): ShortcutsManager {
  const manager = new ShortcutsManager();

  onMount(() => manager.attach());

  setContext(CONTEXT_KEY, manager);

  return manager;
}

function getShortcutsManager(): ShortcutsManager {
  if (hasContext(CONTEXT_KEY)) {
    return getContext<ShortcutsManager>(CONTEXT_KEY);
  }

  const manager = new ShortcutsManager();
  onMount(() => manager.attach());
  return manager;
}

/**
 * Subscribes `callback` to `shortcut` for as long as the calling component
 * is mounted. Must be called during component initialization, after
 * {@link setupShortcuts} has run somewhere up the tree.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useShortcut } from 'browser-shortcuts/svelte';
 *   useShortcut('CTRL+SHIFT+F', () => (fullScreen = !fullScreen));
 * </script>
 * ```
 */
export function useShortcut(shortcut: Keybind, callback: ShortcutListener): void {
  const manager = getShortcutsManager();

  onMount(() => {
    manager.on(shortcut, callback);
    return () => manager.off(shortcut, callback);
  });
}
