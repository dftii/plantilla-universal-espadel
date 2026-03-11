# 🎾 Plantilla Universal Espadel

Una plantilla web completa, moderna y responsive para clubs de pádel.

## ✨ Características

- **Diseño responsive** — funciona perfectamente en móvil, tablet y escritorio
- **Secciones incluidas**:
  - Hero con llamada a la acción
  - Estadísticas animadas del club
  - Instalaciones
  - Servicios (clases, ligas)
  - Torneos y eventos
  - Membresías / precios
  - Formulario de reserva de pista
  - Contacto
  - Footer completo
- **Formularios con validación** en el lado del cliente
- **Sin dependencias externas** — HTML, CSS y JavaScript puros
- **Accesible** — respeta `prefers-reduced-motion`, `aria-label`, foco de teclado

## 📂 Estructura del proyecto

```
plantilla-universal-espadel/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos (CSS custom properties, responsive)
├── js/
│   └── main.js         # Interactividad (nav, contadores, formularios)
└── README.md
```

## 🚀 Uso

1. Clona o descarga este repositorio.
2. Abre `index.html` en tu navegador, o sírvelo desde cualquier servidor estático.
3. Personaliza los textos, colores y contenido en `index.html` y `css/styles.css`.

### Personalización rápida

Los colores principales se definen como CSS custom properties en `:root` dentro de `styles.css`:

```css
:root {
  --color-primary: #00b894;       /* Color principal (verde espadel) */
  --color-primary-dark: #00927a;
  --color-secondary: #2d3436;     /* Color oscuro / texto */
  --color-accent: #fdcb6e;        /* Color acento */
}
```

### Integrar un backend real

Los formularios de reserva y contacto simulan el envío con un `setTimeout`. Reemplaza esa sección en `js/main.js` con tu llamada real a la API:

```js
// Ejemplo con fetch
fetch('/api/reservas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(new FormData(reservaForm)))
})
  .then(res => res.json())
  .then(data => { /* mostrar éxito */ })
  .catch(() => { /* mostrar error */ });
```

## 🌐 Compatibilidad

Compatible con todos los navegadores modernos (Chrome, Firefox, Safari, Edge).

## 📄 Licencia

MIT
