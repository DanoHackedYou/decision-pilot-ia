# Decision Pilot IA

Aplicación web educativa para estructurar decisiones complejas mediante prompts optimizados y modelos de lenguaje de inteligencia artificial.

---

## Objetivo

Decision Pilot IA ayuda a estudiantes y profesionales a convertir una situación desestructurada en un prompt riguroso, listo para ser procesado por cualquier modelo de lenguaje (Claude, ChatGPT, Gemini u otros). El objetivo no es que la IA decida: es que el usuario aprenda a formular bien el problema antes de delegar el análisis.

---

## Qué problema resuelve

La mayoría de los usuarios interactúan con modelos de lenguaje mediante preguntas vagas o sin contexto suficiente. Esto produce respuestas genéricas que no sirven para tomar decisiones reales. Esta app enseña el patrón correcto: rol experto + contexto + decisión + datos + restricciones + formato de salida esperado.

---

## Casos incluidos

| # | Caso | Dominio |
|---|------|---------|
| 1 | Admisión y becas universitarias | Educación superior |
| 2 | Tickets internos de soporte TI | Operaciones tecnológicas |
| 3 | Devoluciones y fraude en e-commerce | Comercio digital |
| 4 | Documentación corporativa interna | Gestión del conocimiento |

Cada caso incluye datos de ejemplo precargados para facilitar su uso inmediato en el aula.

---

## Estructura del proyecto

```
decision-pilot-ia/
│
├── index.html          Estructura HTML de la interfaz
├── style.css           Estilos visuales y diseño responsive
├── app.js              Lógica de la interfaz (eventos, validación, output)
├── prompts.js          Plantillas de prompt por caso y función de construcción
│
├── data/
│   └── ejemplos.json   Casos precargados con datos plausibles de aula
│
└── README.md           Este archivo
```

Cada archivo tiene una única responsabilidad. La lógica de construcción de prompts está completamente separada de la lógica de interfaz.

---

## Cómo usar la aplicación

1. Abre la aplicación en el navegador (local o mediante el enlace de GitHub Pages).
2. Selecciona uno de los cuatro casos disponibles en el panel superior.
3. Los campos del formulario se precargan automáticamente con un ejemplo real. Puedes editarlos o sustituirlos por tu situación concreta.
4. Pulsa **Generar prompt estructurado**.
5. Revisa el prompt generado en el panel de salida. Puedes leerlo, modificarlo mentalmente o copiarlo directamente.
6. Pega el prompt en el modelo de lenguaje de tu elección y analiza la respuesta siguiendo los 9 bloques del protocolo de análisis.

Los campos obligatorios son **Contexto general** y **Decisión a tomar**. Los campos de datos y restricciones son opcionales pero mejoran significativamente la calidad del prompt.

---

## Estructura del prompt generado

Todos los prompts siguen el mismo protocolo de 9 secciones:

1. Resumen del problema
2. Decisión real a tomar
3. Datos faltantes (clasificados como bloqueantes o deseables)
4. Tres alternativas de acción
5. Comparación de alternativas
6. Recomendación razonada
7. Qué automatizar y qué mantener bajo control humano
8. KPIs de seguimiento
9. Veredicto final: GO / NO-GO / GO con condiciones

Este protocolo es constante en todos los casos. Lo que varía es el rol experto y el vocabulario técnico de cada dominio.

---

## Despliegue en GitHub Pages

### Requisitos previos

- Cuenta en GitHub.
- Repositorio público con los archivos del proyecto en la rama principal.

### Pasos

1. Sube todos los archivos del proyecto a un repositorio público en GitHub.
2. Ve a **Settings** → **Pages** (en el menú lateral izquierdo del repositorio).
3. En la sección **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
4. Haz clic en **Save**.
5. GitHub generará automáticamente la URL de la aplicación con el formato `https://tu-usuario.github.io/decision-pilot-ia/`.
6. El despliegue tarda entre 1 y 3 minutos. Recarga la página de Settings → Pages para ver el enlace activo.

No se requiere servidor, base de datos ni configuración adicional. La aplicación funciona completamente en el navegador del usuario.

---

## Limitaciones del proyecto

**Técnicas**

- La aplicación no se conecta directamente a ningún modelo de lenguaje. Genera el prompt y el usuario lo copia manualmente en la herramienta de su elección.
- No hay persistencia de datos: al cerrar o recargar la página, el contenido del formulario se pierde.
- No admite autenticación ni perfiles de usuario.
- Está diseñada para navegadores modernos. No se garantiza compatibilidad con Internet Explorer.

**De alcance**

- Los cuatro casos incluidos son representativos, no exhaustivos. No cubren todos los sectores ni tipos de decisión.
- Los datos de ejemplo son ficticios y tienen fines exclusivamente pedagógicos. No deben usarse como referencia para decisiones reales sin validación experta.
- El protocolo de 9 pasos está optimizado para decisiones complejas de gestión. No es adecuado para decisiones operativas simples o repetitivas.

**De la IA**

- La calidad de la respuesta del modelo de lenguaje depende del modelo utilizado, de su versión y de las instrucciones del sistema configuradas por el proveedor. Esta app no controla ninguno de esos factores.
- Ninguna respuesta de un modelo de lenguaje debe adoptarse como decisión final sin revisión humana cualificada.

---

## Equipo

Proyecto desarrollado como trabajo final del curso de **Gestión de Proyectos**.

| Nombre | Rol en el proyecto |
|--------|--------------------|
| Autor 1 | Diseño de interfaz y maquetación |
| Autor 2 | Lógica de aplicación y prompts |
| Autor 3 | Casos de uso y documentación |

**Institución:** nombre de la universidad o centro  
**Curso académico:** 2024-2025  
**Tutor o docente:** nombre del profesor responsable

---

## Licencia

Este proyecto se distribuye con fines educativos. Puedes reutilizar, adaptar y mejorar el código citando la fuente original.
