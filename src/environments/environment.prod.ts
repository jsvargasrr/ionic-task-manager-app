/** Configuración web Firebase (misma forma que en `environment.ts`). */
export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
};

export const environment = {
  production: true,
  firebase: null as FirebaseWebConfig | null,
};
