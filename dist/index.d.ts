import * as react from 'react';

/**
 * Maps a keybind string (e.g. `"CTRL+SHIFT+F"`) to either the name of a
 * {@link SHORTCUTS} entry or an inline handler.
 *
 * Prefer referencing a named entry in {@link SHORTCUTS} so the same action
 * can be triggered programmatically (e.g. from a command palette) using the
 * same {@link Shortcut} name.
 */
type KeybindAction = Shortcut | ((event: Event) => void);
declare const KEYBINDS: {
    'CTRL+SHIFT+F': "toggleFullScreen";
    'CMD+SHIFT+F': "toggleFullScreen";
    'CTRL+SHIFT+G': "toggleGrid";
    'CMD+SHIFT+G': "toggleGrid";
    'CTRL+SHIFT+H': "toggleHelp";
    'CMD+SHIFT+H': "toggleHelp";
    ESCAPE: "closeOverlay";
    'CTRL+Z': "undo";
    'CMD+Z': "undo";
    'CTRL+SHIFT+Z': "redo";
    'CMD+SHIFT+Z': "redo";
    'CTRL+Y': "redo";
    DELETE: "delete";
    BACKSPACE: "delete";
    'CTRL+A': "selectAll";
    'CMD+A': "selectAll";
    'CTRL+C': "copy";
    'CMD+C': "copy";
    'CTRL+V': "paste";
    'CMD+V': "paste";
    'CTRL+S': "save";
    'CMD+S': "save";
    DOUBLE_LEFT_BUTTON: "zoomIn";
    LEFT_BUTTON: "leftMouseButton";
    MIDDLE_BUTTON: "middleMouseButton";
    RIGHT_BUTTON: "rightMouseButton";
};
/**
 * Named shortcut handlers, keyed by {@link Shortcut} name. Referenced from
 * {@link KEYBINDS} by name so the same action can be triggered from
 * multiple bindings (or invoked directly, outside of any input event).
 */
declare const SHORTCUTS: {
    toggleFullScreen: (event: Event) => void;
    toggleGrid: (event: Event) => void;
    toggleHelp: (event: Event) => void;
    closeOverlay: (event: Event) => void;
    undo: (event: Event) => void;
    redo: (event: Event) => void;
    delete: (event: Event) => void;
    selectAll: (event: Event) => void;
    copy: (event: Event) => void;
    paste: (event: Event) => void;
    save: (event: Event) => void;
    zoomIn: (event: Event) => void;
    leftMouseButton: (event: Event) => void;
    middleMouseButton: (event: Event) => void;
    rightMouseButton: (event: Event) => void;
};
/** A key combination string understood by {@link KEYBINDS}, e.g. `"CTRL+SHIFT+F"`. */
type Keybind = keyof typeof KEYBINDS;
/** The name of a handler registered in {@link SHORTCUTS}. */
type Shortcut = keyof typeof SHORTCUTS;

/** Callback invoked when a bound shortcut fires. */
type ShortcutListener = (event: Event) => void;
interface ShortcutsContextProps {
    /** Registers `callback` to run whenever `shortcut` is triggered. */
    on: (shortcut: Keybind, callback: ShortcutListener) => void;
    /** Removes a `callback` previously registered with {@link ShortcutsContextProps.on}. */
    off: (shortcut: Keybind, callback: ShortcutListener) => void;
}
declare const ShortcutsContext: react.Context<ShortcutsContextProps>;
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
declare function ShortcutsContextProvider({ children, }: {
    children: React.ReactNode;
}): react.JSX.Element;

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
declare function useShortcut(shortcut: Keybind, callback: (event: Event) => void): void;

/** Whether the current platform reports itself as macOS (used to prefer `CMD` over `CTRL`). */
declare const IS_MAC: boolean;
/** Whether the current device supports mouse/keyboard input rather than touch only. */
declare const IS_NOT_TOUCH_DEVICE: boolean;
/** Names for `MouseEvent.button` values 0, 1 and 2, in that order. */
declare const MOUSE_BUTTONS: string[];
/**
 * Builds a {@link Keybind} string (e.g. `"CTRL+SHIFT+F"`) from a base key
 * name and the modifier keys held during the triggering event.
 *
 * @param key - The key or button name, e.g. `"F"` or `"LEFT_BUTTON"`.
 * @param event - The DOM event the key combination is derived from.
 */
declare function buildShortcutString(key: string, event: KeyboardEvent | MouseEvent | WheelEvent): Keybind;

export { IS_MAC, IS_NOT_TOUCH_DEVICE, KEYBINDS, type Keybind, type KeybindAction, MOUSE_BUTTONS, SHORTCUTS, type Shortcut, type ShortcutListener, ShortcutsContext, type ShortcutsContextProps, ShortcutsContextProvider, buildShortcutString, useShortcut };
