// Sound system
const sounds = {
    jump: null,
    coin: null,
    enemyDefeat: null,
    gameOver: null,
    levelComplete: null,
    backgroundMusic: null
};

// Sound control
let soundEnabled = true;

// Initialize sound system
function initSounds() {
    // Create audio contexts for sound effects using Web Audio API
    // Using simple beep sounds that work without external files
    
    // Jump sound - short ascending beep
    sounds.jump = createBeepSound(220, 0.1, 'square');
    
    // Coin sound - pleasant ding
    sounds.coin = createBeepSound(440, 0.2, 'sine');
    
    // Enemy defeat sound - descending beep
    sounds.enemyDefeat = createBeepSound(330, 0.15, 'sawtooth');
    
    // Game over sound - low descending tone
    sounds.gameOver = createBeepSound(110, 0.5, 'triangle');
    
    // Level complete sound - ascending melody
    sounds.levelComplete = createMelodySound([262, 330, 392, 523], 0.3);
    
    // Background music - simple loop
    sounds.backgroundMusic = createBackgroundMusic();
}

// Create beep sound using Web Audio API
function createBeepSound(frequency, duration, waveType = 'sine') {
    return function() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = waveType;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            console.log('Audio not supported');
        }
    };
}

// Create melody sound for level complete
function createMelodySound(frequencies, noteDuration) {
    return function() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                
                const startTime = audioContext.currentTime + (index * noteDuration);
                const endTime = startTime + noteDuration;
                
                gainNode.gain.setValueAtTime(0.1, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
                
                oscillator.start(startTime);
                oscillator.stop(endTime);
            });
        } catch (e) {
            console.log('Audio not supported');
        }
    };
}

// Create simple background music
function createBackgroundMusic() {
    let isPlaying = false;
    let intervalId = null;
    
    const melody = [262, 294, 330, 349, 392, 440, 494, 523]; // C major scale
    let currentNote = 0;
    
    return {
        play: function() {
            if (isPlaying) return;
            isPlaying = true;
            
            intervalId = setInterval(() => {
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = melody[currentNote];
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.5);
                    
                    currentNote = (currentNote + 1) % melody.length;
                } catch (e) {
                    console.log('Audio not supported');
                }
            }, 600);
        },
        
        stop: function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            isPlaying = false;
        }
    };
}

// Play sound function
function playSound(soundName) {
    if (!soundEnabled) return;
    
    if (sounds[soundName] && typeof sounds[soundName] === 'function') {
        sounds[soundName]();
    } else if (sounds[soundName] && sounds[soundName].play) {
        sounds[soundName].play();
    }
}

// Toggle sound on/off
function toggleSound() {
    soundEnabled = !soundEnabled;
    const button = document.getElementById('soundToggle');
    
    if (soundEnabled) {
        button.textContent = '🔊 Sound ON';
        // Restart background music if game is running
        if (gameState.gameRunning) {
            setTimeout(() => {
                playSound('backgroundMusic');
            }, 100);
        }
    } else {
        button.textContent = '🔇 Sound OFF';
        sounds.backgroundMusic.stop();
    }
} 