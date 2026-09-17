'use client';

import KEYBINDS, {
  SHORTCUTS,
  type Keybind,
  type KeybindAction,
  type Shortcut,
} from '@/config/shortcuts';
import { buildShortcutString, MOUSE_BUTTONS } from '@/utils/misc';
import { createContext, useCallback, useLayoutEffect, useRef } from 'react';

/** Callback invoked when a bound shortcut fires. */
export type ShortcutListener = (event: Event) => void;

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
 *
 * Listens for the most commonly used input events (`keydown`, `keyup`,
 * `mousedown`, `mouseup`, `dblclick`, `contextmenu` and `wheel`), converts
 * each into a {@link Keybind} string, and dispatches it to any listeners
 * registered with `useShortcut` as well as the static bindings declared in
 * `KEYBINDS`.
 */
export function ShortcutsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const listeners = useRef(new Map<Keybind, Set<ShortcutListener>>());

  const on = (shortcut: Keybind, callback: ShortcutListener) => {
    if (!listeners.current.has(shortcut)) {
      listeners.current.set(shortcut, new Set());
    }
    listeners.current.get(shortcut)?.add(callback);
  };

  const off = (shortcut: Keybind, callback: ShortcutListener) => {
    listeners.current.get(shortcut)?.delete(callback);
  };

  const emit = (shortcut: Keybind, event: Event) => {
    listeners.current.get(shortcut)?.forEach((callback) => callback(event));
  };

  const triggerShortcut = useCallback((shortcut: Keybind, event: Event) => {
    emit(shortcut, event);

    const action = KEYBINDS[shortcut] as KeybindAction | undefined;
    if (action) {
      event.preventDefault();
      if (typeof action === 'string') {
        SHORTCUTS[action as Shortcut]?.(event);
      } else {
        action(event);
      }
    }
  }, []);

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      triggerShortcut(buildShortcutString(event.key, event), event);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      triggerShortcut(buildShortcutString(`${event.key}_UP`, event), event);
    };

    const handleMouseDown = (event: MouseEvent) => {
      triggerShortcut(
        buildShortcutString(MOUSE_BUTTONS[event.button], event),
        event,
      );
    };

    const handleMouseUp = (event: MouseEvent) => {
      triggerShortcut(
        buildShortcutString(`${MOUSE_BUTTONS[event.button]}_UP`, event),
        event,
      );
    };

    const handleDoubleClick = (event: MouseEvent) => {
      triggerShortcut(
        buildShortcutString(`DOUBLE_${MOUSE_BUTTONS[event.button]}`, event),
        event,
      );
    };

    const handleContextMenu = (event: MouseEvent) => {
      triggerShortcut(buildShortcutString('RIGHT_BUTTON', event), event);
    };

    const handleWheel = (event: WheelEvent) => {
      const direction = event.deltaY < 0 ? 'WHEEL_UP' : 'WHEEL_DOWN';
      triggerShortcut(buildShortcutString(direction, event), event);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('dblclick', handleDoubleClick);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [triggerShortcut]);

  return (
    <ShortcutsContext.Provider value={{ on, off }}>
      {children}
    </ShortcutsContext.Provider>
  );
}
