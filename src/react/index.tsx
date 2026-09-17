'use client';

import type { Keybind } from '@/config';
import { ShortcutsManager, type ShortcutListener } from '@/core/shortcuts-manager';
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

export type { ShortcutListener } from '@/core/shortcuts-manager';

export interface ShortcutsContextProps {
  /** Registers `callback` to run whenever `shortcut` is triggered. */
  on: (shortcut: Keybind, callback: ShortcutListener) => void;
  /** Removes a `callback` previously registered with {@link ShortcutsContextProps.on}. */
  off: (shortcut: Keybind, callback: ShortcutListener) => void;
}

export const ShortcutsContext = createContext<ShortcutsContextProps>(
  {} as ShortcutsContextProps,
);

/**
 * Provides global keyboard, mouse and wheel shortcut handling to its
 * subtree via {@link ShortcutsContext}.
 */
export function ShortcutsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [manager] = useState(() => new ShortcutsManager());

  useLayoutEffect(() => {
    return manager.attach();
  }, [manager]);

  const { on, off } = manager;

  return (
    <ShortcutsContext.Provider value={{ on, off }}>
      {children}
    </ShortcutsContext.Provider>
  );
}

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
