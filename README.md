# Cashi Mobile

**Cashi Mobile** es una app de finanzas personales creada con **React Native + Expo + TypeScript**. Permite iniciar sesión, gestionar categorías, registrar ingresos/egresos y consultar un balance financiero. Por defecto usa persistencia local con **AsyncStorage**, y también puede conectarse de forma opt-in al backend Cashi.

La app está optimizada para validación **Android-first** con Expo Go/emulador.

## Funcionalidades

- Login demo local.
- CRUD completo de categorías.
- Categorías con `type` (`income | expense`) y color fijo de la paleta Cashi.
- CRUD completo de transacciones.
- Selección de categoría al crear/editar transacciones.
- Adjuntos locales en transacciones: foto de comprobante y coordenadas GPS opcionales.
- Balance con total de ingresos, total de egresos, saldo final y **Categoría principal**.
- Montos en pesos chilenos CLP: `$1.250.000`, sin decimales y con punto de miles.
- Persistencia local con AsyncStorage por defecto.
- Integración opt-in con backend Cashi para categorías, transacciones y balance.
- Validación de formularios con Zod y errores por campo.
- Navegación con Expo Router y tabs.
- UI Android-first basada en referencia OpenDesign, con tokens, gradientes e Inter como tipografía disponible.

## Stack técnico

| Área         | Herramienta                                     |
| ------------ | ----------------------------------------------- |
| Mobile       | React Native + Expo                             |
| Lenguaje     | TypeScript                                      |
| Navegación   | Expo Router                                     |
| Persistencia | AsyncStorage local + backend opt-in             |
| Validación   | Zod                                             |
| UI           | Tokens propios + `expo-linear-gradient` + Inter |
| Testing      | Jest + jest-expo + Testing Library              |

## Instalación

```bash
npm install
```

## Ejecutar la app

### Opción rápida

```bash
npm start
```

Luego podés abrirla con Expo Go o con el emulador desde la terminal de Expo.

### Android/emulador recomendado

```bash
npx expo start --clear --android
```

Si Expo Go queda cargando o abre una versión anterior, reiniciá la conexión local:

```bash
adb shell am force-stop host.exp.exponent
adb reverse tcp:8081 tcp:8081
adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081"
```

Credenciales demo:

```txt
Email: demo@cashi.com
Password: Cashi1234
```

## Ejecutar contra el backend Cashi

La app mantiene modo local por defecto. Para usar el backend hay que iniciar Expo con variables públicas de entorno.

Backend esperado para emulador Android:

```txt
http://127.0.0.1:3000
```

Usamos `127.0.0.1` porque se recomienda abrir un reverse del puerto 3000 con ADB:

```bash
adb reverse tcp:3000 tcp:3000
```

### CMD de Windows

```bat
set EXPO_PUBLIC_CASHI_DATA_SOURCE=backend
set EXPO_PUBLIC_CASHI_API_BASE_URL=http://127.0.0.1:3000
npx expo start --clear
```

### PowerShell

```powershell
$env:EXPO_PUBLIC_CASHI_DATA_SOURCE="backend"
$env:EXPO_PUBLIC_CASHI_API_BASE_URL="http://127.0.0.1:3000"
npx expo start --clear
```

### Android emulator / Expo Go

Con el emulador abierto:

```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000
adb shell am force-stop host.exp.exponent
adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081"
```

Credenciales de login de la app:

```txt
Email: demo@cashi.com
Password: Cashi1234
```

> El backend no tiene autenticación todavía. El login sigue siendo demo local; el backend se usa para categorías, transacciones y balance.

Si las tablas del backend están recién migradas, es normal ver categorías, movimientos y balance vacíos hasta crear datos desde la app.

## Requerimiento 3: entrega local con foto y ubicación

El Requerimiento 3 agrega metadata **local-first** a las transacciones sin romper la integración con backend.

### Qué probar

1. Entrar a `Movimientos`.
2. Tocar `+` para crear una transacción, o tocar una transacción existente para editarla.
3. En `Comprobante`, usar `Tomar foto` o `Elegir foto`.
4. En `Ubicación`, usar `Usar ubicación actual`.
5. Guardar la transacción.

Resultado esperado:

- la foto se muestra como preview antes de guardar;
- la ubicación se muestra como `Lat: ..., Lon: ...`;
- ambos campos son opcionales;
- si se usa backend, `photoUri` y `location` no se envían al API.

> En emulador, la cámara es simulada. Es normal que `Tomar foto` muestre una escena artificial del emulador en vez de una foto real. En un dispositivo físico se usa la cámara real.

### Diseño técnico

| Área | Decisión |
| ---- | -------- |
| Metadata | `photoUri` y `location` viven como campos opcionales de `Transaction`. |
| Persistencia local | AsyncStorage conserva la metadata en transacciones locales. |
| Backend | Los mappers omiten metadata local antes de crear/actualizar DTOs HTTP. |
| UI | La pantalla coordina hooks de dispositivo; `TransactionForm` sigue siendo presentacional. |
| Ubicación | Se intenta proveedor de red Android, `getLastKnownPositionAsync` y luego `getCurrentPositionAsync`. |

### Mensajes de error de backend

El front traduce errores técnicos a mensajes amigables. Ejemplos:

- Backend apagado: `No se pudo conectar con el servidor. Revisá que el backend esté activo.`
- URL/config faltante: `La conexión con el backend no está configurada correctamente.`
- Validación: `Revisá los datos ingresados e intentá nuevamente.`
- Duplicado: `Ya existe un registro con esos datos.`

## Problema conocido: Expo Go queda negro o no carga en emulador

Durante la validación Android nos encontramos con este problema:

- El emulador abría Expo Go, pero la pantalla quedaba negra o cargando indefinidamente.
- Expo mostraba URLs tipo `exp://192.168.100.9:8081` o `exp://127.0.0.1:8081`.
- La terminal decía `No apps connected` al intentar recargar.
- ADB veía el emulador, pero Expo Go no lograba comunicarse de forma estable con Metro.

La causa fue que el emulador no tenía activo el túnel local hacia Metro. La solución estable fue usar **ADB reverse** para reenviar el puerto `8081` del emulador al host.

### Receta de recuperación

Con el emulador abierto:

```bash
adb devices
adb reverse tcp:8081 tcp:8081
npx expo start --clear --android
```

Si Expo Go quedó en un estado roto:

```bash
adb shell am force-stop host.exp.exponent
adb reverse tcp:8081 tcp:8081
adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081"
```

Si ADB no ve dispositivos:

```bash
adb start-server
adb devices
```

Luego iniciar el emulador desde Android Studio Device Manager o con:

```bash
emulator -avd Pixel_6
```

> Nota: `npm star` no inicia la app. El comando correcto es `npm start` o `npx expo start --clear --android`.

## Problema conocido: ubicación del emulador no entrega coordenadas

Que Android tenga `Location` activado no significa que exista una ubicación disponible. Si la app muestra:

```txt
No pudimos obtener tu ubicación actual. Activá la ubicación del emulador o intentá de nuevo.
```

diagnosticá primero si el emulador tiene un fix real:

```bash
adb shell settings get secure location_mode
adb shell dumpsys location | findstr /i "last location gps network fused"
```

`location_mode = 3` indica que Location está activo. Pero si `dumpsys location` muestra:

```txt
last location=null
locations = 0
```

Android no recibió coordenadas todavía.

### Enviar coordenadas al emulador

Desde Extended Controls del emulador:

1. `...` → `Location`.
2. Buscar o seleccionar Santiago.
3. Click en `Set Location`.

O por ADB:

```bash
adb emu geo fix -70.669265 -33.448890
adb shell dumpsys location | findstr /i "last location gps network fused"
```

> En `adb emu geo fix`, el orden es longitud primero y latitud después.

### Si el emulador tiene internet pero no resuelve DNS

Si `last location` sigue en `null`, revisá conectividad:

```bash
adb shell ping -c 3 8.8.8.8
adb shell ping -c 3 google.com
```

Si `8.8.8.8` responde pero `google.com` devuelve `unknown host`, el emulador tiene red pero DNS roto. Cerrá el emulador y arrancalo con DNS explícito:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd "Pixel_7" -dns-server 8.8.8.8,8.8.4.4
```

Luego verificá:

```bash
adb shell ping -c 3 google.com
adb emu geo fix -70.669265 -33.448890
adb shell dumpsys location | findstr /i "last location gps network fused"
```

Si Google Maps o el navegador del emulador ya obtienen ubicación, la app debería poder mostrar la píldora `Lat/Lon` al tocar `Usar ubicación actual`.

## Ejecutar tests

```bash
npm test
```

También podés correrlos en modo secuencial:

```bash
npm test -- --runInBand
```

Typecheck:

```bash
npm run typecheck
```

Export Android:

```bash
npx expo export --platform android
```

## Arquitectura

La regla principal del proyecto es: **las pantallas renderizan; la lógica vive en hooks y storage**.

```txt
app/              # rutas y pantallas con Expo Router
src/components/   # componentes presentacionales
src/design/       # tokens visuales y tipográficos de la app
src/domain/       # tipos, schemas y helpers de dominio
src/hooks/        # lógica de negocio y formularios
src/storage/      # acceso a AsyncStorage
__tests__/        # pruebas unitarias y de componentes
```

### Decisiones importantes

- Los componentes no importan AsyncStorage.
- `useCategories` maneja la lógica de categorías.
- `useCategoryForm` maneja validación y estado del formulario de categorías.
- `useTransactions` maneja CRUD de transacciones y cálculo de balance.
- `useTransactionForm` maneja validación y estado del formulario de transacciones.
- El balance se calcula en el hook, no en la pantalla.
- `Category.type` define si la categoría es de ingreso o egreso.
- `Category.color` usa una paleta fija Cashi de 12 colores visibles sobre fondo oscuro.
- “Categoría principal” es la categoría de egreso con mayor gasto total.

## Modelo de datos

### Category

```ts
interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: CategoryColor;
}
```

### Transaction

```ts
interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  date: string;
  categoryId: string;
  photoUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}
```

## Persistencia

Los datos se guardan localmente con una key por entidad:

| Entidad       | Key            |
| ------------- | -------------- |
| Categorías    | `categories`   |
| Transacciones | `transactions` |

La app usa el patrón **read-modify-write** en modo local: leer datos actuales, modificar en memoria y guardar el arreglo completo nuevamente.

En modo backend, `useCategories` y `useTransactions` resuelven repositorios HTTP mediante `EXPO_PUBLIC_CASHI_DATA_SOURCE=backend` y `EXPO_PUBLIC_CASHI_API_BASE_URL`.

## Validación

Los formularios usan Zod para validar:

- categoría con nombre obligatorio;
- categoría con tipo válido;
- categoría con color de paleta Cashi;
- transacción con monto positivo;
- descripción obligatoria;
- tipo válido: ingreso o egreso;
- categoría obligatoria.
- metadata opcional: `photoUri` y `location` no hacen inválidas las transacciones legacy.

Los errores se muestran en pantalla, cerca del campo correspondiente.

## UX/UI

La interfaz usa una paleta fintech oscura derivada de OpenDesign:

| Uso                 | Color     |
| ------------------- | --------- |
| Primario            | `#281C59` |
| Secundario / acento | `#4E8D9C` |
| Ingresos / positivo | `#85C79A` |
| Lima / highlight    | `#EDF7BD` |
| Fondo               | `#05060B` |
| Cards               | `#151621` |

Los ingresos y egresos se diferencian con texto, signo y color para no depender solo del color.

### Tipografía

OpenDesign referenciaba fuentes de display como `Aeonik Pro` / `Söhne` y cuerpo `Inter`. Como las fuentes propietarias de display no están incluidas en el repo ni se debe asumir licencia, la app carga **Inter** con `@expo-google-fonts/inter` y usa pesos fuertes como aproximación visual.

Si más adelante se agregan archivos/licencias de `Aeonik Pro` o `Söhne`, se pueden registrar en `app/_layout.tsx` y actualizar `src/design/tokens.ts`.

## Uso de IA

Durante el desarrollo se usaron herramientas de IA como apoyo para organizar ideas, revisar alternativas de arquitectura, mejorar pruebas y validar la claridad de la documentación.

El aprendizaje principal fue reforzar la separación entre UI, lógica de negocio y persistencia: **las pantallas renderizan, los hooks coordinan la lógica y AsyncStorage queda aislado en la capa de storage**.

## Estado de entrega

- [x] Login
- [x] CRUD categorías
- [x] CRUD transacciones
- [x] Balance
- [x] Categoría principal
- [x] Formato CLP
- [x] Persistencia local
- [x] Validación con Zod
- [x] Tests automatizados
- [x] Android export
- [x] Commits por funcionalidad
