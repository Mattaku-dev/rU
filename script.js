// Responses arrays (from previous designs)
const responses = [
    "Wow, you're so retarded you make rocks look smart.",
    "Retard alert: Your brain's on permanent vacation, dummy.",
    "You're not just retarded, you're the king of idiots.",
    "Congrats, retard—your IQ is lower than your shoe size.",
    "Retarded beyond belief. Go back to drooling in the corner.",
    "You're so retarded, even retards think you're retarded.",
    "Brain scan complete: Total retard detected. Seek help, loser.",
    "Retard levels off the charts—you're a human error.",
    "Dummy confirmed. Retarded beyond repair.",
    "You're retarded enough to fail at being retarded.",
    "Retard vibes strong—your face says it all, moron.",
    "Scan results: Pure retard. Don't breed, please.",
    "You're so retarded, Darwin would disown you.",
    "Retard-o-meter broken from your stupidity.",
    "Confirmed retard. Your mom's worst mistake.",
    "Retarded and ugly—double whammy, clown.",
    "Brain not found. Retard status: Elite.",
    "You're retarded like a fox... wait, no, just retarded.",
    "Retard central: Population—you, fool.",
    "Scan says: Retarded nitwit. Good luck with that.",
    "You're so retarded, you think this app is real.",
    "Retard achievement unlocked: Maximum dumb.",
    "Holy retard, Batman! You're the sidekick nobody wants.",
    "Retarded and proud? Nah, just retarded.",
    "Your retardation is contagious—stay away, idiot.",
    "Scan complete: Retard overload. System crashing.",
    "You're retarded enough to need therapy after this.",
    "Retard royalty: Bow to the dumb king.",
    "Confirmed: Retarded clown. Circus called, they want you back.",
    "Retard levels critical—evacuate your brain, if it exists."
];

const specialMessages = [
    "Omega levels of retardation achieved—you're a legend in stupidity.",
    "Over 100% retard: You're breaking the scale, you absolute failure.",
    "Hyper-retard mode: Even aliens think you're dumb.",
    "Ultimate retard status: You've reached peak idiot—congrats, loser.",
    "Retard overload: Your brain is a black hole of dumbness."
];

const negativeMessage = "Not retarded... surprisingly. Don't let it go to your head, genius.";

// Elements
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

// Take Selfie
takeSelfieBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.classList.remove('hidden');
        inputSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
        
        // Capture photo after 2s or on button (simplified)
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
        }, 2000); // Auto-capture for simplicity; add a button if needed
    } catch (err) {
        alert('Camera access denied or unavailable.');
    }
});

// Upload Image
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

// Scan Button
scanBtn.addEventListener('click', () => {
    previewSection.classList.add('hidden');
    scanningSection.classList.remove('hidden');
    scanningSection.querySelector('.scanner').style.backgroundImage = `url(${currentImage})`;
    
    setTimeout(() => {
        scanningSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        generateResults();
    }, 3000); // 3-second scan
});

// Generate Results
function generateResults() {
    const ctx = resultCanvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Random percentage
        const percent = Math.random() * 150;
        let message;
        if (percent <= 20) {
            message = negativeMessage;
        } else if (percent > 100) {
            message = specialMessages[Math.floor(Math.random() * specialMessages.length)];
        } else {
            message = responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Calculate dynamic box height for centering
        ctx.font = 'bold 50px Arial'; // Temp for measurement
        const maxWidth = img.width - 100; // Padding
        const lines = wrapText(ctx, message, maxWidth);
        const boxHeight = 120 + (lines.length * 60); // Base for percentage + message lines
        
        // Centered overlay box
        const boxY = (img.height / 2) - (boxHeight / 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(20, boxY, img.width - 40, boxHeight); // Slight horizontal padding
        
        // Center text
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 15;
        
        // Large percentage text
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 80px Arial';
        ctx.fillText(`${Math.round(percent)}% RETARDED`, img.width / 2, boxY + 90);
        
        // Message text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 50px Arial';
        lines.forEach((line, index) => {
            ctx.fillText(line, img.width / 2, boxY + 160 + (index * 60));
        });
    };
    img.src = currentImage;
}

// Helper function to wrap long messages
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

// Share Button (downloads the image)
shareBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'retard-result.png';
    link.href = resultCanvas.toDataURL('image/png');
    link.click();
});

// Retry
retryBtn.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    currentImage = null;
});
