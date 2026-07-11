// Base de datos de las oraciones escriturales
const DATA_ORDINANCES = {
    pan: {
        title: "Bendición del Pan",
        fullText: "Oh Dios, Padre Eterno, en el nombre de Jesucristo, tu Hijo, te pedimos que bendigas y santifiques este pan para las almas de todos los que participen de él, para que lo coman en memoria del cuerpo de tu Hijo, y testifiquen ante ti, oh Dios, Padre Eterno, que están dispuestos a tomar sobre sí el nombre de tu Hijo, y a recordarle siempre, y a guardar sus mandamientos que él les ha dado, para que siempre puedan tener su Espíritu consigo. Amén.",
        level1Template: `
            Oh Dios, Padre Eterno, en el nombre de Jesucristo, tu Hijo, te pedimos que bendigas y 
            <span class="blank-space" data-answer="santifiques" id="l1-space-1">_______</span> este pan para las 
            <span class="blank-space" data-answer="almas" id="l1-space-2">_______</span> de todos los que participen de él, para que lo coman en 
            <span class="blank-space" data-answer="memoria" id="l1-space-3">_______</span> del cuerpo de tu Hijo, y testifiquen ante ti, oh Dios, Padre Eterno, que están dispuestos a tomar sobre sí el 
            <span class="blank-space" data-answer="nombre" id="l1-space-4">_______</span> de tu Hijo, y a recordarle siempre, y a guardar sus 
            <span class="blank-space" data-answer="mandamientos" id="l1-space-5">_______</span> que él les ha dado, para que siempre puedan tener su Espíritu consigo. Amén.
        `,
        level1Words: ["santifiques", "almas", "memoria", "nombre", "mandamientos"],
        level2Phrases: [
            "Oh Dios, Padre Eterno, en el nombre de Jesucristo, tu Hijo,",
            "te pedimos que bendigas y santifiques este pan",
            "para las almas de todos los que participen de él,",
            "para que lo coman en memoria del cuerpo de tu Hijo,",
            "y testifiquen ante ti, oh Dios, Padre Eterno,",
            "que están dispuestos a tomar sobre sí el nombre de tu Hijo,",
            "y a recordarle siempre, y a guardar sus mandamientos que él les ha dado,",
            "para que siempre puedan tener su Espíritu consigo. Amén."
        ]
    },
    agua: {
        title: "Bendición del Agua",
        fullText: "Oh Dios, Padre Eterno, en el nombre de Jesucristo, tu Hijo, te pedimos que bendigas y santifiques esta agua para las almas de todos los que la beban, para que lo hagan en memoria de la sangre de tu Hijo, que por ellos se derramó; para que testifiquen ante ti, oh Dios, Padre Eterno, que siempre se acuerdan de él, para que puedan tener su Espíritu consigo. Amén.",
        level1Template: `
            Oh Dios, Padre Eterno, en el nombre de Jesucristo, tu Hijo, te pedimos que bendigas y 
            <span class="blank-space" data-answer="santifiques" id="l1-space-1">_______</span> esta agua para las 
            <span class="blank-space" data-answer="almas" id="l1-space-2">_______</span> de todos los que la beban, para que lo hagan en 
            <span class="blank-space" data-answer="memoria" id="l1-space-3">_______</span> de la sangre de tu Hijo, que por ellos se derramó; para que testifiquen ante ti, oh Dios, Padre Eterno, que siempre se 
            <span class="blank-space" data-answer="acuerdan" id="l1-space-4">_______</span> de él, para que puedan tener su 
            <span class="blank-space" data-answer="Espíritu" id="l1-space-5">_______</span> consigo. Amén.
        `,
        level1Words: ["santifiques", "almas", "memoria", "acuerdan", "Espíritu"],
        level2Phrases: [
            "Oh Dios, Padre Eterno, en el nombre de Jesucristo, tu Hijo,",
            "te pedimos que bendigas y santifiques esta agua",
            "para las almas de todos los que la beban,",
            "para que lo hagan en memoria de la sangre de tu Hijo, que por ellos se derramó;",
            "para que testifiquen ante ti, oh Dios, Padre Eterno,",
            "que siempre se acuerdan de él,",
            "para que puedan tener su Espíritu consigo. Amén."
        ]
    }
};

let currentOrdinance = 'pan'; // 'pan' o 'agua'
let currentLevel = 1;
let level1SelectedSpaceId = null;
let recognition = null;

// Elementos de Control de Pantallas
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const backToMenuBtn = document.getElementById('back-to-menu-btn');

// Elementos del Escenario del Juego
const stage = document.getElementById('game-stage');
const ordinanceTitle = document.getElementById('ordinance-title');
const levelSelector = document.getElementById('level-selector');
const feedbackMessage = document.getElementById('feedback-message');
const actionBtn = document.getElementById('action-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const resetBtn = document.getElementById('reset-btn');

// Cambiar de pantalla e iniciar práctica
function startProject(type) {
    currentOrdinance = type;
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    ordinanceTitle.textContent = DATA_ORDINANCES[type].title;
    loadLevel(1);
}

// Volver a la pantalla de Inicio
backToMenuBtn.addEventListener('click', () => {
    if (recognition) recognition.stop();
    gameScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
});

levelSelector.addEventListener('change', (e) => {
    loadLevel(parseInt(e.target.value));
});

function loadLevel(level) {
    currentLevel = level;
    levelSelector.value = level;
    feedbackMessage.textContent = "";
    feedbackMessage.className = "feedback";
    actionBtn.classList.add('hidden');
    nextLevelBtn.classList.add('hidden');
    resetBtn.classList.add('hidden');

    if (recognition) recognition.stop();

    if (level === 1) setupLevel1();
    else if (level === 2) setupLevel2();
    else if (level === 3) setupLevel3();
}

// ==========================================
// NIVEL 1: Completar Espacios
// ==========================================
function setupLevel1() {
    const data = DATA_ORDINANCES[currentOrdinance];
    stage.innerHTML = `
        <p class="prayer-text">${data.level1Template}</p>
        <div class="options-container" id="l1-options"></div>
    `;

    const spaces = document.querySelectorAll('.blank-space');
    const optionsContainer = document.getElementById('l1-options');
    
    spaces[0].classList.add('active');
    level1SelectedSpaceId = spaces[0].id;

    spaces.forEach(space => {
        space.addEventListener('click', () => {
            document.querySelector('.blank-space.active')?.classList.remove('active');
            space.classList.add('active');
            level1SelectedSpaceId = space.id;
        });
    });

    const shuffled = [...data.level1Words].sort(() => Math.random() - 0.5);
    shuffled.forEach(word => {
        const btn = document.createElement('button');
        btn.textContent = word;
        btn.classList.add('word-btn');
        btn.addEventListener('click', () => {
            const currentSpace = document.getElementById(level1SelectedSpaceId);
            if (currentSpace) {
                currentSpace.textContent = word;
                currentSpace.classList.add('filled');
                btn.disabled = true;
                
                let next = Array.from(spaces).find(s => s.textContent === "_______");
                currentSpace.classList.remove('active');
                if (next) {
                    next.classList.add('active');
                    level1SelectedSpaceId = next.id;
                } else {
                    level1SelectedSpaceId = null;
                    checkLevel1(spaces);
                }
            }
        });
        optionsContainer.appendChild(btn);
    });
}

function checkLevel1(spaces) {
    let correct = true;
    spaces.forEach(s => {
        if (s.textContent !== s.getAttribute('data-answer')) correct = false;
    });

    if (correct) {
        feedbackMessage.textContent = "¡Excelente! Nivel 1 completado con éxito.";
        feedbackMessage.className = "feedback correct";
        nextLevelBtn.classList.remove('hidden');
    } else {
        feedbackMessage.textContent = "Algunas palabras no coinciden con la escritura.";
        feedbackMessage.className = "feedback incorrect";
        resetBtn.classList.remove('hidden');
    }
}

// ==========================================
// NIVEL 2: Ordenar Bloques
// ==========================================
function setupLevel2() {
    actionBtn.classList.remove('hidden');
    actionBtn.textContent = "Verificar Orden";
    stage.innerHTML = `<div class="sortable-list" id="l2-list"></div>`;
    const listContainer = document.getElementById('l2-list');

    const data = DATA_ORDINANCES[currentOrdinance];
    let shuffledPhrases = [...data.level2Phrases].sort(() => Math.random() - 0.5);

    shuffledPhrases.forEach((phrase) => {
        const item = document.createElement('div');
        item.textContent = phrase;
        item.classList.add('phrase-item');
        item.draggable = true;
        item.addEventListener('dragstart', () => item.classList.add('dragging'));
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
        listContainer.appendChild(item);
    });

    listContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(listContainer, e.clientY);
        const draggingItem = document.querySelector('.dragging');
        if (afterElement == null) listContainer.appendChild(draggingItem);
        else listContainer.insertBefore(draggingItem, afterElement);
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.phrase-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
        else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkLevel2() {
    const items = document.querySelectorAll('.phrase-item');
    const data = DATA_ORDINANCES[currentOrdinance];
    let correct = true;

    items.forEach((item, index) => {
        if (item.textContent !== data.level2Phrases[index]) correct = false;
    });

    if (correct) {
        feedbackMessage.textContent = "¡Perfecto! El orden de las frases es correcto.";
        feedbackMessage.className = "feedback correct";
        actionBtn.classList.add('hidden');
        nextLevelBtn.classList.remove('hidden');
    } else {
        feedbackMessage.textContent = "El orden estructural no coincide. Intenta mover los bloques.";
        feedbackMessage.className = "feedback incorrect";
    }
}

// ==========================================
// NIVEL 3: Memorización Completa + Voz
// ==========================================
function setupLevel3() {
    actionBtn.classList.remove('hidden');
    actionBtn.textContent = "Validar Oración";

    stage.innerHTML = `
        <div class="textarea-container">
            <textarea class="prayer-textarea" id="l3-input" placeholder="Escribe o presiona el micrófono para recitar la oración completa..."></textarea>
            <p class="hint-text">Nota: La aprobación ignora tildes, comas, puntos y mayúsculas.</p>
            <div class="voice-controls">
                <button id="voice-start-btn" class="voice-btn">
                    <i class="fa-solid fa-microphone"></i> <span id="voice-btn-text">Responder con Voz</span>
                </button>
            </div>
        </div>
    `;

    initSpeechRecognition();
}

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        const voiceBtn = document.getElementById('voice-start-btn');
        if (voiceBtn) voiceBtn.style.display = 'none';
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'es-PE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const voiceBtn = document.getElementById('voice-start-btn');
    const voiceText = document.getElementById('voice-btn-text');
    const textarea = document.getElementById('l3-input');

    voiceBtn.addEventListener('click', () => {
        if (voiceBtn.classList.contains('listening')) recognition.stop();
        else { textarea.value = ""; recognition.start(); }
    });

    recognition.onstart = () => {
        voiceBtn.classList.add('listening');
        voiceText.textContent = "Escuchando... Recita la ordenanza";
    };

    recognition.onresult = (event) => { textarea.value = event.results[0][0].transcript; };
    recognition.onerror = () => {
        feedbackMessage.textContent = "Ocurrió un error con el micrófono.";
        feedbackMessage.className = "feedback incorrect";
    };
    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
        voiceText.textContent = "Responder con Voz";
    };
}

function checkLevel3() {
    const userInput = document.getElementById('l3-input').value;
    const data = DATA_ORDINANCES[currentOrdinance];
    
    const cleanText = (str) => {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
            .replace(/[.,;]/g, "")           // Elimina signos de puntuación
            .replace(/\s+/g, ' ')            // Remueve espacios extra
            .trim();
    };

    if (cleanText(userInput) === cleanText(data.fullText)) {
        feedbackMessage.textContent = "¡Extraordinario! Has memorizado la oración perfectamente. 🎉🏆";
        feedbackMessage.className = "feedback correct";
        actionBtn.classList.add('hidden');
    } else {
        feedbackMessage.textContent = "Hay detalles en la memorización que no coinciden con la escritura original.";
        feedbackMessage.className = "feedback incorrect";
    }
}

// ==========================================
// CONTROLADORES DE EVENTOS GLOBALES
// ==========================================
actionBtn.addEventListener('click', () => {
    if (currentLevel === 2) checkLevel2();
    if (currentLevel === 3) checkLevel3();
});

nextLevelBtn.addEventListener('click', () => {
    loadLevel(currentLevel + 1);
});

resetBtn.addEventListener('click', () => {
    loadLevel(currentLevel);
});