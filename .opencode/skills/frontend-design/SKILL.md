---
title: frontend-design
version: 1.0.0
author: Software Engineering Team
date: 2026-07-08
description: Regeln estrictas de UI/UX moderna, diseño responsivo/mobile-first, variables CSS para estética gaming oscura, y estados interactivos.
tagline: Estética gaming oscura con interacciones fluidas
---

## Diseño y Estructura

### Organización
- **Diseño Mobile-First**: Comenzar con diseños optimizados para dispositivos móviles, luego escalar hacia vistas de escritorio
- **Variable CSS**: Usar variables CSS para colores, espaciados y valores base para una estética consistente
- **CSS Moderno**: Utilizar Flexbox, Grid, y CSS Custom Properties

### Estética (Gaming Oscuro)
```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --accent-primary: #00ff88;
  --accent-secondary: #0088ff;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
}
```

### Comportamiento
- **Sobrescribir estilos normales**: Agregar estilos específicos cuando un elemento sea activo/hover/focus
- **Transiciones Suaves**: Todas las animaciones deben usar `transition` con valores `ease-in-out` para una sensación fluida
- **Focus States**: Always emphasize on focus state for accessibility

### Layout y Diseño Visual
- **Diseño Responsivo**: Usar media queries para adaptar el diseño al ancho de pantalla (breakpoint: 320px - 768px - 1024px)
- **Espaciado Claro**: Usar el sistema de espaciado más simple - 0, 8px, 16px, 24px, 32px, 48px, 64px
- **Contraste**: Asegurar siempre un acceso visual mínimo de 4.5:1 para la accesibilidad