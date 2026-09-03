(function () {
  "use strict";
  const host = document.querySelector('.experiment-shell');
  const params = new URLSearchParams(location.search);
  const phase = params.get('phase');
  const group = params.get('group');
  const pair = (es, en) => ({ es, en });
  const starter = '<form>\n  <input placeholder="Nombre / Name">\n  <input placeholder="Correo / Email">\n  <div>Inscribirme / Register</div>\n</form>\n<style>\n  input:focus { outline: none; }\n</style>';
  const tasks = {
    requirements: {
      title: pair('Historia de usuario con criterios de aceptación', 'User story with acceptance criteria'),
      brief: pair('Una estudiante quiere inscribirse a un taller universitario mediante un formulario de nombre y correo. La inscripción debe ser accesible. Redacta una historia de usuario y tres criterios de aceptación verificables.', 'A student wants to register for a university workshop using a name and email form. Registration must be accessible. Write one user story and three verifiable acceptance criteria.'),
      fields: [pair('Historia de usuario', 'User story'), pair('Tres criterios de aceptación', 'Three acceptance criteria')],
      initial: [pair('Como…\nQuiero…\nPara…', 'As a…\nI want…\nSo that…'), pair('1.\n2.\n3.', '1.\n2.\n3.')],
      steps: pair(['Identifica quién se inscribe, qué necesita y para qué. Incluye a quien utiliza teclado o lector de pantalla.', 'Completa Como / Quiero / Para con una sola necesidad.', 'Escribe tres criterios observables: etiquetas de los campos, operación con teclado y resultado de la inscripción.', 'Para cada criterio indica una acción y el resultado esperado; evita frases como “que sea accesible”.'], ['Identify who registers, what they need and why. Include people using a keyboard or screen reader.', 'Complete As a / I want / So that with one need.', 'Write three observable criteria: field labels, keyboard operation and registration outcome.', 'For each criterion give an action and expected result; avoid phrases such as “make it accessible”.']),
      criteria: pair(['La historia identifica persona, necesidad y beneficio.', 'Cada criterio permite decidir si se cumple o no mediante una comprobación concreta.', 'Los criterios cubren etiquetas, teclado y una confirmación perceptible.'], ['The story identifies a person, need and benefit.', 'Each criterion can pass or fail through a concrete check.', 'Criteria cover labels, keyboard and a perceivable confirmation.']),
      example: pair('Ejemplo en otro contexto: “Dado el formulario de préstamo, cuando avanzo con Tab, puedo alcanzar y activar el botón Reservar sin utilizar el mouse”. No verificable: “El préstamo será fácil para todos”.', 'Example in another context: “Given the loan form, when I move with Tab, I can reach and activate the Reserve button without a mouse”. Not verifiable: “Borrowing will be easy for everyone”.'),
      slug: 'accessible-user-stories'
    },
    design: {
      title: pair('Prototipo / wireframe de interfaz', 'Interface prototype / wireframe'),
      brief: pair('Diseña una pantalla accesible para inscribirse a un taller universitario: título, nombre, correo, botón de inscripción y mensaje de resultado. Haz un wireframe sencillo en texto dentro de la plantilla y anota tus decisiones; no necesitas una herramienta de diseño.', 'Design an accessible university workshop registration screen: title, name, email, registration button and result message. Make a simple text wireframe in the template and annotate your decisions; no design tool is needed.'),
      fields: [pair('Wireframe en texto', 'Text wireframe'), pair('Decisiones de diseño', 'Design decisions')],
      initial: [pair('[Título]\n\n[Campo 1]\n\n[Campo 2]\n\n[Acción]\n\n[Resultado]', '[Title]\n\n[Field 1]\n\n[Field 2]\n\n[Action]\n\n[Result]'), pair('', '')],
      steps: pair(['Coloca un título claro y organiza los controles de arriba hacia abajo.', 'Dibuja una etiqueta visible junto a cada campo; el texto de ejemplo no sustituye la etiqueta.', 'Anota el recorrido del teclado y cómo se verá el foco en cada control.', 'Define colores legibles y mensajes de éxito/error con texto, no solamente color.'], ['Use a clear heading and arrange controls from top to bottom.', 'Draw a visible label next to each field; example text does not replace a label.', 'Annotate keyboard order and how focus will look on each control.', 'Specify readable colors and success/error messages using text, not color alone.']),
      criteria: pair(['Incluye todos los elementos solicitados y etiquetas visibles.', 'Especifica un orden de foco coherente y un indicador visible.', 'El texto normal alcanza contraste de al menos 4.5:1; los errores se explican con texto.'], ['Includes all requested elements and visible labels.', 'Specifies a logical focus order and a visible indicator.', 'Normal text has at least 4.5:1 contrast; errors are explained in text.']),
      example: pair('Accesible: “Correo electrónico [________]” con la nota “foco: contorno azul de 3 px”. Insuficiente: un rectángulo vacío sin etiqueta y la nota “si hay error, poner rojo”.', 'Accessible: “Email [________]” with the note “focus: 3 px blue outline”. Insufficient: an empty rectangle without a label and the note “turn red on error”.'),
      slug: 'accessible-prototypes'
    },
    implementation: {
      title: pair('Código fuente HTML/CSS', 'HTML/CSS source code'),
      brief: pair('Mejora el código inicial del formulario de inscripción a un taller para que sea accesible. Conserva nombre, correo y la acción de inscripción. Entrega HTML/CSS; no necesitas servidor, envío real ni JavaScript.', 'Improve the starter workshop registration form to make it accessible. Keep name, email and the registration action. Submit HTML/CSS; no server, actual submission or JavaScript is needed.'),
      fields: [pair('Código HTML/CSS', 'HTML/CSS code')], initial: [pair(starter, starter)],
      steps: pair(['Asocia una etiqueta visible a cada input mediante label for e id únicos.', 'Utiliza type="email" para el correo y un button type="submit" para la acción.', 'Elimina la regla que oculta el foco y define un contorno visible con :focus-visible.', 'Comprueba en el navegador que Tab recorra los campos y el botón; que el botón pueda activarse con teclado. No agregues ARIA si HTML nativo resuelve la necesidad.'], ['Associate a visible label with each input using label for and unique ids.', 'Use type="email" for email and a button type="submit" for the action.', 'Remove the rule hiding focus and define a visible outline with :focus-visible.', 'Check in a browser that Tab reaches fields and the button and that the button works with a keyboard. Do not add ARIA when native HTML meets the need.']),
      criteria: pair(['Cada campo tiene una etiqueta asociada y un id único.', 'La acción usa un botón nativo alcanzable y activable con teclado.', 'El foco es visible y el código mantiene los dos campos solicitados.'], ['Each field has an associated label and a unique id.', 'The action uses a native button reachable and operable by keyboard.', 'Focus is visible and the code retains both requested fields.']),
      example: pair('Accesible en otro formulario:\n<label for="city">Ciudad</label>\n<input id="city" name="city">\n\nInsuficiente: <input placeholder="Ciudad"> sin etiqueta asociada.', 'Accessible in another form:\n<label for="city">City</label>\n<input id="city" name="city">\n\nInsufficient: <input placeholder="City"> without an associated label.'),
      slug: 'accessible-code'
    },
    testing: {
      title: pair('Reporte de pruebas de accesibilidad', 'Accessibility test report'),
      brief: pair('Evalúa el formulario proporcionado de inscripción a un taller. Documenta tres hallazgos de accesibilidad: método usado, evidencia, criterio WCAG relacionado y recomendación. Termina con una conclusión breve. Puedes inspeccionar el código y usar la muestra; no se enviarán datos.', 'Evaluate the provided workshop registration form. Document three accessibility findings: method used, evidence, related WCAG criterion and recommendation. End with a brief conclusion. You may inspect the code and use the sample; no data will be submitted.'),
      fields: [pair('Reporte: tres hallazgos', 'Report: three findings'), pair('Conclusión', 'Conclusion')],
      initial: [pair([1,2,3].map(n => `Hallazgo ${n}\nMétodo:\nEvidencia:\nWCAG:\nRecomendación:\n`).join('\n'), [1,2,3].map(n => `Finding ${n}\nMethod:\nEvidence:\nWCAG:\nRecommendation:\n`).join('\n')), pair('', '')],
      steps: pair(['Inspecciona si cada campo tiene una etiqueta visible asociada en el código.', 'En la muestra, recorre con Tab y trata de activar la inscripción. Registra qué control no puedes alcanzar.', 'Observa si puedes ver dónde está el foco; identifica la regla CSS que lo oculta.', 'Vincula cada evidencia con WCAG y propone una corrección específica. Combina revisión técnica/cuantitativa con observación cualitativa: contar errores no explica todas las barreras. Una herramienta automática no sustituye la revisión manual ni las pruebas con usuarios.'], ['Inspect whether each field has an associated visible label in the code.', 'In the sample, move with Tab and try to activate registration. Record which control you cannot reach.', 'Observe whether focus is visible; identify the CSS rule that hides it.', 'Connect each piece of evidence to WCAG and propose a specific correction. Combine technical/quantitative checks with qualitative observation: counting errors does not explain all barriers. An automated tool does not replace manual review or user testing.']),
      criteria: pair(['Hay tres hallazgos con evidencia reproducible, método y recomendación.', 'Las referencias corresponden a la barrera: etiquetas (1.3.1 / 3.3.2), teclado (2.1.1) y foco visible (2.4.7).', 'La conclusión distingue lo comprobado de lo no evaluado; no afirma conformidad de todo el sitio.'], ['There are three findings with reproducible evidence, method and recommendation.', 'References match the barrier: labels (1.3.1 / 3.3.2), keyboard (2.1.1) and visible focus (2.4.7).', 'The conclusion distinguishes checked items from untested ones; it does not claim whole-site conformance.']),
      example: pair('Ejemplo en otro componente: “Método: teclado. Evidencia: Tab omite Cerrar en el diálogo. WCAG: 2.1.1. Corrección: utilizar un botón nativo”. Insuficiente: “La página no es accesible”.', 'Example in another component: “Method: keyboard. Evidence: Tab skips Close in the dialog. WCAG: 2.1.1. Fix: use a native button”. Insufficient: “The page is not accessible”.'),
      slug: 'manual-evaluation-reports'
    }
  };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let locale;
  let answers = null;
  const t = value => value[locale];
  const say = (es,en) => locale === 'es' ? es : en;
  const capture = () => { if (host.querySelector('textarea')) answers = [...host.querySelectorAll('textarea')].map(field => field.value); };
  function render() {
    capture();
    locale = window.WAPG_I18N?.language || 'es';
    const task = tasks[phase];
    document.title = say('Evaluación experimental | WAPG','Experimental evaluation | WAPG');
    if (!task) {
      host.innerHTML = `<h1>${say('Elige una fase','Choose a phase')}</h1><ul>${Object.entries(tasks).map(([key,item]) => `<li><a href="experiment.html?phase=${key}">${escape(t(item.title))}</a></li>`).join('')}</ul>`;
      return;
    }
    const title = escape(t(task.title));
    if (!['A','B'].includes(group)) {
      host.innerHTML = `<p>${say('Evaluación experimental','Experimental evaluation')}</p><h1>${title}</h1><p>${say('Selecciona únicamente el grupo que te asignó la persona evaluadora. Ambos grupos resuelven el mismo problema con la misma plantilla.','Select only the group assigned by your evaluator. Both groups solve the same problem using the same template.')}</p><div class="experiment-groups">${['A','B'].map(g => `<section class="experiment-group"><h2>${say(g === 'A' ? 'Grupo control — A' : 'Grupo experimental — B',g === 'A' ? 'Control group — A' : 'Experimental group — B')}</h2><p>${say(g === 'A' ? 'Consigna y plantilla, sin orientación adicional.' : 'Consigna y plantilla con pasos, ejemplos y criterios.',g === 'A' ? 'Task and template, without additional guidance.' : 'Task and template with steps, examples and criteria.')}</p><a class="card-link" href="experiment.html?phase=${phase}&amp;group=${g}">${say('Comenzar','Start')} — ${g}</a></section>`).join('')}</div><a href="${phase}.html">${say('Volver a la fase','Return to phase')}</a>`;
      return;
    }
    host.innerHTML = `<p>${say(group === 'A' ? 'Grupo control — A' : 'Grupo experimental — B',group === 'A' ? 'Control group — A' : 'Experimental group — B')}</p><h1>${title}</h1><section class="experiment-task"><h2>${say('Problema a resolver','Task')}</h2><p>${escape(t(task.brief))}</p>${phase === 'testing' ? `<h3>${say('Material a evaluar','Material to evaluate')}</h3><pre>${escape(starter)}</pre><iframe title="${say('Formulario de muestra para evaluar','Sample form to evaluate')}" sandbox=""></iframe>` : ''}</section>${group === 'B' ? `<section class="experiment-help"><h2>${say('Ayuda paso a paso','Step-by-step help')}</h2><ol>${t(task.steps).map(s => `<li>${escape(s)}</li>`).join('')}</ol><h3>${say('Criterios de aceptación','Acceptance criteria')}</h3><ul>${t(task.criteria).map(s => `<li>${escape(s)}</li>`).join('')}</ul><details><summary>${say('Ejemplo accesible y no accesible','Accessible and inaccessible example')}</summary><pre>${escape(t(task.example))}</pre></details><h3>${say('Recursos de apoyo','Supporting resources')}</h3><ul><li><a href="artifacts/${task.slug}.html" target="_blank" rel="noopener">${say('Consultar el artefacto en la guía (nueva pestaña)','Read the artifact in the guide (new tab)')}</a></li><li><a href="https://www.w3.org/WAI/tutorials/forms/labels/" target="_blank" rel="noopener">W3C: ${say('etiquetas de formularios (inglés, nueva pestaña)','form labels (new tab)')}</a></li><li><a href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html" target="_blank" rel="noopener">WCAG 2.1.1: ${say('teclado (inglés, nueva pestaña)','keyboard (new tab)')}</a></li><li><a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" target="_blank" rel="noopener">WCAG 2.4.7: ${say('foco visible (inglés, nueva pestaña)','focus visible (new tab)')}</a></li>${phase === 'design' ? '<li><a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noopener">WCAG 1.4.3: Contrast (new tab)</a></li>' : ''}</ul></section>` : ''}<section class="experiment-template"><h2>${say('Tu plantilla','Your template')}</h2><p class="experiment-note">${say('Completa los campos y descarga tu respuesta para entregarla a la persona evaluadora. No se envían ni se guardan respuestas en un servidor. Si cierras o recargas esta página, perderás lo que no hayas descargado.','Complete the fields and download your response to give to the evaluator. Answers are not sent to or saved on a server. Closing or reloading this page loses anything you have not downloaded.')}</p>${task.fields.map((field,i) => `<label class="experiment-field" for="answer-${i}">${escape(t(field))}<textarea id="answer-${i}" spellcheck="false"></textarea></label>`).join('')}<button type="button" class="button" id="download-answer">${say('Descargar plantilla / respuesta (.txt)','Download template / response (.txt)')}</button><p class="experiment-status" role="status"></p></section>`;
    host.querySelectorAll('textarea').forEach((field,i) => {
      field.value = answers?.[i] ?? t(task.initial[i]);
      field.rows = Math.min(16, Math.max(5, t(task.initial[i]).split('\n').length + 1));
    });
    const contrastLink = host.querySelector('a[href$="contrast-minimum.html"]');
    if (contrastLink) contrastLink.textContent = say('WCAG 1.4.3: contraste (inglés, nueva pestaña)', 'WCAG 1.4.3: contrast (new tab)');
    const frame = host.querySelector('iframe');
    if (frame) frame.srcdoc = '<!doctype html><html lang="' + locale + '"><meta charset="utf-8"><title>Sample</title><body>' + starter + '</body></html>';
    host.querySelector('#download-answer').addEventListener('click', () => {
      capture();
      const content = `${t(task.title)}\n${say('Grupo','Group')}: ${group}\n\n${t(task.brief)}\n\n` + task.fields.map((field,i) => `${t(field)}\n${answers[i]}`).join('\n\n');
      const url = URL.createObjectURL(new Blob(['\uFEFF' + content], {type:'text/plain;charset=utf-8'}));
      const link = document.createElement('a');
      link.href = url; link.download = `wapg-${phase}-group-${group}.txt`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      host.querySelector('.experiment-status').textContent = say('Descarga solicitada. Entrega el archivo a la persona evaluadora.','Download requested. Give the file to the evaluator.');
    });
  }
  render();
  document.addEventListener('wapg:languagechange', () => { if (locale !== window.WAPG_I18N.language) render(); });
})();
