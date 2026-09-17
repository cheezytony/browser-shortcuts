import KEYBINDS, {
  SHORTCUTS,
  type Keybind,
  type KeybindAction,
  type Shortcut,
} from '@/config/shortcuts';
import { buildShortcutString, MOUSE_BUTTONS } from '@/utils/misc';

/** Callback invoked when a bound shortcut fires. */
export type ShortcutListener = (event: Event) => void;

/**
 * Framework-agnostic keyboard, mouse and wheel shortcut dispatcher.
 *
 * Listens for the most commonly used input events (`keydown`, `keyup`,
 * `mousedown`, `mouseup`, `dblclick`, `contextmenu` and `wheel`) on a target
 * (`window` by default), converts each into a {@link Keybind} string, and
 * dispatches it to any listeners registered with {@link on} as well as the
 * static bindings declared in `KEYBINDS`.
 *
 * Every framework adapter in this package (React, Vue, Svelte, Angular,
 * Solid, Preact) wraps a single instance of this class in that framework's
 * own idioms (context/provider, composable, store, service, etc.).
 */
export class ShortcutsManager {
  private listeners = new Map<Keybind, Set<ShortcutListener>>();
  private target: EventTarget | undefined;
  private cleanup: (() => void) | undefined;

  /** Registers `callback` to run whenever `shortcut` is triggered. */
  on = (shortcut: Keybind, callback: ShortcutListener): void => {
    if (!this.listeners.has(shortcut)) {
      this.listeners.set(shortcut, new Set());
    }
    this.listeners.get(shortcut)?.add(callback);
  };

  /** Removes a `callback` previously registered with {@link on}. */
  off = (shortcut: Keybind, callback: ShortcutListener): void => {
    this.listeners.get(shortcut)?.delete(callback);
  };

  private emit = (shortcut: Keybind, event: Event): void => {
    this.listeners.get(shortcut)?.forEach((callback) => callback(event));
  };

  private triggerShortcut = (shortcut: Keybind, event: Event): void => {
    this.emit(shortcut, event);

    const action = KEYBINDS[shortcut] as KeybindAction | undefined;
    if (action) {
      event.preventDefault();
      if (typeof action === 'string') {
        SHORTCUTS[action as Shortcut]?.(event);
      } else {
        action(event);
      }
    }
  };

  /**
   * Starts listening on `target` (`window` by default). Returns a disposer
   * that removes the listeners; safe to call multiple times.
   */
  attach = (target: EventTarget = window): (() => void) => {
    this.detach();
    this.target = target;

    const handleKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      this.triggerShortcut(
        buildShortcutString(keyboardEvent.key, keyboardEvent),
        event,
      );
    };

    const handleKeyUp = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      this.triggerShortcut(
        buildShortcutString(`${keyboardEvent.key}_UP`, keyboardEvent),
        event,
      );
    };

    const handleMouseDown = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      this.triggerShortcut(
        buildShortcutString(MOUSE_BUTTONS[mouseEvent.button], mouseEvent),
        event,
      );
    };

    const handleMouseUp = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      this.triggerShortcut(
        buildShortcutString(
          `${MOUSE_BUTTONS[mouseEvent.button]}_UP`,
          mouseEvent,
        ),
        event,
      );
    };

    const handleDoubleClick = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      this.triggerShortcut(
        buildShortcutString(
          `DOUBLE_${MOUSE_BUTTONS[mouseEvent.button]}`,
          mouseEvent,
        ),
        event,
      );
    };

    const handleContextMenu = (event: Event) => {
      this.triggerShortcut(
        buildShortcutString('RIGHT_BUTTON', event as MouseEvent),
        event,
      );
    };

    const handleWheel = (event: Event) => {
      const wheelEvent = event as WheelEvent;
      const direction = wheelEvent.deltaY < 0 ? 'WHEEL_UP' : 'WHEEL_DOWN';
      this.triggerShortcut(buildShortcutString(direction, wheelEvent), event);
    };

    target.addEventListener('keydown', handleKeyDown);
    target.addEventListener('keyup', handleKeyUp);
    target.addEventListener('mousedown', handleMouseDown);
    target.addEventListener('mouseup', handleMouseUp);
    target.addEventListener('dblclick', handleDoubleClick);
    target.addEventListener('contextmenu', handleContextMenu);
    target.addEventListener('wheel', handleWheel, { passive: true });

    this.cleanup = () => {
      target.removeEventListener('keydown', handleKeyDown);
      target.removeEventListener('keyup', handleKeyUp);
      target.removeEventListener('mousedown', handleMouseDown);
      target.removeEventListener('mouseup', handleMouseUp);
      target.removeEventListener('dblclick', handleDoubleClick);
      target.removeEventListener('contextmenu', handleContextMenu);
      target.removeEventListener('wheel', handleWheel);
      this.target = undefined;
      this.cleanup = undefined;
    };

    return this.cleanup;
  };

  /** Stops listening. Safe to call even if {@link attach} was never called. */
  detach = (): void => {
    this.cleanup?.();
  };
}
