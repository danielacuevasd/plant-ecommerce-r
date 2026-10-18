# Florae — Tienda online de plantas y jardinería

Proyecto semestral de la asignatura **DSY1104 — Desarrollo Fullstack II**. Consiste en el desarrollo de una tienda online para un vivero, construida de forma incremental a lo largo de tres evaluaciones parciales. 

Este repositorio corresponde a la **Evaluación Parcial 2**: migración del frontend a React con pruebas unitarias.

**Sitio publicado:** https://plant-ecommerce-r.vercel.app/

| | |
|---|---|
| Autora | Daniela Cuevas |
| Asignatura | DSY1104 - Desarrollo Fullstack II |
| Evaluación | Parcial 2: frontend con React y pruebas unitarias |
| Versión anterior (EP1) | https://github.com/danielacuevasd/plant-ecommerce (HTML, CSS y JavaScript) |

---

## Contexto del proyecto

El proyecto avanza en tres etapas, una por evaluación parcial:

| Etapa | Alcance | Estado |
|---|---|---|
| **EP1** | Frontend estático con HTML, CSS y JavaScript | Completada |
| **EP2** | Migración a React, datos simulados con CRUD, diseño responsivo y pruebas unitarias | **Este repositorio** |
| **EP3** | Backend con API REST y base de datos | Pendiente |

En esta etapa **no hay backend**. Los datos (productos, usuarios, carrito y sesión) se guardan en el `localStorage` del navegador a través de una capa de datos simulada (`src/data/db.js`), con operaciones de crear, leer, actualizar y eliminar.

## Funcionalidades

**Tienda (pública)**
- Portada con productos destacados, catálogo con búsqueda por texto y filtro por categoría, y detalle de producto con productos relacionados.
- Carrito con cambio de cantidades, control de stock, cupones de descuento y persistencia al recargar.
- Registro e inicio de sesión con validaciones (RUN con dígito verificador, correo con dominios permitidos y comuna según la región).
- Formulario de contacto con contador de caracteres, página "Nosotros" y página 404.

**Panel de administración (solo rol Administrador)**
- Resumen con el total de productos, usuarios y productos con stock crítico.
- Gestión de productos y de usuarios: listado, creación, edición y eliminación con confirmación.
- El administrador no puede eliminar su propia cuenta.

**Pendiente (opcional):** checkout con páginas de compra exitosa y pago con error, vistas de categorías y ofertas, y gestión de órdenes.

## Tecnologías

| Categoría | Herramienta |
|---|---|
| Framework | React con Vite |
| Navegación | React Router 6 |
| Estilos | CSS propio de Florae y Bootstrap 5 |
| Estado global | Context API (carrito con `useReducer` y sesión) |
| Pruebas | Vitest, jsdom, React Testing Library y user-event |
| Cobertura | `@vitest/coverage-v8` |
| Despliegue | Vercel |

## Cómo levantar el proyecto

**Requisitos:** Node.js 26.3.1 o superior y npm.

```bash
git clone https://github.com/danielacuevasd/plant-ecommerce-r.git
cd plant-ecommerce-r
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila la aplicación para producción (carpeta `dist/`) |
| `npm run preview` | Sirve la versión compilada para revisarla localmente |
| `npm test` | Ejecuta todas las pruebas una vez |
| `npm run test:watch` | Ejecuta las pruebas y vuelve a correrlas al guardar |
| `npm run coverage` | Ejecuta las pruebas y genera el reporte de cobertura en `coverage/` |

## Datos y credenciales de prueba

Al abrir la aplicación por primera vez se cargan 8 productos y 3 usuarios de ejemplo.

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `marcelo.caceres@profesor.duoc.cl` | `admin` |
| Vendedor | `matias.fuentes@duoc.cl` | `vendedor` |
| Cliente | `camila.reyes@gmail.com` | `cliente` |

Cupones de descuento: `FLORAE10` (10 %) y `BIENVENIDO` (5 %).

Los datos viven en el navegador, así que cada navegador y cada dispositivo tiene los suyos. Para volver a los datos iniciales, abre la consola del navegador y ejecuta `localStorage.clear()`, o borra las claves `florae_productos`, `florae_usuarios`, `florae_carrito` y `florae_sesion`, y recarga la página.

> Las contraseñas se guardan en texto plano y el control de acceso existe solo en el navegador, porque esta etapa no tiene backend. La autenticación real y el cifrado de contraseñas se abordan en la EP3.

## Estructura del proyecto

```
src/
├── components/   Header, Footer, layouts, ProductCard, ProductList, CartItem, CampoFormulario
├── context/      CartContext (carrito) y AuthContext (sesión)
├── data/         db.js (datos simulados con CRUD), categorias.js, regiones.js
├── pages/        Vistas de la tienda; pages/admin contiene las vistas del panel
├── styles/       estilos.css, admin.css y extras.css
├── utils/        validaciones, reducer del carrito, filtros y formato de precios
└── __tests__/    Pruebas unitarias
docs/
├── ERS.md                  Especificación de requisitos del software (versión 2.0)
└── COBERTURA_TESTING.md    Documento de cobertura y análisis del testing
```

La lógica (validaciones, carrito, filtros) está en funciones puras dentro de `utils`, separada de la interfaz. Eso permite probarla sin renderizar componentes.

## Rutas

| Ruta | Página |
|---|---|
| `/` | Portada |
| `/productos` y `/productos/:id` | Catálogo y detalle de producto |
| `/carrito` | Carrito de compras |
| `/login` y `/registro` | Inicio de sesión y registro |
| `/nosotros` y `/contacto` | Información y formulario de contacto |
| `/admin` | Resumen del panel (solo administradores) |
| `/admin/productos`, `/admin/productos/nuevo` y `/admin/productos/:id/editar` | Gestión de productos |
| `/admin/usuarios`, `/admin/usuarios/nuevo` y `/admin/usuarios/:id/editar` | Gestión de usuarios |

## Pruebas y cobertura

Los resultados de la última ejecución son:

| Indicador | Resultado |
|---|---|
| Archivos de prueba | 26, todos pasan |
| Pruebas unitarias | 150, todas pasan |
| Cobertura de líneas | 97,72 % |
| Cobertura de sentencias | 96,57 % |
| Cobertura de ramas | 91,45 % |
| Cobertura de funciones | 96,62 % |

Las pruebas cubren renderizado de listas, renderizado condicional, props, estado y eventos, e incluyen mocks (`vi.fn()`, `vi.spyOn(window, "confirm")` y `vi.spyOn(Storage.prototype, "setItem")`). La lógica de negocio se desarrolló con las pruebas primero: cada commit `test:` con pruebas que fallan va seguido de un commit `feat:` con la implementación.

El detalle completo (inventario de pruebas, mocks, análisis de lo no cubierto y limitaciones) está en [`docs/COBERTURA_TESTING.md`](docs/COBERTURA_TESTING.md). Después de ejecutar `npm run coverage`, el reporte navegable queda en `coverage/index.html`.

## Documentación

- [`docs/ERS.md`](docs/ERS.md): requerimientos funcionales y no funcionales, reglas de negocio, arquitectura, modelo de datos y propuesta de diseño.
- [`docs/COBERTURA_TESTING.md`](docs/COBERTURA_TESTING.md): estrategia de pruebas, cobertura y hallazgos.

## Flujo de trabajo con Git

- `main`: versión estable, la que se despliega en Vercel.
- `develop`: integración del trabajo en curso.
- `feature/*`: una rama por funcionalidad (`feature/capa-datos`, `feature/catalogo`, `feature/carrito`, `feature/auth-formularios`, `feature/panel-admin`), integrada a `develop` con Pull Request.
- Mensajes de commit con prefijos: `feat` (funcionalidad), `test` (pruebas), `chore` (configuración) y `docs` (documentación).

## Despliegue

El sitio se despliega en Vercel desde la rama `main`. El archivo `vercel.json` redirige todas las rutas a `index.html`, para que la navegación de React Router funcione al recargar cualquier página.