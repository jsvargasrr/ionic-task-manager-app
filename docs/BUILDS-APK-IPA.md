# Generación de APK (Android) e IPA (iOS)

## Prerrequisitos

- `npm install`
- Android: SDK, `JAVA_HOME` (JDK 17), `ANDROID_HOME` / `ANDROID_SDK_ROOT`.
- iOS: **solo en macOS** — Xcode, cuenta de desarrollador para firma y distribución.

## Web + Cordova

```bash
npm run cordova:prepare
```

Si no existe `platforms/android`:

```bash
npx cordova platform add android
```

En Mac, para iOS:

```bash
npx cordova platform add ios
```

---

## APK de depuración (rápido para probar en dispositivo)

```bash
npm run cordova:build:android
```

Salida típica del APK debug:

`platforms/android/app/build/outputs/apk/debug/app-debug.apk`

---

## APK de release (Google Play / entrega)

El build release **requiere firma**. Opciones:

1. **Archivo `build.json`** en la raíz del proyecto (no subas claves al repo; usa variables de CI o un archivo local ignorado por Git). Ver [documentación Cordova — Android signing](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#signing-an-app).

2. Ejemplo de comando (tras configurar keystore):

```bash
npm run cordova:build:android:release
```

Los artefactos suelen quedar bajo:

`platforms/android/app/build/outputs/apk/release/`

o en formato **AAB** si configuraste `packageType` / Gradle según la guía actual de Play Console.

---

## IPA (iOS)

1. En Mac, con la plataforma `ios` añadida:

   ```bash
   npm run cordova:build:ios:release
   ```

2. Abre el workspace/proyecto generado en `platforms/ios/` con **Xcode**.
3. Ajusta **Signing & Capabilities**, perfil de aprovisionamiento y destino de archivo.
4. **Product → Archive** y exporta el **IPA** (Ad Hoc, Development o App Store Connect / TestFlight).

No es posible generar IPA desde Windows con el toolchain nativo de Apple.

---

## Enlaces de descarga (entrega)

Publica los binarios en un almacenamiento que permita enlace directo o página de descarga (Drive con enlace, GitHub Releases, S3, etc.) y documenta las URLs en `docs/ENLACES-DESCARGA.md` (plantilla incluida en el repo).
