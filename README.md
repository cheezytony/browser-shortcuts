# browser-shortcuts

Declarative keyboard, mouse and wheel shortcuts for the browser. Register
shortcuts from any component with a hook/composable, and configure global key
bindings in one place. Ships with adapters for React, Preact, Vue, Svelte,
Solid and Angular — all built on the same framework-agnostic core.

```bash
npm install browser-shortcuts
```

Each adapter is a separate subpath, so you only pull in the code for the
framework you use:

| Framework | Import |
| --- | --- |
| React | `browser-shortcuts/react` |
| Preact | `browser-shortcuts/preact` |
| Vue | `browser-shortcuts/vue` |
| Svelte | `browser-shortcuts/svelte` |
| Solid | `browser-shortcuts/solid` |
| Angular | `browser-shortcuts/angular` |

## React

```tsx
// app/layout.tsx
import { ShortcutsContextProvider } from 'browser-shortcuts/react';

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

```tsx
import { useShortcut } from 'browser-shortcuts/react';

function Toolbar() {
  useShortcut('CTRL+SHIFT+F', () => {
    setFullScreen((prev) => !prev);
  });

  return null;
}
```

## Preact

Identical API to React, imported from `browser-shortcuts/preact`:

```tsx
import { ShortcutsContextProvider, useShortcut } from 'browser-shortcuts/preact';

function App() {
  return (
    <ShortcutsContextProvider>
      <Toolbar />
    </ShortcutsContextProvider>
  );
}

function Toolbar() {
  useShortcut('CTRL+SHIFT+F', () => setFullScreen((prev) => !prev));
  return null;
}
```

## Vue

Install the plugin once, then use `useShortcut` from any component:

```ts
// main.ts
import { createApp } from 'vue';
import { ShortcutsPlugin } from 'browser-shortcuts/vue';

createApp(App).use(ShortcutsPlugin).mount('#app');
```

```vue
<script setup lang="ts">
import { useShortcut } from 'browser-shortcuts/vue';

const fullScreen = ref(false);
useShortcut('CTRL+SHIFT+F', () => (fullScreen.value = !fullScreen.value));
</script>
```

## Svelte

Call `setupShortcuts()` once near the root, then `useShortcut` anywhere below it:

```svelte
<!-- App.svelte -->
<script>
  import { setupShortcuts } from 'browser-shortcuts/svelte';
  setupShortcuts();
</script>
```

```svelte
<script>
  import { useShortcut } from 'browser-shortcuts/svelte';

  let fullScreen = false;
  useShortcut('CTRL+SHIFT+F', () => (fullScreen = !fullScreen));
</script>
```

## Solid

```tsx
import { ShortcutsProvider, useShortcut } from 'browser-shortcuts/solid';

function App() {
  return (
    <ShortcutsProvider>
      <Toolbar />
    </ShortcutsProvider>
  );
}

function Toolbar() {
  useShortcut('CTRL+SHIFT+F', () => setFullScreen((prev) => !prev));
  return null;
}
```

## Angular

`ShortcutsService` is a root-provided singleton; use `provideShortcuts()` to
start listening as soon as the app bootstraps:

```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideShortcuts } from 'browser-shortcuts/angular';

bootstrapApplication(AppComponent, {
  providers: [provideShortcuts()],
});
```

```ts
import { Component } from '@angular/core';
import { ShortcutsService } from 'browser-shortcuts/angular';

@Component({ selector: 'app-toolbar', template: '' })
export class ToolbarComponent {
  constructor(shortcuts: ShortcutsService) {
    shortcuts.useShortcut('CTRL+SHIFT+F', () => this.toggleFullScreen());
  }

  toggleFullScreen() {
    /* ... */
  }
}
```

## Global key bindings

`KEYBINDS` (the default export of `browser-shortcuts`'s core) maps a key
combination to either the name of a handler in `SHORTCUTS`, or an inline
function. These fire in addition to any component-level `useShortcut`
listeners for the same combination, and call `event.preventDefault()`. This
part of the API is framework-agnostic and lives on the root import:

```ts
import KEYBINDS, { SHORTCUTS } from 'browser-shortcuts';

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

Every adapter attaches a single `ShortcutsManager` that listens for the most
commonly used input events and normalizes each into a `Keybind` string:

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

### Core (`browser-shortcuts`)

- **`ShortcutsManager`** — framework-agnostic class with `on`/`off` and
  `attach(target?)` (defaults to `window`), which starts listening and
  returns a disposer. Every adapter wraps one instance of this class.
- **`KEYBINDS`** (default export) — map of `Keybind` → `Shortcut` name or
  inline handler, evaluated on every matching event.
- **`SHORTCUTS`** — map of named handlers referenced from `KEYBINDS`.
- **`buildShortcutString(key, event)`** — builds a `Keybind` string from a
  base key name and the modifiers held during `event`.
- **`MOUSE_BUTTONS`** — `["LEFT_BUTTON", "MIDDLE_BUTTON", "RIGHT_BUTTON"]`,
  indexed by `MouseEvent.button`.
- **`IS_MAC`** / **`IS_NOT_TOUCH_DEVICE`** — environment helpers used
  internally and exposed for convenience.

### Adapters

- **React / Preact** — `ShortcutsContextProvider` (mount once near the root)
  and `useShortcut(shortcut, callback)`.
- **Vue** — `ShortcutsPlugin` (install once on the app), plus
  `useShortcut(shortcut, callback)` and `useShortcutsManager()` composables.
- **Svelte** — `setupShortcuts()` (call once near the root) and
  `useShortcut(shortcut, callback)`.
- **Solid** — `ShortcutsProvider` (mount once near the root) and
  `useShortcut(shortcut, callback)`.
- **Angular** — `ShortcutsService` (root-provided singleton) with
  `on`/`off`/`useShortcut`, and `provideShortcuts()` to eagerly start
  listening on bootstrap.

### Types

- **`Keybind`** — union of the keys declared in `KEYBINDS`.
- **`Shortcut`** — union of the keys declared in `SHORTCUTS`.
- **`KeybindAction`** — `Shortcut | ((event: Event) => void)`.
- **`ShortcutListener`** — `(event: Event) => void`.

## Development

```bash
npm run dev   # rebuild dist/ on change
npm run build # build the publishable library to dist/
```
