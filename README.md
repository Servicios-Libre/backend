<div align="center">
  <h1>🛠️ Servicio Libre - Backend API</h1>
  <p><em>Una plataforma digital que conecta usuarios con trabajadores de servicios locales</em></p>
  
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
</div>

---

## 📋 Descripción del Proyecto

<table>
<tr>
<td>

**Servicio Libre** es una API REST robusta construida con NestJS y TypeScript que permite a los usuarios encontrar y contratar servicios locales, mientras que los trabajadores pueden ofrecer sus servicios y gestionar su perfil profesional. [1](#2-0) 

</td>
</tr>
</table>

### ✨ Características Principales

<details>
<summary><strong>🔐 Sistema de Autenticación</strong></summary>

- Registro y login de usuarios
- Autenticación JWT segura
- Sistema de roles diferenciados
- Guards de protección de rutas

</details>

<details>
<summary><strong>👥 Gestión de Usuarios</strong></summary>

- Perfiles completos de usuario y trabajador
- Sistema de calificaciones y reseñas
- Gestión de disponibilidad
- Cuentas premium

</details>

<details>
<summary><strong>🛠️ Servicios por Categorías</strong></summary>

- Servicios organizados por categorías
- Sistema de aprobación de servicios
- Galería de fotos de trabajos
- Búsqueda y filtrado avanzado

</details>

<details>
<summary><strong>💬 Comunicación en Tiempo Real</strong></summary>

- Chat bidireccional entre usuarios
- Notificaciones instantáneas
- Gestión de contratos
- Historial de conversaciones

</details>

<details>
<summary><strong>📧 Sistema de Notificaciones</strong></summary>

- Emails automáticos de bienvenida
- Notificaciones de aprobación/rechazo
- Alertas de nuevas reseñas
- Templates HTML personalizados

</details>

---

## 🚀 Instalación y Configuración

<table>
<tr>
<td width="50%">

### 📋 Prerrequisitos

```bash
Node.js >= 16.0.0
npm >= 8.0.0
PostgreSQL >= 13.0
```

</td>
<td width="50%">

### ⚡ Instalación Rápida

```bash
git clone [URL_DEL_REPOSITORIO]
cd backend
npm install
```

</td>
</tr>
</table>

### 🔧 Variables de Entorno

<details>
<summary>Configuración del archivo <code>.env</code></summary>

```env
# 🗄️ Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=servicios_libre

# 🔐 JWT
JWT_SECRET=tu_jwt_secret_super_seguro

# 📧 Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app

# 🌐 Aplicación
PORT=8080
FRONT_URL=http://localhost:3000

# ☁️ Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

</details>

---

## 🏃‍♂️ Ejecución

<div align="center">

| Comando | Descripción | Puerto |
|---------|-------------|--------|
| `npm run start:dev` |  👀 Modo watch | 8080 |
| `npm run start:prod` | 🚀 Producción | 8080 |
| `npm run start` | 🔧 Levanta la aplicación | 8080 |

</div>

<div align="center">
  <p>🌐 La API estará disponible en <code>http://localhost:8080</code></p>
</div> [2](#2-1) 

---

## 📚 Documentación de la API

<div align="center">
  <h3>🔍 Swagger/OpenAPI</h3>
  <p>Documentación interactiva disponible en:</p>
  <a href="http://localhost:8080/api">
    <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger">
  </a>
  <p><code>http://localhost:8080/api</code></p>
</div> [3](#2-2) 

### 🛣️ Endpoints Principales

<details>
<summary><strong>🔐 Autenticación</strong></summary>

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/auth/signup` | Registro de usuario | ❌ |
| `POST` | `/auth/signin` | Inicio de sesión | ❌ |

</details>

<details>
<summary><strong>👤 Usuarios</strong></summary>

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/users/byId` | Perfil del usuario autenticado | ✅ JWT |
| `PUT` | `/users/update` | Actualizar datos del usuario | ✅ JWT |
| `GET` | `/users/worker/:id` | Perfil público de trabajador | ❌ |

</details>

<details>
<summary><strong>🛠️ Servicios</strong></summary>

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/services` | Listar servicios (paginado) | ❌ |
| `POST` | `/services/new` | Crear nuevo servicio | ✅ Worker |
| `GET` | `/services/categories` | Listar categorías | ❌ |

</details>

<details>
<summary><strong>📁 Archivos</strong></summary>

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/files/service/:id` | Subir fotos de servicio | ✅ Worker |
| `POST` | `/files/user` | Subir foto de perfil | ✅ JWT |

</details>

---

## 🏗️ Arquitectura del Sistema

<div align="center">
  <h3>📦 Estructura Modular</h3>
</div>

```
src/
├── 🔐 modules/
│   ├── auth/           # Autenticación y JWT
│   ├── users/          # Gestión de usuarios y perfiles
│   ├── workerServices/ # Servicios ofrecidos por trabajadores
│   ├── categories/     # Categorías de servicios
│   ├── reviews/        # Sistema de reseñas
│   ├── chat/          # Chat en tiempo real
│   ├── tickets/       # Sistema de solicitudes
│   ├── email/         # Notificaciones por email
│   └── files/         # Gestión de archivos/imágenes
├── 🛡️ common/         # Guards, decoradores, utilidades
└── 🚀 main.ts         # Punto de entrada de la aplicación
```

### 🗄️ Base de Datos

<table>
<tr>
<td>

**Entidades Principales:**
- 👤 **User**: Usuarios y trabajadores
- 🏠 **Address**: Direcciones de usuarios  
- 🛠️ **Service**: Servicios ofrecidos
- 📂 **Category**: Categorías de servicios
- ⭐ **Review**: Reseñas y calificaciones
- 💬 **Chat**: Conversaciones
- 🎫 **Ticket**: Solicitudes de aprobación

</td>
</tr>
</table>

---

## 🔒 Seguridad

<div align="center">

| Característica | Tecnología | Estado |
|----------------|------------|--------|
| **Autenticación** | JWT | ✅ |
| **Validación** | class-validator | ✅ |
| **Guards de Roles** | NestJS Guards | ✅ |
| **CORS** | Configurado | ✅ |

</div>

---

## 🧪 Testing

<div align="center">

```bash
# 🔬 Tests unitarios
npm run test

# 🌐 Tests e2e  
npm run test:e2e

# 📊 Cobertura de tests
npm run test:cov
```

</div>

---

## 📦 Despliegue

<details>
<summary><strong>🚀 Producción</strong></summary>

```bash
# Construir para producción
npm run build

# Ejecutar en producción
npm run start:prod
```

</details>

<details>
<summary><strong>🐳 Docker</strong></summary>

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "start:prod"]
```

</details>

---

## 🤝 Contribución

<div align="center">

| Paso | Acción |
|------|--------|
| 1️⃣ | Fork el proyecto |
| 2️⃣ | Crea tu rama (`git checkout -b feature/AmazingFeature`) |
| 3️⃣ | Commit tus cambios (`git commit -m 'Add AmazingFeature'`) |
| 4️⃣ | Push a la rama (`git push origin feature/AmazingFeature`) |
| 5️⃣ | Abre un Pull Request |

</div>

---

## 📞 Contacto

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
        <br>
        <a href="mailto:servicios.libre.pf@gmail.com">servicios.libre.pf@gmail.com</a>
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/API_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="API">
        <br>
        <a href="http://localhost:8080/api">Documentación API</a>
      </td>
    </tr>
  </table>
</div> [4](#2-3) 

---

## 🔧 Stack Tecnológico

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
        <br><strong>Framework</strong>
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
        <br><strong>Lenguaje</strong>
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
        <br><strong>Base de Datos</strong>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM">
        <br><strong>ORM</strong>
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
        <br><strong>Autenticación</strong>
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger">
        <br><strong>Documentación</strong>
      </td>
    </tr>
  </table>
</div>

---

<div align="center">
  <h3>📄 Licencia</h3>
  <p>Este proyecto está bajo la <strong>Licencia MIT</strong></p>
  
  <br>
  
  <p><em>Construido con ❤️ para conectar servicios locales</em></p>
</div>
```

