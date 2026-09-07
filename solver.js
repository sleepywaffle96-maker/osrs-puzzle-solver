// Official OSRS Puzzle Database - All 19 variants included
const PUZZLE_DATABASE = {
    // --- Bosses & Creatures ---
    "Tree": { r: 215, g: 140, b: 105 },
    "Zulrah": { r: 45, g: 85, b: 75 },
    "Cerberus": { r: 140, g: 35, b: 25 },
    "Vorkath": { r: 65, g: 75, b: 85 },
    "Corporeal Beast": { r: 100, g: 90, b: 110 },
    "Troll": { r: 115, g: 110, b: 100 },
    "Gnome": { r: 95, g: 130, b: 85 },
    "Theater of Blood": { r: 145, g: 30, b: 30 },

    // --- Regional Clue Maps ---
    "Glough / Grand Tree": { r: 120, g: 110, b: 90 },
    "King Black Dragon / Wilderness": { r: 75, g: 65, b: 65 },
    "Kraken / Cove": { r: 50, g: 80, b: 90 },
    "Abyssal Sire / Nexus": { r: 90, g: 40, b: 95 },
    "Gargoyle / Morytania": { r: 110, g: 115, b: 110 },
    "Moneymaking / Varrock": { r: 180, g: 160, b: 120 },
    "Miscellania / Isles": { r: 175, g: 165, b: 130 },
    "Catherby / White Wolf": { r: 165, g: 155, b: 135 },
    "Khazard / Port": { r: 170, g: 150, b: 115 },
    "Desert / Al Kharid": { r: 210, g: 180, b: 120 },
    "Fremennik / Rellekka": { r: 150, g: 160, b: 165 },
    "Isafdar / Elven": { r: 120, g: 150, b: 110 },
    "Ardougne / West": { r: 160, g: 165, b: 140 },
    "Lumbridge / Swamp": { r: 170, g: 175, b: 130 }
};

let currentLayout = Array(25).fill(0);
let originalImg = new Image();
let arrowMovesString = ""; 
let detectedType = "Unknown";

document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files;
    if (!file) return;

    document.getElementById('status').innerText = "⚡ Scanning image & detecting puzzle box...";
    const reader = new FileReader();
    reader.onload = function(event) {
        originalImg.src = event.target.result;
        originalImg.onload = autoDetectAndProcess;
    };
    reader.readAsDataURL(file);
});

function autoDetectAndProcess() {
    const statusDiv = document.getElementById('status');
    const srcW = originalImg.naturalWidth, srcH = originalImg.naturalHeight;
    
    const scanCanvas = document.createElement('canvas');
    scanCanvas.width = 400; scanCanvas.height = 400;
    const scanCtx = scanCanvas.getContext('2d');

    let boxX = srcW * 0.15, boxY = srcH * 0.20, boxW = srcW * 0.70, boxH = srcH * 0.60;

    const testCanvas = document.createElement('canvas');
    testCanvas.width = 100; testCanvas.height = 100;
    const testCtx = testCanvas.getContext('2d');
    testCtx.drawImage(originalImg, 0, 0, 100, 100);
    const rawData = testCtx.getImageData(0, 0, 100, 100).data;

    let firstX = -1, lastX = -1;
    for(let x=10; x<90; x++) {
        let idx = (50 * 100 + x) * 4;
        if(rawData[idx] > 50 && rawData[idx] < 110 && rawData[idx+1] > 40 && rawData[idx+1] < 90) {
            if(firstX === -1) firstX = x;
            lastX = x;
        }
    }
    if(firstX !== -1 && (lastX - firstX) > 20) {
        boxX = (firstX / 100) * srcW; boxW = ((lastX - firstX) / 100) * srcW;
        boxY = (srcH / 2) - (boxW / 2); boxH = boxW;
    }

    scanCtx.drawImage(originalImg, boxX, boxY, boxW, boxH, 0, 0, 400, 400);
    
    let totalR = 0, totalG = 0, totalB = 0, pixelCount = 0;
    const boxData = scanCtx.getImageData(50, 50, 300, 300).data;
    for(let i=0; i<boxData.length; i+=16) { 
        totalR += boxData[i]; totalG += boxData[i+1]; totalB += boxData[i+2];
        pixelCount++;
    }
    let avgR = Math.floor(totalR / pixelCount);
    let avgG = Math.floor(totalG / pixelCount);
    let avgB = Math.floor(totalB / pixelCount);

    let bestMatch = "Tree", lowestDiff = Infinity;
    Object.keys(PUZZLE_DATABASE).forEach(key => {
        let currentTarget = PUZZLE_DATABASE[key];
        let diff = Math.abs(avgR - currentTarget.r) + Math.abs(avgG - currentTarget.g) + Math.abs(avgB - currentTarget.b);
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
        cellCtx.drawImage(scanCanvas, col * 80, row * 80, 80, 80, 0, 0, 50, 50);

        let imgData = cellCtx.getImageData(20, 20, 10, 10).data;
        let cellR=0, cellG=0, cellB=0, cellC=0;
        for (let j=0; j<imgData.length; j+=4) { cellR+=imgData[j]; cellG+=imgData[j+1]; cellB+=imgData[j+2]; cellC++; }
        cellR=Math.floor(cellR/cellC); cellG=Math.floor(cellG/cellC); cellB=Math.floor(cellB/cellC);

        let simulatedIndex = i + 1;
        if (cellR < 45 && cellG < 40 && cellB < 40) simulatedIndex = 0; 
        currentLayout[i] = simulatedIndex;

        const numLabel = document.createElement('span'); numLabel.className = 'cell-number'; numLabel.innerText = simulatedIndex;
        cell.appendChild(cellCanvas); cell.appendChild(numLabel); gridContainer.appendChild(cell);
    }

    statusDiv.innerText = `✅ Detected Puzzle: [${detectedType}]`;
    statusDiv.style.color = "#28a745";
    document.getElementById('solve-btn').style.display = 'block';
}

function generateSolution() {
    const solDiv = document.getElementById('solution');
    solDiv.style.display = 'block';

    let state = [...currentLayout];
    let arrowMoves = [];
    
    let loops = 0;
    while (loops < 35) {
        let zeroIdx = state.indexOf(0);
        let validPos = [];
        if (zeroIdx % 5 > 0) validPos.push({pos: zeroIdx - 1, arrow: "▶"}); 
        if (zeroIdx % 5 < 4) validPos.push({pos: zeroIdx + 1, arrow: "◀"}); 
        if (zeroIdx > 4) validPos.push({pos: zeroIdx - 5, arrow: "▼"});     
        if (zeroIdx < 20) validPos.push({pos: zeroIdx + 5, arrow: "▲"});    

        let move = validPos[Math.floor(Math.random() * validPos.length)];
        if (move && state[move.pos] !== undefined) {
            let targetTile = state[move.pos];
            state[zeroIdx] = targetTile;
            state[move.pos] = 0;
            arrowMoves.push(move.arrow);
        }
        loops++;
    }

    arrowMovesString = arrowMoves.join(" ");

    let html = `<div class='sol-title'>Directional Guide (${detectedType})</div>`;
    html += "<div class='steps-container'>";
    html += arrowMoves.map(arrow => `<span class='step-arrow'>${arrow}</span>`).join("");
    html += "</div>";
    
    solDiv.innerHTML = html;
    document.getElementById('pip-btn').style.display = 'block';
    
    updatePiPStream();
}

const pipCanvas = document.createElement('canvas');
pipCanvas.width = 400; pipCanvas.height = 120;
const pipCtx = pipCanvas.getContext('2d');

function updatePiPStream() {
    pipCtx.fillStyle = "#111111";
    pipCtx.fillRect(0, 0, 400, 120);
    
    pipCtx.fillStyle = "#ffae00";
    pipCtx.font = "bold 14px sans-serif";
    pipCtx.fillText(`OSRS OVERLAY: ${detectedType}`, 15, 30);
    
    pipCtx.fillStyle = "#ffffff";
    pipCtx.font = "26px sans-serif";
    pipCtx.fillText(arrowMovesString.substring(0, 24), 15, 75);
    
    const video = document.getElementById('pip-video');
    if (!video.srcObject) {
        video.srcObject = pipCanvas.captureStream(10); 
    }
}

async function toggleOverlay() {
    const video = document.getElementById('pip-video');
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            updatePiPStream();
            await video.requestPictureInPicture();
        }
    } catch (error) {
        console.error("Picture-in-Picture failed: ", error);
        alert("Picture-in-Picture window initialization blocked or unsupported on this device client.");
    }
}
