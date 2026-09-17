import { SHORTCUTS } from '@/config/shortcuts';
import { ShortcutsManager } from '@/core/shortcuts-manager';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ShortcutsManager', () => {
  let manager: ShortcutsManager;

  beforeEach(() => {
    manager = new ShortcutsManager();
  });

  afterEach(() => {
    manager.detach();
  });

  it('invokes listeners registered with on() when the shortcut fires', () => {
    manager.attach();
    const listener = vi.fn();
    manager.on('CTRL+SHIFT+K', listener);

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, shiftKey: true }),
    );

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('stops invoking a listener after off()', () => {
    manager.attach();
    const listener = vi.fn();
    manager.on('CTRL+SHIFT+K', listener);
    manager.off('CTRL+SHIFT+K', listener);

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, shiftKey: true }),
    );

    expect(listener).not.toHaveBeenCalled();
  });

  it('does not invoke listeners for a different shortcut', () => {
    manager.attach();
    const listener = vi.fn();
    manager.on('CTRL+SHIFT+K', listener);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));

    expect(listener).not.toHaveBeenCalled();
  });

  it('supports multiple listeners for the same shortcut', () => {
    manager.attach();
    const first = vi.fn();
    const second = vi.fn();
    manager.on('CTRL+SHIFT+K', first);
    manager.on('CTRL+SHIFT+K', second);

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, shiftKey: true }),
    );

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('does not dispatch events after detach()', () => {
    const dispose = manager.attach();
    const listener = vi.fn();
    manager.on('CTRL+SHIFT+K', listener);

    dispose();

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, shiftKey: true }),
    );

    expect(listener).not.toHaveBeenCalled();
  });

  it('re-attaching tears down the previous listeners first', () => {
    manager.attach();
    manager.attach();
    const listener = vi.fn();
    manager.on('CTRL+SHIFT+K', listener);

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, shiftKey: true }),
    );

    // Only the most recent attach's listeners should be wired, so the
    // handler still only fires once, not twice.
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('calls a named KEYBINDS entry via SHORTCUTS and prevents the default action', () => {
    manager.attach();
    const spy = vi.spyOn(SHORTCUTS, 'selectAll').mockImplementation(() => {});

    const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, cancelable: true });
    window.dispatchEvent(event);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);

    spy.mockRestore();
  });

  it('normalizes keyup, mouse and wheel events into shortcut strings', () => {
    manager.attach();

    const keyUp = vi.fn();
    manager.on('K_UP', keyUp);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'k' }));
    expect(keyUp).toHaveBeenCalledTimes(1);

    const mouseDown = vi.fn();
    manager.on('LEFT_BUTTON', mouseDown);
    window.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
    expect(mouseDown).toHaveBeenCalledTimes(1);

    const mouseUp = vi.fn();
    manager.on('MIDDLE_BUTTON_UP', mouseUp);
    window.dispatchEvent(new MouseEvent('mouseup', { button: 1 }));
    expect(mouseUp).toHaveBeenCalledTimes(1);

    const doubleClick = vi.fn();
    manager.on('DOUBLE_LEFT_BUTTON', doubleClick);
    window.dispatchEvent(new MouseEvent('dblclick', { button: 0 }));
    expect(doubleClick).toHaveBeenCalledTimes(1);

    const contextMenu = vi.fn();
    manager.on('RIGHT_BUTTON', contextMenu);
    window.dispatchEvent(new MouseEvent('contextmenu'));
    expect(contextMenu).toHaveBeenCalledTimes(1);

    const wheelUp = vi.fn();
    manager.on('WHEEL_UP', wheelUp);
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: -10 }));
    expect(wheelUp).toHaveBeenCalledTimes(1);

    const wheelDown = vi.fn();
    manager.on('WHEEL_DOWN', wheelDown);
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 10 }));
    expect(wheelDown).toHaveBeenCalledTimes(1);
  });

  it('can attach to a custom target instead of window', () => {
    const target = document.createElement('div');
    manager.attach(target);
    const listener = vi.fn();
    manager.on('K', listener);

    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
