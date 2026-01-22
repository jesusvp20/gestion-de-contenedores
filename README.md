# Sistema de Gestión de Contenedores

Este es un proyecto personal diseñado para la administración eficiente de inventarios de contenedores, seguimiento de movimientos y gestión de clientes.

## 🚀 Arquitectura del Proyecto

El sistema utiliza una arquitectura desacoplada:

- **Frontend:** [gestionContenedoresFrontend](file:///c:/Users/caraj/Documents/Gestion%20De%20Contenedores/gestionContenedoresFrontend)
    - **Tecnologías:** React 19, Vite, TypeScript, Axios, Lucide React.
    - **Diseño:** Moderno, responsivo, paleta Negro/Blanco/Azul Oscuro.
- **Backend:** [gestionDeContenedores](file:///c:/Users/caraj/Documents/Gestion%20De%20Contenedores/gestionDeContenedores)
    - **Tecnologías:** Laravel 11, PHP 8.2.
    - **Base de Datos:** Supabase (PostgreSQL).
    - **Despliegue:** Dockerizado para Render.

## 🛠️ Configuración Rápida

### 1. Base de Datos (Supabase)
La base de datos ya ha sido configurada y las tablas creadas en Supabase.
- **Usuario de prueba:** `Administrador`
- **Contraseña:** `test123`

### 2. Backend (Laravel)
```bash
cd gestionDeContenedores
# Instalar dependencias
composer install
# Generar APP_KEY
php artisan key:generate
# Iniciar servidor
php artisan serve
```

### 3. Frontend (React)
```bash
cd gestionContenedoresFrontend
# Instalar dependencias
npm install
# Iniciar entorno de desarrollo
npm run dev
```
## 📦 Estructura del Repositorio (carpeta padre)
- `gestionContenedoresFrontend/` (React + Vite)
- `gestionDeContenedores/` (Laravel API)
- `README.md` (documentación general)
- `.gitignore` (exclusión de dependencias y secretos)
