# Cashi Mobile

**Cashi Mobile** es una app de finanzas personales creada con **React Native + Expo + TypeScript**. Permite iniciar sesión, gestionar categorías, registrar ingresos/egresos y consultar un balance financiero persistido localmente con **AsyncStorage**.

## Funcionalidades

- Login con credenciales hardcodeadas en memoria.
- CRUD completo de categorías.
- CRUD completo de transacciones.
- Selección de categoría al crear/editar transacciones.
- Balance con total de ingresos, total de egresos y saldo final.
- Persistencia local con AsyncStorage.
- Validación de formularios con Zod y errores por campo.
- Navegación con Expo Router y tabs.

## Stack técnico

| Área | Herramienta |
|---|---|
| Mobile | React Native + Expo |
| Lenguaje | TypeScript |
| Navegación | Expo Router |
| Persistencia | AsyncStorage |
| Validación | Zod |
| Testing | Jest + jest-expo + Testing Library |

## Instalación

```bash
npm install
```

## Ejecutar la app

```bash
npm start
```

Luego podés abrirla con Expo Go o con el emulador desde la terminal de Expo.

## Ejecutar tests

```bash
npm test
```

También podés correrlos en modo secuencial:

```bash
npm test -- --runInBand
```

## Arquitectura

La regla principal del proyecto es: **las pantallas renderizan; la lógica vive en hooks y storage**.

```txt
app/              # rutas y pantallas con Expo Router
src/components/   # componentes presentacionales
src/design/       # tokens visuales de la app
src/domain/       # tipos y schemas de dominio
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
- Categoría no tiene `type`; el tipo `income | expense` pertenece a la transacción.

## Modelo de datos

### Category

```ts
interface Category {
  id: string
  name: string
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
- transacción con monto positivo;
- descripción obligatoria;
- tipo válido: ingreso o egreso;
- categoría obligatoria.

Los errores se muestran en pantalla, cerca del campo correspondiente.

## UX/UI

La interfaz usa una paleta sobria para finanzas personales:

| Uso | Color |
|---|---|
| Primario | `#281C59` |
| Secundario | `#4E8D9C` |
| Ingresos / positivo | `#85C79A` |
| Fondo suave | `#EDF7BD` |

Los ingresos y egresos se diferencian con texto, signo y color para no depender solo del color.

## Credenciales de prueba

Las credenciales están definidas en memoria para esta evaluación.

```txt
Email: admin@cashi.cl
Password: 123456
```

## Uso de IA

Se usó asistencia de IA para:

- planificar el proyecto con flujo SDD;
- definir la arquitectura hook-first;
- generar y revisar pruebas con TDD;
- revisar UX/UI y consistencia visual;
- apoyar la redacción de documentación.

El aprendizaje principal fue reforzar la separación entre UI, lógica de negocio y persistencia: **AsyncStorage y cálculos no deben vivir en componentes**.

## Estado de entrega

- [x] Login
- [x] CRUD categorías
- [x] CRUD transacciones
- [x] Balance
- [x] Persistencia local
- [x] Validación con Zod
- [x] Tests automatizados
- [x] Commits por funcionalidad
