# Florae — Tienda online de plantas y jardinería

Proyecto semestral de la asignatura **DSY1104 — Desarrollo Fullstack II**. Consiste en el desarrollo de una tienda online para un vivero, construida de forma incremental a lo largo de tres evaluaciones parciales.

Este repositorio corresponde a la **Evaluación Parcial 3**: integración del frontend en React con una API REST propia.

**Sitio publicado:** https://plant-ecommerce-r.vercel.app/
**Backend (API y Swagger):** https://github.com/danielacuevasd/plant-ecommerce-back

| | |
|---|---|
| Autora | Daniela Cuevas |
| Asignatura | DSY1104 - Desarrollo Fullstack II |
| Evaluación | Parcial 3: integración frontend y backend |
| Etapas anteriores | EP1 (HTML, CSS y JavaScript) y EP2 (React con datos simulados) |

---

## Contexto del proyecto

| Etapa | Alcance | Estado |
|---|---|---|
| **EP1** | Frontend estático con HTML, CSS y JavaScript | Completada |
| **EP2** | Migración a React, datos simulados, diseño responsivo y pruebas unitarias | Completada |
| **EP3** | Backend con API REST, base de datos, autenticación JWT e integración con el front | **En progreso** |

En esta etapa el front ya no usa `localStorage` como base de datos. Todos los datos (productos, usuarios y mensajes de contacto) vienen de la API, que los guarda en PostgreSQL. En el navegador solo se guarda el token JWT, los datos básicos de la sesión y el carrito.

## Integración con el backend

- **Cliente HTTP:** `axios`, configurado una sola vez en `src/services/api.js` con la URL base `VITE_API_URL` + `/api/v1`.
- **Servicios:** `src/services/` tiene un archivo por recurso (`authService`, `productosService`, `usuariosService`, `contactoService`). Los componentes nunca llaman a axios directamente.
- **Carga de datos:** el hook `useCargar` entrega `{ datos, cargando, error }`, y cada pantalla muestra su estado de carga y de error.
- **Errores:** `mensajeDeError` convierte la respuesta de la API (o la falta de conexión) en un texto para el usuario.

## Autenticación, sesión y roles

- **Inicio de sesión y registro** llaman a la API, que devuelve un JWT. El token se guarda en `localStorage` (`florae_token`) y un interceptor de axios lo envía en cada petición como `Authorization: Bearer <token>`.
- **Persistencia:** `AuthContext` lee la sesión guardada (`florae_sesion`) al iniciar, así que el usuario sigue conectado al recargar la página. Nunca se guarda la contraseña.
- **Token vencido:** si la API responde 401, un interceptor borra el token y la sesión y redirige a `/login`.
- **Restricción de pantallas:** `AdminLayout` solo deja entrar al panel a usuarios de tipo Administrador; cualquier otro es enviado al login.
- **La seguridad real está en la API.** Las rutas de administración responden 403 a quien no sea administrador, aunque alguien modifique la sesión del navegador.

## Funcionalidades

**Tienda (pública)**
- Portada con productos destacados, catálogo con búsqueda y filtro por categoría, y detalle de producto con relacionados.
- Carrito con cambio de cantidades, tope de stock según la API, cupones y persistencia al recargar.
- Registro e inicio de sesión con validaciones (RUN con dígito verificador, dominios de correo permitidos y comuna según la región).
- Formulario de contacto que guarda el mensaje en la base de datos.

**Panel de administración (solo rol Administrador)**
- Resumen con totales de productos, usuarios y stock crítico.
- Gestión de productos y de usuarios: listado, creación, edición y eliminación con confirmación.
- Bandeja de mensajes de contacto.
- El administrador no puede eliminar su propia cuenta ni cambiarse el tipo.

## Tecnologías

| Categoría | Herramienta |
|---|---|
| Framework | React con Vite |
| Navegación | React Router 6 |
| Peticiones HTTP | axios |
| Estilos | CSS propio de Florae y Bootstrap 5 |
| Estado global | Context API (carrito con `useReducer` y sesión) |
| Pruebas | Vitest, jsdom, React Testing Library y user-event |
| Cobertura | `@vitest/coverage-v8` |
| Despliegue | Vercel |

## Cómo levantar el proyecto

**Requisitos:** Node.js 26.3.1 o superior, npm y el backend en ejecución (ver su README).

```bash
git clone https://github.com/danielacuevasd/plant-ecommerce-r.git
cd plant-ecommerce-r
npm install
cp .env.example .env     # define VITE_API_URL (por defecto http://localhost:3000)
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend, sin `/api/v1` (ej. `http://localhost:3000`) |

### Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila la aplicación para producción (carpeta `dist/`) |
| `npm run preview` | Sirve la versión compilada para revisarla localmente |
| `npm test` | Ejecuta todas las pruebas una vez |
| `npm run test:watch` | Ejecuta las pruebas y vuelve a correrlas al guardar |
| `npm run coverage` | Ejecuta las pruebas y genera el reporte de cobertura en `coverage/` |

## Credenciales de prueba

Son los usuarios que carga el seed del backend.

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `marcelo.caceres@profesor.duoc.cl` | `admin` |
| Vendedor | `matias.fuentes@duoc.cl` | `vendedor` |
| Cliente | `camila.reyes@gmail.com` | `cliente` |

Cupones de descuento: `FLORAE10` (10 %) y `BIENVENIDO` (5 %).

## Estructura del proyecto

```
src/
├── components/   Header, Footer, layouts, ProductCard, ProductList, CartItem, CampoFormulario
├── context/      CartContext (carrito) y AuthContext (sesión)
├── hooks/        useCargar (carga de datos con estados de carga y error)
├── services/     api.js (axios, JWT) y un servicio por recurso
├── data/         categorias.js y regiones.js
├── pages/        Vistas de la tienda; pages/admin contiene las vistas del panel
├── styles/       estilos.css, admin.css y extras.css
├── utils/        validaciones, reducer del carrito, filtros y formato de precios
└── __tests__/    Pruebas unitarias
docs/
├── ERS.md                  Especificación de requisitos del software
└── COBERTURA_TESTING.md    Documento de cobertura y análisis del testing
```

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Portada | Público |
| `/productos` y `/productos/:id` | Catálogo y detalle | Público |
| `/carrito` | Carrito de compras | Público |
| `/login` y `/registro` | Inicio de sesión y registro | Público |
| `/nosotros` y `/contacto` | Información y formulario de contacto | Público |
| `/admin` | Resumen del panel | Administrador |
| `/admin/productos`, `/nuevo` y `/:id/editar` | Gestión de productos | Administrador |
| `/admin/usuarios`, `/nuevo` y `/:id/editar` | Gestión de usuarios | Administrador |
| `/admin/mensajes` | Mensajes de contacto | Administrador |

## Pruebas y cobertura

Las pruebas de componentes que usan la API reemplazan los servicios con mocks (`vi.mock`), así que no necesitan el backend encendido.

| Indicador | Resultado |
|---|---|
| Archivos de prueba | _completar con `npm run coverage`_ |
| Pruebas unitarias | _completar_ |
| Cobertura de líneas | _completar_ |

El detalle está en [`docs/COBERTURA_TESTING.md`](docs/COBERTURA_TESTING.md).

## Flujo de trabajo con Git

- `main`: versión estable, la que se despliega en Vercel.
- `develop`: integración del trabajo en curso.
- `feature/*`: una rama por funcionalidad, integrada a `develop` con Pull Request.
- Mensajes de commit con prefijos: `feat`, `test`, `chore` y `docs`.

## Despliegue

El sitio se despliega en Vercel desde `main`. En Vercel hay que definir `VITE_API_URL` con la URL pública de la API, y el dominio del sitio debe estar permitido en el CORS del backend. `vercel.json` redirige todas las rutas a `index.html` para que React Router funcione al recargar.