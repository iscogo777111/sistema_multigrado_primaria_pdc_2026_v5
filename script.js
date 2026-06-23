const AREAS_PRIMARIA = [
    { abrev: "VEyR", nombre: "Valores Espiritualidades y Religiones" },
    { abrev: "CyL", nombre: "Comunicación y Lenguaje" },
    { abrev: "CS", nombre: "Ciencias Sociales" },
    { abrev: "APyV", nombre: "Artes Plásticas y Visuales" },
    { abrev: "EFyD", nombre: "Educación Física y Deportes" },
    { abrev: "EM", nombre: "Educación Musical" },
    { abrev: "CN", nombre: "Ciencias Naturales" },
    { abrev: "Mat", nombre: "Matemática" },
    { abrev: "TT", nombre: "Técnica Tecnológica" }
];

const OPCIONES_GRADOS = [
    "Primer Año", "Segundo Año", "Tercer Año",
    "Cuarto Año", "Quinto Año", "Sexto Año"
];

function renderizarConfiguracionGrados() {
    const cant = parseInt(document.getElementById('cantidadGrados').value);
    const containerConfig = document.getElementById('configuracion-grados');
    const containerSemanas = document.getElementById('contenedor-semanas-multigrado');

    containerConfig.innerHTML = "";
    containerSemanas.innerHTML = "";

    if (cant > 0) {
        let htmlGrados = '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">';
        for (let i = 1; i <= cant; i++) {
            htmlGrados += '<div>' +
                '<label class="text-[10px] font-bold text-slate-500 uppercase">Grado ' + i + ':</label>' +
                '<select id="grado_ref_' + i + '" class="input-style" onchange="actualizarInterfazSemanas()">' +
                '<option value="">Seleccione Año...</option>' +
                OPCIONES_GRADOS.map(g => '<option value="' + g + '">' + g + '</option>').join('') +
                '</select>' +
                '</div>';
        }
        htmlGrados += '</div>';
        containerConfig.innerHTML = htmlGrados;
    }
}

// NUEVA FUNCIÓN PARA MINIMIZAR/MAXIMIZAR
function toggleGrado(id) {
    const content = document.getElementById('content-grado-' + id);
    const icon = document.getElementById('icon-grado-' + id);
    if (content.classList.contains('hidden-content')) {
        content.classList.remove('hidden-content');
        content.classList.add('show-content');
        icon.classList.add('rotate-180');
    } else {
        content.classList.add('hidden-content');
        content.classList.remove('show-content');
        icon.classList.remove('rotate-180');
    }
}

function actualizarInterfazSemanas() {
    const cant = parseInt(document.getElementById('cantidadGrados').value);
    const containerSemanas = document.getElementById('contenedor-semanas-multigrado');
    let gradosSeleccionados = [];

    for (let i = 1; i <= cant; i++) {
        const val = document.getElementById('grado_ref_' + i).value;
        if (val) gradosSeleccionados.push({ id: i, nombre: val });
    }

    if (gradosSeleccionados.length === 0) {
        containerSemanas.innerHTML = "";
        return;
    }

    // ORGANIZACIÓN POR GRADOS (Bloques independientes)
    let htmlGradosBlocks = "";

    gradosSeleccionados.forEach(grado => {
        htmlGradosBlocks +=
            '<div class="grado-container rounded-3xl bg-white/90 backdrop-blur-md overflow-hidden shadow-lg mb-6 border border-blue-100" id="grado-container-' + grado.id + '">' +
            '<div class="w-full flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 group">' +
            '<h3 class="font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-3">' +
            '<span class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl text-xs shadow-md group-hover:shadow-lg transition-all">GRADO</span> <span class="text-indigo-900">' + grado.nombre + '</span>' +
            '</h3>' +
            '<div class="flex items-center gap-3">' +
            '<button type="button" onclick="agregarSemana(' + grado.id + ')" id="btn-add-week-' + grado.id + '" class="text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition-colors flex items-center gap-1 shadow-sm">' +
            '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>' +
            'Agregar Semana' +
            '</button>' +
            '<button type="button" onclick="toggleGrado(' + grado.id + ')" class="flex items-center gap-2">' +
            '<span class="text-[10px] text-indigo-400 font-bold uppercase tracking-widest hidden sm:block bg-white/50 px-3 py-1 rounded-full border border-indigo-100">Expandir / Contraer</span>' +
            '<div class="bg-white p-2 rounded-full shadow-md text-indigo-500 hover:text-indigo-700 transition-colors border border-indigo-50">' +
            '<svg id="icon-grado-' + grado.id + '" class="w-5 h-5 transition-transform duration-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>' +
            '</svg>' +
            '</div>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '<div id="content-grado-' + grado.id + '" class="p-6 md:p-8 show-content">' +
            '<div id="grid-semanas-' + grado.id + '" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-semanas="4">' +
            [1, 2, 3, 4].map(sem => generarHTMLSemana(sem, grado.id)).join('') +
            '</div>' +
            '</div>' +
            '</div>';
    });

    containerSemanas.innerHTML = htmlGradosBlocks;
}

function generarHTMLSemana(sem, idGrado) {
    return '<div class="bg-white rounded-xl border border-blue-50 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 group/semana" id="semana-' + sem + '-grado-' + idGrado + '">' +
        '<div class="flex items-center justify-center gap-2 mb-5 pb-3 border-b border-blue-50">' +
        '<h4 class="font-bold text-xs text-indigo-400 uppercase tracking-widest group-hover/semana:text-indigo-600 transition-colors">Semana ' + sem + '</h4>' +
        '</div>' +
        '<div class="space-y-3">' +
        generarFilasMultigrado(sem, idGrado) +
        '</div>' +
        '</div>';
}

function agregarSemana(idGrado) {
    const grid = document.getElementById('grid-semanas-' + idGrado);
    let cantSemanas = parseInt(grid.getAttribute('data-semanas'));

    if (cantSemanas >= 6) {
        alert("Se ha alcanzado el límite máximo de 6 semanas.");
        return;
    }

    cantSemanas++;
    grid.setAttribute('data-semanas', cantSemanas);

    const nuevaSemanaHTML = generarHTMLSemana(cantSemanas, idGrado);
    grid.insertAdjacentHTML('beforeend', nuevaSemanaHTML);

    if (cantSemanas === 6) {
        document.getElementById('btn-add-week-' + idGrado).style.display = 'none';
    }

    // Sincronizar las alturas de la nueva semana con las demás
    setTimeout(() => {
        for (let f = 1; f <= 9; f++) {
            sincronizarAlturasArea(idGrado, f);
        }
    }, 10);
}

function generarFilasMultigrado(numSemana, idGrado) {
    let filas = "";
    AREAS_PRIMARIA.forEach((area, index) => {
        const f = index + 1;
        filas += '<div class="flex flex-col gap-1 mb-2">' +
            '<div class="area-badge area-' + area.abrev + ' text-white text-[9px] inline-flex items-center justify-center px-2 py-1 rounded-md font-bold shadow-sm tracking-wider w-max mb-1">' +
            area.abrev +
            '</div>' +
            '<textarea id="cont_s' + numSemana + '_g' + idGrado + '_f' + f + '" class="w-full border border-blue-100 rounded-xl p-3 text-[0.8rem] text-slate-700 bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 focus:outline-none resize-none overflow-hidden transition-all shadow-inner custom-scrollbar font-medium" rows="1" placeholder="Contenido..." oninput="autoExpand(this)"></textarea>' +
            '<input type="hidden" id="area_s' + numSemana + '_g' + idGrado + '_f' + f + '" value="' + area.abrev + '">' +
            '</div>';
    });
    return filas;
}

function autoExpand(field) {
    const idParts = field.id.split('_');
    if (idParts.length === 4 && idParts[0] === 'cont') {
        const idGrado = parseInt(idParts[2].substring(1));
        const f = parseInt(idParts[3].substring(1));
        sincronizarAlturasArea(idGrado, f);
    } else {
        field.style.height = 'auto'; // Reset
        const computed = window.getComputedStyle(field);
        const borderTop = parseInt(computed.getPropertyValue('border-top-width'), 10) || 0;
        const borderBottom = parseInt(computed.getPropertyValue('border-bottom-width'), 10) || 0;
        field.style.height = (field.scrollHeight + borderTop + borderBottom) + 'px';
    }
}

function sincronizarAlturasArea(idGrado, f) {
    let maxHeight = 0;
    const textareas = [];

    // Localizar equivalentes de las demás semanas
    for (let s = 1; s <= 6; s++) {
        const el = document.getElementById('cont_s' + s + '_g' + idGrado + '_f' + f);
        if (el) {
            textareas.push(el);
            el.style.height = 'auto'; // Resetear para calcular mínimo dinámico
        }
    }

    // Obtener la altura máxima entre todas las semanas de la misma fila
    textareas.forEach(el => {
        const computed = window.getComputedStyle(el);
        const borderTop = parseInt(computed.getPropertyValue('border-top-width'), 10) || 0;
        const borderBottom = parseInt(computed.getPropertyValue('border-bottom-width'), 10) || 0;
        const totalHeight = el.scrollHeight + borderTop + borderBottom;
        if (totalHeight > maxHeight) maxHeight = totalHeight;
    });

    // Aplicar la altura máxima unificada a todas para alineación horizontal perfecta
    textareas.forEach(el => {
        el.style.height = maxHeight + 'px';
    });
}

let documentoGeneradoBlob = null;
let documentoNombre = "";

function setProgress(percent, text) {
    const container = document.getElementById('progressContainer');
    const bar = document.getElementById('progressBar');
    const textEl = document.getElementById('progressText');
    const pEl = document.getElementById('progressPercent');

    if (container) container.classList.remove('hidden');
    if (bar) bar.style.width = percent + '%';
    if (textEl) textEl.innerText = text;
    if (pEl) pEl.innerText = percent + '%';
}

function descargarDocumento() {
    if (documentoGeneradoBlob && documentoNombre) {
        window.saveAs(documentoGeneradoBlob, documentoNombre);
    }
}

async function generarPDCWord() {
    const cantGrados = parseInt(document.getElementById('cantidadGrados').value);

    const objNivel = "Conoce, Identifica, Describe, Explica, Interpreta, Comprende, Clasifica, Organiza, Relaciona, Analiza, Compara, Argumenta, Justifica, Infiere, Aplica, Utiliza, Representa, Demuestra, Redacta, Desarrolla";
    const vPractica = "Jugamos, Conversamos, Exploramos, Observamos, Participamos, Narramos, Interpretamos, Modelamos, Realizamos, Construimos, Elaboramos, Recolectamos";
    const vTeoria = "Analizamos, Identificamos, Describimos, Clasificamos, Explicamos, Conceptualizamos, Sistematizamos, Comparamos, Investigamos, Comprendemos";
    const vProduccion = "Exponemos, Dramatizamos, Representamos gráficamente, Interpretamos, Ejecutamos, Demostramos, Elaboramos, Aplicamos, Preparamos, Componemos, Socializamos";

    let gradosData = [];
    for (let i = 1; i <= cantGrados; i++) {
        const selectElement = document.getElementById('grado_ref_' + i);
        if (selectElement && selectElement.value) {
            gradosData.push({ id: i, nombre: selectElement.value });
        }
    }

    if (gradosData.length < 2 || gradosData.length > 6) {
        alert("Por favor seleccione entre 2 y 6 grados requeridos para la generación.");
        return;
    }

    const btn = document.getElementById('btnGenerar');
    const btnDescargar = document.getElementById('btnDescargar');
    const output = document.getElementById('promptOutput');
    const originalBtnText = btn.innerHTML;

    // Recopilar contenidos de las áreas para incluirlos en el prompt y el JSON directo
    let areasDict = {}; // para uso local de la plantilla docx
    let promptGradosInfo = "";

    // Mapeo específico de sufijos por grado para la plantilla
    const sufijosGrado = ["1ro", "2do", "3ro", "4to", "5to", "6to"]; // Grado 1 a 6

    for (let gIndex = 0; gIndex < gradosData.length; gIndex++) {
        const grado = gradosData[gIndex];
        const sufijo = sufijosGrado[gIndex];

        promptGradosInfo += "\n\n--- INFORMACIÓN DEL GRADO " + (gIndex + 1) + ": " + grado.nombre + " ---\nContenidos registrados por el usuario para fundamentar el plan:\n";

        for (let s = 1; s <= 4; s++) { // 4 Semanas de acuerdo al requerimiento
            promptGradosInfo += "SEMANA " + s + ":\n";
            for (let f = 1; f <= 9; f++) {
                let areaId = "area_s" + s + "_g" + grado.id + "_f" + f;
                let contId = "cont_s" + s + "_g" + grado.id + "_f" + f;
                if (document.getElementById(areaId) && document.getElementById(contId)) {
                    let area = document.getElementById(areaId).value;
                    let contenido = document.getElementById(contId).value.trim() || "-";
                    areasDict[area + "_sem" + s + "_" + sufijo] = contenido;
                    if (contenido !== "-") {
                        promptGradosInfo += "[" + area + "]: " + contenido + "\n";
                    }
                } else {
                    let defaultArea = AREAS_PRIMARIA[f - 1].abrev;
                    areasDict[defaultArea + "_sem" + s + "_" + sufijo] = "-";
                }
            }
        }
    }

    const categoriaAdaptacion = document.getElementById('categoriaAdaptacion').value;
    const adaptacionDetalle = document.getElementById('tipoAdaptacion').value || "No especificado";

    try {
        if (btn) {
            btn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generando...';
            btn.disabled = true;
            if (btnDescargar) btnDescargar.classList.add('hidden');
        }

        setProgress(10, 'Inicializando generación...');
        output.value = 'Inicializando generación...\n';

        setTimeout(() => {
            if (output.value.includes('Inicializando')) {
                setProgress(20, 'Analizando datos para Gemini...');
                output.value += 'Analizando datos...\n';
            }
        }, 600);

        let adaptacionesPrompt = "ADAPTACIONES CURRICULARES:\n";
        if (categoriaAdaptacion === 'curricular') {
            adaptacionesPrompt += "Dificultades leves/Rezago. Información registrada: " + adaptacionDetalle + ".\nINSTRUCCIÓN IMPORTANTÍSIMA: Generar EXCLUSIVAMENTE entre 5 y 7 actividades de apoyo lúdico y adaptadas a la condición, aplicadas a los contenidos del grado. NO incluir tablas, no incluir encabezados, columnas, ni criterios adicionales. Únicamente la lista de viñetas limpia.";
        } else {
            adaptacionesPrompt += "Significativa (Discapacidad, TDAH, TEA, etc.). Condiciones registradas de los estudiantes: " + adaptacionDetalle + ".\nINSTRUCCIÓN IMPORTANTÍSIMA: Para cada grado, debes generar actividades pedagógicas específicas y personalizadas para cada estudiante, considerando su condición individual. Estas actividades deben estar ESTRICTAMENTE relacionadas con los contenidos planificados del grado correspondiente, ser concretas, aplicables en un aula multigrado y favorecer la inclusión. Generar EXCLUSIVAMENTE entre 5 y 7 actividades. NO incluir tablas, no incluir encabezados, columnas, ni criterios adicionales. Únicamente la lista de viñetas limpia.";
        }

        let jsonStructure = "{\n";
        for (let i = 0; i < gradosData.length; i++) {
            let gNum = i + 1;
            jsonStructure += "  \"objetivo_grado_" + gNum + "\": \"(objetivo para el grado " + gNum + ")\",\n" +
                "  \"momentos_formativos_semana_1_grado_" + gNum + "\": \"(actividades formativas semana 1 - grado " + gNum + " - si hay)\",\n" +
                "  \"momentos_formativos_semana_2_grado_" + gNum + "\": \"(actividades formativas semana 2 - grado " + gNum + " - si hay)\",\n" +
                "  \"momentos_formativos_semana_3_grado_" + gNum + "\": \"(actividades formativas semana 3 - grado " + gNum + " - si hay)\",\n" +
                "  \"momentos_formativos_semana_4_grado_" + gNum + "\": \"(actividades formativas semana 4 - grado " + gNum + " - si hay)\",\n" +
                "  \"recursos_grado_" + gNum + "\": \"(recursos para el grado " + gNum + ")\",\n" +
                "  \"criterios_de_evaluacion_grado_" + gNum + "\": \"(SER: ...\\nSABER: ...\\nHACER: ...)\",\n" +
                "  \"adaptaciones_grado_" + gNum + "\": \"(5-7 actividades personalizadas a la condición vinculadas al grado " + gNum + ")\"";

            if (i < gradosData.length - 1) {
                jsonStructure += ",\n\n";
            } else {
                jsonStructure += "\n}";
            }
        }

        const finalPrompt = "Actúa como experto pedagogo de Educación Primaria Multigrado en Bolivia. Elabora la siguiente planificación curricular para " + gradosData.length + " grados considerando:\n" +
            "⚠️ NO GENERAR IMÁGENES.\n" +
            "⚠️ DEVUELVE ÚNICAMENTE UN OBJETO JSON VÁLIDO Y ESTRICTO.\n" +
            "⚠️ NO USAR MARKDOWN (no uses *, ** o comillas invertidas). Emplea viñetas planas (\u2022 o -) o formato limpio.\n\n" +
            "Aquí están los datos analizados de los grados a planificar:\n" + promptGradosInfo + "\n\n" +
            "Instrucción de adaptaciones: " + adaptacionesPrompt + "\n\n" +
            "INSTRUCCIONES DE GENERACIÓN PARA CADA GRADO:\n" +
            "1. Objetivo: Generar el 'objetivo_grado_X' articulando los contenidos usando un verbo indicativo (" + objNivel + ") con la estructura: VERBO + CONTENIDO + CÓMO + PARA QUÉ.\n" +
            "2. Momentos formativos: Generar 'momentos_formativos_semana_Y_grado_X' usando actividades de 4 momentos (Práctica, Teoría, Producción, Valoración) basadas en los contenidos de esa semana.\n" +
            "   - En la práctica, iniciar al menos 1 con verbos: " + vPractica + "\n" +
            "   - En la teoría, iniciar al menos 1 con verbos: " + vTeoria + "\n" +
            "   - En la producción, iniciar al menos 1 con verbos: " + vProduccion + "\n" +
            "   - Cada momento debe tener su etiqueta al final del párrafo, ej: (...)(Práctica).\n" +
            "3. Recursos: Generar 'recursos_grado_X' integrando una lista de materiales de apoyo de acuerdo a las semanas planificadas.\n" +
            "4. Criterios de Evaluación: Generar 'criterios_de_evaluacion_grado_X' con formato SER:, SABER:, HACER: (evita astériscos).\n" +
            "5. Adaptaciones: Generar 'adaptaciones_grado_X' (lista de 5 a 7 actividades pedagógicas personalizadas por estudiante, vinculadas estrictamente a los contenidos del grado y a su condición).\n\n" +
            "ESTRUCTURA DEL JSON EXACTA A DEVOLVER:\n" + jsonStructure;

        setProgress(40, 'Generando contenido con IA...');
        output.value += 'Llamando a la IA...\n';

        let response;
        try {
            response = await fetch('/.netlify/functions/generate-pdc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: finalPrompt })
            });

            if (response.status === 404 && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')) {
                throw new Error("Netlify function no disponible, activando fallback local");
            }

            if (!response.ok) {
                const errData = await response.text();
                throw new Error("Error en Netlify Function (" + response.status + "): " + errData);
            }
        } catch (error) {
            console.warn(error.message);
            // Fallback para uso local seguro
            let LOCAL_API_KEY = localStorage.getItem('GEMINI_API_KEY');
            if (!LOCAL_API_KEY) {
                LOCAL_API_KEY = prompt("El entorno local requiere una API Key de Gemini. Por favor, introdúzcala (se guardará en su navegador):");
                if (LOCAL_API_KEY) {
                    localStorage.setItem('GEMINI_API_KEY', LOCAL_API_KEY);
                } else {
                    throw new Error("Generación cancelada: Se requiere una API Key válida para continuar de forma local.");
                }
            }
            response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + LOCAL_API_KEY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: finalPrompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!response.ok) {
                if (response.status === 400 || response.status === 403) {
                    localStorage.removeItem('GEMINI_API_KEY');
                }
                throw new Error("Error en la respuesta de Gemini AI (" + response.status + ") " + await response.text());
            }
        }

        const data = await response.json();
        if (data.usedKey) {
            output.value += `✅ Usando ${data.usedKey}\n`;
        }
        let geminiText = data.candidates[0].content.parts[0].text;
        geminiText = geminiText.replace(/```json/g, "").replace(/```/g, "").trim();

        setProgress(70, 'Integrando datos con el documento...');
        output.value += 'Recibido de IA, rellenando plantilla Word...\n';

        const generatedData = JSON.parse(geminiText);

        // Agregamos marcadores únicos a los datos generados por la IA para formatearlos luego
        for (let key in generatedData) {
            if (generatedData.hasOwnProperty(key)) {
                generatedData[key] = "##AISTART##" + generatedData[key] + "##AIEND##";
            }
        }

        // ARAMAR DATOS FINALES PARA DOCXTEMPLATER
        const templateData = Object.assign({}, generatedData, areasDict);

        // Datos referenciales
        templateData.numero_pdc = (document.getElementById('numeroPDC').value || "01");
        templateData.distrito_educativo = (document.getElementById('distrito').value || "-").toUpperCase();
        templateData.unidad_educativa = (document.getElementById('ue').value || "-").toUpperCase();
        templateData.nivel = "PRIMARIA COMUNITARIA VOCACIONAL";

        let añosArr = gradosData.map(g => g.nombre.toUpperCase());
        templateData.año_de_escolaridad = añosArr.join(" Y ");

        templateData.maestro = (document.getElementById('maestro').value || "-").toUpperCase();
        templateData.director = (document.getElementById('directora').value || "-").toUpperCase();
        templateData.trimestre = (document.getElementById('trimestre').value || "-").toUpperCase();
        templateData.duracion = (document.getElementById('duracion').value || "-").toUpperCase();

        for (let i = 0; i < 6; i++) {
            let gNum = i + 1;
            templateData['grado_' + gNum] = gradosData[i] ? gradosData[i].nombre.toUpperCase() : "-";
        }

        templateData.condicion = adaptacionDetalle;

        // Cargar Template
        setProgress(85, 'Aplicando formato al documento...');

        // Selección dinámica de plantilla
        // 2 grados -> primaria_1.docx, 3 -> primaria_2.docx, etc.
        let templateFileName = 'primaria_' + (gradosData.length - 1) + '.docx';

        const templateResponse = await window.fetch(templateFileName);
        if (!templateResponse.ok) throw new Error("No se pudo cargar la plantilla " + templateFileName);
        const content = await templateResponse.arrayBuffer();

        const zip = new window.PizZip(content);
        const doc = new window.docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            delimiters: { start: '{{', end: '}}' },
            nullGetter: function () { return "-"; }
        });

        doc.render(templateData);

        // --- POST-PROCESAMIENTO PARA NEGRITAS OPCIONAL ---
        let postZip = doc.getZip();
        let finalXml = postZip.file('word/document.xml').asText();

        // 1. Aplicar formato general de IA a los párrafos: Arial 9pt, Izquierda, interlineado 1.15
        finalXml = finalXml.replace(/<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g, function (match, innerP) {
            if (innerP.includes('##AISTART##')) {
                // Eliminar marcadores
                let cleanInner = innerP.replace(/##AISTART##/g, '').replace(/##AIEND##/g, '');

                let pProperties = '<w:pPr><w:spacing w:line="276" w:lineRule="auto" w:before="0" w:after="0"/><w:jc w:val="left"/></w:pPr>';
                let rProperties = '<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:color w:val="000000"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>';

                // Reemplazar o inyectar propiedades de párrafo
                if (cleanInner.includes('<w:pPr>')) {
                    cleanInner = cleanInner.replace(/<w:pPr>[\s\S]*?<\/w:pPr>/, pProperties);
                } else {
                    cleanInner = pProperties + cleanInner;
                }

                // Eliminar propiedades de run (fuente/tamaño) existentes para que no hagan conflicto
                cleanInner = cleanInner.replace(/<w:rPr>[\s\S]*?<\/w:rPr>/g, '');

                // Inyectar nuestras propiedades de run después de cada apertura de <w:r>
                cleanInner = cleanInner.replace(/(<w:r(?:\s[^>]*)?>)/g, '$1' + rProperties);

                return '<w:p>' + cleanInner + '</w:p>';
            }
            return match;
        });

        // 2. Buscar SER:, SABER:, HACER: y aplicar formato negrita manteniendo Arial 9pt
        let rPropBold = '<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:color w:val="000000"/><w:sz w:val="18"/><w:szCs w:val="18"/><w:b/></w:rPr>';
        let rPropNorm = '<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:color w:val="000000"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>';

        finalXml = finalXml.replace(/(<w:t[^>]*>)((?:&nbsp;|\s)*)(SER:|SABER:|HACER:|PRÁCTICA:|TEORÍA:|PRODUCCIÓN:|VALORACIÓN:)((?:&nbsp;|\s)*)/g,
            '$1$2</w:t></w:r><w:r>' + rPropBold + '<w:t xml:space="preserve">$3</w:t></w:r><w:r>' + rPropNorm + '<w:t xml:space="preserve">$4');

        postZip.file('word/document.xml', finalXml);
        // -----------------------------------------

        const out = postZip.generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        setProgress(95, 'Preparando archivo para descarga...');
        output.value += 'Preparando archivo para descarga...\n';

        documentoGeneradoBlob = out;
        documentoNombre = "PDC_MULTIGRADO_" + templateData.numero_pdc + ".docx";

        setTimeout(() => {
            setProgress(100, 'PDC generado correctamente');
            output.value += 'Generación exitosa. Listo para descargar.\n';
            if (output) output.scrollTop = output.scrollHeight;
            if (btnDescargar) btnDescargar.classList.remove('hidden');
            if (btn) { btn.innerHTML = originalBtnText; btn.disabled = false; }
        }, 600);

    } catch (error) {
        console.error(error);
        setProgress(0, 'Error en el proceso');
        if (output) output.value += "\nERROR: " + error.message + "\n";
        if (btn) { btn.innerHTML = originalBtnText; btn.disabled = false; }
    }
}


// -----------------------------------------------------------------------------
// Medidas de Seguridad del Cliente (Prevenir visualización de código)
// -----------------------------------------------------------------------------
document.addEventListener('contextmenu', event => {
    const tagName = event.target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || event.target.isContentEditable) {
        return; // Habilita el menú contextual en campos de registro
    }
    event.preventDefault();
});

document.addEventListener('keydown', (e) => {
    // Evitar F12
    if (e.key === 'F12') {
        e.preventDefault();
    }
    // Evitar Ctrl+Shift+I (Herramientas de desarrollo)
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'I') {
        e.preventDefault();
    }
    // Evitar Ctrl+Shift+J (Consola)
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'J') {
        e.preventDefault();
    }
    // Evitar Ctrl+U (Ver código fuente)
    if (e.ctrlKey && e.key.toUpperCase() === 'U') {
        e.preventDefault();
    }
    // Evitar Ctrl+S (Guardar página)
    if (e.ctrlKey && e.key.toUpperCase() === 'S') {
        e.preventDefault();
    }
});

// Inicializar predeterminados de la interfaz
document.addEventListener('DOMContentLoaded', () => {
    renderizarConfiguracionGrados();
});
