# Ionic Task Manager — Prueba técnica

App híbrida **Ionic + Angular**: tareas, categorías, **Cordova**, **Firebase Remote Config**, optimización (CDK virtual scroll, debounce de persistencia, lazy Firebase).

## Inicio rápido

```bash
npm install
npm start
```

Build web (`www/`):

```bash
npm run build
```

Cordova (tras configurar SDK / plataformas):

```bash
npm run cordova:prepare
npm run cordova:run:android
```

## Fases del proyecto

| Fase | Contenido | Estado |
|------|-------------|--------|
| 1 | To-Do + Ionic Storage | Listo |
| 2 | Categorías | Listo |
| 3 | Cordova Android/iOS | Listo |
| 4 | Firebase Remote Config | Listo |
| 5 | Rendimiento (virtual scroll, debounce, lazy Firebase, `NoPreloading`) | Listo |
| 6 | Entrega APK/IPA, capturas, respuestas | Listo (ver `docs/`) |

## Fase 6 — Entrega

Documentación lista para completar y enviar:

| Documento | Uso |
|-----------|-----|
| [docs/BUILDS-APK-IPA.md](docs/BUILDS-APK-IPA.md) | Cómo generar **APK** e **IPA** |
| [docs/ENLACES-DESCARGA.md](docs/ENLACES-DESCARGA.md) | Plantilla de **enlaces** a binarios |
| [docs/RESPUESTAS-TECNICAS.md](docs/RESPUESTAS-TECNICAS.md) | Respuestas a las **3 preguntas** de la prueba |
| [docs/CHECKLIST-ENTREGA.md](docs/CHECKLIST-ENTREGA.md) | **Checklist** antes de enviar |
| [docs/screenshots/](docs/screenshots/) | Carpeta para **capturas** o vídeo |

**Firebase:** configura `src/environments/environment.ts` (`firebase` o `null`). Parámetro Remote Config: `feature_show_task_progress` (boolean).

## Licencia

Proyecto de demostración para proceso de selección.
