# 📚 API Backend - Documentación de Rutas

## Autenticación

| Método | Endpoint        | Descripción             | Body / Headers                | Respuesta esperada            |
|--------|----------------|-------------------------|-------------------------------|-------------------------------|
| POST   | `/auth/signup` | Registrar usuario       | JSON con datos de usuario     | Usuario creado (sin password) |
| POST   | `/auth/signin` | Login de usuario        | `{ email, password }`         | `{ token }` JWT               |

---

## Usuarios

| Método | Endpoint        | Descripción                | Headers                        | Respuesta esperada            |
|--------|----------------|----------------------------|--------------------------------|-------------------------------|
| GET    | `/users/byId`  | Obtener usuario por token  | `Authorization: Bearer <JWT>`  | Usuario con datos y dirección |

---

## Servicios

| Método | Endpoint               | Descripción                    | Query / Body / File                | Respuesta esperada        |
|--------|------------------------|--------------------------------|------------------------------------|---------------------------|
| GET    | `/services`            | Listar servicios (paginado)    | `page`, `limit`, `category` (op)   | Array de servicios        |
| GET    | `/services/categories` | Listar categorías              | -                                  | Array de categorías       |
| POST   | `/services/new`        | Crear servicio con imagen      | Body: datos servicio, File: image  | Servicio creado           |

**Ejemplo de POST `/services/new`:**

```json
{
  "worker_id": "uuid",
  "category": "Carpintero",
  "title": "Título",
  "description": "Descripción"
}
```
- **File:**  
  `image` (form-data, imagen jpeg/png/webp, máx 2MB)

---

## Archivos (Imágenes)

| Método | Endpoint             | Descripción                      | File / Params                      | Respuesta esperada                |
|--------|----------------------|----------------------------------|------------------------------------|-----------------------------------|
| POST   | `/files/service/:id` | Subir foto de trabajo a servicio | File: image, Param: id servicio    | `{ message: 'Image uploaded...'}` |
| POST   | `/files/user/:id`    | Subir foto de perfil de usuario  | File: image, Param: id usuario     | `{ message: 'Image uploaded...'}` |

**Notas para archivos:**
- Usar `multipart/form-data` con campo `image`.
- Solo imágenes jpeg, jpg, png, webp. Máx 2MB.
