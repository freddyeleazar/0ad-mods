---
title: clean-web-architecture
version: 1.0.0
author: Software Engineering Team
date: 2026-07-08
description: Directrices para organizar assets en /assets/css/, /assets/js/, y /assets/images/, modularizar con PHP en /includes/, y prohibir estilos inline.
tagline: Estructura de proyectos limpia y escalable
---

## Estructuras de Archivos

### Layout de Proyectos
```
/project-root/
├── assets/
│   ├── css/              # Archivos CSS (mínimo 2 archivos)
│   │   ├── main.css     # CSS principal
│   │   └── responsive.css # Ajustes responsivos
│   ├── js/              # Scripts JavaScript (mínimo 2 archivos)
│   │   ├── main.js     # Lógica principal
│   │   └── components/ # Componentes modulares
│   └── images/          # Todos los archivos de imagen PNG, WEBP
└── includes/            # Archivos PHP (mínimo 3 archivos)
    ├── header.php      # Elementos de header
    ├── footer.php      # Elementos de footer
    └── config.php      # Configuraciones globales
```

### Organización de Assets
- **CSS**: Mínimo 2 archivos, archivos separados para componentes estructurales y lógicos
- **JS**: Mínimo 2 archivos, usar patrón de modulación para organizar componentes
- **Images**: Comprimir todas las imágenes, usar formato optimizado para el navegador (WEBP)
- **No Patrones Permitidos**: No enfoques tipo "todo en un solo archivo"

### Código PHP
- **Modularización**: Usar plantilla de diseño para dividir archivos PHP
- **Prohibir estilos inline**: Todos los estilos deben estar en un archivo CSS separado
- **No estilos inline**: Prohibir `style="width:100px"` entre todas las páginas