import { Injectable } from '@angular/core';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  type RemoteConfig,
} from 'firebase/remote-config';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment, type FirebaseWebConfig } from '../../environments/environment';

/** Nombre del parámetro en Firebase Remote Config (tipo Boolean). */
export const REMOTE_CONFIG_SHOW_TASK_PROGRESS = 'feature_show_task_progress';

@Injectable({ providedIn: 'root' })
export class FirebaseRemoteFeatureService {
  private app: FirebaseApp | null = null;
  private remoteConfig: RemoteConfig | null = null;

  private readonly showTaskProgressSubject = new BehaviorSubject(false);
  readonly showTaskProgress$: Observable<boolean> =
    this.showTaskProgressSubject.asObservable();

  private readonly remoteAvailableSubject = new BehaviorSubject(false);
  readonly remoteAvailable$: Observable<boolean> =
    this.remoteAvailableSubject.asObservable();

  private inited = false;

  async init(): Promise<void> {
    if (this.inited) {
      return;
    }
    this.inited = true;

    const cfg = environment.firebase;
    if (!this.isFirebaseOptions(cfg)) {
      this.remoteAvailableSubject.next(false);
      return;
    }

    try {
      this.app = initializeApp(cfg);
      this.remoteConfig = getRemoteConfig(this.app);
      this.remoteConfig.settings.minimumFetchIntervalMillis = environment.production
        ? 3_600_000
        : 0;

      await fetchAndActivate(this.remoteConfig);
      const value = getValue(
        this.remoteConfig,
        REMOTE_CONFIG_SHOW_TASK_PROGRESS,
      );
      this.showTaskProgressSubject.next(value.asBoolean());
      this.remoteAvailableSubject.next(true);
    } catch {
      this.showTaskProgressSubject.next(false);
      this.remoteAvailableSubject.next(false);
    }
  }

  /** Vuelve a pedir plantilla y actualiza flags (p. ej. tras cambiar valores en consola). */
  async refresh(): Promise<void> {
    if (!this.remoteConfig) {
      return;
    }
    try {
      await fetchAndActivate(this.remoteConfig);
      const value = getValue(
        this.remoteConfig,
        REMOTE_CONFIG_SHOW_TASK_PROGRESS,
      );
      this.showTaskProgressSubject.next(value.asBoolean());
    } catch {
      /* mantener último valor conocido */
    }
  }

  private isFirebaseOptions(
    cfg: typeof environment.firebase,
  ): cfg is FirebaseWebConfig {
    if (cfg == null || typeof cfg !== 'object') {
      return false;
    }
    const c = cfg as Partial<FirebaseWebConfig>;
    return (
      typeof c.apiKey === 'string' &&
      c.apiKey.length > 0 &&
      typeof c.authDomain === 'string' &&
      c.authDomain.length > 0 &&
      typeof c.projectId === 'string' &&
      c.projectId.length > 0 &&
      typeof c.appId === 'string' &&
      c.appId.length > 0
    );
  }
}
