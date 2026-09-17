import './setup-angular';

import { provideShortcuts, ShortcutsService } from '@/angular';
import {
  ApplicationInitStatus,
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('angular adapter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('invokes on()/off() registered listeners when the shortcut fires', () => {
    const service = TestBed.inject(ShortcutsService);
    const listener = vi.fn();
    service.on('CTRL+SHIFT+F', listener);

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(listener).toHaveBeenCalledTimes(1);

    service.off('CTRL+SHIFT+F', listener);
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('useShortcut unsubscribes automatically when its injection context is destroyed', () => {
    const service = TestBed.inject(ShortcutsService);
    const injector = TestBed.inject(EnvironmentInjector);
    const onFire = vi.fn();

    runInInjectionContext(injector, () => {
      service.useShortcut('CTRL+SHIFT+F', onFire);
    });

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );
    expect(onFire).toHaveBeenCalledTimes(1);

    TestBed.resetTestingModule();

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );
    expect(onFire).toHaveBeenCalledTimes(1);
  });

  it('provideShortcuts eagerly instantiates the service on bootstrap', async () => {
    TestBed.configureTestingModule({ providers: [provideShortcuts()] });

    await TestBed.inject(ApplicationInitStatus).donePromise;

    const listener = vi.fn();
    TestBed.inject(ShortcutsService).on('CTRL+SHIFT+F', listener);

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
