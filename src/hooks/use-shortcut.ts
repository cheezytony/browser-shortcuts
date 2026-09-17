import type { Keybind } from '@/config';
import { ShortcutsContext } from '@/contexts/shortcuts.context';
import { useContext, useEffect } from 'react';

/**
 * Subscribes `callback` to `shortcut` for as long as the calling component
 * is mounted. Must be used within a `ShortcutsContextProvider`.
 *
 * @param shortcut - A key combination string, e.g. `"CTRL+SHIFT+F"`.
 * @param callback - Invoked with the originating `Event` when the shortcut fires.
 *
 * @example
 * ```tsx
 * useShortcut('CTRL+SHIFT+F', () => setFullScreen((prev) => !prev));
 * ```
 */
export function useShortcut(
  shortcut: Keybind,
  callback: (event: Event) => void,
) {
  const { on, off } = useContext(ShortcutsContext);

  useEffect(() => {
    on(shortcut, callback);

    return () => {
      off(shortcut, callback);
    };
  }, [shortcut, callback, on, off]);
}
