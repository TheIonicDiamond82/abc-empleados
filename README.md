# ABC Empleados

Sistema web de administración de personal (altas, bajas y cambios) con Vue 3, Vite, Tailwind CSS 4, Pinia y Axios.

## Arranque

```sh
npm install
npm run dev
```

Variables en `.env`:

```
VITE_USE_MOCKS=true
VITE_API_URL=http://localhost:5080/api
```

- `VITE_USE_MOCKS=true` usa un almacén en memoria y no llama a la red.
- `VITE_USE_MOCKS=false` envía todas las peticiones a `VITE_API_URL`.

Los contratos esperados de la API futura (C#/.NET) están en `docs/API_CONTRACTS.md`.

## Arquitectura

- `views/` pantallas.
- `components/` UI reutilizable y formularios.
- `services/` única capa HTTP. Las vistas no llaman a Axios.
- `stores/` estado y orquestación.
- `composables/` búsqueda diferida, orden y paginación.
- `mocks/` datos y reglas simuladas, separados de los servicios.
- `constants/apiPaths.js` rutas centralizadas.

## Módulos

1. Dashboard con indicadores y gráficas.
2. Empleados (CRUD, filtros, búsqueda, paginación).
3. Departamentos.
4. Puestos.
5. Reportes de actividad con exportación CSV y PDF.
