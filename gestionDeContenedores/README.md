# Backend: Gestión de Contenedores (API)

API REST robusta construida con Laravel para la gestión de la base de datos de contenedores en Supabase.

## 🛠️ Tecnologías

- **Framework:** Laravel 11.
- **Lenguaje:** PHP 8.2.
- **Base de Datos:** PostgreSQL (vía Supabase).
- **Autenticación:** Laravel Sanctum.

## 📡 Endpoints Principales

### Usuarios
- `POST /api/usuarios/login`: Iniciar sesión.
- `POST /api/usuarios/logout`: Cerrar sesión (requiere token).

### Contenedores
- `GET /api/contenedores`: Listar todos.
- `POST /api/contenedores`: Crear nuevo.
- `PUT /api/contenedores/{id}`: Actualizar existente.
- `DELETE /api/contenedores/{id}`: Eliminar.

### Clientes y Movimientos
- `GET /api/clientes`: Listar clientes.
- `GET /api/movimientos`: Listar registro de movimientos.

## 🐳 Docker y Despliegue

El proyecto incluye un `Dockerfile` optimizado para Render.

**Pasos para desplegar:**
1. Crear un nuevo Web Service en Render.
2. Conectar el repositorio.
3. Configurar las variables de entorno (`DB_HOST`, `DB_PASSWORD`, etc.).
4. El sistema detectará el Dockerfile y construirá la imagen automáticamente.

## ⚙️ Configuración local
```bash
composer install
cp .env.example .env
php artisan key:generate
# Configurar conexión a PostgreSQL (Supabase) en .env
php artisan migrate --force
php artisan serve
```

## 🔒 Variables de entorno
Define en `.env` sin subir secretos al repositorio:
- `DB_CONNECTION=pgsql`
- `DB_HOST=<host>`
- `DB_PORT=<puerto>`
- `DB_DATABASE=<base>`
- `DB_USERNAME=<usuario>`
- `DB_PASSWORD=<password>`

---
*Parte del proyecto Gestión de Contenedores.*
