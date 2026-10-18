# Documento ERS - Especificación de Requisitos del Software

- **Proyecto:** Florae - Tienda online de plantas y jardinería
- **Asignatura:** DSY1104 - Desarrollo Fullstack II
- **Versión:** 2.0 (EP2)
- **Estado:** Frontend migrado a React, con pruebas unitarias y publicado en internet
- **Repositorio:** https://github.com/danielacuevasd/plant-ecommerce-r
- **Sitio publicado:** https://plant-ecommerce-r.vercel.app/

---

## Historial de versiones

| Versión | Evaluación | Resumen de cambios |
|---|---|---|
| 1.0 | EP1 | Propuesta inicial. Frontend estático con HTML5, CSS3 y JavaScript, sin frameworks. |
| 2.0 | EP2 | Migración a React con Vite y Bootstrap. Fuente de datos simulada con CRUD. Sesión y control de acceso simulados en el frontend. Filtros de búsqueda, control de stock, rutas protegidas del administrador y página 404. Pruebas unitarias con Vitest (150 pruebas, 97,72 % de cobertura de líneas). Despliegue en Vercel. |

## 1. Introducción

Florae es una tienda online dedicada a la venta de plantas, macetas, sustratos y herramientas básicas de jardinería. El proyecto busca digitalizar la experiencia de compra de un vivero, permitiendo a los clientes explorar un catálogo, agregar productos a un carrito de compras y, en etapas posteriores, completar una compra real, mientras un equipo administrador gestiona el catálogo y los usuarios del sistema.

Este documento corresponde a la segunda versión del ERS, elaborada durante la Evaluación Parcial 2 (EP2). En esta etapa la aplicación desarrollada en la EP1 se migró a React, se incorporó una fuente de datos simulada con operaciones CRUD, se mejoró la interactividad y se construyó un proceso de pruebas unitarias para los componentes del frontend. Sigue sin existir backend ni base de datos reales.

## 2. Objetivo del proyecto

Desarrollar una aplicación web de comercio electrónico para un vivero, que permita:

- A los **clientes**, explorar el catálogo, revisar el detalle de cada producto y gestionar un carrito de compras.
- A los **vendedores**, consultar el catálogo de productos y sus pedidos.
- A los **administradores**, gestionar el catálogo completo de productos y los usuarios del sistema.

## 3. Alcance por evaluación

| Evaluación | Alcance |
|---|---|
| **EP1** (completada) | Frontend estático con HTML5, CSS3 y JavaScript vanilla. Estructura de vistas tienda y administrador, validaciones de formularios, carrito con `localStorage`. Sin backend ni base de datos. |
| **EP2** (actual) | Migración del frontend a React con Vite. Componentes reutilizables con manejo de props y estado. Fuente de datos simulada (`db.js`) con CRUD de productos y usuarios. Diseño responsivo con Bootstrap y CSS propio. Interactividad mejorada (filtros, sesión, rutas protegidas). Pruebas unitarias con Vitest y Testing Library. Despliegue en Vercel. |
| **EP3** (futura) | Integración frontend/backend mediante API REST conectada a una base de datos (RA3). |

## 4. Requerimientos funcionales

### 4.1 Vista tienda (pública)

| ID | Requerimiento |
|---|---|
| RF-01 | El sistema debe mostrar una página de inicio con información general de la tienda y cuatro productos destacados. |
| RF-02 | El sistema debe listar todos los productos disponibles, mostrando imagen, nombre y precio, con un botón para añadirlos al carrito. |
| RF-03 | El sistema debe permitir ver el detalle de un producto individual (ruta `/productos/:id`), incluyendo descripción, stock disponible y productos relacionados de la misma categoría. Si el producto no existe, debe mostrar un mensaje claro. |
| RF-04 | El sistema debe permitir agregar productos al carrito de compras desde la portada, el listado y el detalle. En el detalle, el usuario puede elegir la cantidad. |
| RF-05 | El carrito debe persistir mientras el usuario navega y al recargar la página, utilizando almacenamiento local del navegador (`localStorage`). El contador del carrito en el encabezado debe actualizarse en todo momento. |
| RF-06 | El usuario debe poder modificar la cantidad de un producto en el carrito (botones + y -) o eliminarlo. Al llegar la cantidad a 0, el producto se elimina. |
| RF-07 | El sistema debe permitir aplicar un cupón de descuento simulado sobre el total del carrito. Los cupones válidos son `FLORAE10` (10 %) y `BIENVENIDO` (5 %), sin distinguir mayúsculas. Un cupón inválido debe mostrar un error y no aplicar descuento. |
| RF-08 | El sistema debe contar con un formulario de registro de usuario, con validaciones de RUN, nombre, apellidos, correo, contraseña y dirección. La comuna debe depender de la región elegida. No se debe permitir registrar un correo ya existente. Al registrarse, el usuario inicia sesión automáticamente. |
| RF-09 | El sistema debe contar con un formulario de inicio de sesión, con validaciones y verificación de las credenciales contra los usuarios guardados. Si el usuario es administrador, se le redirige al panel de administración; en otro caso, a la tienda. |
| RF-10 | El sistema debe contar con un formulario de contacto, con nombre, correo y comentario obligatorios. El comentario admite hasta 500 caracteres y debe mostrar un contador. Al enviarse correctamente, debe mostrar una confirmación y limpiar el formulario. |
| RF-11 | El sistema debe mostrar una página "Nosotros" con información institucional de la tienda. |
| RF-19 | El listado de productos debe permitir buscar por texto (nombre o descripción corta) y filtrar por categoría, y mostrar cuántos productos coinciden. |
| RF-20 | El sistema debe controlar el stock: el carrito no puede contener más unidades de las disponibles, y un producto sin stock no puede agregarse. |
| RF-21 | El encabezado debe mostrar el nombre del usuario con sesión iniciada y un botón para cerrar sesión. El enlace al panel de administración solo debe mostrarse a los administradores. |
| RF-24 | El sistema debe mostrar una página de "Página no encontrada" cuando se accede a una ruta inexistente. |
| RF-25 | El botón "Pagar" del carrito debe simular la compra: si hay productos, vacía el carrito y muestra una confirmación; si está vacío, muestra un aviso. (El flujo de pago completo queda pendiente, ver sección 10). |

### 4.2 Vista administrador

| ID | Requerimiento |
|---|---|
| RF-12 | El sistema debe mostrar un panel de administración con el total de productos, el total de usuarios y la cantidad de productos con stock crítico. |
| RF-13 | El administrador debe poder ver un listado de todos los productos, con su código, nombre, categoría, precio, stock y estado. Un producto está en estado crítico cuando su stock es menor o igual a su stock crítico. |
| RF-14 | El administrador debe poder crear un nuevo producto, indicando código, nombre, descripción, precio, stock, stock crítico, categoría e imagen, con validación de los campos. |
| RF-15 | El administrador debe poder editar un producto existente (con sus datos precargados) y eliminarlo, previa confirmación. |
| RF-16 | El administrador debe poder ver un listado de todos los usuarios registrados, con su RUN, nombre, correo y tipo de usuario. |
| RF-17 | El administrador debe poder crear un nuevo usuario, indicando RUN, nombre, apellidos, correo, contraseña, tipo de usuario, región, comuna y dirección, con validación de los campos y sin permitir correos repetidos. |
| RF-18 | El administrador debe poder editar un usuario existente (conservando su propio correo) y eliminarlo, previa confirmación. |
| RF-22 | Las rutas del panel de administración (`/admin/*`) solo deben ser accesibles para usuarios de tipo Administrador. Cualquier otro visitante debe ser redirigido al inicio de sesión. |
| RF-23 | El administrador no debe poder eliminar la cuenta con la que tiene la sesión iniciada. |

### 4.3 Capa de datos simulada

| ID | Requerimiento |
|---|---|
| RF-26 | El sistema debe contar con un archivo de datos (`src/data/db.js`) que actúe como fuente de datos simulada, con funciones de creación, lectura, actualización y eliminación (CRUD) de productos y usuarios, y datos iniciales de ejemplo. |
| RF-27 | Los datos deben persistir en `localStorage`. Si el contenido guardado no existe o está dañado, el sistema debe volver a los datos iniciales. |
| RF-28 | Los componentes de React deben leer y modificar los datos a través de esa capa, de modo que la interfaz se actualice con los cambios (por ejemplo, un producto eliminado en el admin deja de aparecer en la tienda). |

### 4.4 Roles del sistema

| Rol | Permisos |
|---|---|
| **Cliente** | Puede acceder a la vista pública de la tienda (explorar catálogo, usar el carrito, registrarse e iniciar sesión). No puede acceder al panel de administración. |
| **Vendedor** | Definido en los datos y en el formulario de usuarios. Por ahora tiene los mismos permisos que un cliente, porque la vista de órdenes que debía consultar aún no está implementada. |
| **Administrador** | Tiene acceso total al panel: gestión de productos y usuarios. |

> Nota: en esta etapa el control de acceso existe solo en el navegador. Las rutas del panel están protegidas y la sesión se guarda en `localStorage`, pero una persona con conocimientos técnicos podría modificar ese almacenamiento. La seguridad real (autenticación en el servidor, contraseñas cifradas y autorización por rol) requiere un backend y se aborda en la EP3.

## 5. Requerimientos no funcionales

| ID | Requerimiento |
|---|---|
| RNF-01 | El frontend debe construirse con React y Vite, organizado en componentes reutilizables, con manejo de propiedades (props) y de estado. |
| RNF-02 | El diseño debe ser consistente en todas las vistas, combinando los estilos propios de Florae (`estilos.css`, `admin.css` y `extras.css`) con Bootstrap, donde Bootstrap aporta la grilla responsiva y los controles de formulario. |
| RNF-03 | El sitio debe ser responsivo, adaptándose a escritorio, tablet y móvil: grilla de productos de 4, 3 y 2 columnas, y menú de navegación colapsable en pantallas pequeñas. |
| RNF-04 | Los formularios deben validar los datos y mostrar mensajes de error claros y específicos junto a cada campo. La lógica de validación debe implementarse como funciones independientes de la interfaz. |
| RNF-05 | El código debe organizarse con separación de responsabilidades: componentes (`components`), páginas (`pages`), estado global (`context`), datos (`data`) y funciones de lógica (`utils`). |
| RNF-06 | El proyecto debe versionarse en un repositorio Git público con ramas `main`, `develop` y `feature/*`, integración mediante Pull Requests y mensajes de commit descriptivos con prefijos (`feat`, `test`, `chore`, `docs`). |
| RNF-07 | El frontend debe contar con pruebas unitarias ejecutadas con Vitest y React Testing Library, con un mínimo de diez pruebas y al menos una de cada tipo: renderizado, renderizado condicional, props, estado y eventos. |
| RNF-08 | La lógica de negocio (validaciones, carrito, filtros y datos) debe desarrollarse con las pruebas primero, y el proyecto debe mantener una cobertura de líneas superior al 90 %. |
| RNF-09 | La aplicación debe estar desplegada en internet (Vercel), con redirección de rutas hacia `index.html` para que la navegación funcione al recargar. |
| RNF-10 | Los formularios y controles deben ser accesibles de forma básica: etiquetas asociadas a cada campo, mensajes de error anunciados (`role="alert"`), campos marcados con `aria-invalid` cuando tienen error y navegación identificada con `aria-label`. |

## 6. Reglas de negocio y de validación

| Regla | Detalle |
|---|---|
| RUN | Entre 7 y 9 caracteres, sin puntos ni guion, solo números y una K opcional al final. El dígito verificador se valida con el algoritmo módulo 11. |
| Correo | Formato válido, máximo 100 caracteres y solo dominios `duoc.cl`, `profesor.duoc.cl` o `gmail.com`. Debe ser único entre los usuarios (sin distinguir mayúsculas). |
| Contraseña | Entre 4 y 10 caracteres. Se confirma al registrarse. |
| Nombre y apellidos | Obligatorios. Nombre hasta 50 caracteres y apellidos hasta 100. |
| Dirección | Obligatoria, hasta 300 caracteres. La comuna debe pertenecer a la región elegida. |
| Comentario de contacto | Obligatorio, hasta 500 caracteres. |
| Código de producto | Al menos 3 caracteres. |
| Precio | Número mayor o igual a 0. |
| Stock y stock crítico | Enteros mayores o iguales a 0. El stock crítico es opcional. |
| Cupones | `FLORAE10` descuenta 10 % y `BIENVENIDO` descuenta 5 % sobre el subtotal. |
| Tope de stock | La cantidad en el carrito nunca supera el stock del producto. |
| Stock crítico | Un producto se considera crítico cuando `stock <= stockCritico`. |

## 7. Herramientas y tecnologías

| Categoría | Herramienta |
|---|---|
| Framework | React con Vite |
| Navegación | React Router 6 |
| Estilos | CSS propio (`estilos.css`, `admin.css`, `extras.css`) y Bootstrap 5 |
| Estado global | Context API de React (carrito con `useReducer` y sesión) |
| Persistencia temporal | `localStorage` del navegador (productos, usuarios, carrito y sesión) |
| Pruebas | Vitest, jsdom, React Testing Library, user-event y jest-dom |
| Cobertura | `@vitest/coverage-v8` |
| Control de versiones | Git y GitHub (repositorio público: `plant-ecommerce-r`) |
| Despliegue | Vercel |
| Diseño de referencia | Figma Make (prototipo visual, no utilizado como código) |
| Planificado para la EP3 | API REST y base de datos |

## 8. Arquitectura del frontend

```
src/
├── components/   Header, Footer, layouts, ProductCard, ProductList, CartItem, CampoFormulario
├── context/      CartContext (carrito) y AuthContext (sesión)
├── data/         db.js (datos simulados con CRUD), categorias.js, regiones.js
├── pages/        Vistas de la tienda y pages/admin (vistas del panel)
├── styles/       estilos.css, admin.css, extras.css
├── utils/        validaciones.js, carritoReducer.js, filtros.js, formato.js
└── __tests__/    Pruebas unitarias
```

Decisiones de diseño principales:

- **Lógica separada de la interfaz.** Las validaciones, el carrito y los filtros son funciones puras en `utils`, por lo que se prueban sin renderizar componentes.
- **Estado global solo cuando hace falta.** El carrito y la sesión viven en contextos porque varios componentes dependen de ellos (por ejemplo, el contador del encabezado). El resto del estado (valores de formularios, mensajes) es local a cada página.
- **Componentes reutilizables.** `CampoFormulario` unifica etiqueta, campo y mensaje de error en todos los formularios; `ProductCard` y `ProductList` se usan en la portada, el catálogo y los productos relacionados; y un mismo formulario sirve para crear y editar productos y usuarios.

## 9. Modelo de datos simulado

Los datos se guardan en `localStorage` con las siguientes claves: `florae_productos`, `florae_usuarios`, `florae_carrito` y `florae_sesion`.

**Producto**

| Campo | Tipo | Observación |
|---|---|---|
| `id` | Número | Autoincremental |
| `codigo` | Texto | Mínimo 3 caracteres |
| `nombre` | Texto | Hasta 100 caracteres |
| `descripcion` | Texto | Opcional, hasta 500 caracteres |
| `descripcionCorta` | Texto | Primeros 80 caracteres de la descripción |
| `categoria` | Texto | `interior`, `exterior`, `macetas`, `sustratos` o `herramientas` |
| `precio` | Número | Mayor o igual a 0 |
| `stock` | Entero | Mayor o igual a 0 |
| `stockCritico` | Entero | Opcional |
| `imagen` | Texto | Ruta de la imagen |

**Usuario**

| Campo | Tipo | Observación |
|---|---|---|
| `id` | Número | Autoincremental |
| `run` | Texto | 7 a 9 caracteres, dígito verificador válido |
| `nombre`, `apellidos` | Texto | Obligatorios |
| `correo` | Texto | Único, dominios permitidos |
| `contrasena` | Texto | 4 a 10 caracteres (en texto plano solo por ser una simulación) |
| `tipo` | Texto | `Administrador`, `Vendedor` o `Cliente` |
| `fechaNacimiento` | Fecha | Opcional |
| `region`, `comuna`, `direccion` | Texto | Obligatorios |

**Sesión:** guarda `id`, `nombre`, `correo` y `tipo`, nunca la contraseña.
**Carrito:** guarda una lista de `{ id, cantidad }` y el código del cupón aplicado.

## 10. Propuesta de diseño

### 10.1 Identidad de marca

- **Nombre:** Florae
- **Estilo:** cálido, natural, editorial. Combina tipografía serif para títulos con sans-serif para texto de cuerpo.

### 10.2 Paleta de colores

| Color | Uso | Código |
|---|---|---|
| Crema | Fondo principal | `#F5F1E8` |
| Verde oscuro | Textos destacados, botones principales, header/footer | `#33402A` |
| Terracota | Acentos, enlaces destacados | `#C1633D` |
| Blanco | Tarjetas, formularios | `#FFFFFF` |

### 10.3 Tipografía

- Títulos: fuente serif (Lora, con Georgia como respaldo).
- Texto de cuerpo: fuente sans-serif (Inter, con Segoe UI como respaldo).

> Nota: la integración de Google Fonts para cargar las tipografías reales sigue pendiente; actualmente se utilizan las fuentes de respaldo del sistema.

### 10.4 Diseño responsivo

Se combinan Bootstrap y CSS propio. La grilla de productos usa las clases de columnas de Bootstrap (2 columnas en móvil, 3 en tablet y 4 en escritorio). El menú de navegación se colapsa en pantallas pequeñas y se abre con un botón. Los campos de búsqueda se apilan en móvil y se ubican en una fila en pantallas medianas.

## 11. Estructura de páginas (sitemap)

```
Tienda (pública)
├── Home                          /
├── Productos                     /productos
│   └── Detalle de producto       /productos/:id
├── Registro                      /registro
├── Login                         /login
├── Nosotros                      /nosotros
├── Contacto                      /contacto
├── Carrito                       /carrito
└── Página no encontrada          cualquier otra ruta

Administrador (solo rol Administrador)
├── Inicio (resumen)              /admin
├── Productos                     /admin/productos
│   └── Nuevo / Editar producto   /admin/productos/nuevo  y  /admin/productos/:id/editar
└── Usuarios                      /admin/usuarios
    └── Nuevo / Editar usuario    /admin/usuarios/nuevo  y  /admin/usuarios/:id/editar
```

## 12. Propuesta personalizada de la EP2

Además de migrar la aplicación de la EP1, se decidió incorporar las siguientes mejoras:

| Mejora | Motivo |
|---|---|
| Filtros de búsqueda por texto y categoría (RF-19) | Cumple el requisito de interactividad mejorada y facilita encontrar productos |
| Control de stock en el carrito (RF-20) | Evita compras de más unidades de las disponibles |
| Sesión simulada y encabezado según el usuario (RF-21) | Permite mostrar el nombre del usuario y limitar el panel de administración |
| Rutas del admin protegidas (RF-22) | El panel no debe estar abierto a cualquier visitante |
| Correo obligatorio en contacto (RF-10) | En la EP1 era opcional, pero el formulario promete una respuesta y sin correo no es posible dar una |
| Regla de cuenta propia (RF-23) | Evita que el administrador elimine su usuario y quede sin acceso |
| Corrección de los RUN de ejemplo | Los usuarios de ejemplo de la EP1 tenían un dígito verificador incorrecto, y fueron detectados por una prueba |
| Página 404 (RF-24) | Una ruta inexistente debe informar al usuario en vez de mostrar una pantalla vacía |

## 13. Estado actual del desarrollo (EP2)

- [x] Proyecto React con Vite, organizado en componentes, páginas, contextos, datos y utilidades
- [x] Migración de las 8 vistas de la tienda y las 5 vistas del administrador
- [x] Fuente de datos simulada con CRUD de productos y usuarios (`db.js`)
- [x] Carrito con contexto, persistencia, cupones y control de stock
- [x] Sesión simulada, redirección por rol y rutas del admin protegidas
- [x] Validaciones de formularios como funciones independientes
- [x] Diseño responsivo con Bootstrap y CSS propio
- [x] Pruebas unitarias con Vitest: 150 pruebas en 26 archivos
- [x] Cobertura: 96,57 % de sentencias, 91,45 % de ramas, 96,62 % de funciones y 97,72 % de líneas (ver `docs/COBERTURA_TESTING.md`)
- [x] Aplicación desplegada en Vercel
- [ ] Flujo de compra completo: checkout, compra exitosa y pago con error
- [ ] Vistas de categorías y ofertas
- [ ] Órdenes, boletas y reportes en el panel de administración, y la vista de órdenes del rol Vendedor
- [ ] Integración de tipografías Google Fonts
- [ ] Prueba del cierre de sesión (único hueco funcional detectado en la cobertura)

## 14. Pendientes y próximas etapas

- Implementar el checkout con dirección de entrega, y las vistas de compra exitosa y de pago con error.
- Agregar las vistas de categorías, ofertas y la gestión de órdenes en el panel.
- Cargar las tipografías reales con Google Fonts.
- Cubrir con pruebas el cierre de sesión y los temporizadores de la interfaz (ver el documento de cobertura).
- Diseñar el modelo de datos relacional que sustentará la integración con base de datos (EP3), a partir de las entidades de la sección 9.
- Definir el contrato de la API REST para la comunicación frontend/backend (EP3).
- Reemplazar la autenticación simulada por autenticación en el servidor, con contraseñas cifradas (EP3).

---

*Este documento corresponde a la versión 2.0 (EP2) y se actualizará de forma incremental durante el desarrollo del proyecto.*