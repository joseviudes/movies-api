# Movies API

API REST para un catálogo de películas, hecha con Node.js, Express, TypeScript, PostgreSQL y Prisma.

Trabajo práctico integrador del Bootcamp 5.0 (Módulo Node.js).

> **Estado actual: Etapa 1 (punto de control).** CRUD de películas conectado a la base de datos. Todavía no incluye autenticación (login, JWT, rutas protegidas) ni validaciones de negocio: eso se suma en la entrega final.

## Instalación

1. Cloná el repositorio e instalá las dependencias:

   ```bash
   npm install
   ```

2. Levantá la base de datos de Postgres con Docker:

   ```bash
   docker compose up -d
   ```

3. Copiá `.env.template` a `.env` y completá las variables:

   ```bash
   cp .env.template .env
   ```

   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5434/mydb
   JWT_SECRET=
   ```

4. Aplicá las migraciones de Prisma:

   ```bash
   npx prisma migrate dev
   ```

## Ejecución

Modo desarrollo (con recarga automática):

```bash
npm run dev
```

Build y ejecución en producción:

```bash
npm run build
npm start
```

El servidor queda disponible en `http://localhost:3000` (o el puerto definido en `PORT`).

## Endpoints

### Health check

| Método | Ruta           | Descripción             |
| ------ | -------------- | ------------------------ |
| GET    | `/api/health/` | Verifica que el servidor esté activo |

### Películas (`/api/movies`)

| Método | Ruta               | Descripción                  |
| ------ | ------------------ | ----------------------------- |
| GET    | `/api/movies`      | Lista todas las películas     |
| GET    | `/api/movies/:id`  | Obtiene una película por id   |
| POST   | `/api/movies`      | Crea una película             |
| PUT    | `/api/movies/:id`  | Actualiza una película        |
| DELETE | `/api/movies/:id`  | Elimina una película          |

Body esperado para `POST` y `PUT`:

```json
{
  "title": "string",
  "director": "string",
  "genre": "string",
  "duration": 120,
  "yearOfRelease": 2024,
  "rating": 8.5
}
```

> Los endpoints de usuarios (registro y login) y la protección de rutas con JWT se agregan en la entrega final.

## Pruebas

Pruebas manuales realizadas en Postman sobre `/api/movies`, incluyendo casos de éxito y de error.

| Caso | Método | Resultado |
| ---- | ------ | --------- |
| Listar películas | GET `/api/movies` | `200 OK` |
| Crear película | POST `/api/movies` | `201 Created` |
| Actualizar película | PUT `/api/movies/:id` | `200 OK` |
| Eliminar película | DELETE `/api/movies/:id` | `200 OK` |
| Crear con campos faltantes | POST `/api/movies` | `400 Bad Request` |
| Buscar película inexistente | GET `/api/movies/:id` | `404 Not Found` |

Capturas:

![GET /api/movies - 200 OK](docs/screenshots/01-get-movies.png)
![POST /api/movies - 201 Created](docs/screenshots/02-post-movie.png)
![PUT /api/movies/:id - 200 OK](docs/screenshots/03-put-movie.png)
![DELETE /api/movies/:id - 200 OK](docs/screenshots/04-delete-movie.png)
![POST /api/movies - 400 Bad Request](docs/screenshots/05-post-movie-400.png)
![GET /api/movies/:id - 404 Not Found](docs/screenshots/06-get-movie-404.png)

## Tecnologías

- Node.js + TypeScript
- Express
- PostgreSQL + Prisma ORM
- Docker (base de datos local)
