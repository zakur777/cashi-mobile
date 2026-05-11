# cashi-mobile

App mobile de finanzas personales construida con **Expo + TypeScript + Expo Router**.

## Instalación

```bash
npm install
```

## Ejecutar la app

```bash
npm start
```

## Ejecutar tests

```bash
npm test
```

## Arquitectura mínima

- `app/`: screens render-only
- `src/hooks`: lógica de negocio (CRUD, validaciones, balance, refresh)
- `src/storage`: frontera de persistencia (AsyncStorage)

## Nota de IA

Este proyecto fue desarrollado con asistencia de IA bajo flujo SDD/TDD (RED → GREEN → REFACTOR), con revisión y validación humana.
