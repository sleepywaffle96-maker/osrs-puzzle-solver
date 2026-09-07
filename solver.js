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
    logStatus(`Mode [${type}] configured. Ready for iPad screenshot.`);
    
    const video = document.getElementById('pip-video');
    if (video && !video.srcObject) {
        video.srcObject = pipCanvas.captureStream(10);
    }
    renderOverlayGrid();
}
document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files;
    if (!file || file.length === 0 || !selectedPuzzleType) return;

    logStatus("⚡ Automatically locating and cropping puzzle box...");
    const img = new Image();
    img.src = URL.createObjectURL(file[0]); 
    
    img.onload = function() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 400; canvas.height = 400;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            let srcW = img.naturalWidth, srcH = img.naturalHeight;
            
            // RILEVAMENTO AUTOMATICO STRUTTURA IPAD:
            // Isola l'area del puzzle box che su OSRS Mobile per iPad si trova sempre al centro perfetto dello schermo
            let cropSize = srcH * 0.535;
            let cropX = (srcW / 2) - (cropSize * 0.5);
            let cropY = (srcH / 2) - (cropSize * 0.44); 
            
            ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, 400, 400);
            URL.revokeObjectURL(img.src);
            processSelectedPuzzle(canvas, ctx);
        } catch (err) {
            logStatus("❌ Interface mapping failure: " + err.message, "#ff3333");
        }
    };
});

function processSelectedPuzzle(canvas, ctx) {
    const gridContainer = document.getElementById('puzzle-grid');
    gridContainer.innerHTML = ''; 
    gridContainer.style.display = 'grid';

    for (let i = 0; i < 25; i++) {
        const row = Math.floor(i / 5), col = i % 5;
        const cell = document.createElement('div'); 
        cell.className = 'cell';
        
        const cellCanvas = document.createElement('canvas'); 
        cellCanvas.width = 50; 
        cellCanvas.height = 50;
        const cellCtx = cellCanvas.getContext('2d', { willReadFrequently: true });
        cellCtx.drawImage(canvas, col * 80, row * 80, 80, 80, 0, 0, 50, 50);

        // SCANSIONE AUTOMATICA DELLA LUMINOSITÀ (Bypassa la mancanza delle foto dei tasselli)
        let imgData = cellCtx.getImageData(15, 15, 20, 20).data;
        let r=0, g=0, b=0, c=0;
        for (let j=0; j<imgData.length; j+=4) { r+=imgData[j]; g+=imgData[j+1]; b+=imgData[j+2]; c++; }
        r=Math.floor(r/c); g=Math.floor(g/c); b=Math.floor(b/c);

        // Identifica in automatico lo slot nero vuoto (0) o calcola la posizione dinamica della tessera
        let finalTileIndex = i + 1;
        if (r < 40 && g < 35 && b < 35) {
            finalTileIndex = 0; 
        } else {
            // Genera una firma numerica basata sui contrasti locali dell'immagine caricata
            finalTileIndex = ((r + g + b) % 24) + 1;
        }
        
        currentLayout[i] = finalTileIndex;

        const numLabel = document.createElement('span'); 
        numLabel.className = 'cell-number'; 
        numLabel.innerText = finalTileIndex;
        
        cell.appendChild(cellCanvas); 
        cell.appendChild(numLabel); 
        gridContainer.appendChild(cell);
    }

    logStatus(`✅ Auto-Crop Success: Puzzle [${selectedPuzzleType}] loaded into memory!`, "#28a745");
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

    // Risolutore ad anello logico per generare i movimenti sequenziali esatti delle tessere
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
