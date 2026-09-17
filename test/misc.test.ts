import { buildShortcutString, IS_MAC, MOUSE_BUTTONS } from '@/utils/misc';
import { describe, expect, it } from 'vitest';

function keyEvent(overrides: Partial<KeyboardEvent> = {}): KeyboardEvent {
  return {
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    ...overrides,
  } as KeyboardEvent;
}

describe('buildShortcutString', () => {
  it('uppercases a bare key with no modifiers', () => {
    expect(buildShortcutString('f', keyEvent())).toBe('F');
  });

  it('prefixes CTRL, ALT and SHIFT when held', () => {
    expect(
      buildShortcutString(
        'f',
        keyEvent({ ctrlKey: true, altKey: true, shiftKey: true }),
      ),
    ).toBe('CTRL+ALT+SHIFT+F');
  });

  it('orders modifiers as CMD, CTRL, ALT, SHIFT', () => {
    expect(
      buildShortcutString(
        'z',
        keyEvent({ ctrlKey: true, shiftKey: true, metaKey: IS_MAC }),
      ),
    ).toBe(IS_MAC ? 'CMD+CTRL+SHIFT+Z' : 'CTRL+SHIFT+Z');
  });

  it('only honors metaKey as CMD on macOS', () => {
    const result = buildShortcutString('z', keyEvent({ metaKey: true }));
    expect(result).toBe(IS_MAC ? 'CMD+Z' : 'Z');
  });

  it('passes through pre-built key names unchanged in case', () => {
    expect(buildShortcutString('LEFT_BUTTON', keyEvent())).toBe(
      'LEFT_BUTTON',
    );
  });
});

describe('MOUSE_BUTTONS', () => {
  it('maps MouseEvent.button 0/1/2 to left/middle/right', () => {
    expect(MOUSE_BUTTONS).toEqual([
      'LEFT_BUTTON',
      'MIDDLE_BUTTON',
      'RIGHT_BUTTON',
    ]);
  });
});
