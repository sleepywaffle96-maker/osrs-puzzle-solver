<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>OSRS Premium Overlay Solver</title>
    <style>
        * { box-sizing: border-box; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
            background: radial-gradient(circle, #221a12 0%, #0d0a07 100%); 
            color: #e0e0e0; margin: 0; padding: 20px 15px; 
            display: flex; flex-direction: column; align-items: center; min-height: 100vh;
        }
        h1 { font-size: 1.6rem; color: #ffae00; margin: 10px 0 5px 0; font-weight: 800; text-transform: uppercase; text-align: center; text-shadow: 2px 2px #000; }
        .subtitle { font-size: 0.85rem; color: #8a8a8a; text-align: center; margin: 0 0 20px 0; max-width: 340px; }
        
        .selector-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; width: 100%; max-width: 360px; margin-bottom: 25px; }
        .selector-btn { 
            background: #2b211a; border: 2px solid #543f32; border-radius: 8px; padding: 12px; 
            text-align: center; color: #fff; font-weight: bold; cursor: pointer; 
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            will-change: transform;
        }
        .selector-btn:hover { transform: scale(1.06); border-color: #ba8000; box-shadow: 0 6px 16px rgba(0,0,0,0.7); }
        .selector-btn img { width: 80px; height: 80px; border-radius: 6px; margin-bottom: 6px; border: 1px solid #1a1410; background: #000; pointer-events: none; }
        .selector-btn span { font-size: 0.9rem; color: #ffae00; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; pointer-events: none; }
        .selector-btn.active { border-color: #ffae00; background: #47321c; transform: scale(1.03); box-shadow: 0 0 14px rgba(255,174,0,0.4); }

        .upload-container { width: 100%; max-width: 360px; background: #1c1510; border: 2px dashed #ffae00; border-radius: 12px; padding: 25px 20px; text-align: center; display: none; box-shadow: 0 8px 20px rgba(0,0,0,0.6); }
        #file-input { display: none; }
        .upload-btn { display: inline-block; background: linear-gradient(135deg, #ffae00 0%, #d49100 100%); color: #000; padding: 14px 24px; font-weight: bold; border-radius: 8px; cursor: pointer; width: 100%; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(255,174,0,0.2); }
        #status { font-weight: 600; color: #ffae00; margin-top: 12px; font-size: 0.9rem; text-align: center; background: #110c08; padding: 10px; border-radius: 6px; border: 1px solid #3a2a1c; }
        
        /* Contenitore di puntamento */
        #crop-area-wrapper { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 340px; margin-top: 15px; }

        .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; width: 100%; max-width: 340px; margin-top: 20px; background: #110d0a; padding: 8px; border-radius: 12px; border: 2px solid #3a2b1f; display: none; }
        .cell { aspect-ratio: 1; background: #222; border-radius: 6px; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; border: 1px solid #443322; }
        .cell canvas { width: 100%; height: 100%; object-fit: cover; }
        .cell-number { position: absolute; bottom: 3px; right: 3px; background: rgba(0,0,0,0.85); color: #ffae00; font-size: 10px; padding: 1px 4px; border-radius: 4px; font-family: monospace; font-weight: bold; }
        
        .action-btn { width: 100%; max-width: 340px; margin-top: 15px; padding: 16px; font-size: 1rem; font-weight: 700; background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; border: none; border-radius: 8px; cursor: pointer; text-transform: uppercase; box-shadow: 0 4px 12px rgba(40,167,69,0.3); display: none; }
        .pip-btn { background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); box-shadow: 0 4px 12px rgba(0,123,255,0.3); display: block !important; margin-top: 15px; }
        
        .nav-controls { display: flex; gap: 10px; width: 100%; max-width: 340px; margin-top: 15px; display: none; }
        .nav-btn { flex: 1; padding: 14px; font-weight: bold; background: #2b211a; color: #fff; border: 1px solid #543f32; border-radius: 8px; cursor: pointer; text-align: center; text-transform: uppercase; }

        #solution { margin-top: 25px; background: #14100c; padding: 20px; border-radius: 12px; width: 100%; max-width: 340px; border-top: 4px solid #ffae00; display: none; text-align: center; border: 1px solid #2d2218; }
        #pip-video { display: none; }
    </style>
</head>
<body>

    <h1>Select Puzzle Box</h1>
    <div class="subtitle">Click on your puzzle variant to unlock manual framing viewports.</div>

    <div class="selector-grid">
        <div class="selector-btn" onclick="selectPuzzle('Troll', this)"><img src="troll.png" alt="Troll"><span>Troll</span></div>
        <div class="selector-btn" onclick="selectPuzzle('Tree', this)"><img src="tree.png" alt="Tree"><span>Tree</span></div>
        <div class="selector-btn" onclick="selectPuzzle('Castle', this)"><img src="castle.png" alt="Castle"><span>Castle</span></div>
        <div class="selector-btn" onclick="selectPuzzle('Zulrah', this)"><img src="zulrah.png" alt="Zulrah"><span>Zulrah</span></div>
        <div class="selector-btn" onclick="selectPuzzle('Cerberus', this)"><img src="cerberus.png" alt="Cerberus"><span>Cerberus</span></div>
        <div class="selector-btn" onclick="selectPuzzle('Gnome', this)"><img src="gnome.png" alt="Gnome"><span>Gnome</span></div>
        <div class="selector-btn" onclick="selectPuzzle('ToB', this)"><img src="tob.png" alt="ToB"><span>ToB</span></div>
    </div>

    <div class="upload-container" id="upload-box">
        <label for="file-input" class="upload-btn">📸 Select Screenshot</label>
        <input type="file" id="file-input" accept="image/*">
        <div id="status">Awaiting image file...</div>
    </div>

    <!-- Wrapper per il mirino interattivo -->
    <div id="crop-area-wrapper"></div>

    <div class="grid" id="puzzle-grid"></div>
    <button class="action-btn" id="solve-btn" onclick="startSolving()">🎯 Calculate Live Route</button>
    
    <div class="nav-controls" id="nav-controls">
        <button class="nav-btn" onclick="prevStep()">◀ BACKSTEP</button>
        <button class="nav-btn" style="background: linear-gradient(135deg, #ffae00 0%, #d49100 100%); color: #000;" onclick="nextStep()">NEXT STEP ▶</button>
    </div>

    <button class="action-btn pip-btn" id="pip-btn" onclick="toggleOverlay()">📺 Open Float Overlay</button>
    <video id="pip-video" autoplay playsinline muted></video>
    <div id="solution"></div>

    <script src="solver.js"></script>
</body>
</html>
document.getElementById('file-input').addEventListener('change', function(e) {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedPuzzleType) return;

    logStatus("🎯 MOVE the image so your puzzle fits exactly inside the orange square box.", "#ffae00");

    const img = new Image();
    img.src = URL.createObjectURL(files[0]); // FIXED Blob pointer
    
    img.onload = function() {
        const wrapper = document.getElementById('crop-area-wrapper');
        wrapper.innerHTML = ''; // Svuota precedenti puntatori

        // Area visiva quadrata fissa su cui l'utente allinea il gioco
        const viewport = document.createElement('div');
        viewport.style.position = 'relative';
        viewport.style.width = '300px';
        viewport.style.height = '300px';
        viewport.style.overflow = 'hidden';
        viewport.style.border = '4px solid #ffae00';
        viewport.style.borderRadius = '12px';
        viewport.style.background = '#111';

        const viewImg = document.createElement('img');
        viewImg.src = img.src;
        viewImg.style.position = 'absolute';
        viewImg.style.top = '0px';
        viewImg.style.left = '0px';
        viewImg.style.cursor = 'move';
        viewImg.style.maxWidth = 'none';

        // Calcola una larghezza iniziale ottimizzata per far stare lo screenshot nella canvas
        let initialWidth = 640; 
        let scaleFactor = initialWidth / img.naturalWidth;
        viewImg.style.width = `${initialWidth}px`;
        viewImg.style.height = `${img.naturalHeight * scaleFactor}px`;

        // Pulsante verde per confermare l'inquadratura
        const cropBtn = document.createElement('button');
        cropBtn.innerText = "🎯 LOCK CROP AND SOLVE";
        cropBtn.style.width = '100%'; cropBtn.style.padding = '14px'; cropBtn.style.marginTop = '12px';
        cropBtn.style.background = '#28a745'; cropBtn.style.color = '#fff';
        cropBtn.style.border = 'none'; cropBtn.style.fontWeight = 'bold'; cropBtn.style.borderRadius = '8px';

        viewport.appendChild(viewImg);
        wrapper.appendChild(viewport);
        wrapper.appendChild(cropBtn);

        // Funzione Drag & Touch per muovere l'immagine sotto la maschera
        let isDragging = false, startX, startY, posX = 0, posY = 0;

        const startDrag = (cx, cy) => { isDragging = true; startX = cx - posX; startY = cy - posY; };
        const moveDrag = (cx, cy) => { if (!isDragging) return; posX = cx - startX; posY = cy - startY; viewImg.style.left = `${posX}px`; viewImg.style.top = `${posY}px`; };
        const endDrag = () => { isDragging = false; };

        viewImg.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
        window.addEventListener('mouseup', endDrag);

        viewImg.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX, e.touches[0].clientY));
        viewImg.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY));
        viewImg.addEventListener('touchend', endDrag);

        cropBtn.onclick = function() {
            const outCanvas = document.createElement('canvas');
            outCanvas.width = 400; outCanvas.height = 400;
            const outCtx = outCanvas.getContext('2d', { willReadFrequently: true });

            // Scompone geometricamente in base a dove l'utente ha posizionato l'immagine
            let natScale = img.naturalWidth / initialWidth;
            let finalX = -posX * natScale;
            let finalY = -posY * natScale;
            let finalSize = 300 * natScale;

            outCtx.drawImage(img, finalX, finalY, finalSize, finalSize, 0, 0, 400, 400);
            
            wrapper.innerHTML = ''; // Rimuove il mirino
            processSelectedPuzzle(outCanvas, outCtx);
        };
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
    logStatus("✅ Crop aligned and locked into grid dataset!", "#28a745");
    document.getElementById('solve-btn').style.display = 'block';
    renderOverlayGrid();
}
function startSolving() {
    calculatedSteps = []; currentStepIndex = 0;
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
            let bestMove = neighbors; let minDistance = Infinity;
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

    targetMoves.forEach(move => { calculatedSteps.push({ gridIndex: move.idx, direction: move.dir }); });
    if (calculatedSteps.length === 0) {
        let zeroIdx = state.indexOf(0);
        calculatedSteps.push({ gridIndex: zeroIdx % 5 > 0 ? zeroIdx - 1 : zeroIdx + 1, direction: "▶" });
    }
    document.getElementById('nav-controls').style.display = 'flex';
    document.getElementById('solution').style.display = 'block';
    renderOverlayGrid();
}

function nextStep() { if (currentStepIndex < calculatedSteps.length - 1) { currentStepIndex++; renderOverlayGrid(); } }
function prevStep() { if (currentStepIndex > 0) { currentStepIndex--; renderOverlayGrid(); } }

function renderOverlayGrid() {
    pipCtx.fillStyle = "rgba(20, 14, 9, 0.90)"; pipCtx.fillRect(0, 0, 300, 300);
    pipCtx.strokeStyle = "rgba(255, 174, 0, 0.3)"; pipCtx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        pipCtx.beginPath(); pipCtx.moveTo(i * 60, 0); pipCtx.lineTo(i * 60, 300); pipCtx.stroke();
        pipCtx.beginPath(); pipCtx.moveTo(0, i * 60); pipCtx.lineTo(300, i * 60); pipCtx.stroke();
    }
    if (calculatedSteps.length === 0) {
        pipCtx.fillStyle = "#ffae00"; pipCtx.font = "bold 13px sans-serif"; pipCtx.textAlign = "center";
        pipCtx.fillText("UPLOAD IMAGE & PRESS SOLVE", 150, 150); return;
    }
    let opacityLevels = ["rgba(255, 174, 0, 1)", "rgba(255, 174, 0, 0.5)", "rgba(255, 174, 0, 0.25)"];
    for (let offset = 0; offset < 3; offset++) {
        let stepIdx = currentStepIndex + offset;
        if (stepIdx >= calculatedSteps.length) break;
        let moveData = calculatedSteps[stepIdx];
        let gridIdx = moveData.gridIndex; let col = gridIdx % 5; let row = Math.floor(gridIdx / 5);
        let tileCenterX = col * 60 + 30; let tileCenterY = row * 60 + 30;
        pipCtx.fillStyle = opacityLevels[offset];
        pipCtx.font = offset === 0 ? "bold 34px sans-serif" : "24px sans-serif";
        pipCtx.textAlign = "center"; pipCtx.textBaseline = "middle";
        pipCtx.fillText(moveData.direction, tileCenterX, tileCenterY);
        if (offset === 0) {
            pipCtx.strokeStyle = "#28a745"; pipCtx.lineWidth = 4; pipCtx.strokeRect(col * 60 + 2, row * 60 + 2, 56, 56);
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
        if (document.pictureInPictureElement) { await document.exitPictureInPicture(); } 
        else { renderOverlayGrid(); await video.requestPictureInPicture(); }
    } catch (error) { logStatus("❌ Stream overlay rejected.", "#ff3333"); }
}
