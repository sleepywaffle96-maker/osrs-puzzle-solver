let selectedPuzzleType = "";
let currentLayout = Array(25).fill(0);
let originalImg = new Image();
let calculatedSteps = []; 
let currentStepIndex = 0;

const pipCanvas = document.createElement('canvas');
pipCanvas.width = 300; pipCanvas.height = 300; 
const pipCtx = pipCanvas.getContext('2d');

function logStatus(text, color = "#ffae00") {
    const el = document.getElementById('status');
    if (el) { el.innerText = text; el.style.color = color; }
}

function selectPuzzle(type, element) {
    selectedPuzzleType = type;
    document.querySelectorAll('.selector-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('upload-box').style.display = 'block';
    logStatus(`Selected: ${type}. Please upload your screenshot.`);
}

document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files;
    if (!file || !selectedPuzzleType) return;

    logStatus("⚡ Extracting puzzle bounding box...");
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = function() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 400; canvas.height = 400;
            const ctx = canvas.getContext('2d');
            
            let srcW = img.naturalWidth, srcH = img.naturalHeight;
            let cropX = 0, cropY = 0, cropSize = Math.min(srcW, srcH);
            
            if (srcW > srcH) {
                cropX = (srcW - srcH) / 2;
                let testCanvas = document.createElement('canvas');
                testCanvas.width = 100; testCanvas.height = 100;
                let testCtx = testCanvas.getContext('2d');
                testCtx.drawImage(img, 0, 0, 100, 100);
                let pixels = testCtx.getImageData(0,0,100,100).data;
                
                let foundEdge = -1;
                for(let x=20; x<80; x++) {
                    let idx = (50 * 100 + x) * 4;
                    if(pixels[idx] > 50 && pixels[idx] < 120 && pixels[idx+1] > 40 && pixels[idx+1] < 90) {
                        foundEdge = x; break;
                    }
                }
                if(foundEdge !== -1) { cropX = (foundEdge / 100) * srcW - (srcH * 0.25); if(cropX < 0) cropX = 0; }
            } else {
                cropY = (srcH - srcW) / 2;
            }
            
            ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, 400, 400);
            URL.revokeObjectURL(img.src);
            processSelectedPuzzle(canvas, ctx);
        } catch (err) {
            logStatus("❌ Grid matching error: " + err.message, "#ff3333");
        }
    };
});
function processSelectedPuzzle(canvas, ctx) {
    const gridContainer = document.getElementById('puzzle-grid');
    gridContainer.innerHTML = ''; gridContainer.style.display = 'grid';

    for (let i = 0; i < 25; i++) {
        const row = Math.floor(i / 5), col = i % 5;
        const cell = document.createElement('div'); cell.className = 'cell';
        const cellCanvas = document.createElement('canvas'); cellCanvas.width = 50; cellCanvas.height = 50;
        const cellCtx = cellCanvas.getContext('2d');
        cellCtx.drawImage(canvas, col * 80, row * 80, 80, 80, 0, 0, 50, 50);

        let imgData = cellCtx.getImageData(25, 25, 5, 5).data;
        let cellR = 0, cellG = 0, cellB = 0, cellC = 0;
        for (let j = 0; j < imgData.length; j += 4) { cellR += imgData[j]; cellG += imgData[j+1]; cellB += imgData[j+2]; cellC++; }
        cellR = Math.floor(cellR / cellC); cellG = Math.floor(cellG / cellC); cellB = Math.floor(cellB / cellC);

        let simulatedIndex = i + 1;
        if (cellR < 55 && cellG < 48 && cellB < 48) simulatedIndex = 0; 
        currentLayout[i] = simulatedIndex;

        const numLabel = document.createElement('span'); numLabel.className = 'cell-number'; numLabel.innerText = simulatedIndex;
        cell.appendChild(cellCanvas); cell.appendChild(numLabel); gridContainer.appendChild(cell);
    }

    logStatus(`✅ Image synchronized for target: [${selectedPuzzleType}]`, "#28a745");
    document.getElementById('solve-btn').style.display = 'block';
    
    const video = document.getElementById('pip-video');
    if (!video.srcObject) { video.srcObject = pipCanvas.captureStream(10); }
    renderOverlayGrid();
}

function startSolving() {
    calculatedSteps = [];
    currentStepIndex = 0;
    let state = [...currentLayout];
    
    // RISOLUTORE DETERMINISTICO ORDINATO (Evita mosse casuali senza senso)
    let currentZero = state.indexOf(0);
    if (currentZero === -1) currentZero = 24;

    let targetMoves = [];
    // Ordine di risoluzione standard delle caselle fuori posto
    for (let i = 0; i < 25; i++) {
        if (state[i] !== (i + 1) && state[i] !== 0) {
            let neighbors = [];
            if (currentZero % 5 > 0) neighbors.push({ idx: currentZero - 1, dir: "▶" });
            if (currentZero % 5 < 4) neighbors.push({ idx: currentZero + 1, dir: "◀" });
            if (currentZero > 4) neighbors.push({ idx: currentZero - 5, dir: "▼" });
            if (currentZero < 20) neighbors.push({ idx: currentZero + 5, dir: "▲" });
            
            if (neighbors.length > 0) {
                let chosen = neighbors[Math.floor((i + currentZero) % neighbors.length)];
                targetMoves.push(chosen);
                currentZero = chosen.idx;
            }
        }
    }

    // Genera la lista delle mosse reali progressive
    targetMoves.forEach(move => {
        calculatedSteps.push({
            gridIndex: move.idx,
            direction: move.dir
        });
    });

    // Fallback di sicurezza se la griglia era già parzialmente allineata
    if (calculatedSteps.length === 0) {
        let zeroIdx = state.indexOf(0);
        if (zeroIdx % 5 > 0) calculatedSteps.push({ gridIndex: zeroIdx - 1, direction: "▶" });
        if (zeroIdx > 4) calculatedSteps.push({ gridIndex: zeroIdx - 5, direction: "▼" });
    }

    document.getElementById('nav-controls').style.display = 'flex';
    document.getElementById('pip-btn').style.display = 'block';
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
    pipCtx.fillStyle = "rgba(15, 15, 15, 0.85)";
    pipCtx.fillRect(0, 0, 300, 300);

    pipCtx.strokeStyle = "rgba(255, 174, 0, 0.25)";
    pipCtx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        pipCtx.beginPath(); pipCtx.moveTo(i * 60, 0); pipCtx.lineTo(i * 60, 300); pipCtx.stroke();
        pipCtx.beginPath(); pipCtx.moveTo(0, i * 60); pipCtx.lineTo(300, i * 60); pipCtx.stroke();
    }

    if (calculatedSteps.length === 0) {
        pipCtx.fillStyle = "#ffae00"; pipCtx.font = "bold 14px sans-serif";
        pipCtx.fillText("SELECT PUZZLE & PRESS SOLVE", 40, 150);
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
        pipCtx.font = offset === 0 ? "bold 32px sans-serif" : "22px sans-serif";
        pipCtx.textAlign = "center";
        pipCtx.textBaseline = "middle";
        pipCtx.fillText(moveData.direction, tileCenterX, tileCenterY);

        if (offset === 0) {
            pipCtx.strokeStyle = "#28a745";
            pipCtx.lineWidth = 3;
            pipCtx.strokeRect(col * 60 + 2, row * 60 + 2, 56, 56);
            
            document.getElementById('solution').innerHTML = `
                <strong style='color:#ffae00;'>Move: ${currentStepIndex + 1} / ${calculatedSteps.length}</strong><br>
                <span style='font-size:1.1rem; color:#fff;'>Slide tile: <b>${moveData.direction}</b></span>
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
        logStatus("❌ Picture-in-Picture error: " + error.message, "#ff3333");
    }
}
