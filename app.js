/* ════════════════════════════════════════════════════════════
   DECISION PILOT IA — app.js
   Responsabilidad: orquestar la interfaz.
   NO contiene lógica de prompts (eso es prompts.js).

   Flujo:
   1. Inicializar → 2. Cambio de caso → 3. Validar
   4. Construir prompt → 5. Mostrar → 6. Copiar
════════════════════════════════════════════════════════════ */


/* ──────────────────────────────────────────
   1. INICIALIZACIÓN
   Se ejecuta cuando el DOM está completamente cargado.
────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ── Referencias a elementos del DOM ────────────────────

  // Selector de caso (todos los radios con name="caso")
  const radios         = document.querySelectorAll('input[name="caso"]');

  // Campos del formulario
  const campoContexto  = document.getElementById('campo-contexto');
  const campoDecision  = document.getElementById('campo-decision');
  const campoDatos     = document.getElementById('campo-datos');
  const campoRestr     = document.getElementById('campo-restricciones');

  // Botones
  const btnGenerar     = document.getElementById('btn-generar');
  const btnLimpiar     = document.getElementById('btn-limpiar');
  const btnCopiar      = document.getElementById('btn-copiar');

  // Zona de salida
  const placeholder    = document.getElementById('prompt-placeholder');
  const promptTexto    = document.getElementById('prompt-texto');
  const outputMeta     = document.getElementById('output-meta');
  const metaCasoLabel  = document.getElementById('meta-caso-label');
  const metaChars      = document.getElementById('meta-chars');

  // ── Registro de eventos ─────────────────────────────────

  // Cambio de caso → precarga ejemplos
  radios.forEach(radio =>
    radio.addEventListener('change', () => {
      limpiarValidacion();
      resetearOutput();
      cargarEjemplo(obtenerCasoActivo());
    })
  );

  // Botón principal → genera el prompt
  btnGenerar.addEventListener('click', generarPrompt);

  // Botón limpiar → resetea campos y output
  btnLimpiar.addEventListener('click', () => {
    limpiarValidacion();
    resetearOutput();
  });

  // Botón copiar → escribe en portapapeles
  btnCopiar.addEventListener('click', copiarPrompt);

  // ── Estado inicial: cargar ejemplo del primer caso ──────
  cargarEjemplo(obtenerCasoActivo());

});


/* ──────────────────────────────────────────
   2. CAMBIO DE CASO — Datos de ejemplo
   Lee el caso activo y rellena los campos
   con la muestra definida en prompts.js.
────────────────────────────────────────── */

/**
 * Devuelve el value del radio actualmente seleccionado.
 * @returns {string} Identificador del caso activo.
 */
function obtenerCasoActivo() {
  const seleccionado = document.querySelector('input[name="caso"]:checked');
  return seleccionado ? seleccionado.value : '';
}

/**
 * Rellena los cuatro campos con datos de ejemplo
 * del caso indicado, tomados de prompts.js.
 * Si el caso no tiene ejemplos definidos, limpia los campos.
 *
 * @param {string} caso - Valor del radio seleccionado.
 */
function cargarEjemplo(caso) {
  // EJEMPLOS está definido en prompts.js
  const datos = (typeof EJEMPLOS !== 'undefined' && EJEMPLOS[caso])
    ? EJEMPLOS[caso]
    : { contexto: '', decision: '', datos: '', restricciones: '' };

  document.getElementById('campo-contexto').value     = datos.contexto;
  document.getElementById('campo-decision').value     = datos.decision;
  document.getElementById('campo-datos').value        = datos.datos;
  document.getElementById('campo-restricciones').value = datos.restricciones;
}


/* ──────────────────────────────────────────
   3. VALIDACIÓN
   Comprueba que los campos obligatorios
   no estén vacíos antes de generar.
────────────────────────────────────────── */

/**
 * Valida los campos obligatorios del formulario.
 * Marca visualmente los campos inválidos.
 * @returns {boolean} true si el formulario es válido.
 */
function validarFormulario() {
  const camposObligatorios = [
    { el: document.getElementById('campo-contexto'),  nombre: 'Contexto general' },
    { el: document.getElementById('campo-decision'),  nombre: 'Decisión a tomar' },
  ];

  let valido = true;

  camposObligatorios.forEach(({ el, nombre }) => {
    // Elimina estado previo de error
    el.removeAttribute('aria-invalid');
    el.style.borderColor = '';

    if (!el.value.trim()) {
      el.setAttribute('aria-invalid', 'true');
      el.style.borderColor = '#dc2626';    // rojo de error (CSS ya tiene la variable)
      el.focus();
      valido = false;
    }
  });

  if (!valido) {
    mostrarMensaje('Completa al menos los campos Contexto y Decisión antes de generar.');
  }

  return valido;
}

/**
 * Elimina los marcadores visuales de validación.
 */
function limpiarValidacion() {
  ['campo-contexto', 'campo-decision', 'campo-datos', 'campo-restricciones']
    .forEach(id => {
      const el = document.getElementById(id);
      el.removeAttribute('aria-invalid');
      el.style.borderColor = '';
    });
}


/* ──────────────────────────────────────────
   4. CONSTRUIR PROMPT
   Recoge los valores del formulario y llama
   a construirPrompt() definida en prompts.js.
────────────────────────────────────────── */

/**
 * Orquesta la generación del prompt completo:
 * valida → recoge datos → llama a prompts.js → muestra resultado.
 */
function generarPrompt() {
  limpiarValidacion();

  if (!validarFormulario()) return;

  const caso   = obtenerCasoActivo();
  const campos = {
    contexto:      document.getElementById('campo-contexto').value.trim(),
    decision:      document.getElementById('campo-decision').value.trim(),
    datos:         document.getElementById('campo-datos').value.trim(),
    restricciones: document.getElementById('campo-restricciones').value.trim(),
  };

  // construirPrompt está definida en prompts.js
  if (typeof construirPrompt !== 'function') {
    mostrarMensaje('Error: no se encontró prompts.js. Verifica que el archivo está cargado.');
    return;
  }

  const textoGenerado = construirPrompt(caso, campos);

  mostrarOutput(textoGenerado, caso);
}


/* ──────────────────────────────────────────
   5. MOSTRAR RESULTADO
   Inyecta el prompt en el DOM y actualiza
   los metadatos del panel de salida.
────────────────────────────────────────── */

/**
 * Nombres legibles de cada caso para el badge de metadatos.
 */
const NOMBRES_CASO = {
  'admision':           '🎓 Admisión y becas',
  'it-support':         '🖥️ Soporte TI',
  'ecommerce-fraude':   '📦 E-commerce / Fraude',
  'documentacion-corp': '📋 Documentación corp.',
};

/**
 * Muestra el prompt generado en la zona de output
 * y actualiza el badge de metadatos.
 *
 * @param {string} texto - Prompt completo a mostrar.
 * @param {string} caso  - Identificador del caso activo.
 */
function mostrarOutput(texto, caso) {
  const placeholder   = document.getElementById('prompt-placeholder');
  const promptTexto   = document.getElementById('prompt-texto');
  const outputMeta    = document.getElementById('output-meta');
  const metaCasoLabel = document.getElementById('meta-caso-label');
  const metaChars     = document.getElementById('meta-chars');
  const btnCopiar     = document.getElementById('btn-copiar');

  // Inyectar texto y alternar visibilidad
  promptTexto.textContent    = texto;
  promptTexto.removeAttribute('hidden');
  promptTexto.removeAttribute('aria-hidden');
  placeholder.hidden         = true;

  // Activar botón de copiar
  btnCopiar.disabled         = false;

  // Metadatos
  metaCasoLabel.textContent  = NOMBRES_CASO[caso] || caso;
  metaChars.textContent      = `${texto.length.toLocaleString('es-ES')} caracteres`;
  outputMeta.removeAttribute('hidden');

  // Desplazar al resultado suavemente
  document.getElementById('panel-output')
    .scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Resetea la zona de output a su estado vacío inicial.
 */
function resetearOutput() {
  const placeholder   = document.getElementById('prompt-placeholder');
  const promptTexto   = document.getElementById('prompt-texto');
  const outputMeta    = document.getElementById('output-meta');
  const btnCopiar     = document.getElementById('btn-copiar');

  promptTexto.textContent  = '';
  promptTexto.hidden       = true;
  promptTexto.setAttribute('aria-hidden', 'true');
  placeholder.hidden       = false;
  outputMeta.hidden        = true;
  btnCopiar.disabled       = true;

  // Limpiar estado "copiado" si quedó activo
  btnCopiar.classList.remove('copiado');
  btnCopiar.innerHTML = '<span class="btn-icon" aria-hidden="true">⎘</span> Copiar';
}


/* ──────────────────────────────────────────
   6. COPIAR AL PORTAPAPELES
   Usa la Clipboard API moderna con fallback
   visual si el navegador bloquea el acceso.
────────────────────────────────────────── */

/**
 * Copia el contenido de #prompt-texto al portapapeles.
 * Ofrece feedback visual en el botón durante 2 segundos.
 */
async function copiarPrompt() {
  const btnCopiar   = document.getElementById('btn-copiar');
  const promptTexto = document.getElementById('prompt-texto');
  const texto       = promptTexto.textContent;

  if (!texto) return;

  try {
    await navigator.clipboard.writeText(texto);
    // Confirmación visual: éxito
    btnCopiar.classList.add('copiado');
    btnCopiar.innerHTML = '<span class="btn-icon" aria-hidden="true">✓</span> ¡Copiado!';
  } catch {
    // Fallback: el navegador bloqueó el portapapeles
    mostrarMensaje('No se pudo copiar automáticamente. Selecciona el texto manualmente (Ctrl+A / Cmd+A).');
    return;
  }

  // Restaurar botón tras 2 segundos
  setTimeout(() => {
    btnCopiar.classList.remove('copiado');
    btnCopiar.innerHTML = '<span class="btn-icon" aria-hidden="true">⎘</span> Copiar';
  }, 2000);
}


/* ──────────────────────────────────────────
   UTILIDAD — Mensajes de aviso
   Muestra un aviso temporal no intrusivo
   sobre el formulario sin usar alert().
────────────────────────────────────────── */

/**
 * Inserta un mensaje de aviso encima del botón "Generar"
 * y lo elimina automáticamente después de 4 segundos.
 *
 * @param {string} texto - Mensaje a mostrar al usuario.
 */
function mostrarMensaje(texto) {
  // Evitar duplicados
  const existente = document.getElementById('aviso-temporal');
  if (existente) existente.remove();

  const aviso = document.createElement('p');
  aviso.id          = 'aviso-temporal';
  aviso.textContent = texto;
  aviso.setAttribute('role', 'alert');
  aviso.setAttribute('aria-live', 'assertive');

  // Estilos inline mínimos para no depender de clases extra en CSS
  Object.assign(aviso.style, {
    margin:       '0 0 0.75rem',
    padding:      '0.6rem 1rem',
    background:   '#fef2f2',
    border:       '1px solid #fca5a5',
    borderRadius: '6px',
    color:        '#991b1b',
    fontSize:     '0.875rem',
    lineHeight:   '1.5',
  });

  // Insertar antes del botón "Generar"
  const acciones = document.querySelector('.form-actions');
  acciones.parentNode.insertBefore(aviso, acciones);

  // Auto-eliminar tras 4 segundos
  setTimeout(() => aviso.remove(), 4000);
}
