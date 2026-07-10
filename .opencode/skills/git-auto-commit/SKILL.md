---
title: git-auto-commit
version: 1.0.0
author: Software Engineering Team
date: 2026-07-08
description: Instrucciones para analizar git diff y redactar commits semánticos bajo el estándar de Conventional Commits. Usar tipos com feat, fix, docs, refactor, y un tipo personalizado 'asset' para archivos de mods.
tagline: Commits semánticos automatizados con contribuciones a mods
---

## Direcciones de Commit

### Tipos Normales
- **feat**: Nuevas características de la aplicación (funciones, demos nuevas)
- **fix**: Correcciones de errores y problemas (bugs, fallos, notworking)
- **docs**: Enlaces a cambios frecuentes (README, CHANGELOG, documentación del sitio)
- **refactor**: Refactorización de código (renombres, eliminaciones de código, eliminaciones de patrones)
- **style**: Arquitectura y estilo (formato específico, ordenado y estilizado)
- **test**: Correcciones y pruebas (ensayos, unidades de prueba, function test)

### Tipo Personalizado
- **asset**: Nuevos archivos de mods subidos para los Mods del sitio

### Formato
```bash
git add .
if git diff --cached --quiet; then
  echo "No changes detected. Nothing to commit."
else
  git diff --cached | cat
  echo -e "\n---\nEnter your commit message: "
  read -r commit_message
  echo "$commit_message" | git commit -F -
fi
```

### Ejemplo Edit
```
$ git diff --cached
--- a/includes/config.inc.php
+++ b/includes/config.inc.php
@@ -1,7 +1,7 @@
-<?php $host = 'localhost' ; ?>
+<?php
+   $host = 'localhost';
+   $db = 'gamestudio';
     $user = 'admin';
     $pass = 'secret';
-?>
+?> 

$ Edit "config.inc.php"
$ git add includes/config.inc.php
$ git commit -m "docs: update configuration format"
```

### Ejemplo Add  
```
$ git diff --cached
--- /dev/null
+++ b/assets/images/game-mod-cover.webp
@@ -0,0 +1,2 @@
+/* mod cover image */
+宽:1920px; 高:1080px;

$ Edit "assets/images/game-mod-cover.webp"
$ git add assets/images/game-mod-cover.webp
$ git commit -m "asset: upload game mod cover image"
```