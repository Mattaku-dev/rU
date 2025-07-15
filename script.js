// Tiered responses: Mild for low %, harsher as % increases, mix of one-liners, looks insults, and funny retard jokes
const mildResponses = [ // Under 30%: Mostly positive, light mix (10 responses)
    "Barely retarded... your face almost fools us all 😏",
    "Low retard: Cute try at looking sharp, almost worked 👀",
    "Mild case: Face says 'I'm trying,' brain agrees 🧐",
    "Under radar retard: Your look's not giving it away yet 😌",
    "Slight retard: Helmet optional for that mug 🪖😉",
    "Not bad: You're the retard who blends in at parties 🎉",
    "Light retard: Brain's slow, but face is on point 📸",
    "Barely there: Like a retard in disguise 🕶️",
    "Mild vibes: Your grin hides the slow burn 😬",
    "Low score: Face like a normie, inside's the joke 🤫"
];

const mediumResponses = [ // 30-70%: Moderate crude, balanced mix (20 responses)
    "Mid retard: Face like a puzzled potato 🥔😵",
    "Decent retard: Your look's got that vacant charm 👀✨",
    "Retard rising: Mug drooping like your thoughts 📉🧠",
    "Half retard: Short bus selfie material 🚌🤳",
    "Medium slow: Face begging for a helmet fitting 🪖🙄",
    "Retard joke: You're the one who licks windows casually 🪟👅",
    "Balanced retard: Brain and face in slow sync 😑",
    "Mid-level: Like a retard at a genius convention 🧠🎪",
    "Retard tease: Your stare's blanker than a fresh slate 👀❌",
    "Funny retard: Thinks puzzles are for eating 🧩🍴",
    "Medium mug: Looks retarded, acts surprised 😲",
    "Retard zing: Slow as molasses in January 🐌",
    "Halfway fool: Face tells the retard story 📖😵",
    "Moderate joke: Retard who counts fingers twice 🔢🖐️",
    "Retard blend: Ugly slow with a side of awkward 😬",
    "Mid scan: Brain's buffering, face loading error 🚫",
    "Retard fun: Hugs the wrong tree in the forest 🌳🤗",
    "Medium clown: Retard juggling one thought 🤹‍♂️",
    "Slow roast: Your look's the punchline 😅",
    "Retard mix: Face and brain in retard harmony 🎶"
];

const harshResponses = [ // 71-99%: Harsh, crude mix with more looks/funny jabs (20 responses)
    "High retard: Face screams short bus regular 🚌😑",
    "Serious retard: Drool-ready mug on display 💧👅",
    "Retard max: Ugly like a retard convention reject 😵",
    "Deep retard: Looks lost a bet with stupid 🥊🧠",
    "Total retard: Face and brain in full drool mode 👑💧",
    "Harsh joke: Retard who eats crayons for breakfast 🖍️🍳",
    "Peak retard: Mug's the helmet model poster 🪖📸",
    "Retard roast: Your stare's emptier than promises 👀🚫",
    "Funny harsh: Counts to potato and calls it math 🥔🔢",
    "Retard slam: Face like it needs training wheels 🚲😬",
    "Crude retard: Window licker with a view 🪟👅",
    "Harsh vibes: Brain nap, face eternal blank 😴😶",
    "Retard zinger: Hugs trees 'cause people run 🌳🏃",
    "Ugly retard: Looks match the mental mess 😵🎭",
    "Severe joke: Retard upgrading to velcro life 👟🔒",
    "Retard crown: Foam padding royalty 👑🛡️",
    "Harsh clown: Red nose from retard blunders 🤡👃",
    "Brain eternal nap: Face tells the sleepy tale 😴🧠",
    "Retard overload: Popcorn thoughts exploding 🍿😵",
    "Final jab: Retard therapy starts with basics 📚🤪"
];

const specialMessages = [ // >100%: Over-the-top harsh mix (5 responses)
    "Omega retard: Window-licking hall of fame 👅🪟🏆",
    "Over 100%: Head just for hat storage 🎩😵⭐",
    "Hyper-retard: Eternal helmet icon 🪖🦸‍♂️",
    "Ultimate retard: Drool empire builder 💧👑",
    "Retard max: Short bus supreme ruler 🚌👹"
];

const negativeMessage = "Not retarded... face had us fooled 😎";

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

// Generate Results (unchanged text sizes)
function generateResults() {
    const ctx = resultCanvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const percentValue = Math.random() * 150;
        const percent = Math.round(percentValue);
        let message;
        if (percent <= 30) {
            if (percent <= 20) {
                message = negativeMessage;
            } else {
                message = mildResponses[Math.floor(Math.random() * mildResponses.length)];
            }
        } else if (percent <= 70) {
            message = mediumResponses[Math.floor(Math.random() * mediumResponses.length)];
        } else if (percent <= 100) {
            message = harshResponses[Math.floor(Math.random() * harshResponses.length)];
        } else {
            message = specialMessages[Math.floor(Math.random() * specialMessages.length)];
        }
        
        ctx.font = 'bold 29px Arial'; // Measurement font
        const maxWidth = img.width - 100;
        const lines = wrapText(ctx, message, maxWidth);
        const boxHeight = 68 + (lines.length * 32);
        
        const boxY = (img.height / 2) - (boxHeight / 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(20, boxY, img.width - 40, boxHeight);
        
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 20;
        
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 47px Arial';
        ctx.fillText(`${percent}% RETARDED`, img.width / 2, boxY + 53);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 29px Arial';
        lines.forEach((line, index) => {
            ctx.fillText(line, img.width / 2, boxY + 90 + (index * 32));
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
