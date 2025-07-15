// Updated cruder responses (slightly vulgar, no hard cuss words)
const responses = [
    "Damn, you're retarded enough to trip over your own shadow, idiot.",
    "Retard alert: Your brain's a damn empty void, helpless moron.",
    "You're not just retarded, you're the damn emperor of boneheads.",
    "Congrats, retard—your IQ's scraping the bottom of the barrel.",
    "Retarded as hell. Crawl back to your cave, drooling fool.",
    "You're so retarded, even village idiots pity you.",
    "Brain scan: Total retard. Get a damn clue, loser.",
    "Retard levels exploding—you're a walking disaster.",
    "Moron confirmed. Retarded and utterly hopeless.",
    "You're retarded enough to screw up breathing.",
    "Retard vibes maxed—your face screams 'dumb as dirt'.",
    "Scan results: Pure retard. Keep your genes to yourself.",
    "You're so retarded, evolution's regretting you.",
    "Retard-o-meter shattered by your sheer stupidity.",
    "Confirmed retard. Your mom's biggest regret, damn it.",
    "Retarded and hideous—double damn whammy, clown.",
    "Brain missing in action. Retard status: Supreme.",
    "You're retarded like a damn broken record.",
    "Retard headquarters: Just you, you pitiful fool.",
    "Scan says: Retarded dimwit. Tough break.",
    "You're so retarded, you believe your own nonsense.",
    "Retard milestone: Peak stupidity unlocked.",
    "Holy retard! You're the damn reject nobody claims.",
    "Retarded and smug? Nah, just plain retarded.",
    "Your retardation's spreading—quarantine yourself, idiot.",
    "Scan complete: Retard crisis. Systems failing.",
    "You're retarded enough to damn near need a handler.",
    "Retard elite: Hail the king of dimwits.",
    "Confirmed: Retarded buffoon. The circus misses you.",
    "Retard levels extreme—abandon all hope for brains."
];

const specialMessages = [
    "Omega retardation: You're a damn legend in moron history.",
    "Over 100% retard: Shattering scales, you utter failure.",
    "Hyper-retard: Aliens laugh at your damn stupidity.",
    "Ultimate retard: Peak idiot achieved—pathetic, loser.",
    "Retard apocalypse: Your brain's a damn wasteland."
];

const negativeMessage = "Not retarded... shockingly. Don't get cocky, smartass.";

// Elements (unchanged)
const takeSelfieBtn = document.getElementById('take-selfie');
const uploadBtn = document.getElementById('upload-image');
const scanBtn = document.getElementById('scan-button');
const shareBtn = document.getElementById('share-button');
const retryBtn = document.getElementById('retry-button');
const inputSection = document.getElementById('input-section');
const previewSection = document.getElementById('preview-section');
const scanningSection = document.getElementById('scanning-section');
const resultsSection = document.getElementById('results-section');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const resultCanvas = document.getElementById('result-canvas');

let currentImage = null;

// Take Selfie (unchanged)
takeSelfieBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.classList.remove('hidden');
        inputSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
        
        setTimeout(() => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            currentImage = canvas.toDataURL('image/png');
            preview.src = currentImage;
            video.classList.add('hidden');
            preview.classList.remove('hidden');
            scanBtn.classList.remove('hidden');
            stream.getTracks().forEach(track => track.stop());
        }, 2000);
    } catch (err) {
        alert('Camera access denied or unavailable.');
    }
});

// Upload Image (unchanged)
uploadBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            currentImage = event.target.result;
            preview.src = currentImage;
            inputSection.classList.add('hidden');
            previewSection.classList.remove('hidden');
            scanBtn.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    };
    input.click();
});

// Scan Button (unchanged)
scanBtn.addEventListener('click', () => {
    previewSection.classList.add('hidden');
    scanningSection.classList.remove('hidden');
    scanningSection.querySelector('.scanner').style.backgroundImage = `url(${currentImage})`;
    
    setTimeout(() => {
        scanningSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        generateResults();
    }, 3000);
});

// Generate Results (25% larger text, centered)
function generateResults() {
    const ctx = resultCanvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const percent = Math.random() * 150;
        let message;
        if (percent <= 20) {
            message = negativeMessage;
        } else if (percent > 100) {
            message = specialMessages[Math.floor(Math.random() * specialMessages.length)];
        } else {
            message = responses[Math.floor(Math.random() * responses.length)];
        }
        
        ctx.font = 'bold 75px Arial'; // Temp for measurement (25% up from 60px)
        const maxWidth = img.width - 100;
        const lines = wrapText(ctx, message, maxWidth);
        const boxHeight = 180 + (lines.length * 85); // Adjusted for larger text
        
        const boxY = (img.height / 2) - (boxHeight / 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(20, boxY, img.width - 40, boxHeight);
        
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 20;
        
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 125px Arial'; // 25% up from 100px
        ctx.fillText(`${Math.round(percent)}% RETARDED`, img.width / 2, boxY + 140);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 75px Arial';
        lines.forEach((line, index) => {
            ctx.fillText(line, img.width / 2, boxY + 240 + (index * 85));
        });
    };
    img.src = currentImage;
}

// Wrap Text (unchanged)
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Share Button (unchanged)
shareBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'retard-result.png';
    link.href = resultCanvas.toDataURL('image/png');
    link.click();
});

// Retry (unchanged)
retryBtn.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    currentImage = null;
});
