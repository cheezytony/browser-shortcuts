/**
 * Maps a keybind string (e.g. `"CTRL+SHIFT+F"`) to either the name of a
 * {@link SHORTCUTS} entry or an inline handler.
 *
 * Prefer referencing a named entry in {@link SHORTCUTS} so the same action
 * can be triggered programmatically (e.g. from a command palette) using the
 * same {@link Shortcut} name.
 */
export type KeybindAction = Shortcut | ((event: Event) => void);

const KEYBINDS = {
  'CTRL+SHIFT+F': 'toggleFullScreen',
  'CMD+SHIFT+F': 'toggleFullScreen',
  'CTRL+SHIFT+G': 'toggleGrid',
  'CMD+SHIFT+G': 'toggleGrid',
  'CTRL+SHIFT+H': 'toggleHelp',
  'CMD+SHIFT+H': 'toggleHelp',
  ESCAPE: 'closeOverlay',
  'CTRL+Z': 'undo',
  'CMD+Z': 'undo',
  'CTRL+SHIFT+Z': 'redo',
  'CMD+SHIFT+Z': 'redo',
  'CTRL+Y': 'redo',
  DELETE: 'delete',
  BACKSPACE: 'delete',
  'CTRL+A': 'selectAll',
  'CMD+A': 'selectAll',
  'CTRL+C': 'copy',
  'CMD+C': 'copy',
  'CTRL+V': 'paste',
  'CMD+V': 'paste',
  'CTRL+S': 'save',
  'CMD+S': 'save',
  DOUBLE_LEFT_BUTTON: 'zoomIn',
  LEFT_BUTTON: 'leftMouseButton',
  MIDDLE_BUTTON: 'middleMouseButton',
  RIGHT_BUTTON: 'rightMouseButton',
} satisfies { [key: string]: KeybindAction };

/**
 * Named shortcut handlers, keyed by {@link Shortcut} name. Referenced from
 * {@link KEYBINDS} by name so the same action can be triggered from
 * multiple bindings (or invoked directly, outside of any input event).
 */
export const SHORTCUTS = {
  toggleFullScreen: (event: Event) => {
    console.log('toggleFullScreen', event);
  },
  toggleGrid: (event: Event) => {
    console.log('toggleGrid', event);
  },
  toggleHelp: (event: Event) => {
    console.log('toggleHelp', event);
  },
  closeOverlay: (event: Event) => {
    console.log('closeOverlay', event);
  },
  undo: (event: Event) => {
    console.log('undo', event);
  },
  redo: (event: Event) => {
    console.log('redo', event);
  },
  delete: (event: Event) => {
    console.log('delete', event);
  },
  selectAll: (event: Event) => {
    console.log('selectAll', event);
  },
  copy: (event: Event) => {
    console.log('copy', event);
  },
  paste: (event: Event) => {
    console.log('paste', event);
  },
  save: (event: Event) => {
    console.log('save', event);
  },
  zoomIn: (event: Event) => {
    console.log('zoomIn', event);
  },
  leftMouseButton: (event: Event) => {
    console.log('leftMouseButton', event);
  },
  middleMouseButton: (event: Event) => {
    console.log('middleMouseButton', event);
  },
  rightMouseButton: (event: Event) => {
    console.log('rightMouseButton', event);
  },
};

/** A key combination string understood by {@link KEYBINDS}, e.g. `"CTRL+SHIFT+F"`. */
export type Keybind = keyof typeof KEYBINDS;

/** The name of a handler registered in {@link SHORTCUTS}. */
export type Shortcut = keyof typeof SHORTCUTS;

export default KEYBINDS;
