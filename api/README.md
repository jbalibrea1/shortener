# EXPRESS API - Short URL Service

## Getting Started

### Prerequisites

- Node.js (version 22)
- TypeScript
- MongoDB (or a MongoDB Atlas account)

### Usage

Set the environment variables in a `.env` file like the `.env.example` file.

```bash
pnpm i
# run development server
pnpm dev
# to build
pnpm build
# to run built code
pnpm start
```

## Description

PI para acortar URLs, con soporte para usuarios autenticados y anónimos, roles y gestión de URLs propias.

## Features

- Create a short URL from a long URL.
- Retrieve the original URL using the short URL.
- Get statistics on the number of clicks for each short URL.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas - Cloud-hosted database
- Mongoose
- TypeScript
- dotenv (for environment variables)

## API Endpoints

### Autenticación

- `POST /api/v1/auth/register`  
  Registra un usuario.  
  Body: `{ username, name, password }`  
  Respuesta: `{ token, username }`

- `POST /api/v1/auth/login`  
  Inicia sesión.  
  Body: `{ username, password }`  
  Respuesta: `{ token, username }`

- `GET /api/v1/auth/me`  
  Devuelve el usuario autenticado y sus URLs.  
  Header: `Authorization: Bearer <token>`

### Gestión de URLs

- `GET /api/v1/urls`  
  Lista las URLs propias del usuario autenticado.

- `POST /api/v1/urls`  
  Crea una nueva shortURL.  
  Body: `{ url }`  
  (Opcional: autenticación para asociar la URL al usuario)

- `GET /api/v1/urls/:shortUrl`  
  Devuelve información de una shortURL propia.

- `DELETE /api/v1/urls/:shortUrl`  
  Elimina una shortURL propia (requiere autenticación).

### Redirección

- `GET /api/v1/redirect/:shortUrl`  
  Redirige a la URL original o muestra una página 404 si no existe.

### Administración

- `GET /api/v1/admin/urls`  
  (Solo admin) Lista todas las URLs acortadas.
- `GET /api/v1/admin/urls/:shortUrl`
- `DELETE /api/v1/admin/urls/:shortUrl`  
  Elimina una shortURL (requiere autenticación de admin).

## Roles

- `user`: Puede crear, listar y eliminar sus propias URLs.
- `admin`: Puede listar todas las URLs.

## Ejemplo de uso

```bash
curl -X POST http://localhost:3000/api/v1/urls -H "Authorization: Bearer <token>" -d '{"url":"https://example.com"}'
```

- All endpoints return JSON except redirection, which returns a 404 HTML page if the short URL does not exist.
- Protected endpoints require JWT authentication in the header `Authorization: Bearer <token>`.

## TODO

- [ ] Implementar analíticas de clics por día y país.
- [ ] eliminar shortURL y sus analíticas al eliminar una shortURL.
- [ ] añadir redis para mejorar el rendimiento de las consultas.
