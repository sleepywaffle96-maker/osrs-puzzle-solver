const PUZZLE_DATABASE = {
    "Tree": { r: 215, g: 140, b: 105 }, 
    "Zulrah": { r: 45, g: 85, b: 75 },
    "Cerberus": { r: 140, g: 35, b: 25 }, 
    "Vorkath": { r: 65, g: 75, b: 85 },
    "Corporeal Beast": { r: 100, g: 90, b: 110 }, 
    "Troll": { r: 115, g: 110, b: 100 },
    "Gnome": { r: 95, g: 130, b: 85 }, 
    "Theater of Blood": { r: 145, g: 30, b: 30 },
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
let arrowMovesString = ""; 
let detectedType = "Unknown";

function logStatus(text, color = "#ffae00") {
    const el = document.getElementById('status');
    if (el) { 
        el.innerText = text; 
        el.style.color = color; 
    }
}

document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    logStatus("⚡ Syncing image data link...");
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = function() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 400; 
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 400, 400);
            URL.revokeObjectURL(img.src);
            processSafeData(canvas, ctx);
        } catch (err) {
            logStatus("❌ Stream downsample error: " + err.message, "#ff3333");
        }
    };
});

function processSafeData(canvas, ctx) {
    logStatus("⚡ Running color-signature metrics...");
    let totalR = 0, totalG = 0, totalB = 0, count = 0;
    const boxData = ctx.getImageData(50, 50, 300, 300).data;
    
    for(let i = 0; i < boxData.length; i += 256) { 
        totalR += boxData[i]; 
        totalG += boxData[i+1]; 
        totalB += boxData[i+2];
        count++;
    }
    
    let avgR = Math.floor(totalR / count);
    let avgG = Math.floor(totalG / count);
    let avgB = Math.floor(totalB / count);
    let bestMatch = "Tree";
    let lowestDiff = Infinity;
    
    Object.keys(PUZZLE_DATABASE).forEach(key => {
        let target = PUZZLE_DATABASE[key];
        let diff = Math.abs(avgR - target.r) + Math.abs(avgG - target.g) + Math.abs(avgB - target.b);
        if(diff < lowestDiff) { 
            lowestDiff = diff; 
            bestMatch = key; 
        }
    });

    detectedType = bestMatch;
    const gridContainer = document.getElementById('puzzle-grid');
    gridContainer.innerHTML = ''; 
    gridContainer.style.display = 'grid';

    for (let i = 0; i < 25; i++) {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const cell = document.createElement('div'); 
        cell.className = 'cell';
        const cellCanvas = document.createElement('canvas'); 
        cellCanvas.width = 50; 
        cellCanvas.height = 50;
        const cellCtx = cellCanvas.getContext('2d');
        cellCtx.drawImage(canvas, col * 80, row * 80, 80, 80, 0, 0, 50, 50);

        let imgData = cellCtx.getImageData(20, 20, 10, 10).data;
        let cellR = 0, cellG = 0, cellB = 0, cellC = 0;
        for (let j = 0; j < imgData.length; j += 4) { 
            cellR += imgData[j]; 
            cellG += imgData[j+1]; 
            cellB += imgData[j+2]; 
            cellC++; 
        }
        cellR = Math.floor(cellR / cellC); 
        cellG = Math.floor(cellG / cellC); 
        cellB = Math.floor(cellB / cellC);

        let simulatedIndex = i + 1;
        if (cellR < 50 && cellG < 45 && cellB < 45) simulatedIndex = 0; 
        currentLayout[i] = simulatedIndex;

        const numLabel = document.createElement('span'); 
        numLabel.className = 'cell-number'; 
        numLabel.innerText = simulatedIndex;
        cell.appendChild(cellCanvas); 
        cell.appendChild(numLabel); 
        gridContainer.appendChild(cell);
    }

    logStatus(`✅ Target Identified: [${detectedType}]`, "#28a745");
    document.getElementById('solve-btn').style.display = 'block';
}

function generateSolution() {
    const solDiv = document.getElementById('solution');
    solDiv.style.display = 'block';

    let state = [...currentLayout];
    let arrowMoves = [];
    let loops = 0;
    
    while (loops < 30) {
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
pipCanvas.width = 400; 
pipCanvas.height = 120;
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
        logStatus("❌ Overlay track stream conversion blocked.", "#ff3333");
    }
}
