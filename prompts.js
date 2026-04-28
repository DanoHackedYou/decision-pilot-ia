/* ════════════════════════════════════════════════════════════
   DECISION PILOT IA — prompts.js
   Responsabilidad: construir prompts estructurados por caso.

   Exports globales que app.js consume:
   · EJEMPLOS         → datos de demo precargados por caso
   · construirPrompt  → función principal de construcción
════════════════════════════════════════════════════════════ */


/* ──────────────────────────────────────────
   PROMPT MAESTRO
   Bloque de instrucciones común a los 4 casos.
   Define el rol, el protocolo de análisis y el
   formato exacto de salida que debe devolver la IA.
────────────────────────────────────────── */

const PROMPT_MAESTRO = `
Eres un consultor experto en análisis de decisiones complejas.
Tu misión es ayudar al usuario a estructurar su situación, evaluar alternativas
con rigor y emitir una recomendación accionable.

PROTOCOLO DE ANÁLISIS OBLIGATORIO
Responde SIEMPRE en este orden y con estos encabezados exactos:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. RESUMEN DEL PROBLEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sintetiza la situación en 3-4 frases. Identifica el tipo de decisión
(táctica, estratégica, operativa) y el nivel de urgencia (alta/media/baja).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. DECISIÓN REAL A TOMAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Formula la pregunta decisional en una sola oración clara y accionable.
Indica quién tiene la autoridad final para decidir y en qué plazo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. DATOS FALTANTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lista los datos críticos que NO se han proporcionado y que podrían cambiar
la recomendación. Clasifica cada uno como BLOQUEANTE o DESEABLE.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. TRES ALTERNATIVAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Propón exactamente tres alternativas de acción. Cada una debe ser
materialmente diferente (no variantes cosméticas de la misma idea).
Formato por alternativa:
  · NOMBRE: etiqueta corta
  · DESCRIPCIÓN: qué implica concretamente
  · SUPUESTO CLAVE: qué debe ser verdad para que funcione

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. COMPARACIÓN DE ALTERNATIVAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Compara las tres alternativas en una tabla con las siguientes columnas:
Alternativa | Beneficio principal | Riesgo principal | Coste/Esfuerzo | Reversibilidad
Usa escala: Alto / Medio / Bajo donde aplique.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. RECOMENDACIÓN RAZONADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recomienda UNA alternativa. Justifica con los datos disponibles por qué
supera a las otras dos. Señala explícitamente los riesgos que asume quien decide.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. QUÉ AUTOMATIZAR Y QUÉ MANTENER BAJO CONTROL HUMANO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Divide el proceso decisional en tareas. Para cada tarea indica:
  · AUTOMATIZABLE con IA: por qué y con qué herramienta o criterio
  · REQUIERE JUICIO HUMANO: por qué no debe delegarse a un sistema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. KPIs DE SEGUIMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Propón entre 3 y 5 indicadores concretos para medir si la decisión
está funcionando. Incluye: nombre del KPI, cómo medirlo y umbral de alerta.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. VEREDICTO FINAL: GO / NO-GO / GO CON CONDICIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Emite uno de los tres veredictos posibles:
  · GO             → procede sin condiciones adicionales
  · NO-GO          → no procede; indica qué debe cambiar para reconsiderar
  · GO CON CONDICIONES → procede solo si se cumplen las condiciones que lista

Cierra con una sola frase de 20 palabras máximo que resuma la esencia de tu recomendación.

REGLAS DE FORMATO
- No uses lenguaje vago como "podría", "quizás" o "depende" sin concretar de qué depende.
- Sé directo. El usuario necesita decidir, no reflexionar indefinidamente.
- Si los datos son insuficientes para un análisis riguroso, dilo en la sección 3
  pero completa el análisis con los supuestos explícitos que hayas tenido que asumir.
- Responde en el mismo idioma en que esté redactado el contexto del usuario.
`.trim();


/* ──────────────────────────────────────────
   INSTRUCCIONES ESPECÍFICAS POR CASO
   Cada objeto amplía el prompt maestro con
   el rol experto, el vocabulario técnico y
   los criterios propios del dominio.
────────────────────────────────────────── */

const INSTRUCCIONES_CASO = {

  /* ── Caso 1: Admisión y becas universitarias ── */
  'admision': `
ROL EXPERTO
Actúas como director de admisiones con experiencia en política de becas,
financiación universitaria y cumplimiento normativo en educación superior.

FOCO DEL ANÁLISIS
- Equidad vs. meritocracia: pondera ambos criterios explícitamente.
- Sostenibilidad financiera de la institución a corto y medio plazo.
- Riesgo de sesgo en los criterios de selección (edad, género, origen).
- Impacto reputacional de la decisión de beca en la marca universitaria.
- Marco legal aplicable: normativa de igualdad de oportunidades y LOPD.

VOCABULARIO TÉCNICO REQUERIDO
Usa estos términos cuando corresponda:
tasa de conversión de solicitantes, índice de retención, ROI social de la beca,
criterio de desempate, cláusula de mantenimiento de beca, abandono temprano.
  `.trim(),

  /* ── Caso 2: Tickets internos de soporte TI ── */
  'it-support': `
ROL EXPERTO
Actúas como responsable de operaciones TI con experiencia en ITIL,
gestión de incidencias y acuerdos de nivel de servicio (SLA).

FOCO DEL ANÁLISIS
- Impacto en negocio: cuántos usuarios o procesos críticos están afectados.
- Clasificación ITIL: incidencia, problema, cambio o solicitud de servicio.
- SLA comprometido: tiempo de respuesta y resolución acordados.
- Escalado: cuándo y a qué nivel de soporte debe subir el ticket.
- Causa raíz vs. solución temporal (workaround): distinguir ambas.
- Riesgo de incidente de seguridad asociado al ticket.

VOCABULARIO TÉCNICO REQUERIDO
Usa estos términos cuando corresponda:
P1/P2/P3/P4 (prioridad), tiempo medio de resolución (MTTR), escalado L1/L2/L3,
workaround, problema conocido (known error), CMDB, ventana de mantenimiento.
  `.trim(),

  /* ── Caso 3: Devoluciones y fraude en e-commerce ── */
  'ecommerce-fraude': `
ROL EXPERTO
Actúas como director de operaciones de e-commerce con experiencia en
gestión de fraude, logística inversa y experiencia de cliente (CX).

FOCO DEL ANÁLISIS
- Clasificación del riesgo: fraude confirmado, fraude probable, abuso de política o devolución legítima.
- Impacto económico directo: coste de la devolución vs. valor del cliente a largo plazo (LTV).
- Señales de alerta: patrones de comportamiento, historial del cliente, anomalías en el pedido.
- Cumplimiento legal: directiva europea de devoluciones, plazos, coste de envío de retorno.
- Reputación: impacto en reviews, chargeback ratio y relación con pasarela de pago.

VOCABULARIO TÉCNICO REQUERIDO
Usa estos términos cuando corresponda:
chargeback, LTV (lifetime value), tasa de devolución, fraude amistoso,
política de devolución sin preguntas, score de riesgo, logística inversa, umbral de bloqueo.
  `.trim(),

  /* ── Caso 4: Documentación corporativa interna ── */
  'documentacion-corp': `
ROL EXPERTO
Actúas como gestor del conocimiento corporativo con experiencia en
arquitectura de información, gobierno documental y gestión del cambio organizacional.

FOCO DEL ANÁLISIS
- Audiencia objetivo: quién leerá el documento y cuál es su nivel de expertise.
- Jerarquía documental: política > procedimiento > instrucción de trabajo > registro.
- Ciclo de vida: creación, revisión, aprobación, publicación, caducidad y archivo.
- Control de versiones y trazabilidad de cambios (quién aprobó, cuándo, por qué).
- Riesgo de documentación desactualizada: impacto en cumplimiento normativo o auditorías.
- Integración con sistemas existentes: intranet, DMS, wiki corporativa, ERP.

VOCABULARIO TÉCNICO REQUERIDO
Usa estos términos cuando corresponda:
propietario del documento, circuito de aprobación, control de versiones,
fecha de revisión obligatoria, taxonomía documental, gestión del conocimiento tácito,
repositorio único de verdad (single source of truth).
  `.trim(),

};


/* ──────────────────────────────────────────
   DATOS DE EJEMPLO PRECARGADOS
   app.js los consume en cargarEjemplo().
   Sirven como punto de partida educativo
   para cada caso.
────────────────────────────────────────── */

const EJEMPLOS = {

  'admision': {
    contexto: `Somos una universidad privada con 200 solicitudes de beca para 40 plazas disponibles
este semestre. El presupuesto total de becas es de 120.000 € y el perfil de candidatos
es heterogéneo: mezcla de excelencia académica, necesidad económica y primera generación universitaria.`,
    decision: `¿Qué criterios de selección aplicar para asignar las 40 becas de forma justa,
sostenible y alineada con la misión de la universidad?`,
    datos: `Expediente académico (nota media), nivel de ingresos familiares declarado,
carta de motivación, entrevista personal (puntuada 1-10), historial de beca previa,
informe de primera generación universitaria (sí/no).`,
    restricciones: `Presupuesto máximo 120.000 €. Al menos el 30% de becas para primera generación universitaria.
Política de no discriminación vigente. Resolución antes del 15 del próximo mes.
No más del 20% de beca completa (100% matrícula); el resto pueden ser parciales.`,
  },

  'it-support': {
    contexto: `El sistema ERP corporativo lleva 4 horas sin funcionar en el módulo de facturación.
Afecta a 3 departamentos (finanzas, ventas, logística) y bloquea el cierre contable del mes.
El proveedor del ERP no responde al teléfono de soporte prioritario.`,
    decision: `¿Escalamos el incidente al comité de crisis TI, activamos el plan de continuidad manual
o intentamos un rollback al backup de anoche antes de escalar?`,
    datos: `Logs del sistema (últimas 6h), última actualización aplicada (hace 2 días), backup diario
disponible (anoche 23:00), 45 usuarios bloqueados, 3 facturas pendientes de emisión urgente,
SLA del proveedor: resolución en 4h para P1.`,
    restricciones: `El rollback implica perder transacciones de las últimas 17 horas. El cierre contable
es hoy a las 18:00 (en 2 horas). El plan de continuidad manual requiere 6 personas
que ahora mismo están en reunión externa. GDPR: los logs contienen datos sensibles.`,
  },

  'ecommerce-fraude': {
    contexto: `Un cliente solicita la devolución de un pedido de 890 € (zapatillas premium) alegando
que llegaron defectuosas. Es su 4ª devolución en 3 meses. Las fotos enviadas muestran
desgaste por uso, no defecto de fabricación. El cliente tiene un LTV de 2.400 € en 18 meses.`,
    decision: `¿Aceptamos la devolución completa, ofrecemos una solución alternativa (descuento, cambio)
o rechazamos la devolución por incumplimiento de la política?`,
    datos: `Historial del cliente: 4 devoluciones / 12 pedidos en 18 meses. Tasa de devolución media
del catálogo: 8%. Score de riesgo interno: 67/100 (umbral de bloqueo: 75). Fotos del producto:
desgaste visible en suela. Política de devolución: 30 días, producto sin usar.`,
    restricciones: `Directiva europea: derecho de devolución de 14 días sin justificación (ya superado: día 22).
Coste logístico de devolución: 18 €. Chargeback ratio actual: 0,8% (límite Visa: 1%).
Evitar impacto en Trustpilot (el cliente tiene 340 seguidores y ha amenazado con reseña negativa).`,
  },

  'documentacion-corp': {
    contexto: `El departamento de RRHH necesita actualizar el manual de incorporación de nuevos empleados
(onboarding). El actual tiene 3 años, no incluye el trabajo en remoto, cita herramientas
ya descontinuadas y ningún empleado nuevo dice haberlo leído completo.`,
    decision: `¿Redactamos un manual nuevo desde cero, actualizamos el existente por secciones
o lo convertimos en un microsite interactivo en la intranet?`,
    datos: `Manual actual: 47 páginas en Word, versión 2021. Encuesta de satisfacción onboarding:
puntuación media 5,2/10. 3 responsables de área disponibles para revisión (2h/semana cada uno).
Herramientas actuales: Teams, Notion, SAP SuccessFactors. Plazo de incorporaciones: 8 nuevos
empleados en las próximas 6 semanas.`,
    restricciones: `Presupuesto: 0 € (solución interna). Máximo 3 semanas para tener versión operativa.
Aprobación obligatoria de Dirección y Comité de Empresa. Idiomas requeridos: español e inglés.
Debe integrarse con el flujo de alta en SAP SuccessFactors.`,
  },

};


/* ──────────────────────────────────────────
   FUNCIÓN PRINCIPAL
   Combina el prompt maestro + instrucciones
   del caso + datos del usuario en un único
   prompt listo para enviarse a cualquier LLM.
────────────────────────────────────────── */

/**
 * Construye el prompt estructurado completo.
 * Es llamada por app.js con los datos del formulario.
 *
 * @param {string} caso   - Identificador del caso (value del radio).
 * @param {Object} campos - Datos introducidos por el usuario.
 *   @param {string} campos.contexto      - Situación de partida.
 *   @param {string} campos.decision      - Pregunta decisional.
 *   @param {string} campos.datos         - Información disponible.
 *   @param {string} campos.restricciones - Condiciones no negociables.
 * @returns {string} Prompt completo, listo para copiar y usar en un LLM.
 */
function construirPrompt(caso, campos) {

  // Instrucciones del caso o mensaje de fallback si el caso no existe
  const instruccionesCaso = INSTRUCCIONES_CASO[caso]
    || '(No se encontraron instrucciones específicas para este caso. Aplica criterios generales de análisis de decisiones.)';

  // Sección de datos del usuario: muestra solo los campos que tienen contenido
  const seccionDatos = [
    campos.datos         ? `DATOS DISPONIBLES\n${campos.datos}`             : null,
    campos.restricciones ? `RESTRICCIONES Y CRITERIOS CLAVE\n${campos.restricciones}` : null,
  ]
    .filter(Boolean)
    .join('\n\n');

  // Construcción del prompt final en bloques bien delimitados
  const prompt = `
════════════════════════════════════════════════════════
INSTRUCCIONES PARA EL MODELO DE IA
════════════════════════════════════════════════════════

${INSTRUCCIONES_CASO[caso] ? instruccionesCaso : ''}

${PROMPT_MAESTRO}

════════════════════════════════════════════════════════
DATOS DEL CASO PROPORCIONADOS POR EL USUARIO
════════════════════════════════════════════════════════

CONTEXTO GENERAL
${campos.contexto}

DECISIÓN A TOMAR
${campos.decision}

${seccionDatos}

════════════════════════════════════════════════════════
INICIO DEL ANÁLISIS
Sigue el protocolo de 9 pasos definido arriba.
No omitas ninguna sección. No agregues secciones no solicitadas.
════════════════════════════════════════════════════════
`.trim();

  return prompt;
}
