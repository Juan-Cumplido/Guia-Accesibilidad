(function () {
  "use strict";

  const tracks = {
    keyboard: {
      label: "HU-01 · Enviar la inscripción con teclado",
      route: ["artifact:accessible-user-stories", "artifact:accessible-prototypes", "artifact:accessible-code", "practice:accessible-bdd-acceptance-testing"]
    },
    errors: {
      label: "HU-02 · Encontrar y corregir el error de correo",
      route: ["artifact:accessible-acceptance-criteria", "artifact:accessible-mockups", "practice:reusable-accessibility-libraries", "artifact:wcag-checklists"]
    },
    dialog: {
      label: "HU-03 · Revisar la inscripción en un diálogo",
      route: ["artifact:accessible-use-cases", "artifact:accessible-interaction-diagrams", "artifact:reusable-accessible-components", "artifact:manual-evaluation-reports"]
    },
    reflow: {
      label: "HU-04 · Inscribirse con la vista ampliada",
      route: ["artifact:context-of-use-specification", "practice:accessible-variability", "artifact:runtime-accessibility-settings", "artifact:advanced-test-scripts"]
    },
    status: {
      label: "HU-05 · Recibir el folio sin perder el foco",
      route: ["artifact:accessibility-requirements-catalog", "artifact:accessible-architecture-diagrams", "artifact:accessible-templates", "artifact:accessibility-test-plan"]
    }
  };

  const sources = {
    wcag: ["W3C · Recomendación WCAG 2.2", "https://www.w3.org/TR/WCAG22/"],
    uml: ["OMG · UML 2.5.1", "https://www.omg.org/spec/UML/2.5.1/About-UML"],
    users: ["W3C WAI · Participación de usuarios en proyectos web", "https://www.w3.org/WAI/planning/involving-users/"],
    evaluate: ["W3C WAI · Evaluación con usuarios", "https://www.w3.org/WAI/test-evaluate/involving-users/"],
    errors: ["W3C WAI · Notificaciones en formularios", "https://www.w3.org/WAI/tutorials/forms/notifications/"],
    labels: ["W3C WAI · Etiquetas de controles", "https://www.w3.org/WAI/tutorials/forms/labels/"],
    keyboard: ["W3C APG · Interfaz de teclado", "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/"],
    dialog: ["W3C APG · Patrón de diálogo modal", "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"],
    nativeDialog: ["W3C · Técnica H102 para el elemento dialog", "https://www.w3.org/WAI/WCAG22/Techniques/html/H102"],
    wcagem: ["W3C · Metodología de evaluación WCAG-EM", "https://www.w3.org/TR/WCAG-EM/"],
    axe: ["Playwright · Pruebas con axe", "https://playwright.dev/docs/accessibility-testing"],
    playwright: ["Playwright · Configuración del entorno de prueba", "https://playwright.dev/docs/test-use-options"],
    gherkin: ["Cucumber · Referencia de Gherkin", "https://cucumber.io/docs/gherkin/reference/"]
  };

  // El enlace usa el identificador oficial del criterio, no un título convertido en URL.
  const wcag = {
    "1.3.1": ["Información y relaciones", "A", "info-and-relationships"],
    "1.4.3": ["Contraste mínimo", "AA", "contrast-minimum"],
    "1.4.4": ["Cambio de tamaño del texto", "AA", "resize-text"],
    "1.4.10": ["Redistribución del contenido", "AA", "reflow"],
    "2.1.1": ["Teclado", "A", "keyboard"],
    "2.1.2": ["Sin trampas de teclado", "A", "no-keyboard-trap"],
    "2.4.1": ["Evitar bloques", "A", "bypass-blocks"],
    "2.4.3": ["Orden del foco", "A", "focus-order"],
    "2.4.7": ["Foco visible", "AA", "focus-visible"],
    "2.4.11": ["Foco no oculto (mínimo)", "AA", "focus-not-obscured-minimum"],
    "3.3.1": ["Identificación de errores", "A", "error-identification"],
    "3.3.2": ["Etiquetas o instrucciones", "A", "labels-or-instructions"],
    "3.3.3": ["Sugerencias ante errores", "AA", "error-suggestion"],
    "4.1.2": ["Nombre, función y valor", "A", "name-role-value"],
    "4.1.3": ["Mensajes de estado", "AA", "status-messages"]
  };

  const record = (fields) => ({ kind: "record", fields });
  const table = (headers, rows) => ({ kind: "table", headers, rows });
  const screens = (views) => ({ kind: "screens", views });
  const flow = (nodes) => ({ kind: "flow", nodes });
  const code = (snippet, preview) => ({ kind: "code", snippet, preview });
  const diagram = (file, alt, description, useCase) => ({ kind: "diagram", file, alt, description, useCase });
  const example = (track, title, visual, note, criteria, source = "wcag") =>
    ({ track, title, visual, note, criteria, source: sources[source] });

  const examples = {
    // Requisitos: prácticas.
    "practice:multi-method-requirements-elicitation": example("keyboard", "Registro de hallazgos OBS-01",
      table(["Fuente", "Evidencia recogida", "Decisión"], [
        ["Sesión P-01", "La estudiante llega a Enviar con Tab, pero Enter no envía la inscripción.", "Reproducir con teclado en la misma versión."],
        ["Inspección en v1.1", "Enviar es un elemento que solo escucha el clic del ratón.", "REQ-01: usar un control operable por teclado."],
        ["Validación con la estudiante", "Necesita inscribirse sin cambiar de dispositivo de entrada.", "Priorizar HU-01 y crear la prueba T-01."]
      ]),
      "Recoge la observación con consentimiento, reproduce el problema y contrasta el resultado con el criterio. Lleva las tres evidencias a la historia de usuario.",
      [["2.1.1", "Reproduce el envío sin ratón y anota qué acción no se puede completar."]], "users"),

    "practice:accessible-user-stories": example("keyboard", "De OBS-01 a la historia HU-01",
      flow([
        ["Hecho", "P-01 llega al botón Enviar inscripción. Enter no hace nada."],
        ["Historia", "Como estudiante que navega con teclado, quiero enviar mi inscripción para reservar un lugar sin ayuda."],
        ["Criterio de aceptación", "Con datos válidos y el foco en Enviar inscripción, cada intento con Enter o Espacio crea una sola inscripción."],
        ["Evidencia", "T-01 registra tecla, versión y folio de cada intento."]
      ]),
      "Redacta el rol a partir de la forma de interacción. Lleva el mismo texto del botón y el identificador HU-01 al prototipo.",
      [["2.1.1", "El envío debe poder activarse desde una interfaz de teclado."]], "users"),

    "practice:wcag-based-requirements": example("status", "Derivación de REQ-05",
      record([
        ["Alcance", "Inscripción a talleres v1.2. Objetivo de conformidad WCAG 2.2 AA."],
        ["Situación", "El portal muestra el folio en la misma página después de guardar."],
        ["Requisito", "Al completar la inscripción, el mensaje «Inscripción confirmada. Folio A-104» se expone a la tecnología de apoyo sin mover el foco."],
        ["Verificación", "T-05: enviar con teclado y comprobar con lector de pantalla el mensaje y el foco."]
      ]),
      "Determina primero si el cambio es un mensaje de estado. Redacta un requisito del producto con condición, comportamiento esperado y prueba.",
      [["4.1.3", "El mensaje de éxito aparece sin cambiar de contexto y debe poder anunciarse sin recibir foco."]]),

    "practice:define-accessible-personas": example("errors", "Protopersona PP-02 · Recuperar el formulario",
      record([
        ["Meta", "Corregir el correo y retomar la inscripción sin empezar de nuevo."],
        ["Patrón observado", "En la sesión ficticia P-02 la persona usa lector de pantalla y navega por encabezados."],
        ["Hipótesis", "Un resumen con encabezado y enlace al campo facilita retomar la tarea."],
        ["Validación", "Comparar el error solo junto al campo y el resumen enlazado. Registrar ayuda solicitada en cada intento."]
      ]),
      "Distingue en la ficha lo observado de lo que aún se debe probar. Usa PP-02 para definir el escenario de la maqueta de error.",
      [["3.3.1", "Comprueba si la persona puede identificar el campo y comprender el error descrito."]], "users"),

    "practice:prioritize-accessibility-backlog": example("keyboard", "Decisión de prioridad para la entrega v1.2",
      table(["Orden", "Impacto", "Decisión de entrega"], [
        ["P0 · HU-01", "El teclado no activa Enviar. La tarea no se completa.", "Corregir antes de publicar y verificar T-01."],
        ["P1 · HU-02", "El mensaje no explica cómo corregir un correo rechazado.", "Corregir en la misma entrega y ejecutar T-02."],
        ["P2 · Ayuda", "El texto de ayuda es largo. La tarea aún se completa.", "Revisar con contenido después de los bloqueos."]
      ]),
      "Ordena por impacto y dependencia con Producto y QA. Registra la razón y el criterio de salida en lugar de priorizar solo por el nivel WCAG.",
      [["2.1.1", "HU-01 tiene prioridad porque impide realizar la tarea con teclado."], ["3.3.3", "HU-02 debe sugerir una corrección conocida para el correo inválido."]]),

    "practice:accessible-acceptance-criteria": example("errors", "CA-02 · Recuperación de un correo inválido",
      record([
        ["Dado", "El taller está seleccionado y Correo institucional contiene «ana»."],
        ["Cuando", "La persona activa Enviar inscripción."],
        ["Entonces", "El formulario conserva el taller. Un resumen identifica Correo institucional y pide un correo con @ y dominio."],
        ["Y al seguir el enlace", "El foco llega al campo Correo institucional y permite corregir «ana»."],
        ["Evidencia", "T-02 registra el texto, el destino del foco y la recuperación con «ana@ejemplo.test»."]
      ]),
      "Separa la identificación del error y la recuperación en dos comprobaciones. En diseño, representa ambos estados con los mismos textos.",
      [["3.3.1", "Identifica el campo y describe el error en texto."], ["3.3.3", "Da una sugerencia concreta cuando se conoce el formato correcto."]], "errors"),

    "practice:requirements-accessibility-review": example("errors", "Minuta REV-02 · Requisito de error",
      table(["Revisión", "Hallazgo", "Resolución"], [
        ["v1", "«Marcar en rojo el correo» omite qué ocurrió.", "Rechazar esa redacción."],
        ["v2", "«Indicar Correo institucional y describir el error» es verificable.", "Aprobar requisito REQ-02."],
        ["Pendiente", "Aún no se conoce el recorrido entre el resumen y el campo.", "Diseño lo anota y QA ejecuta T-02."]
      ]),
      "Entrega a la persona revisora el flujo, la redacción inicial y el criterio. Guarda qué se aceptó, qué se corrigió y quién valida el pendiente.",
      [["3.3.1", "La minuta distingue la apariencia del aviso de la identificación textual del error."]], "errors"),

    "practice:accessible-context-of-use": example("reflow", "Mapa de contexto para T-04",
      table(["Lugar", "Modo de uso", "Situación que se debe comprobar"], [
        ["Casa", "Portátil con navegador al 400 % en una vista inicial de 1280 px CSS.", "La inscripción funciona en el ancho equivalente a 320 px CSS."],
        ["Trayecto", "Móvil en posición vertical, conexión lenta.", "La ayuda y Enviar están disponibles en una sola columna."],
        ["Biblioteca", "Texto aumentado al 200 %.", "El mensaje y los controles siguen completos y utilizables."]
      ]),
      "Observa el dispositivo y el ajuste que la persona usa habitualmente. Convierte cada condición relevante en una configuración reproducible.",
      [["1.4.10", "A 320 px CSS, el formulario conserva contenido y función sin exigir desplazamiento en dos ejes."], ["1.4.4", "Prueba el aumento del texto al 200 % sin pérdida de contenido ni función."]], "users"),

    "practice:ethnography-and-empathy": example("errors", "Nota de campo OBS-02 · Sesión ficticia",
      record([
        ["Hecho", "P-02 retoma la inscripción tras una interrupción y recorre el formulario desde el inicio."],
        ["Explicación de P-02", "No pudo ubicar qué dato faltaba corregir."],
        ["Interpretación", "El mensaje aislado bajo el campo podría pasar inadvertido."],
        ["Validación", "Probar una versión con resumen al comienzo y enlace al campo. Confirmar la interpretación con P-02."]
      ]),
      "Recoge notas con permiso y usa códigos de participante. La interpretación origina un cambio de diseño que todavía debe comprobarse.",
      [["3.3.1", "La observación orienta una comprobación sobre cómo se identifica y describe el error."]], "users"),

    "practice:classify-prioritize-requirements": example("status", "Matriz de clasificación antes de v1.2",
      table(["ID / criterio", "Barrera", "Prioridad y dependencia"], [
        ["REQ-01 · 2.1.1 A", "El envío no funciona con teclado.", "P0 · bloquea la tarea."],
        ["REQ-05 · 4.1.3 AA", "El folio aparece sin que se anuncie en el lector de pantalla.", "P1 · requiere que el envío funcione."],
        ["REQ-04 · 1.4.10 AA", "El botón queda fuera de la vista ampliada.", "P0 · bloquea la tarea en el contexto CTX-04."]
      ]),
      "Clasifica cada requisito por criterio, impacto y dependencias. REQ-04 y REQ-05 tienen el mismo nivel WCAG y distinta prioridad de implementación.",
      [["2.1.1", "Verifica si la tarea se puede completar con teclado."], ["4.1.3", "Revisa el anuncio del folio sin mover el foco."], ["1.4.10", "Repite el flujo en una vista de 320 px CSS."]]),

    "practice:iterative-accessibility-requirements": example("errors", "Historial de REQ-02",
      flow([
        ["v1 · Definición", "Mostrar el error junto al campo Correo institucional."],
        ["Evidencia E-02", "En la prueba, P-02 no localiza el mensaje después de enviar."],
        ["v2 · Cambio", "Agregar resumen con enlace a Correo y conservar el mensaje junto al campo."],
        ["Verificación", "Actualizar la maqueta D-02 y repetir T-02 con la versión corregida."]
      ]),
      "Versiona el requisito junto a la evidencia que motivó el cambio. Conserva el mismo identificador para localizar diseño, código y prueba.",
      [["3.3.1", "El cambio conserva la identificación y la descripción textual del error."]], "errors"),

    "practice:accessible-user-model": example("reflow", "Modelo de perfiles de interacción",
      table(["Perfil", "Atributos del modelo", "Caso derivado"], [
        ["U-04A", "Entrada: teclado. Presentación: vista estrecha. Ampliación: 400 % sobre 1280 px CSS.", "T-04A: terminar la inscripción sin desplazamiento horizontal."],
        ["U-04B", "Entrada: toque. Presentación: texto al 200 %.", "T-04B: leer instrucciones y activar Enviar sin recortes."],
        ["U-04C", "Entrada: teclado. Salida: lector de pantalla.", "T-04C: conservar el orden de lectura al redistribuir el contenido."]
      ]),
      "Modela entrada, salida y presentación como atributos independientes. Usa combinaciones respaldadas por escenarios, con una prueba por combinación relevante.",
      [["1.4.10", "Comprueba la vista estrecha sin perder la funcionalidad."], ["1.4.4", "Comprueba el aumento de texto por separado."]], "users"),

    // Requisitos: artefactos.
    "artifact:accessible-user-stories": example("keyboard", "Tarjeta HU-01 · Enviar inscripción",
      record([
        ["Historia", "Como estudiante que navega con teclado, quiero enviar mi inscripción para reservar un lugar sin ayuda."],
        ["Origen", "OBS-01 · En la v1.1 el control Enviar no responde al teclado."],
        ["Aceptación", "Con datos válidos, enfocar Enviar inscripción y activar con Enter. Repetir con Espacio en una sesión independiente. Cada intento crea un solo registro."],
        ["Trazabilidad", "REQ-01 → prototipo D-01 → botón nativo de HU-01 → T-01."],
        ["Estado", "Lista para diseñar. QA adjunta la evidencia de ambos intentos al implementar."]
      ]),
      "Usa esta tarjeta al diseñar el orden de Tab. En el prototipo busca el mismo botón Enviar inscripción y comprueba que la acción siga siendo la de HU-01.",
      [["2.1.1", "La persona debe poder activar la acción sin ratón."], ["2.4.7", "El prototipo debe indicar cómo reconocer visualmente el foco del botón."]]),

    "artifact:accessible-personas": example("errors", "Ficha P-02 · Estudiante que usa lector de pantalla",
      record([
        ["Meta", "Completar la inscripción y conservar el folio."],
        ["Entorno", "Portátil, teclado y lector de pantalla. Navega por encabezados para orientarse."],
        ["Barrera observada", "Envía «ana» como correo y no encuentra el mensaje asociado al campo."],
        ["Necesidad", "Saber qué dato corregir, por qué y cómo volver al campo."],
        ["Uso de la ficha", "Diseñar el estado de error D-02 y comprobarlo con la tarea T-02."]
      ]),
      "El perfil y sus datos son ficticios. En tu proyecto, vincula el perfil a observaciones consentidas y valida las decisiones con usuarios que tengan esas formas de interacción.",
      [["3.3.1", "La interfaz debe identificar el error de correo con texto disponible para el usuario."]], "users"),

    "artifact:accessibility-requirements-catalog": example("status", "Catálogo de requisitos · Inscripción v1.2",
      table(["ID y criterio", "Comportamiento", "Verificación / estado"], [
        ["REQ-05 · 4.1.3", "Anunciar «Inscripción confirmada. Folio A-104» al guardar en la misma vista.", "T-05 · pendiente de lector de pantalla."],
        ["REQ-01 · 2.1.1", "Activar el envío por teclado con datos válidos.", "T-01 · listo para probar."],
        ["REQ-02 · 3.3.1", "Identificar el correo rechazado y describir el error en texto.", "T-02 · diseño revisado."]
      ]),
      "Para cada fila conserva el ID, el criterio, el comportamiento y la evidencia. REQ-05 pasa al diagrama D-05 y a la plantilla que contiene la región de estado.",
      [["4.1.3", "Vincula el folio en la misma vista con un mensaje programáticamente identificable."], ["2.1.1", "Comprueba la acción Enviar desde teclado."], ["3.3.1", "Comprueba el mensaje del correo inválido."]]),

    "artifact:accessible-acceptance-criteria": example("errors", "Criterios de aceptación de HU-02",
      table(["Caso", "Entrada y acción", "Resultado que acepta QA"], [
        ["CA-02a · Identificar", "Enviar el formulario con correo «ana».", "El resumen nombra Correo institucional e indica que falta @ y dominio."],
        ["CA-02b · Corregir", "Activar el enlace Correo institucional en el resumen.", "El foco llega al campo, conserva «ana» y permite reemplazarlo."],
        ["CA-02c · Recuperar", "Escribir «ana@ejemplo.test» y volver a enviar.", "Se limpia el estado inválido y se conserva el taller seleccionado."]
      ]),
      "Pasa los tres estados a D-02. En este caso el formulario usa validación propia con novalidate para mostrar el resumen en lugar del aviso del navegador. La aplicación y el servidor siguen validando el dato.",
      [["3.3.1", "El caso CA-02a identifica el dato rechazado y la causa."], ["3.3.3", "El mensaje orienta cómo corregirlo."], ["2.4.3", "El enlace del resumen conduce al control que se debe corregir."]], "errors"),

    "artifact:accessible-backlog": example("keyboard", "Backlog del sprint 4 · Inscripción",
      table(["Ítem", "Responsable y estado", "Evidencia para cerrar"], [
        ["P0 · HU-01", "Desarrollo · en revisión", "T-01 pasa con Enter y Espacio en dos intentos."],
        ["P1 · HU-02", "Diseño y Desarrollo · en curso", "D-02 y T-02 incluyen el error y la recuperación."],
        ["P1 · HU-05", "Desarrollo · planificado tras HU-01", "T-05 confirma el anuncio del folio."]
      ]),
      "Incluye estos ítems junto con los funcionales. Adjunta la prueba que justifica mover cada tarjeta a Terminado.",
      [["2.1.1", "La tarjeta HU-01 identifica un bloqueo de operación por teclado."], ["4.1.3", "HU-05 registra su propia prueba del mensaje de estado."]]),

    "artifact:stakeholder-analysis": example("errors", "Mapa de participación para HU-02",
      table(["Grupo", "Pregunta o aporte", "Momento y evidencia"], [
        ["Estudiantes con discapacidad", "¿Cómo encuentran el aviso y retoman la tarea?", "Sesión de prototipo con consentimiento. Notas P-02."],
        ["Coordinación de talleres", "¿Qué dominios admite el portal?", "Antes de redactar el texto del error. Regla vigente."],
        ["Desarrollo y QA", "¿A qué campo corresponde el error y cómo se reproduce?", "Implementación y verificación. Registro T-02."]
      ]),
      "Identifica a quien conoce la regla, a quien se encuentra la barrera y a quien comprueba la corrección. Registra sus aportes en la ficha del proyecto.",
      [["3.3.3", "La regla del dominio permite proponer una corrección útil en el mensaje."]], "users"),

    "artifact:requirements-template": example("status", "Plantilla completada · REQ-05",
      record([
        ["Contexto", "La vista de inscripción guarda datos y permanece abierta."],
        ["Origen y criterio", "OBS-05 · WCAG 2.2, 4.1.3 AA."],
        ["Comportamiento esperado", "Con el foco en Enviar, anunciar el folio al actualizar la confirmación en pantalla."],
        ["Prueba", "T-05. Registrar la frase que se anuncia y el control que conserva el foco."],
        ["Responsable y versión", "QA · v1.2 · pendiente."]
      ]),
      "Copia estos campos para otro requisito. Conserva una condición observable y una prueba repetible en cada instancia.",
      [["4.1.3", "El folio se presenta sin que el lector de pantalla tenga que navegar a la región."]]),

    "artifact:accessible-use-cases": example("dialog", "CU-03 · Revisar inscripción antes de confirmar",
      diagram("caso-uso-inscripcion.svg", "Diagrama UML de casos de uso del portal de talleres", [
        "El actor Estudiante está fuera del límite del Portal de talleres y se asocia a Revisar inscripción.",
        "Revisar inscripción incluye Mostrar datos. La flecha «include» apunta al caso incluido, que se ejecuta como parte de la revisión."
      ], {
        context: [
          ["Alcance", "Portal de talleres · Inscripción · Caso CU-03, derivado de HU-03."],
          ["Actor principal", "Estudiante que revisa su inscripción. El flujo admite teclado y lector de pantalla."],
          ["Objetivo", "Revisar el taller y el correo, corregirlos si hace falta y confirmar la reserva una sola vez."],
          ["Disparador", "El estudiante activa Revisar inscripción."],
          ["Precondiciones", "El formulario tiene un taller disponible y un correo válido. Todavía no se ha creado la inscripción."],
          ["Datos de ejemplo", "Taller: Introducción a la accesibilidad. Correo: ana@ejemplo.test."]
        ],
        main: [
          "El estudiante llega a Revisar inscripción con Tab y lo activa con Enter o Espacio.",
          "El portal abre el diálogo «Confirmar inscripción», muestra taller y correo, y enfoca Volver. El título da nombre al diálogo.",
          "El estudiante lee los datos y recorre las acciones Volver y Confirmar con Tab o Mayús+Tab. Los controles de la página quedan fuera del recorrido mientras el diálogo está abierto.",
          "El estudiante activa Confirmar. El portal cierra el diálogo, devuelve el foco a Revisar inscripción e inicia una sola solicitud de guardado. Las activaciones repetidas durante la solicitud no crean otra reserva.",
          "Cuando el servicio confirma el guardado, el portal muestra y anuncia «Inscripción confirmada. Folio A-104» en la misma vista, sin mover el foco otra vez."
        ],
        alternatives: [
          ["A1 · Volver o Escape en el paso 3", "Se cierra el diálogo y el foco vuelve a Revisar inscripción. Se conservan taller y correo para que el estudiante pueda corregirlos. No se envía una solicitud."],
          ["A2 · El servicio rechaza la solicitud en el paso 5", "El portal muestra y anuncia el fallo sin desplazar el foco, mantiene los datos y permite reintentar desde Revisar inscripción. No muestra un folio ni confirma una reserva que el servicio rechazó."]
        ],
        outcomes: [
          ["Poscondición de éxito", "Existe un solo registro y se comunica el folio A-104."],
          ["Poscondición de salida o rechazo", "No se crea un registro. Los datos siguen disponibles para editar o volver a intentar."],
          ["Pruebas vinculadas", "T-03a: apertura y confirmación con teclado. T-03b: Volver y Escape sin guardado. T-03c: rechazo y reintento. T-05: anuncio del folio."]
        ]
      }),
      "El diagrama delimita al actor y sus casos de uso. La descripción textual permite reproducir cada camino. En Diseño, D-03 traduce esos caminos a estados y destinos de foco.",
      [["2.1.1", "Abrir, revisar y confirmar debe ser posible con teclado."], ["2.1.2", "Volver y Escape permiten salir del diálogo."], ["2.4.3", "El foco entra en Volver al abrir y regresa al disparador al cerrar."], ["4.1.3", "La confirmación en la misma vista se anuncia sin recibir foco."]], "uml"),

    "artifact:accessible-definition-of-done": example("keyboard", "Definición de terminado aplicada a HU-01",
      table(["Condición", "Evidencia", "Estado"], [
        ["Operación por teclado", "T-01a Enter y T-01b Espacio crean un registro cada uno.", "Cumple"],
        ["Indicador de foco", "Recorrido grabado en la vista de inscripción.", "Cumple"],
        ["Control enfocado no oculto por la cabecera fija", "Falta comprobar la vista ampliada con la cabecera visible.", "Pendiente"]
      ]),
      "El equipo conserva HU-01 en revisión hasta completar la comprobación pendiente y adjuntar el resultado. Usa esta misma tabla en la revisión de cambios.",
      [["2.1.1", "Se comprueban las dos activaciones del botón."], ["2.4.7", "Se observa el indicador al navegar."], ["2.4.11", "La cabecera no debe ocultar por completo el control enfocado."]]),

    "artifact:conceptual-accessibility-model": example("errors", "Modelo conceptual · Campos y errores",
      diagram("clases-validacion.svg", "Diagrama UML de clases para los errores de inscripción", [
        "Una Inscripción tiene uno o más Campos. Cada Campo pertenece a una Inscripción.",
        "Un Campo puede tener cero o más ErroresDeCampo. Cada ErrorDeCampo corresponde a un solo Campo.",
        "Campo tiene id y etiqueta. ErrorDeCampo tiene código y mensaje. El error CORREO_INVALIDO se vincula al Campo correo."
      ]),
      "El modelo conserva la identidad del campo a través del resumen y del mensaje local. Usa el identificador correo para implementar el enlace y la prueba T-02.",
      [["3.3.1", "Cada error debe identificar el campo afectado y describir el problema."]], "uml"),

    "artifact:context-of-use-specification": example("reflow", "CTX-04 · Inscripción con ampliación",
      record([
        ["Persona y tarea", "Estudiante con baja visión busca un taller y envía su inscripción."],
        ["Configuración", "Navegador de escritorio, vista inicial de 1280 px CSS, zoom 400 %. Vista equivalente de 320 px CSS."],
        ["Controles imprescindibles", "Selector de taller, correo, ayuda y botón Enviar inscripción."],
        ["Escenario alternativo", "Aumento de texto al 200 % para revisar que las etiquetas no se recorten."],
        ["Prueba derivada", "T-04 registra ancho, zoom, pérdida de información y desplazamiento en ambos ejes."]
      ]),
      "Pasa CTX-04 al diseño de variantes. Mantén los mismos datos y controles al comparar la versión amplia con la estrecha.",
      [["1.4.10", "Comprueba la redistribución a 320 px CSS en el formulario completo."], ["1.4.4", "Comprueba que el texto aumentado al 200 % conserva contenido y funcionalidad."]]),
    // Diseño: prácticas.
    "practice:accessible-prototyping": example("keyboard", "Boceto anotado · Primera prueba de HU-01",
      screens([
        ["1. Antes del envío", [["Taller", "Introducción a la accesibilidad", "field"], ["Correo institucional", "ana@ejemplo.test", "field"], ["Enviar inscripción", "Foco al llegar con Tab", "focus"]]],
        ["2. Página de confirmación", [["Inscripción confirmada", "Encabezado de la página de destino", "note"], ["Folio de ejemplo", "A-104", "note"]]]
      ]),
      "Numera el orden de Tab y enlaza el envío a la página de confirmación. Comprueba ese recorrido en el prototipo interactivo. Para el caso de confirmación en la misma página, consulta HU-05.",
      [["2.4.3", "Taller, correo y envío siguen la secuencia de la tarea."], ["2.4.7", "Anota y prueba el indicador del botón enfocado."]], "keyboard"),

    "practice:user-centered-accessible-design": example("errors", "Decisiones de diseño a partir de dos sesiones ficticias",
      table(["Observación", "Cambio en D-02", "Verificación"], [
        ["P-02 buscó el error recorriendo todos los campos.", "Agregar resumen «Revisa tu inscripción» al inicio.", "Localizar el error desde el resumen."],
        ["P-03 encontró el texto pero no el campo.", "Enlazar Correo institucional y mover el foco al activarlo.", "Llegar al campo, corregir y volver a enviar."],
        ["Ambas personas ya habían elegido taller.", "Conservar el taller al informar el error.", "Confirmar que no hay que volver a elegirlo."]
      ]),
      "Vuelve a probar el mismo encargo sin indicar dónde está el error. Anota si cada cambio reduce la ayuda requerida.",
      [["3.3.1", "El resumen identifica el error en texto."], ["2.4.3", "El enlace coloca el foco en el campo al que apunta."]], "users"),

    "practice:expert-prototype-review": example("dialog", "Informe de revisión EXP-03 · Prototipo v1",
      table(["Hallazgo", "Impacto", "Corrección por revisar"], [
        ["E-03a · Al abrir, el foco queda en Revisar inscripción.", "El teclado sigue operando la página detrás del diálogo.", "Mover el foco a Volver al abrir."],
        ["E-03b · Título «¿Continuar?».", "La persona no sabe qué confirma.", "Titular «Confirmar inscripción» y comprobar el nombre accesible."],
        ["E-03c · Escape cierra y el foco cae al inicio.", "Se pierde el punto de trabajo.", "Restaurar el foco a Revisar inscripción."]
      ]),
      "Entrega el flujo completo y pide a la persona revisora que anote acción, resultado y corrección. Repite los tres casos en el prototipo v2.",
      [["2.4.3", "Verifica el destino del foco al abrir y al cerrar."], ["4.1.2", "El diálogo implementado debe exponer el rol y el nombre «Confirmar inscripción»."]], "dialog"),

    "practice:accessible-guides-and-patterns": example("dialog", "Ficha del patrón MOD-01 · Confirmación",
      record([
        ["Disparador", "Botón Revisar inscripción. Enter o Espacio abre el diálogo."],
        ["Nombre", "Confirmar inscripción. El título visible aporta el nombre accesible."],
        ["Navegación", "El foco empieza en Volver. Tab y Mayús+Tab recorren Volver y Confirmar dentro del diálogo."],
        ["Salida", "Escape o Volver cierra y devuelve el foco al disparador. Confirmar ejecuta la acción definida por el formulario."]
      ]),
      "Adapta el patrón a tu contenido y define qué hace cada acción. Comprueba el recorrido tras integrar el componente real.",
      [["2.1.2", "El diálogo permite salir con teclado mediante Escape o Volver."], ["2.4.3", "El recorrido es lógico dentro del modal y al volver al formulario."]], "dialog"),

    "practice:design-accessible-components": example("errors", "Especificación visual · CampoCorreo",
      screens([
        ["Estado inicial", [["Correo institucional", "ana@ejemplo.test", "field"], ["Ayuda", "Usa tu correo institucional.", "note"]]],
        ["Estado inválido", [["Correo institucional", "ana", "field"], ["Error", "Ingresa un correo con @ y dominio.", "note"], ["Anotación", "Asociar el mensaje al campo y exponer su estado inválido.", "note"]]]
      ]),
      "Entrega las variantes con etiqueta, ayuda y error como partes del componente. Desarrollo debe comprobar que la asociación se conserva al cambiar de estado.",
      [["3.3.2", "La etiqueta y las instrucciones indican qué dato se solicita."], ["1.3.1", "El mensaje visible y su campo están asociados en el marcado."], ["3.3.1", "El estado inválido identifica el dato y describe el error."]], "labels"),

    "practice:accessible-architecture": example("status", "ADR-05 · Quién comunica el folio",
      record([
        ["Decisión", "El servidor devuelve un folio. La vista lo comunica sin navegar a otra página."],
        ["Contrato de la API", "Si se guarda, devolver HTTP 201 con el dato folio igual a A-104."],
        ["Contrato de la vista", "La región role=status existe antes del envío. Al recibir el folio, se actualiza su texto."],
        ["Verificación", "T-05 registra el anuncio y confirma que la aplicación no movió el foco."]
      ]),
      "Registra la decisión de arquitectura antes de codificar. Usa el diagrama D-05 para revisar quién inicia, devuelve y publica cada dato.",
      [["4.1.3", "La región de estado permite anunciar el resultado que aparece sin cambio de contexto."]], "errors"),

    "practice:iterative-design-with-disabled-people": example("errors", "Registro de dos iteraciones · Sesiones ficticias",
      flow([
        ["v1 · Observar", "P-02 envía «ana» y pide ayuda para encontrar el error."],
        ["v2 · Diseñar con P-02", "Agregar un resumen antes del formulario y enlazar el campo."],
        ["v2 · Repetir", "P-02 llega al campo desde el enlace y corrige el correo sin ayuda en esa sesión."]
      ]),
      "Pide consentimiento, registra cómo la persona propuso el cambio y repite la tarea sin guiarla. Usa otra ronda para explorar si el cambio ayuda en otros contextos.",
      [["3.3.1", "El mensaje identifica el problema y el dato afectado."], ["2.4.3", "Repite el recorrido del foco entre resumen y campo."]], "evaluate"),

    "practice:accessible-variability": example("reflow", "D-04 · La misma inscripción en dos anchos",
      screens([
        ["Vista amplia", [["Taller", "Introducción a la accesibilidad", "field"], ["Correo institucional", "ana@ejemplo.test", "field"], ["Enviar inscripción", "", "action"], ["Ayuda", "Usa tu correo institucional.", "help"]], "columns"],
        ["Vista estrecha · 320 px CSS", [["Taller", "Introducción a la accesibilidad", "field"], ["Correo institucional", "ana@ejemplo.test", "field"], ["Enviar inscripción", "", "action"], ["Ayuda", "Usa tu correo institucional.", "help"]]]
      ]),
      "Deja la ayuda al lado en una vista amplia y debajo en una estrecha. Mantén la secuencia de los controles y comprueba que el flujo completo se pueda usar con texto ampliado.",
      [["1.4.10", "Los controles y el texto se redistribuyen sin exigir desplazamiento en dos ejes."], ["1.4.4", "El aumento de texto al 200 % no recorta las etiquetas ni las acciones."]]),

    "practice:accessible-domain-modeling": example("errors", "Instancia UML del error de correo",
      diagram("objetos-error.svg", "Diagrama UML de objetos del error CORREO_INVALIDO", [
        "correo : Campo tiene id correo y etiqueta Correo institucional.",
        "error01 : ErrorDeCampo tiene código CORREO_INVALIDO y mensaje Ingresa un correo con @ y dominio.",
        "El enlace une el error con el campo. El resumen usa el identificador de ese mismo campo para permitir volver a él."
      ]),
      "Prueba el modelo con una instancia concreta antes de programar. Comprueba que el error no pueda quedar sin campo asociado.",
      [["3.3.1", "El vínculo del modelo permite describir el error e identificar su campo en la interfaz."]], "uml"),

    // Diseño: artefactos.
    "artifact:accessible-prototypes": example("keyboard", "D-01 · Prototipo de HU-01",
      screens([
        ["Formulario · Orden de Tab", [["1. Taller", "Introducción a la accesibilidad", "field"], ["2. Correo institucional", "ana@ejemplo.test", "field"], ["3. Enviar inscripción", "Contorno visible al enfocar", "focus"]]],
        ["Página de confirmación", [["Inscripción confirmada", "Encabezado de la página de destino", "note"], ["Folio de ejemplo", "A-104", "note"], ["Resultado de la acción", "Enter o Espacio activan el mismo envío en intentos separados.", "note"]]]
      ]),
      "Reproduce estas pantallas y enlaza la acción de envío al resultado. Lleva a código el mismo nombre y orden del botón. T-01 comprueba la acción sin ratón.",
      [["2.1.1", "El control del prototipo interactivo admite las teclas de activación."], ["2.4.3", "El orden de foco sigue las tres acciones numeradas."], ["2.4.7", "El botón enfocado tiene indicador visible."]], "keyboard"),

    "artifact:accessible-design-system": example("dialog", "Ficha BTN-03 · Acción de salida del diálogo",
      screens([
        ["Estado normal", [["Volver", "", "action"], ["Estilo", "Texto #113362 sobre fondo #FFFFFF. Contraste aproximado 12.6:1.", "note"]]],
        ["Estado con teclado", [["Volver", "Contorno oscuro de 3 px, separado 3 px", "focus"], ["Uso", "Al activar Volver, cerrar el diálogo y regresar al disparador.", "note"]]]
      ]),
      "Especifica colores, nombre y variantes. Mide el texto en la superficie real y prueba el indicador del componente integrado.",
      [["1.4.3", "El texto normal requiere al menos 4.5:1 salvo las excepciones del criterio."], ["2.4.7", "El estado de foco se distingue durante el uso con teclado."]]),

    "artifact:accessible-architecture-diagrams": example("status", "D-05 · Secuencia UML del folio",
      diagram("secuencia-folio.svg", "Diagrama de secuencia UML de la confirmación de inscripción", [
        "Formulario llama a Servicio de talleres con guardar(datos).",
        "Servicio de talleres devuelve el folio A-104. La respuesta se muestra con una flecha discontinua.",
        "Formulario llama a Región de estado con mostrarFolio(A-104). La región actualiza el texto sin que el formulario mueva el foco."
      ]),
      "Usa las líneas de vida para asignar cada responsabilidad y lee los mensajes de arriba hacia abajo. La plantilla de implementación incorpora la región que se actualiza al recibir el folio.",
      [["4.1.3", "El folio que aparece en la misma página debe ser anunciable sin recibir el foco."]], "uml"),

    "artifact:accessible-mockups": example("errors", "D-02 · Maqueta de error y recuperación",
      screens([
        ["Después de enviar «ana»", [["Revisa tu inscripción", "El resumen recibe el foco.", "note"], ["Correo institucional", "Enlace al campo inválido", "action"], ["Correo institucional", "ana", "field"], ["Error del campo", "Ingresa un correo con @ y dominio.", "note"]]],
        ["Al activar el enlace del resumen", [["Correo institucional", "ana · el campo recibe el foco", "field"], ["Error del campo", "Ingresa un correo con @ y dominio.", "note"], ["Enviar inscripción", "", "action"]]]
      ]),
      "Dibuja el resumen, el mensaje local y el campo con el valor conservado. Anota ambos destinos del foco para que implementación pueda reproducirlos.",
      [["3.3.1", "La maqueta identifica qué campo falló y por qué."], ["3.3.3", "El mensaje dice cómo corregir el correo."], ["2.4.3", "La anotación define un destino lógico para el foco."]], "errors"),

    "artifact:accessible-interaction-diagrams": example("dialog", "D-03 · Máquina de estados UML del diálogo",
      diagram("estados-dialogo.svg", "Diagrama UML de estados del diálogo de revisión", [
        "El estado inicial es Formulario. Revisar inscripción abre el diálogo y enfoca Volver.",
        "Mientras el diálogo está abierto, Tab y Mayús+Tab recorren sus acciones.",
        "Volver o Escape cierran el diálogo y regresan el foco a Revisar inscripción.",
        "Confirmar cierra el diálogo, devuelve el foco a Revisar inscripción e inicia el estado Guardando.",
        "Si el servicio guarda la inscripción, se muestra y anuncia el folio. Si rechaza el guardado, el portal explica el fallo y vuelve al formulario con los datos intactos."
      ]),
      "Las etiquetas de las transiciones describen evento y efecto. Aplica el patrón modal en implementación y repite el camino de retorno con teclado.",
      [["2.1.2", "Hay una salida del modal mediante teclado."], ["2.4.3", "El foco entra en el diálogo y regresa al disparador al cerrar."], ["4.1.3", "La confirmación que aparece en la misma vista se anuncia como mensaje de estado."]], "uml"),

    "artifact:formal-accessibility-design-model": example("errors", "Esquema e instancia del campo Correo",
      code(`# Instancia en YAML
id: correo
tipo: email
etiqueta: Correo institucional
invalido: true
error:
  id: correo-error
  texto: Ingresa un correo con @ y dominio.

# Reglas del validador
# etiqueta debe tener texto.
# Si invalido es true, error.id y error.texto son obligatorios.
# Cada id debe ser único en el formulario.`),
      "Crea una instancia válida y otra sin etiqueta. Configura el validador para rechazar la segunda y verifica que la salida vincule el texto de error con el input.",
      [["3.3.2", "El modelo exige una etiqueta que identifica el dato solicitado."], ["1.3.1", "La salida debe preservar la relación entre campo y mensaje."]], "labels"),

    // Implementación: prácticas.
    "practice:use-accessible-components": example("dialog", "Integración del diálogo nativo",
      screens([
        ["Formulario", [["Revisar inscripción", "", "action"], ["Al abrir", "showModal() abre el diálogo titulado Confirmar inscripción.", "note"]]],
        ["Modal abierto", [["Confirmar inscripción", "Revisa los datos antes de confirmar.", "note"], ["Taller", "Introducción a la accesibilidad", "note"], ["Correo institucional", "ana@ejemplo.test", "note"], ["Volver", "Foco inicial", "focus"], ["Confirmar", "", "action"]]]
      ]),
      "Integra dialog con showModal() y conserva el título visible. Comprueba con teclado y lector de pantalla la apertura, el recorrido, Escape y el retorno al botón.",
      [["2.1.2", "Se puede salir mediante Volver o Escape."], ["4.1.2", "El diálogo expone su nombre y función."]], "nativeDialog"),

    "practice:iterative-accessibility-bug-fixing": example("keyboard", "INC-01 · Reproducir, corregir y volver a probar",
      flow([
        ["v1.1 · Reproducir", "Llegar a Enviar con Tab. Enter no activa el control."],
        ["Corrección", "Usar button type=submit con el texto Enviar inscripción. Conservar el estilo de foco."],
        ["v1.2 · Repetir", "Ejecutar T-01a con Enter y T-01b con Espacio en intentos separados."],
        ["Cerrar", "Adjuntar un folio por intento y agregar T-01 a regresión."]
      ]),
      "Registra qué versión falló y cuál contiene la corrección. Conserva los mismos datos iniciales en ambas ejecuciones.",
      [["2.1.1", "La corrección permite realizar la misma acción con teclado."]], "keyboard"),

    "practice:accessible-definition-of-done": example("keyboard", "Revisión de cambios · HU-01",
      table(["Punto de revisión", "Evidencia en v1.2", "Decisión"], [
        ["Enviar con teclado", "T-01a y T-01b pasan.", "Aprobado"],
        ["Indicador de foco", "Visible con Tab y Mayús+Tab.", "Aprobado"],
        ["Foco con cabecera fija", "Al ampliar, la cabecera oculta por completo Enviar.", "Abrir INC-11 y repetir antes de integrar."]
      ]),
      "Aplaza el cierre de la historia hasta corregir el tercer punto y comprobarlo otra vez. Registra la evidencia junto a la solicitud de cambios.",
      [["2.4.7", "El indicador debe ser visible al operar con teclado."], ["2.4.11", "Un componente enfocado no debe quedar totalmente oculto por contenido creado por el sitio."]]),

    "practice:use-accessible-templates": example("status", "Integración de la plantilla · Orden de lectura",
      flow([
        ["Saltar al contenido", "El enlace lleva al main de inscripción."],
        ["Contenido principal", "Título Inscripción al taller, campos etiquetados y botón Enviar inscripción."],
        ["Región de estado", "Existe vacía al cargar. Al guardar muestra el folio A-104."],
        ["Comprobación", "Probar enlace de salto y anuncio del folio sin mover el foco."]
      ]),
      "Añade el formulario al espacio editable. Conserva el destino del enlace de salto y la región que el código actualiza.",
      [["2.4.1", "El enlace permite omitir el bloque de navegación repetido."], ["4.1.3", "La plantilla mantiene el punto de anuncio del resultado."]]),

    "practice:reusable-accessibility-libraries": example("errors", "Módulo reutilizable · Llevar del resumen al correo",
      code(`<section aria-labelledby="resumen-titulo">
  <h2 id="resumen-titulo" tabindex="-1">Revisa tu inscripción</h2>
  <ul><li><a id="ir-correo" href="#correo">
    Correo institucional: ingresa un correo con @ y dominio.
  </a></li></ul>
</section>
<label for="correo">Correo institucional</label>
<input id="correo" name="correo" type="email" value="ana"
       aria-invalid="true" aria-describedby="correo-error">
<p id="correo-error">Ingresa un correo con @ y dominio.</p>
<script>
  document.getElementById("resumen-titulo").focus();
  document.getElementById("ir-correo").addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("correo").focus();
  });
</script>`, [
        ["Resultado de activar el enlace", [["Correo institucional", "ana · foco en el campo", "field"], ["Error", "Ingresa un correo con @ y dominio.", "note"]]]
      ]),
      "Inserta el fragmento tras rechazar el envío en la validación propia de HU-02. Extrae el comportamiento para recibir el ID del campo y el mensaje. Al validar de nuevo, limpia el estado inválido y el error cuando proceda.",
      [["3.3.1", "El resumen y el campo identifican el dato inválido y describen el problema."], ["1.3.1", "aria-describedby asocia el texto al campo."], ["2.4.3", "El enlace lleva el foco a Correo."]], "errors"),

    "practice:runtime-accessibility-preferences": example("reflow", "Panel de preferencias · Texto grande",
      screens([
        ["Selección guardada", [["Tamaño del texto", "Grande", "field"], ["Restablecer preferencias", "", "action"], ["Estado", "Tamaño de texto guardado.", "note"]]],
        ["Al volver al formulario", [["Correo institucional", "ana@ejemplo.test", "field"], ["Enviar inscripción", "", "action"], ["Comprobación", "Los textos largos se ajustan sin tapar controles.", "note"]]]
      ]),
      "Implementa una opción etiquetada, guarda el valor elegido y ofrece restablecer. Prueba la preferencia junto con la ampliación del navegador.",
      [["1.4.4", "Verifica el aumento de texto hasta el 200 % sin pérdida de información o función."], ["1.4.10", "Comprueba que la preferencia no rompa la redistribución."]]),

    // Implementación: artefactos.
    "artifact:accessible-code": example("keyboard", "HU-01 · Formulario con botón de envío nativo",
      code(`<form action="/inscripciones" method="post">
  <label for="taller">Taller</label>
  <select id="taller" name="taller" required>
    <option value="accesibilidad">Introducción a la accesibilidad</option>
  </select>
  <label for="correo">Correo institucional</label>
  <input id="correo" name="correo" type="email" required>
  <button type="submit">Enviar inscripción</button>
</form>
<style>
  form :focus-visible {
    outline: 3px solid #113362;
    outline-offset: 3px;
  }
</style>`, [
        ["Aspecto del formulario con teclado", [["Taller", "Introducción a la accesibilidad", "field"], ["Correo institucional", "ana@ejemplo.test", "field"], ["Enviar inscripción", "Foco visible", "focus"]]]
      ]),
      "Conecta la ruta de ejemplo al servicio de inscripciones de tu aplicación. Rellena el formulario y ejecuta T-01 con Enter y Espacio por separado.",
      [["2.1.1", "El botón nativo activa el envío con teclado."], ["2.4.7", "El estilo conserva un indicador visible."], ["3.3.2", "Los controles tienen etiquetas visibles."]], "keyboard"),

    "artifact:reusable-accessible-components": example("dialog", "MOD-01 · Instancia reutilizable del diálogo",
      code(`<button type="button" id="revisar">Revisar inscripción</button>
<dialog id="revision" aria-labelledby="revision-titulo">
  <h2 id="revision-titulo">Confirmar inscripción</h2>
  <p>Taller: Introducción a la accesibilidad.</p>
  <p>Correo institucional: ana@ejemplo.test.</p>
  <form method="dialog">
    <button value="volver" autofocus>Volver</button>
    <button value="confirmar">Confirmar</button>
  </form>
</dialog>
<script>
  const revisar = document.getElementById("revisar");
  const revision = document.getElementById("revision");
  revisar.addEventListener("click", () => {
    revision.returnValue = "";
    revision.showModal();
  });
  revision.addEventListener("close", () => {
    revisar.focus();
    if (revision.returnValue === "confirmar") {
      revision.dispatchEvent(new Event("inscripcion-confirmada", { bubbles: true }));
    }
  });
</script>`, [
        ["Diálogo abierto", [["Confirmar inscripción", "Revisa tu taller y tu correo.", "note"], ["Taller", "Introducción a la accesibilidad", "note"], ["Correo institucional", "ana@ejemplo.test", "note"], ["Volver", "Foco inicial", "focus"], ["Confirmar", "", "action"]]]
      ]),
      "Cada instancia necesita IDs únicos. Al integrar el componente, escucha inscripcion-confirmada para iniciar el guardado. La aplicación evita solicitudes duplicadas y comunica éxito o rechazo según CU-03. El fragmento muestra el diálogo y su evento.",
      [["2.1.2", "Escape y Volver cierran el diálogo desde el teclado."], ["2.4.3", "Volver recibe el foco inicial y cancelar lo devuelve al disparador."], ["4.1.2", "aria-labelledby toma el nombre del título visible."]], "nativeDialog"),

    "artifact:accessible-templates": example("status", "Plantilla de la vista · Región para el folio",
      code(`<a href="#contenido">Saltar al contenido</a>
<header>
  <nav aria-label="Principal"><a href="/">Inicio</a></nav>
</header>
<main id="contenido" tabindex="-1">
  <h1>Inscripción al taller</h1>
  <!-- Insertar el formulario de inscripción. -->
  <p id="estado-inscripcion" role="status"></p>
</main>
<script>
  function mostrarFolio(folio) {
    document.getElementById("estado-inscripcion").textContent =
      "Inscripción confirmada. Folio " + folio;
  }
  // Invocar mostrarFolio(folio) al recibir una respuesta exitosa.
</script>`, [
        ["Resultado en la misma vista", [["Inscripción confirmada", "Folio A-104", "note"], ["Foco", "Permanece en el control desde el que se envió.", "note"]]]
      ]),
      "Mantén la región montada antes de guardar. Conecta mostrarFolio a la respuesta exitosa y comprueba su anuncio con T-05.",
      [["2.4.1", "El enlace de salto evita la navegación repetida."], ["4.1.3", "role=status hace identificable el mensaje sin mover el foco."]], "errors"),

    "artifact:accessibility-issue-records": example("keyboard", "INC-01 · No se puede enviar con Enter",
      record([
        ["Versión y entorno", "v1.1 · Chromium · teclado físico · /inscripcion."],
        ["Pasos", "Seleccionar taller, escribir ana@ejemplo.test, pulsar Tab hasta Enviar inscripción y pulsar Enter."],
        ["Esperado / observado", "Esperado: un folio. Observado: no hay envío."],
        ["Impacto y origen", "Bloquea HU-01. El control solo responde al clic."],
        ["Cierre", "v1.2 usa botón nativo. QA adjunta T-01a y T-01b, con un folio por intento."]
      ]),
      "Adjunta pasos reproducibles y deja el folio de prueba o el resultado del servicio como evidencia de cierre.",
      [["2.1.1", "La incidencia describe una funcionalidad que no se puede operar con teclado."]]),

    "artifact:runtime-accessibility-settings": example("reflow", "PREF-04 · Contrato de tamaño de texto",
      table(["Evento", "Estado visible", "Persistencia"], [
        ["Primera visita", "Predeterminado seleccionado.", "Sin valor local."],
        ["Seleccionar Grande", "El texto crece y el formulario se redistribuye.", "Guardar texto=grande."],
        ["Recargar", "Se conserva Grande y la página sigue operable.", "Leer el valor guardado."],
        ["Restablecer", "Predeterminado seleccionado. Se mantienen los datos del formulario.", "Eliminar solo la preferencia."]
      ]),
      "Implementa cada transición y repítela con el navegador ampliado. La preferencia del sitio complementa la ampliación disponible en el navegador.",
      [["1.4.4", "Comprueba el aumento del texto al 200 %."], ["1.4.10", "Mantén la inscripción operable a 320 px CSS sin desplazamiento en dos ejes."]]),
    // Pruebas: prácticas.
    "practice:automated-accessibility-testing": example("errors", "AUTO-02 · Detectar un campo sin nombre",
      code(`import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("el formulario tiene nombres accesibles", async ({ page }) => {
  await page.goto("/inscripcion");
  const resultado = await new AxeBuilder({ page })
    .include("main")
    .withRules(["label"])
    .analyze();
  expect(resultado.violations).toEqual([]);
});`),
      "En un proyecto Playwright con baseURL y @axe-core/playwright, ejecuta la prueba sobre el portal. Rompe la asociación label/for en una copia para ver el fallo y restáurala. Prueba aparte el error tras enviar.",
      [["4.1.2", "La regla label detecta ciertos controles sin nombre accesible. Una ejecución sin infracciones no valida todos los criterios."]], "axe"),

    "practice:manual-heuristic-testing": example("dialog", "Hoja de inspección MAN-03 · Diálogo",
      table(["Acción", "Esperado", "Observado en v1.1"], [
        ["Tab hasta Revisar inscripción, luego Enter.", "Abrir el diálogo y enfocar Volver.", "Abre, pero el foco permanece en la página."],
        ["Tab y Mayús+Tab dentro del diálogo.", "Recorrer Volver y Confirmar.", "Tab llega a Correo detrás del diálogo."],
        ["Leer las acciones.", "El texto permite anticipar su efecto.", "Sugerencia de claridad: «Volver al formulario»."]
      ]),
      "Repite el caso sin ratón. Registra por separado el fallo de foco y la sugerencia de usabilidad, y adjunta el entorno y la versión.",
      [["2.4.3", "La inspección verifica dónde queda el foco al abrir y al recorrer el diálogo."], ["2.1.2", "Completa la revisión con Escape y la acción de salida."]], "dialog"),

    "practice:testing-with-disabled-people": example("errors", "Guion de sesión U-02 · Inscripción con error",
      record([
        ["Preparación", "Consentimiento, entorno de prueba, datos ficticios y tecnología elegida por la persona."],
        ["Consigna", "Inscríbete en el taller. Para el primer intento usa «ana» en Correo institucional."],
        ["Qué observar", "Si localiza el error, si encuentra el campo, qué ayuda solicita y si termina la tarea."],
        ["Registro ficticio", "P-02 usa lector de pantalla. En v1 pidió ayuda para localizar el error. En v2 siguió el enlace y corrigió sin ayuda."],
        ["Seguimiento", "Repetir con otras formas de interacción. Comparar observaciones con T-02."]
      ]),
      "Lee la consigna sin indicar dónde está el aviso. Conserva códigos de participante y el contexto de cada intento.",
      [["3.3.1", "La sesión explora si se identifica el campo y se entiende el error. La prueba técnica se documenta por separado."]], "evaluate"),

    "practice:wcag-em-audits": example("status", "Plan de auditoría · Portal de talleres v1.2",
      flow([
        ["1. Alcance", "Portal de talleres v1.2, objetivo WCAG 2.2 AA. Excluir el panel administrativo y declararlo."],
        ["2. Exploración", "Catálogo, inscripción, errores, revisión modal y confirmación."],
        ["3. Muestra", "Incluir el proceso completo de inscripción y los estados relevantes."],
        ["4. Evaluación", "Aplicar los criterios del alcance y documentar resultados, entornos y evidencias."],
        ["5. Informe", "Describir alcance, muestra, límites y hallazgos. T-05 registra el anuncio del folio."]
      ]),
      "Crea una entrada por criterio y por vista evaluada. El caso del folio es una entrada de la auditoría y se complementa con las demás comprobaciones del proceso.",
      [["4.1.3", "Dentro de la muestra, comprueba el mensaje de éxito de la inscripción."], ["2.1.1", "Comprueba la operación por teclado del proceso completo."]], "wcagem"),

    "practice:multimethod-accessibility-evaluation": example("errors", "Cruce de evidencias · HU-02",
      table(["Método", "Hallazgo ficticio", "Acción"], [
        ["axe en estado inicial", "La regla label no detecta campos sin nombre.", "Guardar el resultado y su alcance."],
        ["Revisión manual del error", "El mensaje «Inválido» no dice cómo corregir el correo.", "Proponer texto con ejemplo de formato."],
        ["Sesión de usuarios", "P-02 pide ayuda para volver al campo.", "Probar D-02 con resumen enlazado y repetir T-02."]
      ]),
      "Ejecuta las tres revisiones sobre la misma versión. Usa los resultados en conjunto para decidir qué cambiar y qué prueba repetir.",
      [["3.3.1", "La revisión manual comprueba identificación y descripción."], ["3.3.3", "La sugerencia debe indicar cómo corregir el formato cuando se conoce."]], "evaluate"),

    "practice:accessibility-regression-and-ab-testing": example("errors", "Comparación A/B del resumen · Datos ficticios",
      table(["Comprobación", "A · Antes del formulario", "B · Antes de Enviar"], [
        ["Regresión T-02", "Pasa. El enlace enfoca Correo institucional.", "Pasa. El enlace enfoca Correo institucional."],
        ["Localiza el error sin ayuda", "4 de 5 participantes de A.", "2 de 5 participantes de B."],
        ["Decisión", "Revisar con otra ronda en el mismo escenario.", "Mantener como comparación."]
      ]),
      "Verifica el comportamiento de teclado en ambas variantes antes de exponerlas. Conserva la asignación de participantes y los límites de la muestra al interpretar la diferencia.",
      [["2.4.3", "Ambas variantes mantienen el destino del foco al activar el enlace."], ["3.3.1", "Ambas muestran el campo afectado y el texto del error."]], "evaluate"),

    "practice:accessible-bdd-acceptance-testing": example("keyboard", "T-01 · Escenarios de aceptación de HU-01",
      code(`# language: es
Característica: Enviar la inscripción con teclado
  Esquema del escenario: Activar el botón de envío
    Dado que la inscripción contiene datos válidos
    Y el foco está en "Enviar inscripción"
    Cuando pulso "<tecla>"
    Entonces la inscripción muestra un folio
    Y se crea exactamente un registro

    Ejemplos:
      | tecla   |
      | Enter   |
      | Espacio |`),
      "Vincula cada paso a tu herramienta de pruebas. Reinicia los datos entre filas, comprueba el foco antes de pulsar y valida la cantidad de registros en un entorno de prueba.",
      [["2.1.1", "Cada fila comprueba una forma de activar el botón con teclado y terminar la tarea."]], "gherkin"),

    "practice:pdca-accessibility-testing": example("keyboard", "Ciclo PDCA · El envío vuelve a funcionar",
      flow([
        ["Planear", "Objetivo: T-01a Enter y T-01b Espacio pasan en la misma versión."],
        ["Hacer", "Ejecutar ambos casos con datos válidos en v1.1."],
        ["Verificar", "0 de 2 casos pasan. El control solo responde al clic."],
        ["Actuar", "Corregir INC-01, añadir regresión y repetir en v1.2. Resultado ficticio: 2 de 2."]
      ]),
      "Usa los mismos casos y condiciones al comparar las versiones. Si cambia la prueba, guarda qué cambió antes de comparar las cifras.",
      [["2.1.1", "El indicador del ciclo mide si se puede completar el envío por teclado."]]),

    // Pruebas: artefactos.
    "artifact:automated-test-reports": example("errors", "AUTO-02 · Informe de etiqueta faltante",
      record([
        ["Ejecución", "v1.1 · Chromium · /inscripcion · estado inicial · axe, regla label."],
        ["Hallazgo", "input#correo no tiene nombre accesible. Adjuntar resultado JSON con el nodo."],
        ["Corrección", "Añadir etiqueta visible con for=correo. Vincular el cambio a REQ-02."],
        ["Repetición", "v1.2: 0 infracciones de la regla label en el mismo estado."],
        ["Cobertura", "El informe documenta la regla ejecutada. T-02 sigue comprobando mensajes y foco."]
      ]),
      "Adjunta la salida original y la repetición. Confirma que el hallazgo corresponde al nodo registrado antes de abrir la incidencia.",
      [["4.1.2", "La regla aplicada comprueba el nombre accesible del control dentro de su alcance."]], "axe"),

    "artifact:wcag-checklists": example("errors", "T-02 · Lista completada para el error de correo",
      table(["Criterio", "Qué ejecutar", "Resultado v1.2"], [
        ["3.3.1 · Identificación", "Enviar «ana». Leer el resumen y el mensaje local.", "Cumple: ambos identifican Correo institucional y el formato inválido."],
        ["3.3.3 · Sugerencia", "Leer la indicación y corregir a «ana@ejemplo.test».", "Cumple: el mensaje pide @ y dominio, y el valor se puede corregir."],
        ["2.4.3 · Orden del foco", "Activar el enlace a Correo con Enter.", "Cumple: el foco llega al campo con el valor conservado."]
      ]),
      "Usa datos que provoquen el estado inválido del servicio de prueba. Guarda el texto observado, la secuencia de foco y la versión junto a la lista.",
      [["3.3.1", "Registra si se nombra el campo y se describe el error."], ["3.3.3", "Registra si la sugerencia indica cómo corregirlo."], ["2.4.3", "Registra el destino del foco tras el enlace."]], "errors"),

    "artifact:manual-evaluation-reports": example("dialog", "MAN-03 · El foco queda fuera del diálogo",
      record([
        ["Entorno", "v1.1 · Chromium · teclado · pantalla de revisión."],
        ["Reproducción", "Llegar a Revisar inscripción con Tab. Pulsar Enter y luego Tab."],
        ["Esperado", "Al abrir, Volver recibe el foco. Tab pasa a Confirmar."],
        ["Observado e impacto", "Tab enfoca Correo detrás del diálogo y dificulta confirmar."],
        ["Repetición v1.2 · T-03a y T-03b", "El foco inicial llega a Volver. Tab alcanza Confirmar. Volver y Escape cierran y devuelven el foco al disparador sin iniciar el guardado."],
        ["Pendiente en el portal integrado · T-03c", "Simular que el servicio rechaza el guardado. Verificar aviso de error, datos conservados y reintento desde el mismo formulario."]
      ]),
      "Documenta qué versión falló y guarda el registro del recorrido posterior a la corrección. Repítelo con Mayús+Tab y con la salida Volver.",
      [["2.4.3", "Evalúa el orden y el destino del foco en ambas versiones."], ["2.1.2", "Comprueba una salida por teclado desde el diálogo."]], "dialog"),

    "artifact:user-testing-reports": example("errors", "Informe U-02 · Datos de sesiones ficticias",
      table(["Participante / contexto", "Resultado de tarea", "Evidencia y decisión"], [
        ["P-02 · lector de pantalla", "Corrige el correo en v2 sin ayuda.", "Usó el enlace del resumen. Mantener y volver a evaluar."],
        ["P-03 · texto ampliado", "Corrige tras desplazarse hacia arriba.", "El resumen quedaba fuera de la vista. Revisar el desplazamiento al enfocar."],
        ["P-04 · teclado", "Corrige y envía sin ratón.", "El enlace movió el foco al correo. Conservar como regresión."]
      ]),
      "Incluye el contexto y la ayuda de cada sesión. Usa los resultados para elegir cambios y nuevas pruebas del flujo.",
      [["3.3.1", "Las observaciones muestran si se pudo identificar el error."], ["2.4.3", "El informe describe si el recorrido del foco permitió corregir el campo."]], "evaluate"),

    "artifact:advanced-test-scripts": example("reflow", "T-04 · Regresión a 320 px CSS",
      code(`import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 320, height: 800 } });

test("la inscripción conserva los controles a 320 px", async ({ page }) => {
  await page.goto("/inscripcion");
  await expect(page.getByLabel("Correo institucional")).toBeVisible();
  await expect(page.getByRole("button", {
    name: "Enviar inscripción"
  })).toBeVisible();
  const anchoExtra = await page.evaluate(() =>
    document.documentElement.scrollWidth -
    document.documentElement.clientWidth
  );
  expect(anchoExtra).toBeLessThanOrEqual(1);
});`, [
        ["Resultado esperado de la prueba", [["Versión corregida", "Los controles existen y el documento no desborda.", "note"], ["Mutación controlada", "Un campo con ancho fijo de 500 px sin recorte provoca fallo.", "note"]]]
      ]),
      "Configura baseURL y ejecuta el script en la versión original y en una copia con un ancho fijo que provoque desbordamiento. Completa con una prueba manual de zoom, recorte y envío.",
      [["1.4.10", "El script es una señal de regresión a 320 px. La comprobación manual confirma que todo el contenido y la tarea siguen disponibles."]], "playwright"),

    "artifact:accessibility-test-plan": example("status", "Plan QA · Salida de v1.2",
      table(["Caso", "Entorno y acción", "Evidencia y responsable"], [
        ["T-05 · folio", "Navegador y lector de pantalla. Enviar y comprobar que se anuncia el folio sin mover el foco.", "Registro de anuncio, versión y foco · QA."],
        ["T-01 · envío", "Teclado físico. Enviar con Enter y Espacio por separado.", "Folio y registro por intento · QA."],
        ["T-02 · recuperación", "Correo «ana». Leer el resumen y corregir desde su enlace.", "Captura y recorrido de foco · QA."],
        ["T-04 · ampliación", "Vista de 320 px CSS y prueba de texto al 200 %.", "Registro de contenido, operación y desplazamiento · QA."]
      ]),
      "Ejecuta los casos sobre la versión candidata. Si un flujo crítico queda bloqueado, asigna la corrección y repite el caso antes de liberar.",
      [["4.1.3", "T-05 verifica el mensaje de éxito."], ["2.1.1", "T-01 verifica el envío por teclado."], ["3.3.1", "T-02 verifica la identificación del error."], ["1.4.10", "T-04 verifica la redistribución."]], "wcagem"),
  };

  const comparisons = {
    // Requisitos: prácticas.
    "practice:multi-method-requirements-elicitation": [
      "Una encuesta registra «el formulario es difícil», pero el equipo ignora qué persona, acción o versión produjo la barrera.",
      "OBS-01 combina la sesión P-01, la reproducción en v1.1 y la inspección del control. Las tres evidencias sustentan REQ-01 y permiten preparar T-01.",
      "Repite la tarea con teclado en la versión indicada. Si Enter falla al llegar a Enviar y el control solo tiene un evento de clic, registra ambos hechos junto a REQ-01."
    ],
    "practice:accessible-user-stories": [
      "«Como usuario quiero un formulario accesible» no señala una tarea, una forma de interacción ni un resultado que QA pueda verificar.",
      "HU-01 indica que una estudiante navega con teclado, qué acción necesita hacer y para qué. La aceptación indica las teclas y exige un solo registro por intento.",
      "Entrega la historia a alguien que no participó en su redacción. Debe poder preparar dos intentos independientes y decidir si pasan contando registros y comprobando el folio."
    ],
    "practice:wcag-based-requirements": [
      "Copiar «4.1.3: Mensajes de estado» en el catálogo no indica qué mensaje del portal se debe comprobar ni en qué momento.",
      "REQ-05 aplica el criterio al folio que aparece en la misma página. Distingue el texto visible, su anuncio y el foco que permanece en el control.",
      "En T-05, envía con teclado y lector de pantalla. Registra si se anuncia el folio después de guardar sin tener que mover el foco a la confirmación."
    ],
    "practice:define-accessible-personas": [
      "«Persona ciega que usa tecnología de apoyo» es demasiado general para decidir dónde colocar un aviso de error.",
      "PP-02 incluye una estrategia observada, una hipótesis sobre la recuperación y dos variantes que se pueden probar. La hipótesis queda señalada como pendiente.",
      "Presenta el mismo correo inválido en ambas variantes. Anota dónde empieza a buscar, si llega al campo y si pide ayuda. Actualiza el perfil con lo que se observó."
    ],
    "practice:prioritize-accessibility-backlog": [
      "Un ítem genérico «Mejorar accesibilidad» se pospone porque no muestra que el envío con teclado está bloqueado.",
      "La decisión separa el bloqueo de HU-01, la recuperación de HU-02 y una mejora de redacción. Cada ítem tiene un criterio de salida ligado a su impacto.",
      "Durante la planificación, pide que el equipo explique por qué HU-01 va primero y señale T-01. Si no existe evidencia de que el bloqueo se corrigió, el ítem sigue abierto."
    ],
    "practice:accessible-acceptance-criteria": [
      "«Mostrar error» permite aceptar una marca roja o un aviso genérico que no ayuda a corregir el correo.",
      "CA-02 fija el dato «ana», el texto que identifica el problema, el enlace al campo y el valor que debe conservarse. Así se puede probar la recuperación completa.",
      "Envía «ana» en el formulario con validación propia. Lee el aviso, activa el enlace con Enter y comprueba que Correo recibe el foco con «ana» todavía escrito."
    ],
    "practice:requirements-accessibility-review": [
      "El revisor deja «mejorar el error» en un comentario suelto y el equipo no sabe qué redacción se aceptó ni quién verifica el cambio.",
      "REV-02 guarda las versiones, el motivo para rechazar la marca roja y la redacción aprobada de REQ-02. Asigna a Diseño y QA el recorrido aún pendiente.",
      "Compara v1 y v2 en la minuta. La versión aprobada debe nombrar el campo y pedir una descripción en texto. Verifica que el pendiente tenga una prueba y un responsable."
    ],
    "practice:accessible-context-of-use": [
      "El equipo prueba una sola pantalla amplia con ratón y concluye que todo el alumnado podrá inscribirse.",
      "El mapa registra dónde se usa el portal, el modo de interacción y el ajuste de pantalla. De cada contexto sale una prueba con configuración concreta.",
      "Abre el formulario a 320 px CSS y completa la tarea. En una ejecución aparte, aumenta el texto al 200 % y comprueba que se conservan las instrucciones y los controles."
    ],
    "practice:ethnography-and-empathy": [
      "La nota «el usuario no entendió» mezcla una interpretación del equipo con lo que ocurrió y puede conducir a un cambio equivocado.",
      "OBS-02 separa el recorrido que se observó, la explicación de P-02 y la hipótesis sobre el aviso. Propone una comparación que aún debe probarse.",
      "Lee las notas con quien facilitó la sesión. Cada afirmación debe poder clasificarse como observación, explicación o hipótesis. Usa la hipótesis para preparar la siguiente sesión."
    ],
    "practice:classify-prioritize-requirements": [
      "Ordenar solo por nivel A y AA puede dejar para después un bloqueo de la inscripción en la vista ampliada.",
      "La matriz distingue el nivel WCAG de la prioridad de trabajo y registra la dependencia entre enviar y anunciar el folio. Justifica el orden por el impacto sobre la tarea.",
      "Pide al equipo que compare REQ-04 y REQ-05. Debe justificar la prioridad de cada uno con su barrera y su dependencia, aunque ambos criterios sean AA."
    ],
    "practice:iterative-accessibility-requirements": [
      "Se sobrescribe REQ-02 tras una sesión y se pierde la razón por la que el equipo cambió el formulario.",
      "El historial conserva v1, la evidencia E-02, la decisión de añadir un resumen y el vínculo con la maqueta D-02 y la prueba T-02.",
      "Parte de E-02 y localiza la versión que motivó, la maqueta actualizada y la prueba que se repite. Comprueba que el mensaje local sigue en el diseño."
    ],
    "practice:accessible-user-model": [
      "Una lista de diagnósticos no indica cómo navega una persona ni qué condiciones deben reproducirse al probar.",
      "El modelo separa entrada, salida y presentación. Cada perfil combina atributos que permiten derivar casos distintos de teclado, ampliación y orden de lectura.",
      "Toma U-04A y prepara la configuración sin asumir un dispositivo adicional. Verifica que el caso derivado especifique tarea, ancho y resultado observable."
    ],

    // Requisitos: artefactos.
    "artifact:accessible-user-stories": [
      "«Como estudiante quiero un botón accesible» nombra un control, pero omite la barrera y la meta de reservar un lugar.",
      "La tarjeta HU-01 incorpora el hallazgo OBS-01, la tarea, la forma de interacción y dos intentos verificables. Los IDs enlazan la historia con D-01 y T-01.",
      "Abre D-01 desde «Seguir el mismo caso» y localiza el botón «Enviar inscripción». En T-01 comprueba que se verifica una sola inscripción con Enter y otra con Espacio."
    ],
    "artifact:accessible-personas": [
      "Un perfil con edad y diagnóstico, pero sin contexto de uso, no ayuda a diseñar la recuperación del error.",
      "P-02 documenta meta, tecnología de apoyo, forma de orientación y barrera. La ficha conecta esa necesidad con D-02 y T-02.",
      "Elige un detalle del perfil, por ejemplo la navegación por encabezados, y comprueba que justifica una anotación concreta de la maqueta, como el título del resumen."
    ],
    "artifact:accessibility-requirements-catalog": [
      "Una lista que dice «teclado, errores, mensajes» no distingue los requisitos ni qué evidencia falta para aprobar cada uno.",
      "Cada fila tiene un ID, un criterio WCAG, un comportamiento del portal y una prueba con estado. REQ-05 conserva T-05 como pendiente de lector de pantalla.",
      "Busca REQ-05 desde T-05 y desde el diagrama D-05. Debes poder identificar el mismo mensaje de éxito y ver qué comprobación falta sin duplicar el requisito."
    ],
    "artifact:accessible-acceptance-criteria": [
      "Aceptar la historia cuando «el mensaje aparece» deja sin comprobar la recuperación y permite que se pierda el taller elegido.",
      "La tabla separa identificar, corregir y recuperar. Da una entrada inválida, una entrada válida y el resultado observable de cada paso.",
      "Ejecuta CA-02a, CA-02b y CA-02c en orden. El criterio solo pasa cuando se entiende el error, el enlace enfoca Correo y el taller sigue seleccionado."
    ],
    "artifact:accessible-backlog": [
      "Los defectos se acumulan en una sola tarjeta, sin orden, dueño ni evidencia suficiente para decidir qué entra al sprint.",
      "El backlog asigna prioridades y responsables, declara la dependencia de HU-05 con HU-01 y pide una evidencia de cierre por tarjeta.",
      "Intenta mover HU-01 a Terminado. La tarjeta solo está lista si el equipo puede localizar T-01a y T-01b, con un resultado registrado para cada tecla."
    ],
    "artifact:stakeholder-analysis": [
      "Una lista de cargos dice quién integra el proyecto, pero no cuándo consultar a estudiantes ni quién valida el mensaje de error.",
      "El mapa separa la experiencia de quienes usan el portal, la regla que aporta Coordinación y la responsabilidad de Desarrollo y QA. Incluye un momento y una evidencia por grupo.",
      "Busca quién valida el dominio permitido y quién comprueba T-02. Si ambas responsabilidades se pueden localizar y hay una sesión con estudiantes prevista, el mapa sirve para actuar."
    ],
    "artifact:requirements-template": [
      "Una plantilla de texto libre produce requisitos dispares. El folio se describe como «mostrar confirmación» sin una prueba asociada.",
      "La plantilla fija contexto, fuente, criterio, comportamiento, verificación y responsable. La instancia de REQ-05 documenta el anuncio que debe observar QA.",
      "Completa la misma plantilla para otro requisito y pide una revisión cruzada. La persona revisora debe encontrar la condición y el resultado esperado sin completar campos por su cuenta."
    ],
    "artifact:accessible-use-cases": [
      "El dibujo «Estudiante → Revisar inscripción» delimita el alcance, pero por sí solo no dice cómo entra y sale el foco, qué pasa al cancelar o cuándo se crea la reserva.",
      "CU-03 incluye objetivo, disparador, precondiciones, flujo principal, alternativas y poscondiciones. Describe Volver, Escape y el rechazo del servicio con la misma entrada y resultados observables.",
      "Sigue los caminos T-03a, T-03b y T-03c. Confirma que solo el camino exitoso crea la reserva, que los otros conservan los datos y que las transiciones coinciden con D-03."
    ],
    "artifact:accessible-definition-of-done": [
      "Cerrar la tarjeta porque se integró el código deja sin revisar el foco bajo la cabecera fija en una vista ampliada.",
      "La DoD exige evidencia separada de teclado, foco visible y foco no oculto. Mantiene el último punto pendiente, aunque los anteriores ya pasaron.",
      "Con la cabecera fija activa, enfoca Enviar en la vista ampliada. Si la cabecera cubre todo el control, registra el fallo y conserva HU-01 en revisión."
    ],
    "artifact:conceptual-accessibility-model": [
      "Un modelo con «mensaje de error» como texto global permite perder qué campo causó el problema.",
      "Las asociaciones UML enlazan una Inscripción con sus Campos y cada ErrorDeCampo con un Campo. Las multiplicidades permiten varios errores sin permitir un error huérfano en el modelo.",
      "Instancia un error para correo y otro para el taller. Ambos deben apuntar a su propio campo y poder convertirse en dos enlaces del resumen."
    ],
    "artifact:context-of-use-specification": [
      "«Se usa en móvil» no especifica la tarea, el ajuste de ampliación ni qué controles se deben conservar.",
      "CTX-04 identifica la tarea, el ancho equivalente a 320 px CSS, la alternativa de texto al 200 % y los controles imprescindibles para terminarla.",
      "Prepara T-04 a partir de la ficha. Registra el ancho y el ajuste de cada ejecución y recorre la inscripción completa hasta Enviar."
    ],

    // Diseño: prácticas.
    "practice:accessible-prototyping": [
      "Una captura del formulario solo muestra el estado inicial. No enseña el foco ni el destino del envío.",
      "El boceto anota el orden de Tab, el contorno de Enviar y la página de confirmación con folio. Diferencia las dos pantallas del recorrido.",
      "En el prototipo interactivo, recorre Taller, Correo y Enviar con Tab. Pulsa Enter y comprueba que llegas a la pantalla prevista con su encabezado."
    ],
    "practice:user-centered-accessible-design": [
      "Mover el aviso por preferencia del equipo deja sin resolver si quienes se encuentran la barrera podrán localizarlo.",
      "Cada cambio de D-02 tiene una observación de sesión y una comprobación: resumen al inicio, enlace al correo y conservación del taller.",
      "Repite la consigna con la versión revisada. Anota si la persona localiza el resumen, alcanza Correo y corrige el dato, y qué ayuda necesitó."
    ],
    "practice:expert-prototype-review": [
      "La revisión marca «diálogo inaccesible» sin indicar cómo reproducirlo o qué parte se debe corregir.",
      "EXP-03 separa el foco inicial, el nombre del diálogo y el retorno al disparador. Cada hallazgo tiene un efecto y una corrección propuesta.",
      "En el prototipo interactivo, abre con Enter, comprueba el título anunciado y cierra con Escape. Registra dónde queda el foco en cada punto."
    ],
    "practice:accessible-guides-and-patterns": [
      "Copiar el aspecto de una ventana superpuesta no garantiza que tenga nombre, un recorrido de foco o una salida por teclado.",
      "MOD-01 adapta el patrón modal con un nombre visible, dos acciones, foco inicial y salida por Volver o Escape.",
      "Abre el componente real y recorre sus acciones con Tab y Mayús+Tab. Comprueba que Escape sale del modal y devuelve el foco al disparador."
    ],
    "practice:design-accessible-components": [
      "Un campo cuyo único rótulo es un placeholder pierde su indicación al escribir. Un borde rojo solo señala visualmente el error.",
      "La especificación conserva la etiqueta y muestra un mensaje de corrección. También documenta cómo asociar el mensaje y exponer el estado inválido al programar.",
      "Compara los estados inicial e inválido. La etiqueta debe seguir visible y el mensaje debe decir qué cambiar. En el componente real, verifica la relación con el campo."
    ],
    "practice:accessible-architecture": [
      "El servidor devuelve un código de éxito, pero el contrato no asigna quién informa el folio en la vista.",
      "ADR-05 asigna el folio a la API y el aviso a la vista. La región existe antes del envío y se actualiza cuando llega el resultado.",
      "Simula HTTP 201 con A-104. Comprueba que la vista muestra el mismo folio y que el lector de pantalla puede anunciarlo sin que cambie el foco."
    ],
    "practice:iterative-design-with-disabled-people": [
      "Se recibe una observación y se corrige la maqueta sin volver a probar si la persona logró recuperar el formulario.",
      "El registro enlaza la dificultad observada en v1, la propuesta hecha con P-02 y el resultado de volver a ejecutar la tarea en v2.",
      "Repite la misma consigna en ambas versiones y registra si se completó la tarea y qué ayuda se necesitó. Usa esos datos para planear otra iteración."
    ],
    "practice:accessible-variability": [
      "Reducir la vista amplia sin redistribuir sus dos columnas recorta la ayuda o obliga a desplazarse en dos ejes.",
      "D-04 mantiene los campos y el botón en ambos anchos. La ayuda pasa a la misma columna y el orden de los controles se conserva.",
      "Recorre la versión implementada a 320 px CSS. Lee la ayuda, llena los datos y acciona Enviar. En otra ejecución, aumenta el texto al 200 % y busca recortes."
    ],
    "practice:accessible-domain-modeling": [
      "El error se representa como un mensaje suelto y no se sabe qué identificador debe usar el enlace del resumen.",
      "El diagrama de objetos instancia correo y error01 con sus valores y los conecta. Así se puede seguir el mismo campo desde el modelo hasta la interfaz.",
      "Genera el resumen a partir de CORREO_INVALIDO. Su enlace debe conducir al control con ID correo y su texto debe coincidir con el mensaje definido."
    ],

    // Diseño: artefactos.
    "artifact:accessible-prototypes": [
      "Una pantalla visualmente terminada puede omitir qué control recibe foco, en qué orden se recorre y qué aparece tras enviar.",
      "D-01 dibuja las dos páginas del recorrido, numera los controles y anota el foco de Enviar. El folio de ejemplo permite reconocer el final de HU-01.",
      "Prueba el prototipo interactivo con Tab y una tecla de activación. La anotación se cumple si ves el foco y alcanzas la página de confirmación con el folio."
    ],
    "artifact:accessible-design-system": [
      "La biblioteca ofrece un botón para el ratón y una variante de foco casi invisible. Los equipos tienen que adivinar cómo se ve al tabular.",
      "BTN-03 define texto y fondo, muestra el indicador de foco y explica qué hace Volver en el diálogo. La pareja propuesta tiene un contraste aproximado de 12.6:1.",
      "Mide el texto sobre el fondo real del componente. Luego enfoca Volver con Tab y comprueba que el contorno se distingue de la superficie que lo rodea."
    ],
    "artifact:accessible-architecture-diagrams": [
      "Una flecha «Guardar → Listo» no identifica qué elemento recibe el folio ni cómo se comunica a quien no lo ve.",
      "D-05 separa las líneas de vida de Formulario, Servicio y Región de estado. Marca la respuesta con el folio y la actualización posterior de la región.",
      "Traza A-104 desde la respuesta hasta la región. Verifica que esta ya exista y que el código la actualice sin trasladar el foco desde Enviar."
    ],
    "artifact:accessible-mockups": [
      "La maqueta solo marca el borde del correo en rojo y no dibuja cómo vuelve la persona al campo después de enviar.",
      "D-02 muestra el resumen con enlace, el error en palabras y el correo conservado. Anota dos destinos de foco: el encabezado del resumen y el campo.",
      "Entrega la maqueta a otra persona. Debe poder señalar dónde aparece el mensaje, qué enlace activa y a qué control llega sin que se lo expliquen."
    ],
    "artifact:accessible-interaction-diagrams": [
      "El flujo «abrir → confirmar» omite cómo se cancela, qué ocurre mientras guarda y adónde vuelve el foco si la solicitud falla.",
      "D-03 distingue Formulario, Diálogo abierto, Guardando y Confirmación. Marca las salidas con Volver o Escape y el retorno con datos conservados si el servicio rechaza la solicitud.",
      "Simula abrir, cancelar, confirmar y recibir un rechazo. Para cada transición, identifica el evento, el nuevo estado y el foco que debe observar QA en T-03."
    ],
    "artifact:formal-accessibility-design-model": [
      "El modelo permite generar un campo sin etiqueta o en estado inválido sin un texto de error.",
      "La instancia y sus reglas exigen etiqueta, ID único y mensaje para el estado inválido. El error queda vinculado al campo en la salida esperada.",
      "Pasa la instancia al validador y repite sin etiqueta y sin error.texto. Esas variantes deben rechazarse. Inspecciona el HTML generado para comprobar las asociaciones."
    ],

    // Implementación: prácticas.
    "practice:use-accessible-components": [
      "Una capa hecha con un div se ve como un modal, pero el foco puede seguir en los controles de la página que quedaron detrás.",
      "La integración usa dialog con showModal(), un título que da nombre al diálogo y Volver como punto de entrada. Define qué sucede al cerrar.",
      "Activa Revisar inscripción con teclado. Comprueba el nombre anunciado, que Tab recorra el modal y que Escape lo cierre y devuelva el foco al botón."
    ],
    "practice:iterative-accessibility-bug-fixing": [
      "Cambiar el color o la forma de Enviar deja intacta la causa del fallo: el control simulado sigue sin activar el envío con teclado.",
      "INC-01 pasa de un control que solo escucha clic a un botón de envío nativo. Se mantiene visible el foco y se agrega la prueba T-01 a regresión.",
      "Ejecuta T-01a y T-01b en v1.1 y v1.2. Registra la tecla y el folio o la falta de envío. La corrección se confirma cuando ambos intentos pasan en v1.2."
    ],
    "practice:accessible-definition-of-done": [
      "La revisión aprueba el cambio porque Enter funciona y el contorno es visible en la vista normal. La cabecera sigue tapando el control cuando se amplía.",
      "La revisión distingue operación, indicador y ocultamiento de foco. INC-11 conserva la evidencia del fallo y bloquea el cierre de HU-01.",
      "Repite la prueba a la ampliación registrada con la cabecera fija. Adjunta evidencia de que el control enfocado ya no queda completamente cubierto."
    ],
    "practice:use-accessible-templates": [
      "La página nueva copia una cabecera y crea su propio contenido, pero pierde el enlace de salto y solo muestra el folio visualmente.",
      "La plantilla aporta un destino main y una región de estado que existe desde la carga. El formulario ocupa su espacio sin eliminar esos elementos.",
      "En la página integrada, activa «Saltar al contenido» y confirma el destino. Después guarda con lector de pantalla y escucha el folio sin desplazarte al mensaje."
    ],
    "practice:reusable-accessibility-libraries": [
      "Cada pantalla muestra el error a su manera. En una, el mensaje aparece debajo de Correo y queda desconectado del campo y del recorrido de foco.",
      "El módulo conserva un encabezado de resumen enfocable, un enlace que mueve el foco al input y la asociación del mensaje local con aria-describedby.",
      "Provoca el error y confirma que el foco llega al resumen. Activa el enlace con Enter y comprueba que Correo recibe el foco y expone su mensaje. Al corregir, verifica que se retire el estado inválido."
    ],
    "practice:runtime-accessibility-preferences": [
      "El portal aumenta el texto mientras la página está abierta, pero lo restablece al recargar y corta la etiqueta de Correo.",
      "La práctica define un control etiquetado, un ajuste persistente, la opción de restablecer y un formulario que se redistribuye con texto más grande.",
      "Elige Grande, recarga y comprueba que el valor siga seleccionado. Amplía la vista, completa la inscripción y restablece solo la preferencia."
    ],

    // Implementación: artefactos.
    "artifact:accessible-code": [
      "En v1.1, un div enfocable con un evento de clic simula el botón. Llegar con Tab no implica que Enter o Espacio activen la acción.",
      "El código usa button type=submit dentro del formulario. El navegador aporta la activación por teclado. Las etiquetas están asociadas a los campos y el CSS conserva un contorno visible.",
      "En un entorno de prueba, enfoca Enviar inscripción y pulsa Enter. Repite con Espacio y datos de prueba nuevos. Cada intento debe hacer un envío y llegar a la confirmación con folio."
    ],
    "artifact:reusable-accessible-components": [
      "Un modal simulado deja el fondo operable o conserva el resultado de una confirmación anterior. Escape puede cerrar sin devolver el foco.",
      "MOD-01 usa dialog, showModal() y aria-labelledby. Reinicia returnValue al abrir, coloca el foco en Volver y distingue la salida de la confirmación antes de emitir el evento de guardado.",
      "Confirma una vez, vuelve a abrir y pulsa Escape. Debe emitirse un solo evento de confirmación en toda la secuencia. En el portal integrado, prueba también que un doble intento durante el guardado no cree dos reservas."
    ],
    "artifact:accessible-templates": [
      "Una plantilla sin destino de salto obliga a atravesar toda la navegación. Insertar un párrafo con el folio sin semántica de estado puede dejar el resultado sin anuncio.",
      "Se incluyeron un main identificable, un enlace para saltar la navegación y una región role=status ya presente. mostrarFolio cambia su texto cuando el servicio confirma.",
      "Comprueba el salto con teclado. Ejecuta mostrarFolio con A-104 en el flujo integrado y verifica con lector de pantalla que el folio se anuncia y que el foco no cambia."
    ],
    "artifact:accessibility-issue-records": [
      "El ticket «Enviar no funciona» carece de versión, pasos y resultado esperado. Desarrollo no sabe si el fallo es de teclado o del servicio.",
      "INC-01 documenta entorno, datos, tecla, impacto, causa y versión de cierre. Vincula las dos ejecuciones de T-01 como evidencia de la corrección.",
      "Una persona distinta debe poder reproducir el fallo en v1.1 y confirmar el envío con ambas teclas en v1.2 a partir del ticket."
    ],
    "artifact:runtime-accessibility-settings": [
      "Una opción llamada «Grande» no especifica qué se guarda, cómo se restablece ni qué datos se conservan después.",
      "PREF-04 documenta el estado inicial, el valor guardado, la recarga y el restablecimiento. Deja explícito que restablecer mantiene los datos del formulario.",
      "Ejecuta los cuatro eventos en orden. Verifica el valor visible y el persistido en cada transición. Al restablecer, revisa que el correo y el taller sigan escritos."
    ],

    // Pruebas: prácticas.
    "practice:automated-accessibility-testing": [
      "Una captura de la puntuación general no comprueba que la herramienta detecte el control de correo sin nombre en este flujo.",
      "AUTO-02 ejecuta la regla label en el formulario. Una mutación que deja el campo sin nombre comprueba que la prueba detecta ese defecto.",
      "Retira la etiqueta asociada y cualquier otra fuente del nombre en una copia. La prueba debe fallar en input#correo. Restaura la etiqueta y repite. Revisa el error de correo en un estado aparte."
    ],
    "practice:manual-heuristic-testing": [
      "Probar solo el clic en Revisar inscripción deja sin detectar que Tab entra en controles del fondo cuando el diálogo está abierto.",
      "La hoja añade acciones de teclado y sus resultados esperados. Separa el fallo de foco de una sugerencia sobre la claridad del texto de la acción.",
      "Repite la secuencia con Enter, Tab, Mayús+Tab y Escape. Anota el control enfocado después de cada tecla y compáralo con el recorrido esperado."
    ],
    "practice:testing-with-disabled-people": [
      "Indicar «busca el resumen arriba» durante la sesión oculta la dificultad que se intenta observar.",
      "El guion fija la consigna y los datos, deja que la persona use su tecnología habitual y registra por separado el resultado y la ayuda.",
      "Observa si la persona identifica el error, vuelve al campo y completa la tarea. Registra cualquier ayuda que le diste y distingue sus observaciones de las comprobaciones técnicas."
    ],
    "practice:wcag-em-audits": [
      "Una inspección de la portada deja fuera el formulario, sus errores y la confirmación, por lo que no documenta el proceso de inscripción.",
      "El plan declara alcance y objetivo, explora las pantallas, selecciona el proceso completo y documenta criterio, resultado y evidencia para la muestra.",
      "Revisa si puedes ubicar el camino de éxito y el de error en la muestra. En el informe, cada fallo debe indicar la versión, el paso que lo reproduce y el alcance evaluado."
    ],
    "practice:multimethod-accessibility-evaluation": [
      "El estado inicial pasa la regla de etiquetas y el equipo da por resuelta la recuperación del correo. La regla no cubre esa interacción.",
      "El ejemplo cruza automatización, inspección del mensaje y sesión de uso. Cada método aporta evidencia distinta sobre el mismo flujo y versión.",
      "Comprueba que la decisión de añadir el resumen tenga evidencia manual y de uso. Repite el caso de error tras el cambio y documenta qué resultado aporta cada método."
    ],
    "practice:accessibility-regression-and-ab-testing": [
      "Comparar clics de dos variantes sin verificar el foco puede favorecer una versión que deja fuera a personas que usan teclado.",
      "Se ejecuta la misma regresión antes de comparar variantes. La métrica de localización sin ayuda y el tamaño de la muestra quedan explícitos.",
      "Comprueba que A y B pasen T-02 y que las sesiones usen la misma consigna. Conserva los conteos por grupo y trata la diferencia como exploratoria."
    ],
    "practice:accessible-bdd-acceptance-testing": [
      "«Cuando hago clic en Enviar, funciona» describe el camino con ratón y no comprueba si la activación por teclado genera un solo registro.",
      "El esquema T-01 fija datos válidos, foco inicial, teclas separadas y un resultado verificable en interfaz y almacenamiento.",
      "Mapea Espacio a la tecla de tu herramienta. Antes de cada fila reinicia el entorno. La prueba debe fallar si el envío no muestra folio o si crea dos registros."
    ],
    "practice:pdca-accessibility-testing": [
      "Se corrige una incidencia y se vuelve a ejecutar un caso diferente, por lo que las cifras antes y después no son comparables.",
      "El ciclo mantiene T-01a y T-01b, registra una meta común, explica el fallo de v1.1 y documenta la regresión agregada en v1.2.",
      "Compara los resultados de los mismos dos casos en ambas versiones con el mismo entorno. Si cambia la muestra o la preparación, anótalo junto al resultado."
    ],

    // Pruebas: artefactos.
    "artifact:automated-test-reports": [
      "«axe detectó un error» no indica la pantalla, el elemento ni la regla que debe volver a ejecutar el equipo.",
      "AUTO-02 guarda ruta, versión, navegador, estado inicial, regla y nodo afectado. Incluye la corrección y conserva el alcance limitado del nuevo resultado.",
      "Abre la salida JSON y localiza input#correo. Repite la regla en el mismo estado antes y después de la corrección. Comprueba que el informe distinga ese resultado de T-02."
    ],
    "artifact:wcag-checklists": [
      "Marcar «cumple errores» sin detallar la acción permite olvidar el texto de corrección o el destino del foco.",
      "T-02 separa identificación, sugerencia y orden del foco. Cada fila documenta la entrada, lo observado y el criterio que respalda la comprobación.",
      "Ejecuta las tres filas con «ana». Guarda el texto visible, el valor corregido y el destino del foco. Registra como fallo cualquier resultado que difiera del esperado."
    ],
    "artifact:manual-evaluation-reports": [
      "Un reporte que solo dice «mal foco en el modal» no indica la tecla, el control al que se mueve el foco ni cómo confirmar la corrección.",
      "MAN-03 registra la versión, la secuencia, el resultado observado frente al esperado y el efecto en la confirmación. Conserva el resultado posterior de Escape y del retorno de foco.",
      "Reproduce Enter y Tab en la versión anterior y corregida. Anota el control enfocado al abrir, al cambiar de acción y al cerrar. En T-03c, comprueba también la recuperación tras rechazo."
    ],
    "artifact:user-testing-reports": [
      "Una media de «tarea completada» oculta quién necesitó ayuda, qué tecnología usó y en qué paso encontró la barrera.",
      "El informe separa el contexto, el resultado y la evidencia por participante. Registra la decisión de mantener el enlace y el seguimiento del problema al ampliar.",
      "Toma la fila de P-03 y localiza la barrera, el ajuste usado y la acción de seguimiento. Comprueba que el informe no generalice el resultado fuera de la muestra."
    ],
    "artifact:advanced-test-scripts": [
      "Una captura de escritorio puede verse bien aunque un campo de ancho fijo desborde la pantalla estrecha o un control desaparezca.",
      "T-04 fija 320 px CSS, comprueba que los controles existen y detecta ancho extra en el documento. La mutación demuestra qué tipo de regresión identifica.",
      "Ejecuta en la vista corregida y con el ancho fijo de 500 px de la mutación. El segundo caso debe fallar. Revisa manualmente recortes y el envío, que el ancho del documento por sí solo no comprueba."
    ],
    "artifact:accessibility-test-plan": [
      "«QA revisará accesibilidad» no dice quién comprueba el folio, con qué método, qué evidencia entrega ni qué bloquea la liberación.",
      "El plan asigna caso, entorno, acción, evidencia y responsable. Distingue el anuncio del folio, el teclado, la recuperación y la ampliación.",
      "Para cada fila, pide el resultado y la evidencia de la versión candidata. Si un caso crítico falla, registra la incidencia, corrígela y repite el caso antes de liberar."
    ],
  };

  window.GPAW_EXAMPLES = { examples, tracks, wcag, comparisons };
})();
