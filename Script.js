// Responses arrays (from previous designs)
const responses = [
    "Wow, you're so retarded you make rocks look smart.",
    "Retard alert: Your brain's on permanent vacation, dummy.",
    // ... Add all 30 here ...
    "Retard levels critical—evacuate your brain, if it exists."
];

const specialMessages = [
    "Omega levels of retardation achieved—you're a legend in stupidity.",
    // ... Add the rest ...
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
        
        // Overlay text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, img.height - 100, img.width, 100);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`${Math.round(percent)}% Retarded`, 20, img.height - 60);
        ctx.font = '18px Arial';
        ctx.fillText(message, 20, img.height - 30);
    };
    img.src = currentImage;
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
