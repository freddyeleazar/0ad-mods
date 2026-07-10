---
title: production-ready-hosting
version: 1.0.0
author: Software Engineering Team
date: 2026-07-08
description: Reglas para usar rutas relativas, nombres de archivos en minúsculas sin espacios, y configuraciones separadas para credenciales de bases de datos.
tagline: Optimizado para infraestructura de producción en hosting
---

## Configuración Hostings

### Estandares PHP
- **Rutas Relativas**: Usar siempre rutas relativas para recursos CSS, imágenes, y archivos JS
- **Nombres de Archivos**: Usar minúsculas sin espacios (style.css, about-me.html)
- **Tree Structure**:
```
/project/
├── index.php
├── about.php
├── mods/
│   ├── mod1.php
│   ├── mod2.php
│   └── index.php
├── assets/
│   ├── css/
│   │   └── main.css
│   └── images/
│       └── logo.png
└── config.inc.php
```

### Configuraciones de Base de Datos
- **Archivo Separado**: Siempre usar `config.inc.php` para credenciales de bases de datos
  ```php
  // config.inc.php
  <?php
  $host = 'localhost';
  $db = 'gamestudio';
  $user = 'admin';
  $pass = 'secret123';
  ?>
  ```
- **Prohibir inline credentials**: No codificar credenciales de bases de datos en scripts PHP

### Paths relativas
- **CSS**: `<link rel="stylesheet" href="assets/css/main.css">`
- **JS**: `<script src="assets/js/main.js"></script>`
- **Images**: `<img src="assets/images/logo.png" alt="Gaming Logo">`
- **Inclusion PHP**: `include 'includes/header.php'`