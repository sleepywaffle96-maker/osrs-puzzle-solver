let selectedPuzzleType = "";
let currentLayout = Array(25).fill(0);
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
document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById('file-input');
    if (!fileInput) return;

    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (!files || files.length === 0 || !selectedPuzzleType) return;

        logStatus("🔍 Zoom con due dita / rotellina e TRASCINA per inquadrare il puzzle box.", "#ffae00");

        const img = new Image();
        img.src = URL.createObjectURL(files[0]);
        
        img.onload = function() {
            let wrapper = document.getElementById('crop-area-wrapper');
            if (wrapper) wrapper.remove();

            wrapper = document.createElement('div');
            wrapper.id = 'crop-area-wrapper';
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'center';
            wrapper.style.width = '100%';
            wrapper.style.marginTop = '15px';

            const viewport = document.createElement('div');
            viewport.style.position = 'relative';
            viewport.style.width = '300px';
            viewport.style.height = '300px';
            viewport.style.overflow = 'hidden';
            viewport.style.border = '4px solid #ffae00';
            viewport.style.borderRadius = '12px';
            viewport.style.background = '#111';
            viewport.style.touchAction = 'none'; // Previene il caricamento della pagina durante il pinch zoom

            const viewImg = document.createElement('img');
            viewImg.src = img.src;
            viewImg.style.position = 'absolute';
            viewImg.style.top = '0px';
            viewImg.style.left = '0px';
            viewImg.style.cursor = 'move';
            viewImg.style.maxWidth = 'none';
            viewImg.style.transformOrigin = '0 0';

            // Impostazioni iniziali di scala fluida adattiva
            let baseWidth = 320;
            let currentScale = baseWidth / img.naturalWidth;
            let posX = 0, posY = 0;
            
            function updateTransform() {
                viewImg.style.width = `${img.naturalWidth * currentScale}px`;
                viewImg.style.height = `${img.naturalHeight * currentScale}px`;
                viewImg.style.left = `${posX}px`;
                viewImg.style.top = `${posY}px`;
            }
            updateTransform();

            const cropBtn = document.createElement('button');
            cropBtn.innerText = "🎯 CONFERMA RITAGLIO E RISOLVI";
            cropBtn.style.width = '100%'; cropBtn.style.padding = '14px'; cropBtn.style.marginTop = '12px';
            cropBtn.style.background = '#28a745'; cropBtn.style.color = '#fff';
            cropBtn.style.border = 'none'; cropBtn.style.fontWeight = 'bold'; cropBtn.style.borderRadius = '8px';
            cropBtn.style.cursor = 'pointer';

            viewport.appendChild(viewImg);
            wrapper.appendChild(viewport);
            wrapper.appendChild(cropBtn);
            document.getElementById('upload-box').after(wrapper);

            // GESTIONE TRASCINAMENTO E PINCH ZOOM (Mouse + Touchscreen)
            let isDragging = false, startX, startY;
            let lastTouchDist = 0;

            // Zoom con rotellina del mouse (Desktop)
            viewport.addEventListener('wheel', function(e) {
                e.preventDefault();
                let zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
                currentScale = Math.max(0.1, Math.min(currentScale * zoomFactor, 4));
                updateTransform();
            }, { passive: false });

            // Inizio tocco/click
            const onStart = (cx, cy) => { isDragging = true; startX = cx - posX; startY = cy - posY; };
            
            // Movimento tocco/click
            const onMove = (cx, cy) => { 
                if (!isDragging) return; 
                posX = cx - startX; 
                posY = cy - startY; 
                updateTransform(); 
            };

            viewport.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
            window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
            window.addEventListener('mouseup', () => { isDragging = false; });

            // Gestione eventi Touch completi per iPad (Pinch to Zoom con due dita)
            viewport.addEventListener('touchstart', function(e) {
                if (e.touches.length === 1) {
                    onStart(e.touches[0].clientX, e.touches[0].clientY);
                } else if (e.touches.length === 2) {
                    isDragging = false;
                    lastTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                }
            });

            viewport.addEventListener('touchmove', function(e) {
                if (e.touches.length === 1) {
                    onMove(e.touches[0].clientX, e.touches[0].clientY);
                } else if (e.touches.length === 2) {
                    let dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                    let factor = dist / lastTouchDist;
                    currentScale = Math.max(0.1, Math.min(currentScale * factor, 4));
                    lastTouchDist = dist;
                    updateTransform();
                }
            });

            viewport.addEventListener('touchend', () => { isDragging = false; lastTouchDist = 0; });

            cropBtn.onclick = function() {
                const outCanvas = document.createElement('canvas');
                outCanvas.width = 400; outCanvas.height = 400;
                const outCtx = outCanvas.getContext('2d', { willReadFrequently: true });

                // Conversione matematica esatta tra lo zoom della maschera e la risoluzione nativa del file
                let natScale = 1 / currentScale;
                let finalX = -posX * natScale;
                let finalY = -posY * natScale;
                let finalSize = 300 * natScale;

                outCtx.drawImage(img, finalX, finalY, finalSize, finalSize, 0, 0, 400, 400);
                wrapper.remove(); 
                processSelectedPuzzle(outCanvas, outCtx);
            };
        };
    });
});

function processSelectedPuzzle(canvas, ctx) {
    const gridContainer = document.getElementById('puzzle-grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = ''; 
    gridContainer.style.display = 'grid';

    for (let i = 0; i < 25; i++) {
        const row = Math.floor(i / 5), col = i % 5;
        const cell = document.createElement('div'); cell.className = 'cell';
        const cellCanvas = document.createElement('canvas'); cellCanvas.width = 50; cellCanvas.height = 50;
        const cellCtx = cellCanvas.getContext('2d', { willReadFrequently: true });
        cellCtx.drawImage(canvas, col * 80, row * 80, 80, 80, 0, 0, 50, 50);

        let imgData = cellCtx.getImageData(20, 20, 10, 10).data;
        let r=0, g=0, b=0, c=0;
        for (let j = 0; j < imgData.length; j += 4) { r += imgData[j]; g += imgData[j+1]; b += imgData[j+2]; c++; }
        r = Math.floor(r / c); g = Math.floor(g / c); b = Math.floor(b / c);

        let finalTileIndex = i + 1;
        if (r < 45 && g < 40 && b < 40) { finalTileIndex = 0; } 
        else { finalTileIndex = ((r + g + b) % 24) + 1; }
        
        currentLayout[i] = finalTileIndex;
        const numLabel = document.createElement('span'); numLabel.className = 'cell-number'; numLabel.innerText = finalTileIndex;
        cell.appendChild(cellCanvas); cell.appendChild(numLabel); gridContainer.appendChild(cell);
    }
    logStatus("✅ Ritaglio confermato e ordinato!", "#28a745");
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
if (typeof prevStep === 'undefined') {
    window.prevStep = function() { if (currentStepIndex > 0) { currentStepIndex--; renderOverlayGrid(); } };
}

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
                <strong style='color:#ffae00; font-size:1.1rem;'>Mossa: ${currentStepIndex + 1} / ${calculatedSteps.length}</strong><br>
                <span style='font-size:1.1rem; color:#fff;'>Fai scorrere il tassello: <b>${moveData.direction}</b></span>
            `;
        }
    }
}

async function toggleOverlay() {
    const video = document.getElementById('pip-video');
    try {
        if (document.pictureInPictureElement) { await document.exitPictureInPicture(); } 
        else { renderOverlayGrid(); await video.requestPictureInPicture(); }
    } catch (error) { logStatus("❌ Errore attivazione overlay.", "#ff3333"); }
}
