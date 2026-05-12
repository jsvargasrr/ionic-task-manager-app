// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/** Campos mínimos para inicializar el SDK y Remote Config. */
export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
};

/**
 * Configuración de la app web de Firebase (consola → Ajustes del proyecto → Tus apps).
 * Deja `firebase` en `null` para trabajar sin Firebase; Remote Config quedará desactivado.
 */
export const environment = {
  production: false,
  firebase: null as FirebaseWebConfig | null,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
