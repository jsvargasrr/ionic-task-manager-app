# Respuestas a las preguntas técnicas (prueba Ionic)

## 1. ¿Cuáles fueron los principales desafíos al implementar las nuevas funcionalidades?

- **Cordova en un starter actual de Ionic**: el CLI prioriza Capacitor; hubo que integrar `config.xml`, plataformas y scripts sin romper el flujo Angular (`www/`, `baseHref: "./"` para rutas en WebView).
- **Remote Config y entorno local**: coordinar `APP_INITIALIZER`, fallos de red o plantilla sin publicar, y evitar bloquear el arranque si Firebase no está configurado (`firebase: null`).
- **Listas largas + Ionic**: sustituir un `ion-list` plano por **virtual scroll (CDK)** manteniendo `ion-item`, checkbox y `ion-select` por fila, alineando `itemSize` con la altura real de cada fila.
- **Persistencia y rendimiento**: muchas ediciones seguidas (completar, cambiar categoría) generaban muchas escrituras; se aplicó **debounce** a la persistencia sin perder consistencia en altas/bajas críticas.

## 2. ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

| Área | Técnica | Motivo |
|------|---------|--------|
| **Carga inicial** | `import()` dinámico de Firebase (`app` + `remote-config`) | Reduce el JS del primer paint; Remote Config solo carga cuando hace falta. |
| **Arranque del router** | `NoPreloading` en rutas lazy | Evita trabajo extra en segundo plano al iniciar si hay más rutas en el futuro. |
| **Listas grandes** | `cdk-virtual-scroll-viewport` + `trackBy` | Pocas filas en DOM; scroll fluido con cientos o miles de tareas en memoria lógica. |
| **Disco / IndexedDB** | Debounce (~350 ms) en persistencia de cambios frecuentes | Menos I/O y menos contención al marcar muchas tareas o reasignar categorías. |
| **UI** | `OnPush` + `async` pipe en la home | Menos ciclos de detección de cambios con flujos reactivos (`BehaviorSubject`, `combineLatest`). |

## 3. ¿Cómo aseguraste la calidad y mantenibilidad del código?

- **Separación por responsabilidades**: servicios dedicados (`TaskStorageService`, `CategoryStorageService`, `FirebaseRemoteFeatureService`) y modelos explícitos (`Task`, `Category`).
- **Constantes compartidas** para Remote Config (`REMOTE_CONFIG_SHOW_TASK_PROGRESS`) y tipos de entorno (`FirebaseWebConfig`) para no “magificar” strings ni configs.
- **Pruebas unitarias** básicas (Karma + Jasmine) en componentes y servicios críticos, con mocks de Ionic Storage y Firebase cuando aplica.
- **README y documentación de fases** para que un revisor reproduzca builds (Cordova) y la demo de feature flags sin adivinar pasos ocultos.
- **Convenciones de Angular/Ionic** (módulos, rutas lazy, nombres claros) y cambios acotados por fase para facilitar revisión en Git.
