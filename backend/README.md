# E-commerce API (Backend)

API REST para un e-commerce de ferretería y materiales de construcción. Incluye autenticación (email/contraseña y Google OAuth), gestión de empleados, catálogo de categorías jerárquicas con atributos dinámicos y productos.

> **Estado:** en desarrollo. Ver [Roadmap](#roadmap).

## Stack

- **Node.js** + **Express 5**
- **TypeScript** (ESM, `strict`)
- **PostgreSQL** + **Prisma 7** (`@prisma/adapter-pg`)
- **Zod 4** para validación
- **JWT** (access + refresh token en cookies `httpOnly`) y **bcryptjs**
- **Google OAuth 2.0** (`googleapis`)
- **pnpm** como gestor de paquetes

## Características

- Registro y login con email/contraseña y login con Google.
- Access token (30 min) y refresh token (7 días) en cookies `httpOnly`; los refresh tokens se guardan hasheados en la base de datos.
- Control de acceso por roles: `admin`, `employee`, `customer`.
- Bloqueo automático de sesión si un empleado está inactivo o despedido.
- CRUD de empleados con filtros y paginación, despido y recontratación.
- Categorías en árbol (padre/hijo) con atributos configurables por categoría (`TEXT`, `NUMBER`, `BOOLEAN`, `SELECT`).
- Productos con SKU autogenerado y precio `Decimal`.
- Manejo centralizado de errores (Zod, Prisma y errores propios).
- Datos de ubigeo de Perú (departamentos, provincias, distritos) cargados por seed.

## Requisitos

- Node.js (LTS reciente)
- pnpm
- PostgreSQL
- Credenciales de Google OAuth (solo si usarás el login con Google)

## Instalación

```bash
git clone <url-del-repo>
cd ecommerce-fullstack/backend
pnpm install
```

### Variables de entorno

Crea un archivo `.env` en la carpeta `backend`:

```env
# Servidor
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Base de datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/ecommerce

# JWT
JWT_ACCESS_SECRET=cambia_este_secreto
JWT_REFRESH_SECRET=cambia_este_otro_secreto
ACCESS_TOKEN_EXPIRES_IN=30m
REFRESH_TOKEN_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### Base de datos

El proyecto usa un archivo de configuración de Prisma con nombre personalizado (`prisma7.config.ts`), por eso se pasa con `--config`:

```bash
# Generar el cliente de Prisma (se crea en src/generated/prisma)
pnpm prisma generate --config prisma7.config.ts

# Aplicar migraciones
pnpm prisma migrate deploy --config prisma7.config.ts

# Cargar datos iniciales (roles, ubigeo, puestos, categorías, admin)
pnpm prisma db seed --config prisma7.config.ts
```

> El seed crea un usuario admin y categorías sin `skipDuplicates`, así que está pensado para ejecutarse **una sola vez** sobre una base de datos vacía.

## Scripts

| Comando      | Descripción                                   |
| ------------ | --------------------------------------------- |
| `pnpm dev`   | Servidor en modo desarrollo (`tsx watch`)     |
| `pnpm build` | Compila TypeScript a `dist/`                  |
| `pnpm start` | Ejecuta la versión compilada (`dist/server.js`) |

El servidor corre por defecto en `http://localhost:3000`.

## Autenticación

La API usa cookies `httpOnly` (`accessToken` y `refreshToken`), no el header `Authorization`. Si pruebas con Postman, Insomnia o similar, activa el manejo de cookies. Cuando el access token expira, llama a `POST /api/auth/refresh`.

Roles disponibles tras el seed:

| ID | Rol        |
| -- | ---------- |
| 1  | `admin`    |
| 2  | `employee` |
| 3  | `customer` |

**Usuario admin de prueba (creado por el seed):** `admin@test.com` / `<tu-contraseña>`

## Formato de respuestas

Éxito:

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Descripción del error",
  "details": []
}
```

`details` solo aparece cuando hay información adicional (por ejemplo, errores de validación de Zod).

## Endpoints

Base URL: `/api`

### Auth — `/api/auth`

| Método | Ruta               | Acceso  | Descripción                          |
| ------ | ------------------ | ------- | ------------------------------------ |
| POST   | `/register`        | Público | Registro de cliente                  |
| POST   | `/login`           | Público | Login con email y contraseña         |
| GET    | `/google`          | Público | Redirige al login de Google          |
| GET    | `/google/callback` | Público | Callback de Google OAuth             |
| POST   | `/refresh`         | Cookie  | Renueva access y refresh token       |
| POST   | `/logout`          | Público | Cierra sesión y limpia cookies       |
| GET    | `/me`              | Auth    | Datos del usuario autenticado        |

### Categories — `/api/categories`

| Método | Ruta                            | Acceso  | Descripción                              |
| ------ | ------------------------------- | ------- | ---------------------------------------- |
| GET    | `/`                             | Público | Categorías visibles                      |
| GET    | `/tree`                         | Público | Árbol de categorías                      |
| GET    | `/:id/breadcrumb`               | Público | Ruta de una categoría hasta la raíz      |
| GET    | `/all`                          | Admin   | Todas las categorías                     |
| GET    | `/:id`                          | Admin   | Detalle de una categoría                 |
| POST   | `/`                             | Admin   | Crear categoría                          |
| PATCH  | `/:id`                          | Admin   | Actualizar categoría                     |
| PATCH  | `/:id/status`                   | Admin   | Activar / desactivar                     |
| PATCH  | `/:id/image`                    | Admin   | Actualizar URL de imagen                 |
| DELETE | `/:id`                          | Admin   | Eliminar categoría                       |
| POST   | `/:id/attributes`               | Admin   | Crear atributo de categoría              |
| GET    | `/:id/attributes`               | Admin   | Listar atributos de la categoría         |
| PATCH  | `/:id/attributes/:attributeId`  | Admin   | Actualizar atributo                      |
| DELETE | `/:id/attributes/:attributeId`  | Admin   | Eliminar atributo                        |

### Products — `/api/products`

| Método | Ruta | Acceso | Descripción     |
| ------ | ---- | ------ | --------------- |
| POST   | `/`  | Admin  | Crear producto  |
| GET    | `/`  | Admin  | Listar productos|

Body para crear un producto:

```json
{
  "categoryId": 12,
  "name": "Taladro percutor 700W",
  "description": "Opcional",
  "barcode": "7501234567890",
  "price": "199.90",
  "isActive": true
}
```

- `price` se envía como string con hasta 2 decimales.
- `barcode` es opcional: 8, 12, 13 o 14 dígitos.
- El `sku` se genera automáticamente a partir del nombre de la categoría.

### Employees — `/api/employees`

Todas las rutas requieren rol **admin**.

| Método | Ruta                    | Descripción                                |
| ------ | ----------------------- | ------------------------------------------ |
| POST   | `/`                     | Crear empleado                             |
| GET    | `/`                     | Listar empleados (filtros y paginación)    |
| GET    | `/document/:documentId` | Buscar empleado por DNI                    |
| GET    | `/:id`                  | Detalle de empleado                        |
| PATCH  | `/:id`                  | Actualizar empleado                        |
| DELETE | `/:id`                  | Eliminar empleado                          |
| POST   | `/:id/photo`            | Actualizar foto                            |
| PATCH  | `/:id/status`           | Activar / desactivar                       |
| PATCH  | `/:id/terminate`        | Despedir empleado (cierra sus sesiones)    |
| PATCH  | `/:id/rehire`           | Recontratar empleado                       |

Query params de `GET /api/employees`: `isActive`, `positionId`, `terminatedAt` (`true` / `false`), `page`, `limit`.

## Estructura del proyecto

```
backend/
├── prisma/
│   ├── data/              # peru-ubigeo.json
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.ts             # configuración de Express y rutas
│   ├── server.ts          # arranque del servidor
│   ├── config/            # Google OAuth y tokens JWT
│   ├── constants/         # roles
│   ├── errors/            # AppError
│   ├── lib/               # cliente de Prisma
│   ├── middlewares/       # auth, roles y manejo de errores
│   ├── modules/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── employees/
│   │   └── products/      # cada módulo: routes, controller, service, schema
│   ├── types/
│   └── utils/
├── prisma7.config.ts
└── tsconfig.json
```

Cada módulo sigue el flujo `routes → controller (valida con Zod) → service (lógica + Prisma)`.

## Modelo de datos

Principales entidades: `User`, `Role`, `RefreshToken`, `Employee`, `Position`, `Customer`, `Address`, `Department` / `Province` / `District` (ubigeo), `Category`, `CategoryAttribute`, `Product`, `ProductImage`, `ProductAttributeValue`.

Detalles relevantes:

- Las categorías forman un árbol mediante `parentId` (nombre único dentro del mismo padre).
- Los atributos se definen por categoría y los productos guardan sus valores en `ProductAttributeValue`.
- `Product.price` y `Employee.salary` son `Decimal(10,2)`.

## Roadmap

- [x] Autenticación (local + Google) y roles
- [x] Empleados
- [x] Categorías y atributos
- [~] Productos (crear y listar; faltan detalle, edición, eliminación y filtros)
- [ ] Imágenes de producto (el modelo ya existe)
- [ ] Valores de atributos por producto
- [ ] Clientes y direcciones
- [ ] Carrito y pedidos
- [ ] Tests

## Autor

Elias Paredes Torres
