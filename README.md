<p align="center">
  <img src="docs/banner.svg" alt="Movies API" width="100%">
</p>

# Movies API

API REST para un catálogo de películas, hecha con Node.js, Express, TypeScript, PostgreSQL y Prisma.

Trabajo práctico integrador del Bootcamp 5.0 (Módulo Node.js).

Incluye:

- CRUD completo de películas.
- Registro y login de usuarios con **Bcrypt** y **JWT**.
- Rutas protegidas con un middleware que verifica el token.
- **Roles**: solo un usuario `ADMIN` puede crear, modificar o eliminar películas.
- **Reviews**: cada usuario puede reseñar películas y ve solo sus propias reviews (relación User → Review → Movie).
- **Filtros** por query string en el listado de películas.
- **Middleware de logging** que muestra en consola el método y la URL de cada petición.

## Arquitectura

El proyecto está organizado por componentes, y cada componente separa sus capas:

```
src/
├── components/
│   ├── movie/      # routes → controller → service → repository
│   ├── user/       # registro y login
│   └── review/     # reviews de cada usuario
├── middlewares/    # auth (JWT), admin (rol) y logger
├── config/         # conexión a Prisma y JWT_SECRET
├── utils/          # HttpError, manejo de errores, validación de UUID
├── app.ts          # configuración de Express
└── server.ts       # conexión a la base y arranque del servidor
```

- **routes**: define las URLs y los middlewares de cada una.
- **controller**: lee la request, llama al servicio y responde con el código de estado (todos con `try/catch`).
- **service**: reglas y validaciones de negocio.
- **repository**: acceso a la base de datos con Prisma.

## Instalación

1. Cloná el repositorio e instalá las dependencias:

   ```bash
   npm install
   ```

2. Levantá la base de datos de Postgres con Docker:

   ```bash
   docker compose up -d
   ```

3. Copiá `.env.example` a `.env` y completá las variables:

   ```bash
   cp .env.example .env
   ```

   ```env
   PORT=3000
   JWT_SECRET=una_clave_secreta_larga
   DATABASE_URL=postgresql://postgres:postgres@localhost:5434/mydb
   ```

4. Aplicá las migraciones y generá el cliente de Prisma:

   ```bash
   npx prisma migrate dev
   npx prisma generate
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

El servidor queda disponible en `http://localhost:3000/api` (o el puerto definido en `PORT`).

## Autenticación

1. Registrate con `POST /api/auth/register`.
2. Iniciá sesión con `POST /api/auth/login`; la respuesta trae un `token` que dura 1 hora.
3. En las rutas protegidas, mandá el token en el header:

   ```
   Authorization: Bearer <token>
   ```

El token solo guarda `id`, `email` y `role` del usuario (nunca la contraseña).

### Cómo crear un usuario admin

Todos los usuarios se registran con el rol `USER`. Para convertir uno en `ADMIN`:

- Con Prisma Studio: `npx prisma studio`, abrí la tabla `User` y cambiá el campo `role` a `ADMIN`.
- O con SQL:

  ```sql
  UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@mail.com';
  ```

Después del cambio hay que **volver a hacer login** para obtener un token con el rol nuevo.

## Endpoints

🔓 = pública · 🔒 = requiere token · 👑 = requiere token de un usuario `ADMIN`

### Health check

| Método | Ruta           | Acceso | Descripción                          |
| ------ | -------------- | ------ | ------------------------------------ |
| GET    | `/api/health/` | 🔓     | Verifica que el servidor esté activo |

### Autenticación (`/api/auth`)

| Método | Ruta                 | Acceso | Descripción                             |
| ------ | -------------------- | ------ | --------------------------------------- |
| POST   | `/api/auth/register` | 🔓     | Registra un usuario                     |
| POST   | `/api/auth/login`    | 🔓     | Inicia sesión y devuelve un token JWT   |

Body de `register`:

```json
{
  "name": "Ana",
  "email": "ana@mail.com",
  "password": "123456"
}
```

Body de `login`:

```json
{
  "email": "ana@mail.com",
  "password": "123456"
}
```

Respuesta de `login`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Películas (`/api/movies`)

| Método | Ruta              | Acceso | Descripción                 |
| ------ | ----------------- | ------ | --------------------------- |
| GET    | `/api/movies`     | 🔓     | Lista todas las películas   |
| GET    | `/api/movies/:id` | 🔓     | Obtiene una película por id |
| POST   | `/api/movies`     | 👑     | Crea una película           |
| PUT    | `/api/movies/:id` | 👑     | Actualiza una película      |
| DELETE | `/api/movies/:id` | 👑     | Elimina una película        |

Body esperado para `POST` y `PUT` (en `PUT` se mandan todos los campos):

```json
{
  "title": "Inception",
  "director": "Christopher Nolan",
  "genre": "Sci-Fi",
  "duration": 148,
  "yearOfRelease": 2010,
  "rating": 8.8
}
```

#### Filtros

Se pueden combinar entre sí:

| Query param | Ejemplo                       | Descripción                                          |
| ----------- | ----------------------------- | ---------------------------------------------------- |
| `genre`     | `/api/movies?genre=drama`     | Género exacto (sin distinguir mayúsculas)            |
| `director`  | `/api/movies?director=nolan`  | El director contiene el texto                        |
| `minRating` | `/api/movies?minRating=8`     | Puntaje mayor o igual al valor (de 1 a 10)           |

### Reviews (`/api/reviews`)

Todas las rutas requieren token. Cada usuario solo ve y borra **sus propias** reviews.

| Método | Ruta               | Acceso | Descripción                        |
| ------ | ------------------ | ------ | ---------------------------------- |
| GET    | `/api/reviews`     | 🔒     | Lista las reviews del usuario      |
| POST   | `/api/reviews`     | 🔒     | Crea una review de una película    |
| DELETE | `/api/reviews/:id` | 🔒     | Elimina una review propia          |

Body de `POST`:

```json
{
  "movieId": "uuid-de-la-pelicula",
  "comment": "Excelente película",
  "score": 9
}
```

## Validaciones de negocio

**Películas**

- `title`, `director`, `genre`, `duration`, `yearOfRelease` y `rating` son obligatorios.
- El `rating` va de 1 a 10.
- La `duration` es un número entero positivo (en minutos).
- El `yearOfRelease` está entre 1888 (primera película de la historia) y el año actual.
- No puede haber dos películas con el mismo título y director.

**Usuarios**

- `name`, `email` y `password` son obligatorios.
- La contraseña tiene al menos 6 caracteres.
- No se puede registrar dos veces el mismo email.

**Reviews**

- El `score` es un entero de 1 a 10 y el `comment` no puede estar vacío.
- La película tiene que existir.
- Un usuario solo puede dejar una review por película.

## Códigos de estado

| Código | Cuándo                                                                     |
| ------ | -------------------------------------------------------------------------- |
| 200    | Consulta, actualización, eliminación o login exitosos                      |
| 201    | Recurso creado (película, usuario o review)                                |
| 400    | Datos inválidos o faltantes, id con formato inválido, email o película duplicados, JSON mal formado |
| 401    | Falta el token, el token es inválido o vencido, o las credenciales del login son incorrectas |
| 403    | El usuario está logueado pero no es `ADMIN`                                |
| 404    | La película o review no existe, o la ruta no existe                        |
| 500    | Error inesperado del servidor                                              |

## Pruebas

Pruebas manuales realizadas en Postman, incluyendo casos de éxito y de error.

| Caso | Método | Resultado |
| ---- | ------ | --------- |
| Listar películas | GET `/api/movies` | `200 OK` |
| Crear película (admin) | POST `/api/movies` | `201 Created` |
| Actualizar película (admin) | PUT `/api/movies/:id` | `200 OK` |
| Eliminar película (admin) | DELETE `/api/movies/:id` | `200 OK` |
| Crear con campos faltantes | POST `/api/movies` | `400 Bad Request` |
| Buscar película inexistente | GET `/api/movies/:id` | `404 Not Found` |
| Registrar usuario | POST `/api/auth/register` | `201 Created` |
| Registrar email repetido | POST `/api/auth/register` | `400 Bad Request` |
| Login correcto | POST `/api/auth/login` | `200 OK` |
| Login con contraseña incorrecta | POST `/api/auth/login` | `401 Unauthorized` |
| Crear película sin token | POST `/api/movies` | `401 Unauthorized` |
| Crear película con usuario no admin | POST `/api/movies` | `403 Forbidden` |
| Filtrar por género | GET `/api/movies?genre=drama` | `200 OK` |
| Crear review | POST `/api/reviews` | `201 Created` |
| Listar mis reviews | GET `/api/reviews` | `200 OK` |
| Eliminar review | DELETE `/api/reviews/:id` | `200 OK` |

Las capturas de cada una de estas pruebas están en la carpeta [docs/screenshots](docs/screenshots), numeradas en el mismo orden que la tabla.

## Tecnologías

- Node.js + TypeScript
- Express
- PostgreSQL + Prisma ORM
- Bcrypt (hash de contraseñas)
- JSON Web Token (autenticación)
- dotenv (variables de entorno)
- Docker (base de datos local)