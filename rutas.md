# 📚 API Backend - Documentación de Rutas

## Autenticación

| Método | Endpoint        | Descripción             | Body / Headers                | Respuesta esperada            |
|--------|----------------|-------------------------|-------------------------------|-------------------------------|
| POST   | `/auth/signup` | Registrar usuario       | JSON con datos de usuario     | Usuario creado (sin password) |
| POST   | `/auth/signin` | Login de usuario        | `{ email, password }`         | `{ token }` JWT               |

---

## Usuarios

| Método | Endpoint        | Descripción                | Headers                        | Body / Query                  | Respuesta esperada            |
|--------|----------------|----------------------------|--------------------------------|-------------------------------|-------------------------------|
| GET    | `/users/byId`  | Obtener usuario por token  | `Authorization: Bearer <JWT>`  | -                             | Usuario con datos y dirección |
| POST   | `/users/update`| Actualizar datos usuario   | `Authorization: Bearer <JWT>`  | JSON con campos a actualizar  | OK / Error                    |

---

## Servicios

| Método | Endpoint               | Descripción                    | Query / Body / File                | Respuesta esperada        |
|--------|------------------------|--------------------------------|------------------------------------|---------------------------|
| GET    | `/services`            | Listar servicios (paginado y por categoría) | Query: `page`, `limit`, `category` (opcional) | Array de servicios        |
| GET    | `/services/categories` | Listar categorías              | -                                  | Array de categorías       |
| POST   | `/services/new`        | Crear servicio                 | JSON: `{ worker_id, category, title, description }` | Servicio creado           |

**Ejemplo de POST `/services/new`:**

```json
{
  "worker_id": "uuid",
  "category": "Carpintero",
  "title": "Título",
  "description": "Descripción"
}
```

---

## Archivos (Imágenes)

| Método | Endpoint                | Descripción                              | Headers / Params / File                | Respuesta esperada                |
|--------|-------------------------|------------------------------------------|----------------------------------------|-----------------------------------|
| POST   | `/files/service/:id`    | Subir foto de trabajo a un servicio      | Param: `id` (UUID servicio), File: `image` (form-data) | `{ message: 'Image uploaded successfully' }` |
| POST   | `/files/user`           | Subir foto de perfil de usuario          | Header: `Authorization: Bearer <JWT>`, File: `image` (form-data) | `{ message: 'Image uploaded successfully' }` |

**Notas para archivos:**
- Usar `multipart/form-data` con campo `image`.
- Solo imágenes jpeg, jpg, png, webp. Máx 2MB.

---