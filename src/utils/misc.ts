'use client';

import type { Keybind } from '@/config';

/** Whether the current platform reports itself as macOS (used to prefer `CMD` over `CTRL`). */
export const IS_MAC = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

/** Whether the current device supports mouse/keyboard input rather than touch only. */
export const IS_NOT_TOUCH_DEVICE = (() => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return !(
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ('msMaxTouchPoints' in navigator &&
      (navigator.msMaxTouchPoints as number) > 0)
  );
})();

/** Names for `MouseEvent.button` values 0, 1 and 2, in that order. */
export const MOUSE_BUTTONS = ['LEFT_BUTTON', 'MIDDLE_BUTTON', 'RIGHT_BUTTON'];

/**
 * Builds a {@link Keybind} string (e.g. `"CTRL+SHIFT+F"`) from a base key
 * name and the modifier keys held during the triggering event.
 *
 * @param key - The key or button name, e.g. `"F"` or `"LEFT_BUTTON"`.
 * @param event - The DOM event the key combination is derived from.
 */
export function buildShortcutString(
  key: string,
  event: KeyboardEvent | MouseEvent | WheelEvent,
): Keybind {
  return [
    IS_MAC && event.metaKey ? 'CMD' : '',
    event.ctrlKey ? 'CTRL' : '',
    event.altKey ? 'ALT' : '',
    event.shiftKey ? 'SHIFT' : '',
    key.toUpperCase(),
  ]
    .filter(Boolean)
    .join('+') as Keybind;
}
