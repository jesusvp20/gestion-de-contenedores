# Frontend: Gestión de Contenedores

Interfaz moderna construida con React y Vite para la administración de inventarios de carga.

## ✨ Características

- **Interfaz Moderna:** Diseño oscuro (Black/Navy) con componentes premium.
- **Responsive:** Adaptable a dispositivos móviles y tablets.
- **Gestión de Datos:** Consumo de API REST con manejo de estados (Loading, Error).
- **Componentes Reutilizables:** Botones, inputs, tarjetas y modales personalizados.

## 🛠️ Tecnologías

- React 19 (Hooks, Context)
- Vite
- TypeScript
- Axios (Cliente HTTP)
- Lucide React (Iconos)

## 📂 Estructura de Carpetas

- `src/components`: Componentes atómicos y reutilizables.
- `src/services`: Lógica de consumo de API.
- `src/pages`: Vistas principales de la aplicación.
- `src/styles`: Tokens de diseño y estilos globales.
- `src/types`: Definiciones de interfaces TypeScript.

## 🚀 Instalación

```bash
npm install
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173`.
Asegúrese de que el backend esté corriendo en el puerto `8000`.

## 🔗 Configuración de API
El cliente HTTP apunta por defecto a `http://localhost:8000/api`. Si deseas cambiarlo, ajusta la constante `API_BASE_URL` en:
- [apiClient.ts](file:///c:/Users/caraj/Documents/Gestion%20De%20Contenedores/gestionContenedoresFrontend/src/services/apiClient.ts)

## 🧪 Calidad del código
```bash
npm run lint
```

---
*Parte del proyecto Gestión de Contenedores.*
