// Updated roast-style responses (zingy one-liners, comedian roast feel)
const responses = [
    "You're so retarded, you tried to drown a fish.",
    "Retard level: You think Taco Bell is a Mexican phone company.",
    "You're retarded like a screen door on a submarine.",
    "Congrats, retard—you're the reason shampoo has instructions.",
    "You're so retarded, you tripped over a cordless phone.",
    "Retard alert: You stare at orange juice because it says 'concentrate'.",
    "You're retarded enough to get lost in an elevator.",
    "Brain scan: Retard who brings a spoon to the Super Bowl.",
    "You're so retarded, you think a quarterback is a refund.",
    "Retard vibes: You climb over a glass wall to see what's on the other side.",
    "You're retarded like putting a 'Do Not Walk on Grass' sign on a fence.",
    "Scan results: Retard who takes a ruler to bed to see how long you sleep.",
    "You're so retarded, you think Meow Mix is a CD for cats.",
    "Retard-o-meter: You return a doughnut because it has a hole.",
    "Confirmed retard: You think Earth Day is when the planet gets older.",
    "You're retarded and ugly—like a two-for-one special on fails.",
    "Brain not found: Retard who locks the car and leaves the keys inside.",
    "You're retarded like arguing with a signpost.",
    "Retard central: You bring your own pencil to a blood test.",
    "Scan says: Retard who thinks manual labor is a Spanish musician.",
    "You're so retarded, you think cheerios are doughnut seeds.",
    "Retard unlocked: You take the 'The' out of 'psychotherapist'.",
    "Holy retard: You think a solar eclipse is the sun quitting.",
    "Retarded and proud? Like a peacock with no feathers.",
    "Your retardation: Like bringing a fork to a soup convention.",
    "Scan complete: Retard who waves at blind people.",
    "You're retarded enough to need a map for the shower.",
    "Retard royalty: Crown made of tin foil.",
    "Confirmed clown: Retard who laughs at mirrors.",
    "Retard critical: You think fast food is hard to catch."
];

const specialMessages = [
    "Omega retard: You're the punchline evolution forgot.",
    "Over 100%: Retard so epic, even mirrors crack up.",
    "Hyper-retard: Aliens visit just to point and laugh.",
    "Ultimate retard: Peak moron—deserves a damn trophy.",
    "Retard overload: Your brain's on strike, permanently."
];

const negativeMessage = "Not retarded... but give it time, genius.";

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

// Generate Results (50% larger text)
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
        
        ctx.font = 'bold 113px Arial'; // Temp for measurement (50% up from 75px)
        const maxWidth = img.width - 100;
        const lines = wrapText(ctx, message, maxWidth);
        const boxHeight = 270 + (lines.length * 128); // Adjusted for larger text (50% up)
        
        const boxY = (img.height / 2) - (boxHeight / 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(20, boxY, img.width - 40, boxHeight);
        
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 20;
        
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 188px Arial'; // 50% up from 125px
        ctx.fillText(`${Math.round(percent)}% RETARDED`, img.width / 2, boxY + 210);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 113px Arial';
        lines.forEach((line, index) => {
            ctx.fillText(line, img.width / 2, boxY + 360 + (index * 128));
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
