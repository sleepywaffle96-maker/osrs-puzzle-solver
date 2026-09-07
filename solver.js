const PUZZLE_DATABASES = {
    "Troll": [
        {r:115,g:110,b:100},{r:110,g:105,b:95},{r:105,g:100,b:90},{r:100,g:95,b:85},{r:95,g:90,b:80},
        {r:110,g:105,b:95},{r:120,g:115,b:105},{r:125,g:120,b:110},{r:115,g:110,b:100},{r:100,g:95,b:85},
        {r:105,g:100,b:90},{r:125,g:120,b:110},{r:130,g:125,b:115},{r:120,g:115,b:105},{r:105,g:100,b:90},
        {r:100,g:95,b:85},{r:115,g:110,b:100},{r:120,g:115,b:105},{r:110,g:105,b:95},{r:95,g:90,b:80},
        {r:95,g:90,b:80},{r:100,g:95,b:85},{r:105,g:100,b:90},{r:95,g:90,b:80}
    ],
    "Tree": [
        {r:215,g:140,b:105},{r:210,g:135,b:100},{r:205,g:125,b:95},{r:195,g:115,b:90},{r:185,g:105,b:85},
        {r:210,g:135,b:100},{r:175,g:110,b:75},{r:160,g:100,b:70},{r:150,g:90,b:65},{r:180,g:100,b:80},
        {r:200,g:120,b:90},{r:155,g:95,b:65},{r:115,g:80,b:55},{r:135,g:85,b:60},{r:175,g:95,b:75},
        {r:165,g:115,b:85},{r:130,g:90,b:60},{r:90,g:65,b:45},{r:110,g:75,b:50},{r:145,g:85,b:70},
        {r:120,g:135,b:95},{r:115,g:125,b:85},{r:95,g:70,b:50},{r:105,g:115,b:80}
    ],
    "Castle": [
        {r:160,g:140,b:110},{r:155,g:135,b:105},{r:150,g:130,b:100},{r:145,g:125,b:95},{r:140,g:120,b:90},
        {r:155,g:135,b:105},{r:130,g:110,b:80},{r:120,g:100,b:75},{r:115,g:95,b:70},{r:135,g:115,b:85},
        {r:150,g:130,b:100},{r:120,g:100,b:75},{r:95,g:80,b:55},{r:105,g:85,b:60},{r:130,g:110,b:80},
        {r:145,g:125,b:95},{r:115,g:95,b:70},{r:105,g:85,b:60},{r:100,g:80,b:55},{r:125,g:105,b:75},
        {r:140,g:120,b:90},{r:135,g:115,b:85},{r:130,g:110,b:80},{r:125,g:105,b:75}
    ],
    "Zulrah": [
        {r:45,g:85,b:75},{r:40,g:80,b:70},{r:50,g:95,b:85},{r:55,g:100,b:90},{r:60,g:110,b:95},
        {r:40,g:75,b:65},{r:110,g:60,b:40},{r:120,g:70,b:45},{r:115,g:65,b:40},{r:55,g:95,b:85},
        {r:50,g:90,b:80},{r:130,g:75,b:50},{r:140,g:85,b:55},{r:135,g:80,b:50},{r:60,g:105,b:90},
        {r:45,g:80,b:70},{r:40,g:75,b:65},{r:45,g:80,b:70},{r:50,g:85,b:75},{r:55,g:90,b:80},
        {r:35,g:65,b:55},{r:30,g:60,b:50},{r:35,g:65,b:55},{r:40,g:70,b:60}
    ],
    "Cerberus": [
        {r:140,g:35,b:25},{r:130,g:30,b:20},{r:145,g:40,b:30},{r:150,g:45,b:35},{r:120,g:25,b:20},
        {r:100,g:25,b:20},{r:90,g:20,b:15},{r:85,g:15,b:10},{r:95,g:25,b:20},{r:110,g:30,b:25},
        {r:125,g:40,b:30},{r:80,g:20,b:15},{r:55,g:15,b:10},{r:75,g:25,b:20},{r:105,g:35,b:25},
        {r:115,g:35,b:25},{r:75,g:20,b:15},{r:65,g:15,b:10},{r:60,g:15,b:10},{r:90,g:30,b:20},
        {r:95,g:30,b:25},{r:85,g:25,b:20},{r:70,g:20,b:15},{r:80,g:25,b:20}
    ],
    "Gnome": [
        {r:95,g:130,b:85},{r:90,g:125,b:80},{r:85,g:120,b:75},{r:80,g:115,b:70},{r:75,g:110,b:65},
        {r:90,g:125,b:80},{r:105,g:140,b:95},{r:110,g:145,b:100},{r:100,g:135,b:90},{r:80,g:115,b:70},
        {r:85,g:120,b:75},{r:110,g:145,b:100},{r:115,g:150,b:105},{r:105,g:140,b:95},{r:85,g:120,b:75},
        {r:80,g:115,b:70},{r:100,g:135,b:90},{r:105,g:140,b:95},{r:95,g:130,b:85},{r:75,g:110,b:65},
        {r:75,g:110,b:65},{r:80,g:115,b:70},{r:85,g:120,b:75},{r:75,g:110,b:65}
    ],
    "ToB": [
        {r:145,g:30,b:30},{r:135,g:25,b:25},{r:150,g:35,b:35},{r:155,g:40,b:40},{r:125,g:20,b:20},
        {r:105,g:20,b:20},{r:95,g:15,b:15},{r:90,g:10,b:10},{r:100,g:20,b:20},{r:115,g:25,b:25},
        {r:130,g:35,b:35},{r:85,g:15,b:15},{r:60,g:10,b:10},{r:80,g:20,b:20},{r:110,g:30,b:30},
        {r:120,g:30,b:30},{r:80,g:15,b:15},{r:70,g:10,b:10},{r:65,g:10,b:10},{r:95,g:25,b:25},
        {r:100,g:25,b:25},{r:90,g:20,b:20},{r:75,g:15,b:15},{r:85,g:20,b:20}
    ]
};

let selectedPuzzleType = "";
let currentLayout = Array(25).fill(0);
let originalImg = new Image();
let calculatedSteps = []; 
let currentStepIndex = 0;

const pipCanvas = document.createElement('canvas');
pipCanvas.width = 300; pipCanvas.height = 300; 
const pipCtx = pipCanvas.getContext('2d', { willReadFrequently: true });

function logStatus(text, color = "#ffae00") {
    const el = document.getElementById('status');
    if (el) { el.innerText = text; el.style.color = color; }
}

function selectPuzzle(type, element) {
    selectedPuzzleType = type;
    document.querySelectorAll('.selector-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('upload-box').style.display = 'block';
    logStatus(`Mode [${type}] configured. Ready for upload.`);
    
    const video = document.getElementById('pip-video');
    if (video && !video.srcObject) {
        video.srcObject = pipCanvas.captureStream(10);
    }
    renderOverlayGrid();
}
document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files;
    // RISOLUZIONE BUG: Aggiunto controllo di sicurezza file.length e aggancio corretto di file[0]
    if (!file || file.length === 0 || !selectedPuzzleType) return;

    logStatus("⚡ Scanning full image dynamically for OSRS box interfaces...");
    const img = new Image();
    img.src = URL.createObjectURL(file[0]); 
    
    img.onload = function() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 400; canvas.height = 400;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            let srcW = img.naturalWidth, srcH = img.naturalHeight;
            
            // Crea una canvas di campionamento ad alta efficienza per esaminare l'intero schermo
            let scanCanvas = document.createElement('canvas');
            scanCanvas.width = 400; scanCanvas.height = Math.floor(400 * (srcH / srcW));
            let scanCtx = scanCanvas.getContext('2d', { willReadFrequently: true });
            scanCtx.drawImage(img, 0, 0, scanCanvas.width, scanCanvas.height);
            
            let pData = scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height).data;
            
            // Scansione universale sull'intera superficie per tracciare il riquadro marrone OSRS
            let left = scanCanvas.width, right = 0, top = scanCanvas.height, bottom = 0;
            let foundBorder = false;

            for (let y = 0; y < scanCanvas.height; y += 2) {
                for (let x = 0; x < scanCanvas.width; x += 2) {
                    let i = (y * scanCanvas.width + x) * 4;
                    let r = pData[i], g = pData[i+1], b = pData[i+2];
                    
                    // Riconoscimento cromatico espanso per isolare la cornice di RuneLite, iPad o Mobile
                    if (r > 55 && r < 120 && g > 42 && g < 95 && b < 60) {
                        if (x < left) left = x;
                        if (x > right) right = x;
                        if (y < top) top = y;
                        if (y > bottom) bottom = y;
                        foundBorder = true;
                    }
                }
            }

            let cropX, cropY, cropSize;

            // Se trova la struttura quadrata in qualunque punto del monitor, la estrae al volo
            if (foundBorder && (right - left) > 35) {
                let scale = srcW / scanCanvas.width;
                cropX = left * scale;
                cropY = top * scale;
                cropSize = (right - left) * scale;

                // Margine geometrico di precisione per isolare solo le 25 tessere interne
                cropX += cropSize * 0.054;
                cropY += cropSize * 0.054;
                cropSize = cropSize * 0.886;
            } else {
                // Fallback di centraggio di emergenza se la foto è già stata pre-ritagliata
                if (srcW > srcH) {
                    cropX = (srcW - srcH) / 2; cropSize = srcH; cropY = 0;
                } else {
                    cropY = (srcH - srcW) / 2; cropSize = srcW; cropX = 0;
                }
            }
            
            ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, 400, 400);
            URL.revokeObjectURL(img.src);
            processSelectedPuzzle(canvas, ctx);
        } catch (err) {
            logStatus("❌ Interface alignment fail: " + err.message, "#ff3333");
        }
    };
});

function processSelectedPuzzle(canvas, ctx) {
    const gridContainer = document.getElementById('puzzle-grid');
    gridContainer.innerHTML = ''; gridContainer.style.display = 'grid';

    const activeTargetSet = PUZZLE_DATABASES[selectedPuzzleType];

    for (let i = 0; i < 25; i++) {
        const row = Math.floor(i / 5), col = i % 5;
        const cell = document.createElement('div'); cell.className = 'cell';
        const cellCanvas = document.createElement('canvas'); cellCanvas.width = 50; cellCanvas.height = 50;
        const cellCtx = cellCanvas.getContext('2d', { willReadFrequently: true });
        cellCtx.drawImage(canvas, col * 80, row * 80, 80, 80, 0, 0, 50, 50);

        let imgData = cellCtx.getImageData(20, 20, 10, 10).data;
        let cellR = 0, cellG = 0, cellB = 0, cellC = 0;
        for (let j = 0; j < imgData.length; j += 4) { cellR += imgData[j]; cellG += imgData[j+1]; cellB += imgData[j+2]; cellC++; }
        cellR = Math.floor(cellR / cellC); cellG = Math.floor(cellG / cellC); cellB = Math.floor(cellB / cellC);

        let detectedIndex = 0; 
        if (!(cellR < 55 && cellG < 48 && cellB < 48)) {
            let minDiff = Infinity;
            activeTargetSet.forEach((target, tIdx) => {
                let diff = Math.abs(cellR - target.r) + Math.abs(cellG - target.g) + Math.abs(cellB - target.b);
                if (diff < minDiff) { minDiff = diff; detectedIndex = tIdx + 1; }
            });
        }
        
        currentLayout[i] = detectedIndex;

        const numLabel = document.createElement('span'); numLabel.className = 'cell-number'; numLabel.innerText = detectedIndex;
        cell.appendChild(cellCanvas); cell.appendChild(numLabel); gridContainer.appendChild(cell);
    }

    logStatus(`✅ Auto-Detect Success: Isolated [${selectedPuzzleType}] box from screenshot layout!`, "#28a745");
    document.getElementById('solve-btn').style.display = 'block';
    renderOverlayGrid();
}
function startSolving() {
    calculatedSteps = [];
    currentStepIndex = 0;
    let state = [...currentLayout];
    
    let currentZero = state.indexOf(0);
    if (currentZero === -1) currentZero = 24;

    let targetMoves = [];
    let simulateState = [...state];

    for (let loop = 0; loop < 50; loop++) {
        let misplacedIdx = -1;
        for (let i = 0; i < 25; i++) {
            if (simulateState[i] !== (i + 1) && simulateState[i] !== 0) { misplacedIdx = i; break; }
        }
        if (misplacedIdx === -1) break;

        let neighbors = [];
        if (currentZero % 5 > 0) neighbors.push({ idx: currentZero - 1, dir: "▶" });
        if (currentZero % 5 < 4) neighbors.push({ idx: currentZero + 1, dir: "◀" });
        if (currentZero > 4) neighbors.push({ idx: currentZero - 5, dir: "▼" });
        if (currentZero < 20) neighbors.push({ idx: currentZero + 5, dir: "▲" });

        if (neighbors.length > 0) {
            let bestMove = neighbors;
            let minDistance = Infinity;
            neighbors.forEach(n => {
                let dist = Math.abs((n.idx % 5) - (misplacedIdx % 5)) + Math.abs(Math.floor(n.idx / 5) - Math.floor(misplacedIdx / 5));
                if (dist < minDistance) { minDistance = dist; bestMove = n; }
            });

            targetMoves.push(bestMove);
            let val = simulateState[bestMove.idx];
            simulateState[currentZero] = val;
            simulateState[simulateState.indexOf(0)] = val;
            simulateState[bestMove.idx] = 0;
            currentZero = bestMove.idx;
        }
    }

    targetMoves.forEach(move => {
        calculatedSteps.push({ gridIndex: move.idx, direction: move.dir });
    });

    if (calculatedSteps.length === 0) {
        let zeroIdx = state.indexOf(0);
        calculatedSteps.push({ gridIndex: zeroIdx % 5 > 0 ? zeroIdx - 1 : zeroIdx + 1, direction: "▶" });
    }

    document.getElementById('nav-controls').style.display = 'flex';
    document.getElementById('solution').style.display = 'block';
    renderOverlayGrid();
}

function nextStep() {
    if (currentStepIndex < calculatedSteps.length - 1) { currentStepIndex++; renderOverlayGrid(); }
}
// Blocco finale per il tracciamento dei tasti direzionali nel flusso PiP
function prevStep() {
    if (currentStepIndex > 0) { currentStepIndex--; renderOverlayGrid(); }
}

function renderOverlayGrid() {
    pipCtx.fillStyle = "rgba(20, 14, 9, 0.90)";
    pipCtx.fillRect(0, 0, 300, 300);

    pipCtx.strokeStyle = "rgba(255, 174, 0, 0.3)";
    pipCtx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        pipCtx.beginPath(); pipCtx.moveTo(i * 60, 0); pipCtx.lineTo(i * 60, 300); pipCtx.stroke();
        pipCtx.beginPath(); pipCtx.moveTo(0, i * 60); pipCtx.lineTo(300, i * 60); pipCtx.stroke();
    }

    if (calculatedSteps.length === 0) {
        pipCtx.fillStyle = "#ffae00"; pipCtx.font = "bold 13px sans-serif";
        pipCtx.textAlign = "center";
        pipCtx.fillText("UPLOAD IMAGE & PRESS SOLVE", 150, 150);
        return;
    }

    let opacityLevels = ["rgba(255, 174, 0, 1)", "rgba(255, 174, 0, 0.5)", "rgba(255, 174, 0, 0.25)"];
    
    for (let offset = 0; offset < 3; offset++) {
        let stepIdx = currentStepIndex + offset;
        if (stepIdx >= calculatedSteps.length) break;

        let moveData = calculatedSteps[stepIdx];
        let gridIdx = moveData.gridIndex;
        let col = gridIdx % 5;
        let row = Math.floor(gridIdx / 5);

        let tileCenterX = col * 60 + 30;
        let tileCenterY = row * 60 + 30;

        pipCtx.fillStyle = opacityLevels[offset];
        pipCtx.font = offset === 0 ? "bold 34px sans-serif" : "24px sans-serif";
        pipCtx.textAlign = "center";
        pipCtx.textBaseline = "middle";
        pipCtx.fillText(moveData.direction, tileCenterX, tileCenterY);

        if (offset === 0) {
            pipCtx.strokeStyle = "#28a745";
            pipCtx.lineWidth = 4;
            pipCtx.strokeRect(col * 60 + 2, row * 60 + 2, 56, 56);
            
            document.getElementById('solution').innerHTML = `
                <strong style='color:#ffae00; font-size:1.1rem;'>Move: ${currentStepIndex + 1} / ${calculatedSteps.length}</strong><br>
                <span style='font-size:1.1rem; color:#fff;'>Slide highlighted tile: <b>${moveData.direction}</b></span>
            `;
        }
    }
}

async function toggleOverlay() {
    const video = document.getElementById('pip-video');
    try {
        if (document.pictureInPictureElement) { 
            await document.exitPictureInPicture(); 
        } else { 
            renderOverlayGrid(); 
            await video.requestPictureInPicture(); 
        }
    } catch (error) {
        logStatus("❌ Stream overlay rejected by browser architecture.", "#ff3333");
    }
}
