# Contratos esperados de API (C#/.NET + PostgreSQL)

Estas rutas son **propuestas de contrato**, no endpoints definitivos. El frontend las consume de forma relativa a `VITE_API_URL`.

Ejemplo:

```
VITE_API_URL=https://api.midominio.com/api
```

Con mocks:

```
VITE_USE_MOCKS=true
```

Cuando `VITE_USE_MOCKS=false`, Axios llama a la API real. No hay URLs duplicadas en vistas ni componentes.

## Convenciones

- Identificadores numéricos (`int`).
- Fechas en ISO-8601.
- Errores estilo Problem Details:

```json
{
  "title": "Conflict",
  "status": 409,
  "detail": "Mensaje legible",
  "errors": {
    "email": ["El correo ya está registrado."]
  }
}
```

- Listados paginados:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 10,
  "totalItems": 42,
  "totalPages": 5
}
```

## Empleados

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/employees` | Listado con filtros |
| GET | `/employees/{id}` | Detalle |
| POST | `/employees` | Alta |
| PUT | `/employees/{id}` | Cambio |
| DELETE | `/employees/{id}` | Baja |

Query params: `search`, `status` (`active` \| `inactive` \| `terminated`), `departmentId`, `positionId`, `page`, `pageSize`, `sortBy`, `sortDir`.

Cuerpo de alta/cambio:

```json
{
  "firstName": "Laura",
  "lastName": "Herrera Solís",
  "email": "laura.herrera@abc.mx",
  "phone": "5512340001",
  "departmentId": 1,
  "positionId": 1,
  "hireDate": "2024-01-15",
  "status": "active",
  "salary": 98000
}
```

El número de empleado (`employeeNumber`) lo asigna el backend.

Reglas esperadas en servidor (no exclusivas del frontend):

- Correo único.
- El puesto debe pertenecer al departamento.
- Auditoría de alta, cambio y baja.

## Departamentos

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/departments` | Listado |
| GET | `/departments/{id}` | Detalle |
| POST | `/departments` | Alta |
| PUT | `/departments/{id}` | Cambio |
| DELETE | `/departments/{id}` | Baja |

Query params: `search`, `isActive`, `page`, `pageSize`, `sortBy`, `sortDir`.

No eliminar si hay puestos o empleados asociados (409).

## Puestos

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/positions` | Listado |
| GET | `/positions/{id}` | Detalle |
| POST | `/positions` | Alta |
| PUT | `/positions/{id}` | Cambio |
| DELETE | `/positions/{id}` | Baja |

Query params: `search`, `departmentId`, `isActive`, `page`, `pageSize`, `sortBy`, `sortDir`.

No eliminar si hay empleados asociados (409). `minSalary` no puede ser mayor que `maxSalary`.

## Dashboard

`GET /dashboard/summary`

```json
{
  "totals": {
    "employees": 14,
    "activeEmployees": 11,
    "departments": 5,
    "positions": 8,
    "hiresThisMonth": 0,
    "terminationsThisMonth": 0
  },
  "byDepartment": [{ "departmentId": 1, "name": "Dirección General", "total": 1 }],
  "activityByMonth": [{ "month": "2026-05", "hires": 1, "changes": 0, "terminations": 0 }]
}
```

## Reportes

`GET /reports/activity`

Query params: `search`, `action` (`create` \| `update` \| `delete`), `entityType` (`employee` \| `department` \| `position`), `from`, `to`, `page`, `pageSize`, `sortBy`, `sortDir`.

Respuesta: listado paginado más `summary: { hires, changes, terminations, total }`.

La exportación PDF/CSV se genera en el cliente a partir de estos datos. El backend puede sustituirla más adelante por un endpoint de archivo.
