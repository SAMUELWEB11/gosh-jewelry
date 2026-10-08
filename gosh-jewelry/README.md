# GOSH JEWELRY — storefront premium

Prototipo e-commerce frontend, responsive y modular, construido sin framework para facilitar una primera validación visual y funcional.

## Incluye
- Header fijo con navegación desktop/mobile.
- Hero editorial con identidad negro + dorado.
- Categorías: pulseras, collares, anillos y aretes.
- Catálogo basado en un arreglo de productos (`PRODUCTS`) para crecer sin reconstruir el frontend.
- Filtros por categoría.
- Vista rápida en modal.
- Carrito lateral con cantidades, eliminación, subtotal, envío y total.
- Persistencia del carrito en `localStorage`.
- Buscador de productos.
- Newsletter.
- SEO base + JSON-LD para tienda online.
- Responsive 320px → 1920px+.
- Microinteracciones y `prefers-reduced-motion`.

## Estructura

```text
index.html
styles.css
app.js
assets/
  logo-gosh.png
  logo-gosh-solid.png
```

## Puesta en marcha

Puede abrir `index.html` directamente en el navegador. Para desarrollo, es recomendable levantar un servidor estático local, por ejemplo:

```bash
python -m http.server 8080
```

Y abrir `http://localhost:8080` dentro de la carpeta del proyecto.

## Siguiente etapa de producción

La interfaz deja puntos claros de integración para Shopify, Mercado Pago, Stripe, WhatsApp, Instagram, Meta Pixel y Google Analytics. El siguiente paso técnico sería sustituir `PRODUCTS` por una API/catálogo real y mover carrito/checkout a servicios persistentes.
