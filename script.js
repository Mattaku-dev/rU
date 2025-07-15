// Updated witty responses (crude, relaxed snippets with mental disability theme, emojis allowed)
const responses = [
    "Yup, full-on window licker 🪟👅",
    "Your head's just a decorative piece, retard 🎩😵",
    "Classic helmet kid energy 🪖🤪",
    "Retard mode: Drool champion 👑💧",
    "So retarded, thoughts need training wheels 🚲🧠",
    "You're the short bus VIP 🚌⭐",
    "Mentally parked in disabled spot ♿🧠",
    "Brain's on strike, retard picket line 🚧😑",
    "Dummy alert: Crayon eater certified 🖍️🍴",
    "Retarded like a puzzle missing half the pieces 🧩❓",
    "Vibes: Special ed hall of famer 🏆🏫",
    "Pure retard, extra slow sauce 🐌🍝",
    "Your smarts? Permanent vacation mode 🏖️🧠",
    "Retard meter maxed, helmet required 🪖📈",
    "Confirmed: Mom's favorite oops baby 👶🙄",
    "Retarded and awkward—like a bad date with yourself 😬🧠",
    "Brain not loading... retard error 404 🚫🧠",
    "You're the retard who hugs trees 'cause they're family 🌳🤗",
    "Retard central: Echoes in an empty skull 💀🗣️",
    "Nitwit retard: Counts to potato 🥔🔢",
    "So retarded, echoes in your head have echoes 🔊🧠",
    "Retard upgrade: Now with bonus blank stares 👀😶",
    "Holy retard: Praying for a brain transplant 🙏🧠",
    "Retarded glow? More like dim bulb 💡😵",
    "Contagious retard: Friends catching the slow 🐢👥",
    "Overload: Retard circuits popping popcorn 🍿🧠",
    "Retarded therapy? Start with velcro shoes 👟🔒",
    "Royal retard: Crown of foam padding 👑🛡️",
    "Clown retard: Red nose optional 🤡👃",
    "Critical retard: Brain nap eternal 😴🧠"
];

const specialMessages = [
    "Omega retard: Window-licking legend 👅🪟🏆",
    "Over 100%: Head decoration hall of fame 🎩😵⭐",
    "Hyper-retard: Helmet hero eternal 🪖🦸‍♂️",
    "Ultimate retard: Drool dynasty founder 💧👑",
    "Retard max: Short bus overlord 🚌👹"
];

const negativeMessage = "Not retarded... but close call 😏";

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

// Function to resize image to consistent size (fix for selfie vs gallery scaling)
function resizeImage(dataUrl, maxWidth = 800) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const aspectRatio = img.height / img.width;
            const newWidth = Math.min(img.width, maxWidth);
            const newHeight = newWidth * aspectRatio;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = newWidth;
            tempCanvas.height = newHeight;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(img, 0, 0, newWidth, newHeight);
            resolve(tempCanvas.toDataURL('image/png'));
        };
        img.src = dataUrl;
    });
}

// Take Selfie (with resize)
takeSelfieBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
        video.classList.remove('hidden');
        inputSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
        
        setTimeout(async () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            let tempImage = canvas.toDataURL('image/png');
            currentImage = await resizeImage(tempImage);
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

// Upload Image (with resize)
uploadBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
            let tempImage = event.target.result;
            currentImage = await resizeImage(tempImage);
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

// Generate Results (50% smaller text sizes from previous halved version, now 47px message, 47px measurement, 47px percentage? Wait, halved from last: percentage 47px, message 28.5~29px, but adjust to sensible)
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
        
        ctx.font = 'bold 29px Arial'; // Halved from 57px
        const maxWidth = img.width - 100;
        const lines = wrapText(ctx, message, maxWidth);
        const boxHeight = 68 + (lines.length * 32); // Halved from 135 and 64
        
        const boxY = (img.height / 2) - (boxHeight / 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(20, boxY, img.width - 40, boxHeight);
        
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 20;
        
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 47px Arial'; // Halved from 94px
        ctx.fillText(`${Math.round(percent)}% RETARDED`, img.width / 2, boxY + 53); // Halved position
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 29px Arial';
        lines.forEach((line, index) => {
            ctx.fillText(line, img.width / 2, boxY + 90 + (index * 32)); // Halved position
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
