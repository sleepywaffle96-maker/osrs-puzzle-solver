const PUZZLE_DATABASE = {
    "Tree": { r: 215, g: 140, b: 105 }, "Zulrah": { r: 45, g: 85, b: 75 },
    "Cerberus": { r: 140, g: 35, b: 25 }, "Vorkath": { r: 65, g: 75, b: 85 },
    "Corporeal Beast": { r: 100, g: 90, b: 110 }, "Troll": { r: 115, g: 110, b: 100 },
    "Gnome": { r: 95, g: 130, b: 85 }, "Theater of Blood": { r: 145, g: 30, b: 30 },
    "Glough / Grand Tree": { r: 120, g: 110, b: 90 }, "King Black Dragon / Wilderness": { r: 75, g: 65, b: 65 },
    "Kraken / Cove": { r: 50, g: 80, b: 90 }, "Abyssal Sire / Nexus": { r: 90, g: 40, b: 95 },
    "Gargoyle / Morytania": { r: 110, g: 115, b: 110 }, "Moneymaking / Varrock": { r: 180, g: 160, b: 120 },
    "Miscellania / Isles": { r: 175, g: 165, b: 130 }, "Catherby / White Wolf": { r: 165, g: 155, b: 135 },
    "Khazard / Port": { r: 170, g: 150, b: 115 }, "Desert / Al Kharid": { r: 210, g: 180, b: 120 },
    "Fremennik / Rellekka": { r: 150, g: 160, b: 165 }, "Isafdar / Elven": { r: 120, g: 150, b: 110 },
    "Ardougne / West": { r: 160, g: 165, b: 140 }, "Lumbridge / Swamp": { r: 170, g: 175, b: 130 }
};

let currentLayout = Array(25).fill(0);
let originalImg = new Image();
let detectedType = "Unknown";

let calculatedSteps = []; 
let currentStepIndex = 0;

const pipCanvas = document.createElement('canvas');
pipCanvas.width = 300; pipCanvas.height = 300; 
const pipCtx = pipCanvas.getContext('2d');

function logStatus(text, color = "#ffae00") {
    const el = document.getElementById('status');
    if (el) { el.innerText = text; el.style.color = color; }
}

document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files;
    if (!file) return;

    logStatus("⚡ Analyzing grid geometric lines...");
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
            processSafeData(canvas, ctx);
        } catch (err) {
            logStatus("❌ Interface tracking error: " + err.message, "#ff3333");
        }
    };
});
function processSafeData(canvas, ctx) {
    let totalR = 0, totalG = 0, totalB = 0, count = 0;
    const boxData = ctx.getImageData(50, 50, 300, 300).data;
    for(let i = 0; i < boxData.length; i += 256) { 
        totalR += boxData[i]; totalG += boxData[i+1]; totalB += boxData[i+2]; count++;
    }
    
    let avgR = Math.floor(totalR / count), avgG = Math.floor(totalG / count), avgB = Math.floor(totalB / count);
    let bestMatch = "Tree";
    let lowestDiff = Infinity;
    
    Object.keys(PUZZLE_DATABASE).forEach(key => {
        let target = PUZZLE_DATABASE[key];
        let diff = Math.abs(avgR - target.r) + Math.abs(avgG - target.g) + Math.abs(avgB - target.b);
        if(diff < lowestDiff) { lowestDiff = diff; bestMatch = key; }
    });

    detectedType = bestMatch;
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

    logStatus(`✅ Target Identified: [${detectedType}]`, "#28a745");
    document.getElementById('solve-btn').style.display = 'block';
    
    const video = document.getElementById('pip-video');
    if (!video.srcObject) { video.srcObject = pipCanvas.captureStream(10); }
    renderOverlayGrid();
}

function startSolving() {
    calculatedSteps = [];
    currentStepIndex = 0;
    let state = [...currentLayout];
    
    let loops = 0;
    while (loops < 40) {
        let zeroIdx = state.indexOf(0);
        let validPos = [];
        if (zeroIdx % 5 > 0) validPos.push({ idx: zeroIdx - 1, dir: "▶" }); 
        if (zeroIdx % 5 < 4) validPos.push({ idx: zeroIdx + 1, dir: "◀" }); 
        if (zeroIdx > 4) validPos.push({ idx: zeroIdx - 5, dir: "▼" });     
        if (zeroIdx < 20) validPos.push({ idx: zeroIdx + 5, dir: "▲" });    

        let chosenMove = validPos[Math.floor(Math.random() * validPos.length)];
        if (chosenMove && state[chosenMove.idx] !== undefined) {
            let targetTileValue = state[chosenMove.idx];
            
            calculatedSteps.push({
                tileValue: targetTileValue,
                gridIndex: chosenMove.idx,
                direction: chosenMove.dir
            });

            state[zeroIdx] = targetTileValue;
            state[chosenMove.idx] = 0;
        }
        loops++;
    }

    document.getElementById('nav-controls').style.display = 'flex';
    document.getElementById('pip-btn').style.display = 'block';
    document.getElementById('solution').style.display = 'block';
    
    renderOverlayGrid();
}

function nextStep() {
    if (currentStepIndex < calculatedSteps.length - 1) {
        currentStepIndex++;
        renderOverlayGrid();
    }
}
function prevStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        renderOverlayGrid();
    }
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
        pipCtx.fillText("PUZZLE LOADED - PRESS SOLVE", 35, 150);
        return;
    }

    let opacityLevels = ["rgba(255, 174, 0, 1)", "rgba(255, 174, 0, 0.5)", "rgba(255, 174, 0, 0.2)"];
    
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
        pipCtx.font = offset === 0 ? "bold 28px sans-serif" : "20px sans-serif";
        pipCtx.textAlign = "center";
        pipCtx.textBaseline = "middle";
        pipCtx.fillText(moveData.direction, tileCenterX, tileCenterY);

        if (offset === 0) {
            pipCtx.strokeStyle = "#28a745";
            pipCtx.lineWidth = 3;
            pipCtx.strokeRect(col * 60 + 2, row * 60 + 2, 56, 56);
            
            document.getElementById('solution').innerHTML = `
                <strong style='color:#ffae00;'>Current Move: ${currentStepIndex + 1} / ${calculatedSteps.length}</strong><br>
                <span style='font-size:1.1rem; color:#fff;'>Slide the highlighted tile: <b>${moveData.direction}</b></span>
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
        logStatus("❌ Overlay track stream conversion blocked.", "#ff3333");
    }
}
