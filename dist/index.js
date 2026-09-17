'use client';

// src/config/shortcuts.ts
var KEYBINDS = {
  "CTRL+SHIFT+F": "toggleFullScreen",
  "CMD+SHIFT+F": "toggleFullScreen",
  "CTRL+SHIFT+G": "toggleGrid",
  "CMD+SHIFT+G": "toggleGrid",
  "CTRL+SHIFT+H": "toggleHelp",
  "CMD+SHIFT+H": "toggleHelp",
  ESCAPE: "closeOverlay",
  "CTRL+Z": "undo",
  "CMD+Z": "undo",
  "CTRL+SHIFT+Z": "redo",
  "CMD+SHIFT+Z": "redo",
  "CTRL+Y": "redo",
  DELETE: "delete",
  BACKSPACE: "delete",
  "CTRL+A": "selectAll",
  "CMD+A": "selectAll",
  "CTRL+C": "copy",
  "CMD+C": "copy",
  "CTRL+V": "paste",
  "CMD+V": "paste",
  "CTRL+S": "save",
  "CMD+S": "save",
  DOUBLE_LEFT_BUTTON: "zoomIn",
  LEFT_BUTTON: "leftMouseButton",
  MIDDLE_BUTTON: "middleMouseButton",
  RIGHT_BUTTON: "rightMouseButton"
};
var SHORTCUTS = {
  toggleFullScreen: (event) => {
    console.log("toggleFullScreen", event);
  },
  toggleGrid: (event) => {
    console.log("toggleGrid", event);
  },
  toggleHelp: (event) => {
    console.log("toggleHelp", event);
  },
  closeOverlay: (event) => {
    console.log("closeOverlay", event);
  },
  undo: (event) => {
    console.log("undo", event);
  },
  redo: (event) => {
    console.log("redo", event);
  },
  delete: (event) => {
    console.log("delete", event);
  },
  selectAll: (event) => {
    console.log("selectAll", event);
  },
  copy: (event) => {
    console.log("copy", event);
  },
  paste: (event) => {
    console.log("paste", event);
  },
  save: (event) => {
    console.log("save", event);
  },
  zoomIn: (event) => {
    console.log("zoomIn", event);
  },
  leftMouseButton: (event) => {
    console.log("leftMouseButton", event);
  },
  middleMouseButton: (event) => {
    console.log("middleMouseButton", event);
  },
  rightMouseButton: (event) => {
    console.log("rightMouseButton", event);
  }
};
var shortcuts_default = KEYBINDS;

// src/utils/misc.ts
var IS_MAC = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
var IS_NOT_TOUCH_DEVICE = (() => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return !("ontouchstart" in window || navigator.maxTouchPoints > 0 || "msMaxTouchPoints" in navigator && navigator.msMaxTouchPoints > 0);
})();
var MOUSE_BUTTONS = ["LEFT_BUTTON", "MIDDLE_BUTTON", "RIGHT_BUTTON"];
function buildShortcutString(key, event) {
  return [
    IS_MAC && event.metaKey ? "CMD" : "",
    event.ctrlKey ? "CTRL" : "",
    event.altKey ? "ALT" : "",
    event.shiftKey ? "SHIFT" : "",
    key.toUpperCase()
  ].filter(Boolean).join("+");
}

// src/contexts/shortcuts.context.tsx
import { createContext, useCallback, useLayoutEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
var ShortcutsContext = createContext(
  {}
);
function ShortcutsContextProvider({
  children
}) {
  const listeners = useRef(/* @__PURE__ */ new Map());
  const on = (shortcut, callback) => {
    var _a;
    if (!listeners.current.has(shortcut)) {
      listeners.current.set(shortcut, /* @__PURE__ */ new Set());
    }
    (_a = listeners.current.get(shortcut)) == null ? void 0 : _a.add(callback);
  };
  const off = (shortcut, callback) => {
    var _a;
    (_a = listeners.current.get(shortcut)) == null ? void 0 : _a.delete(callback);
  };
  const emit = (shortcut, event) => {
    var _a;
    (_a = listeners.current.get(shortcut)) == null ? void 0 : _a.forEach((callback) => callback(event));
  };
  const triggerShortcut = useCallback((shortcut, event) => {
    var _a, _b;
    emit(shortcut, event);
    const action = shortcuts_default[shortcut];
    if (action) {
      event.preventDefault();
      if (typeof action === "string") {
        (_b = (_a = SHORTCUTS)[action]) == null ? void 0 : _b.call(_a, event);
      } else {
        action(event);
      }
    }
  }, []);
  useLayoutEffect(() => {
    const handleKeyDown = (event) => {
      triggerShortcut(buildShortcutString(event.key, event), event);
    };
    const handleKeyUp = (event) => {
      triggerShortcut(buildShortcutString(`${event.key}_UP`, event), event);
    };
    const handleMouseDown = (event) => {
      triggerShortcut(
        buildShortcutString(MOUSE_BUTTONS[event.button], event),
        event
      );
    };
    const handleMouseUp = (event) => {
      triggerShortcut(
        buildShortcutString(`${MOUSE_BUTTONS[event.button]}_UP`, event),
        event
      );
    };
    const handleDoubleClick = (event) => {
      triggerShortcut(
        buildShortcutString(`DOUBLE_${MOUSE_BUTTONS[event.button]}`, event),
        event
      );
    };
    const handleContextMenu = (event) => {
      triggerShortcut(buildShortcutString("RIGHT_BUTTON", event), event);
    };
    const handleWheel = (event) => {
      const direction = event.deltaY < 0 ? "WHEEL_UP" : "WHEEL_DOWN";
      triggerShortcut(buildShortcutString(direction, event), event);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("dblclick", handleDoubleClick);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("dblclick", handleDoubleClick);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [triggerShortcut]);
  return /* @__PURE__ */ jsx(ShortcutsContext.Provider, { value: { on, off }, children });
}

// src/hooks/use-shortcut.ts
import { useContext, useEffect } from "react";
function useShortcut(shortcut, callback) {
  const { on, off } = useContext(ShortcutsContext);
  useEffect(() => {
    on(shortcut, callback);
    return () => {
      off(shortcut, callback);
    };
  }, [shortcut, callback, on, off]);
}
export {
  IS_MAC,
  IS_NOT_TOUCH_DEVICE,
  shortcuts_default as KEYBINDS,
  MOUSE_BUTTONS,
  SHORTCUTS,
  ShortcutsContext,
  ShortcutsContextProvider,
  buildShortcutString,
  useShortcut
};
//# sourceMappingURL=index.js.map