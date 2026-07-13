(function() {
  'use strict';

  var DATA_PATH = typeof DATA_PATH !== 'undefined' ? DATA_PATH : null;
  var MOD_ID = typeof MOD_ID !== 'undefined' ? MOD_ID : null;

  if (!DATA_PATH) return;

  fetch(DATA_PATH)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (MOD_ID) renderDetail(data, MOD_ID);
      else renderCards(data);
      initPage();
    })
    .catch(function(e) {
      console.error('Error loading mods data:', e);
    });

  function renderCards(data) {
    var container = document.getElementById('mods-container');
    if (!container) return;
    var html = '';
    data.mods.forEach(function(mod) {
      html += '<article class="mod-card">';
      html += '  <img src="' + mod.imageCard + '" alt="' + mod.name + ' - Mod para 0 A.D." loading="lazy">';
      html += '  <div class="mod-card-content">';
      html += '    <h3>' + mod.name + '</h3>';
      html += '    <p>' + mod.summary + '</p>';
      html += '    <div class="mod-card-footer">';
      html += '      <small>Compatible con 0 A.D. 0.28.0</small>';
      html += '      <small>' + (mod.dependsOn ? 'Requiere: ' + getDepNames(mod.dependsOn, data) : 'Sin requisitos') + '</small>';
      html += '      <small>Español / English</small>';
      html += '      <small>v' + mod.version + '</small>';
      html += '      <a href="mods/' + mod.id + '/" class="button">Ver detalles</a>';
      html += '    </div>';
      html += '  </div>';
      html += '</article>';
    });
    container.innerHTML = html;
  }

  function renderDetail(data, modId) {
    var mod = null;
    for (var i = 0; i < data.mods.length; i++) {
      if (data.mods[i].id === modId) { mod = data.mods[i]; break; }
    }
    if (!mod) return;

    var container = document.getElementById('mod-detail-container');
    if (!container) return;

    var html = '';

    var prefix = MOD_ID ? '../../' : '';

    // Header
    html += '<div class="mod-detail-header">';
    html += '  <div class="mod-detail-image">';
    html += '    <img src="' + prefix + mod.imageLarge + '" alt="' + mod.name + ' - Mod para 0 A.D." loading="lazy">';
    html += '  </div>';
    html += '  <div class="mod-detail-info">';
    html += '    <div class="mod-detail-title-row">';
    html += '      <h1>' + mod.name + '</h1>';
    html += '      <a href="https://github.com/freddyeleazar/0ad-mods/raw/main/assets/downloads/' + mod.id + '.zip" class="download-button">⬇️ Descargar Mod</a>';
    html += '    </div>';
    html += '    <p class="mb-3"><em>"' + mod.tagline + '"</em></p>';
    html += '    <div class="compatibility-info mb-4">';
    html += '      <span class="compatibility-badge">Versión ' + mod.version + '</span>';
    html += '      <span class="compatibility-badge">Compatible con 0 A.D. 0.28.0</span>';
    html += '      <span class="compatibility-badge">Español / English</span>';
    if (mod.dependsOn) {
      html += '      <span class="compatibility-badge">Requiere ' + getDepNames(mod.dependsOn, data) + '</span>';
    }
    html += '    </div>';
    html += '    <p class="mb-4">' + mod.summary + '</p>';
    html += '  </div>';
    html += '</div>';

    // Descripción Detallada
    html += '<section class="mb-5">';
    html += '  <h2>📝 Descripción Detallada</h2>';
    html += '  ' + mod.description;
    html += '</section>';

    // Características
    html += '<section class="mod-features mb-5">';
    html += '  <h3>✨ Características Principales</h3>';
    html += '  <ul>';
    mod.features.forEach(function(f) {
      html += '    <li>' + f + '</li>';
    });
    html += '  </ul>';
    html += '</section>';

    // Qué Esperar
    html += '<section class="mb-5">';
    html += '  <h3>🎯 ¿Qué Esperar de Este Mod?</h3>';
    html += '  <p>Con este mod podrás:</p>';
    html += '  <ul>';
    mod.whatToExpect.forEach(function(w) {
      html += '    <li>' + w + '</li>';
    });
    html += '  </ul>';
    if (mod.whatToExpectNote) {
      html += '  <p><strong>Nota:</strong> ' + mod.whatToExpectNote + '</p>';
    }
    html += '</section>';

    // Dónde Encontrarlo
    html += '<section class="game-info mb-5">';
    html += '  <h3>🔍 ¿Dónde Encontrarlo en el Juego?</h3>';
    mod.whereToFind.forEach(function(w) {
      html += '  <p>' + w + '</p>';
    });
    html += '</section>';

    // Compatibilidad
    html += '<section class="mb-5">';
    html += '  <h3>⚙️ Información de Compatibilidad</h3>';
    html += '  <div class="compatibility-info">';
    html += '    <span class="compatibility-badge">Versión del mod: ' + mod.version + '</span>';
    html += '    <span class="compatibility-badge">Versión de 0 A.D.: 0.28.0</span>';
    html += '    <span class="compatibility-badge">Idiomas: Español / English</span>';
    html += '    <span class="compatibility-badge">Plataforma: Windows, Linux, Mac</span>';
    html += '  </div>';
    if (mod.compatibilityNote) {
      html += '  <p class="mt-3"><strong>Nota:</strong> ' + mod.compatibilityNote + '</p>';
    }
    html += '</section>';

    // Instalación
    html += '<section class="installation-steps mb-5">';
    html += '  <h4>📋 Instrucciones de Instalación</h4>';
    html += '  <ol>';
    html += '    <li><strong>Descarga el mod:</strong> Haz clic en el botón de descarga de arriba.</li>';
    if (mod.dependsOn) {
      html += '    <li><strong>Asegúrate de tener los requisitos:</strong> Este mod requiere ' + getDepNames(mod.dependsOn, data) + ' instalado (descárgalo desde su página).</li>';
    }
    html += '    <li><strong>Busca la carpeta de 0 A.D.:</strong> Generalmente está en:';
    html += '      <ul>';
    html += '        <li><strong>Windows:</strong> <code>C:\\Users\\[TuUsuario]\\Documents\\My Games\\0ad\\mods</code></li>';
    html += '        <li><strong>Linux:</strong> <code>~/.local/share/0ad/mods</code></li>';
    html += '        <li><strong>Mac:</strong> <code>~/Library/Application Support/0ad/mods</code></li>';
    html += '      </ul>';
    html += '    </li>';
    html += '    <li><strong>Crea una carpeta para el mod:</strong> Crea una carpeta llamada <code>' + mod.id + '</code> dentro de la carpeta "mods".</li>';
    html += '    <li><strong>Copia los archivos:</strong> Extrae el archivo descargado y copia su contenido dentro de la carpeta <code>' + mod.id + '</code>.</li>';
    html += '    <li><strong>Abre 0 A.D.:</strong> Inicia el juego.</li>';
    html += '    <li><strong>Activa el mod:</strong> Ve a Opciones → Mods, busca "' + mod.name + '" y actívalo.</li>';
    if (mod.dependsOn) {
      html += '    <li><strong>Activa los requisitos:</strong> Asegúrate de que los mods requeridos también estén activados.</li>';
    }
    html += '    <li><strong>¡Listo!</strong> Ya puedes disfrutar del mod en tu juego.</li>';
    html += '  </ol>';
    html += '</section>';

    // Créditos
    html += '<section class="mb-5">';
    html += '  <h3>👥 Créditos</h3>';
    html += '  <p><strong>Autor:</strong> freddyeleazar</p>';
    html += '  <p><strong>Versión:</strong> ' + mod.version + '</p>';
    html += '  <p><strong>Licencia:</strong> GPL v2 (como 0 A.D.)</p>';
    html += '</section>';

    // Volver
    html += '<div class="text-center mt-5">';
    html += '  <a href="../../index.html" class="button">← Volver a todos los mods</a>';
    html += '</div>';

    container.innerHTML = html;
  }

  function getDepNames(depIds, data) {
    var names = [];
    depIds.forEach(function(id) {
      for (var i = 0; i < data.mods.length; i++) {
        if (data.mods[i].id === id) {
          names.push(data.mods[i].name);
          break;
        }
      }
    });
    return names.join(', ');
  }

  function initPage() {
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Fade-in effect for cards
    if (!MOD_ID) {
      var cards = document.querySelectorAll('.mod-card');
      cards.forEach(function(card, index) {
        card.style.animationDelay = (index * 0.1) + 's';
        card.classList.add('fade-in');
      });
    }
  }
})();
