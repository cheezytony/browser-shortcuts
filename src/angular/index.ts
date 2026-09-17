import type { Keybind } from '@/config';
import { ShortcutsManager, type ShortcutListener } from '@/core/shortcuts-manager';
import {
  DestroyRef,
  inject,
  Injectable,
  makeEnvironmentProviders,
  APP_INITIALIZER,
} from '@angular/core';

export type { ShortcutListener } from '@/core/shortcuts-manager';

/**
 * App-wide keyboard, mouse and wheel shortcut dispatcher. Injected as a
 * singleton; call {@link ShortcutsService.on} / {@link ShortcutsService.off}
 * directly, or use {@link ShortcutsService.useShortcut} inside another
 * injection context (e.g. a component constructor) for automatic cleanup.
 */
@Injectable({ providedIn: 'root' })
export class ShortcutsService {
  private manager = new ShortcutsManager();
  private detach = this.manager.attach();

  on: (shortcut: Keybind, callback: ShortcutListener) => void = this.manager.on;
  off: (shortcut: Keybind, callback: ShortcutListener) => void = this.manager.off;

  /**
   * Subscribes `callback` to `shortcut` and automatically unsubscribes when
   * the current injection context (e.g. the injecting component) is
   * destroyed. Must be called from an injection context.
   */
  useShortcut(shortcut: Keybind, callback: ShortcutListener): void {
    const destroyRef = inject(DestroyRef);
    this.manager.on(shortcut, callback);
    destroyRef.onDestroy(() => this.manager.off(shortcut, callback));
  }

  /** @internal */
  ngOnDestroy(): void {
    this.detach();
  }
}

/**
 * Eagerly instantiates {@link ShortcutsService} so global shortcuts start
 * listening as soon as the app bootstraps, rather than lazily on first
 * injection.
 *
 * @example
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideShortcuts()],
 * });
 * ```
 */
export function provideShortcuts() {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => () => inject(ShortcutsService),
    },
  ]);
}
