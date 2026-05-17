# Cashi Mobile

**Cashi Mobile** es una app de finanzas personales creada con **React Native + Expo + TypeScript**. Permite iniciar sesión, gestionar categorías, registrar ingresos/egresos y consultar un balance financiero persistido localmente con **AsyncStorage**.

La app está optimizada para validación **Android-first** con Expo Go/emulador.

## Funcionalidades

- Login demo local.
- CRUD completo de categorías.
- Categorías con `type` (`income | expense`) y color fijo de la paleta Cashi.
- CRUD completo de transacciones.
- Selección de categoría al crear/editar transacciones.
- Balance con total de ingresos, total de egresos, saldo final y **Categoría principal**.
- Montos en pesos chilenos CLP: `$1.250.000`, sin decimales y con punto de miles.
- Persistencia local con AsyncStorage.
- Validación de formularios con Zod y errores por campo.
- Navegación con Expo Router y tabs.
- UI Android-first basada en referencia OpenDesign, con tokens, gradientes e Inter como tipografía disponible.

## Stack técnico

| Área | Herramienta |
|---|---|
| Mobile | React Native + Expo |
| Lenguaje | TypeScript |
| Navegación | Expo Router |
| Persistencia | AsyncStorage |
| Validación | Zod |
| UI | Tokens propios + `expo-linear-gradient` + Inter |
| Testing | Jest + jest-expo + Testing Library |

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

Credenciales demo:

```txt
Email: demo@cashi.com
Password: Cashi1234
```

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
- `Category.color` usa una paleta fija Cashi.
- “Categoría principal” es la categoría de egreso con mayor gasto total.

## Modelo de datos

### Category

```ts
interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  color: CategoryColor
}
```

### Transaction

```ts
interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  description: string
  date: string
  categoryId: string
}
```

## Persistencia

Los datos se guardan localmente con una key por entidad:

| Entidad | Key |
|---|---|
| Categorías | `categories` |
| Transacciones | `transactions` |

La app usa el patrón **read-modify-write**: leer datos actuales, modificar en memoria y guardar el arreglo completo nuevamente.

## Validación

Los formularios usan Zod para validar:

- categoría con nombre obligatorio;
- categoría con tipo válido;
- categoría con color de paleta Cashi;
- transacción con monto positivo;
- descripción obligatoria;
- tipo válido: ingreso o egreso;
- categoría obligatoria.

Los errores se muestran en pantalla, cerca del campo correspondiente.

## UX/UI

La interfaz usa una paleta fintech oscura derivada de OpenDesign:

| Uso | Color |
|---|---|
| Primario | `#281C59` |
| Secundario / acento | `#4E8D9C` |
| Ingresos / positivo | `#85C79A` |
| Lima / highlight | `#EDF7BD` |
| Fondo | `#05060B` |
| Cards | `#151621` |

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
