# react-global-shortcuts

Declarative keyboard, mouse and wheel shortcuts for React. Register shortcuts
from any component with a hook, and configure global key bindings in one
place.

```bash
npm install react-global-shortcuts
```

## Quick start

Wrap your app in the provider once, near the root:

```tsx
// app/layout.tsx
import { ShortcutsContextProvider } from 'react-global-shortcuts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ShortcutsContextProvider>{children}</ShortcutsContextProvider>
      </body>
    </html>
  );
}
```

Then subscribe to a shortcut from any component with `useShortcut`:

```tsx
import { useShortcut } from 'react-global-shortcuts';

function Toolbar() {
  useShortcut('CTRL+SHIFT+F', () => {
    setFullScreen((prev) => !prev);
  });

  return null;
}
```

Handlers are automatically added on mount and removed on unmount.

## Global key bindings

`KEYBINDS` (the default export of `react-global-shortcuts`'s config) maps a
key combination to either the name of a handler in `SHORTCUTS`, or an inline
function. These fire in addition to any component-level `useShortcut`
listeners for the same combination, and call `event.preventDefault()`.

```ts
import KEYBINDS, { SHORTCUTS } from 'react-global-shortcuts';

// Named binding: references a handler declared once in SHORTCUTS.
KEYBINDS['CTRL+SHIFT+F'] = 'toggleFullScreen';
SHORTCUTS.toggleFullScreen = (event) => {
  /* ... */
};

// Inline binding: a one-off handler for a single combination.
KEYBINDS['CTRL+SHIFT+G'] = (event) => {
  /* ... */
};
```

## Keybind syntax

A `Keybind` string is built from zero or more modifiers, joined with `+`,
followed by a base key name, all upper case:

| Segment | When it appears |
| --- | --- |
| `CMD` | `metaKey` held, on macOS only |
| `CTRL` | `ctrlKey` held |
| `ALT` | `altKey` held |
| `SHIFT` | `shiftKey` held |
| base key | the key/button name, e.g. `F`, `ESCAPE`, `LEFT_BUTTON` |

Examples: `"CTRL+SHIFT+F"`, `"CMD+Z"`, `"ESCAPE"`, `"LEFT_BUTTON"`.

## Watched events

`ShortcutsContextProvider` listens for the most commonly used input events
and normalizes each into a `Keybind` string:

| Event | Base key | Example |
| --- | --- | --- |
| `keydown` | `event.key` | `"CTRL+SHIFT+F"` |
| `keyup` | `` `${event.key}_UP` `` | `"F_UP"` |
| `mousedown` | `LEFT_BUTTON` \| `MIDDLE_BUTTON` \| `RIGHT_BUTTON` | `"LEFT_BUTTON"` |
| `mouseup` | `..._UP` | `"LEFT_BUTTON_UP"` |
| `dblclick` | `DOUBLE_...` | `"DOUBLE_LEFT_BUTTON"` |
| `contextmenu` | `RIGHT_BUTTON` | `"RIGHT_BUTTON"` |
| `wheel` | `WHEEL_UP` \| `WHEEL_DOWN` (by `deltaY` sign) | `"WHEEL_UP"` |

## API

- **`ShortcutsContextProvider`** — mounts the window-level event listeners
  and provides `on`/`off` registration to descendants. Render once, near the
  root of your app.
- **`useShortcut(shortcut, callback)`** — registers `callback` for
  `shortcut` while the calling component is mounted.
- **`KEYBINDS`** (default export) — map of `Keybind` → `Shortcut` name or
  inline handler, evaluated on every matching event.
- **`SHORTCUTS`** — map of named handlers referenced from `KEYBINDS`.
- **`buildShortcutString(key, event)`** — builds a `Keybind` string from a
  base key name and the modifiers held during `event`.
- **`MOUSE_BUTTONS`** — `["LEFT_BUTTON", "MIDDLE_BUTTON", "RIGHT_BUTTON"]`,
  indexed by `MouseEvent.button`.
- **`IS_MAC`** / **`IS_NOT_TOUCH_DEVICE`** — environment helpers used
  internally and exposed for convenience.

### Types

- **`Keybind`** — union of the keys declared in `KEYBINDS`.
- **`Shortcut`** — union of the keys declared in `SHORTCUTS`.
- **`KeybindAction`** — `Shortcut | ((event: Event) => void)`.
- **`ShortcutListener`** — `(event: Event) => void`.

## Development

This repository also contains a small Next.js app (`src/app`) used to
exercise the library during development; it is not published.

```bash
npm run dev       # run the demo app
npm run build:lib # build the publishable library to dist/
```
