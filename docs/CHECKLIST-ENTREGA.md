# Checklist de entrega (Fase 6)

## Repositorio

- [ ] Repositorio **público** (GitHub/GitLab) con historial Git claro.
- [ ] Rama de trabajo fusionada o enlazada según pidan (fork + rama, etc.).
- [ ] **README** en raíz con cómo ejecutar y resumen de fases (ver `README.md`).

## Binarios

- [ ] **APK** generado e instalado en al menos un dispositivo/emulador Android.
- [ ] **IPA** generado en Mac con Xcode (o explicación si la entrega es solo Android por entorno).
- [ ] Enlaces de descarga documentados en `docs/ENLACES-DESCARGA.md`.

## Evidencias visuales

- [ ] **Capturas** o **video** que muestren:
  - [ ] Alta / completar / eliminar tareas.
  - [ ] Categorías (crear, asignar, filtrar).
  - [ ] **Feature flag**: con `feature_show_task_progress` en `false` (sin tarjeta de progreso) y en `true` (tarjeta visible), o uso del botón de nube para refrescar Remote Config.

Añade los archivos bajo `docs/screenshots/` (o enlázalos en el README / correo de entrega).

## Texto

- [ ] Respuestas técnicas en `docs/RESPUESTAS-TECNICAS.md` revisadas y personalizadas si hace falta.

## Opcional

- [ ] Etiqueta **Git tag** con versión (`v1.0.0`) alineada a `config.xml` / `package.json`.
