# Mario Game Agent Documentation

## 📁 File Structure

```
mario/
├── index.html          # Main HTML file with game canvas and UI
├── style.css           # Modern styling and responsive design
├── README.md           # Game documentation and instructions
├── agent.md            # This documentation file
├── .cursor/
│   └── rules/          # Cursor IDE development rules
│       ├── mario-game-structure.mdc
│       ├── mario-sound-system.mdc
│       ├── mario-animation-system.mdc
│       ├── mario-power-ups-system.mdc
│       └── game-development-patterns.mdc
└── js/                 # Modular JavaScript files (8 modules)
    ├── gameState.js    # Game state, player object, and global variables (56 lines)
    ├── soundSystem.js  # Web Audio API sound system (170 lines)
    ├── levelSystem.js  # Level data and level management (313 lines)
    ├── physics.js      # Physics engine and collision detection (261 lines)
    ├── particles.js    # Particle effects system (92 lines)
    ├── animations.js   # Animation system for sprites (119 lines)
    ├── renderer.js     # Rendering and drawing functions (461 lines)
    └── main.js         # Main game loop and initialization (274 lines)
```

### Core Files Description:
- **index.html**: Game container, canvas element, score display, modal overlays, loads JS modules in correct order
- **js/gameState.js**: Centralized game state management, player object with power-up properties, global variables and physics constants
- **js/soundSystem.js**: Complete Web Audio API sound system with background music, sound effects, and toggle controls
- **js/levelSystem.js**: 3 unique level definitions (Green Hills, Underground Caverns, Sky Castle), moving platforms, breakable blocks, secret areas
- **js/physics.js**: Physics engine with AABB collision detection, power-up mechanics, damage system, fireball physics
- **js/particles.js**: Particle effects system for visual feedback (jump, death, coin, power-up, block break, secret area particles)
- **js/animations.js**: Frame-based animation system for player walking/jumping, enemy movement, coin spinning, power-up effects
- **js/renderer.js**: Complete rendering system with animated sprites, 3D coin effects, detailed character drawing, background rendering
- **js/main.js**: Main game loop at 60 FPS, input handling, game state management, level progression, restart functionality
- **style.css**: Beautiful UI styling with gradients, animations, responsive design, and modern game interface
- **README.md**: User documentation with controls, features, setup instructions, and technical details
- **.cursor/rules/**: Development rules for Cursor IDE with comprehensive game architecture documentation

## ✅ Completed Tasks

### 1. Core Game Engine
- [x] HTML5 Canvas setup with proper dimensions (800x400)
- [x] Game loop using `requestAnimationFrame` for 60 FPS
- [x] Player object with physics properties (position, velocity, speed)
- [x] Keyboard input handling (Arrow keys, Spacebar, R key)

### 2. Physics System
- [x] Gravity implementation (0.6 downward acceleration)
- [x] Friction system (0.85 for smooth deceleration)
- [x] Collision detection using AABB (Axis-Aligned Bounding Box)
- [x] Platform collision with proper separation
- [x] Boundary checking to keep player in canvas

### 3. Game Objects
- [x] Player character (Mario) with multi-part sprite rendering
- [x] Platform system with multiple levels and colors
- [x] Enemy system (Goombas) with AI movement and platform detection
- [x] Coin collection system with completion detection
- [x] Particle effects for jumps, enemy defeats, and coin collection

### 4. Game Mechanics
- [x] Lives system (3 lives, lose life on enemy contact or falling)
- [x] Score system (50 points per coin, 100 points per enemy defeat)
- [x] Level progression with increasing difficulty
- [x] Game over and level complete screens
- [x] Restart functionality

### 5. Visual Design
- [x] Beautiful gradient background with cloud effects
- [x] Modern UI with score board and game information
- [x] Responsive design for different screen sizes
- [x] Particle system for visual feedback
- [x] Textured platforms and detailed character sprites

### 6. Performance Optimization
- [x] Speed adjustments for balanced gameplay
- [x] Efficient collision detection
- [x] Memory management for particles
- [x] Optimized rendering order

### 7. Code Architecture
- [x] **Modular JavaScript Structure** (1,746 total lines across 8 modules)
  - [x] Separated monolithic script.js into 8 focused modules
  - [x] gameState.js (56 lines) - Game state and global variables
  - [x] soundSystem.js (170 lines) - Audio system with Web Audio API
  - [x] levelSystem.js (313 lines) - Level data and management
  - [x] physics.js (261 lines) - Physics engine and collision detection
  - [x] particles.js (92 lines) - Particle effects system
  - [x] animations.js (119 lines) - Animation system for sprites
  - [x] renderer.js (461 lines) - All rendering and drawing functions
  - [x] main.js (274 lines) - Main game loop and initialization
  - [x] Proper dependency order in HTML file loading
  - [x] Created comprehensive Cursor rules for modular architecture

## 📋 TODO Tasks

### High Priority
- [x] **Sound System**
  - [x] Add background music
  - [x] Jump sound effects
  - [x] Coin collection sounds
  - [x] Enemy defeat sounds
  - [x] Game over/level complete audio
  - [x] Sound toggle functionality

- [x] **Enhanced Animations**
  - [x] Player walking animation frames (4-frame walking cycle)
  - [x] Player jumping animation (stretched sprite with spread arms)
  - [x] Player idle animation (detailed sprite with eyes and buttons)
  - [x] Enemy movement animations (bouncing walk cycle with directional eyes)
  - [x] Coin spinning animation (8-frame 3D rotation effect)
  - [x] Platform texture animations (grass effects, brick patterns, moving textures)
  - [x] Sprite flipping based on movement direction

### Medium Priority
- [x] **Power-ups System**
  - [x] Mushroom power-up (grow Mario)
  - [x] Fire flower (shooting ability)
  - [x] Star power-up (invincibility)
  - [x] Power-up collision and effects

- [x] **Level Design**
  - [x] Multiple unique levels with different layouts (3 levels: Green Hills, Underground Caverns, Sky Castle)
  - [x] Moving platforms with boundary constraints
  - [x] Breakable blocks that can be hit from below
  - [x] Hidden areas and secret coins that reveal when discovered

- [x] **Enemy Variety**
  - [x] Koopa Troopa enemies (shell mechanics, faster movement)
  - [x] Flying enemies (sine wave movement pattern)
  - [x] Boss enemies (multiple health, special attacks, health bars)
  - [x] Different enemy behaviors (Goomba: basic, Koopa: shell mode, Flying: aerial, Boss: complex AI)
  - [x] Koopa shell physics (kickable, defeats other enemies)
  - [x] Enemy-specific point values and animations

### Low Priority
- [x] **Advanced Features**
  - [x] Local high score storage

- [x] **Visual Enhancements**
  - [x] Weather effects
  - [ ] Better sprite graphics
  - [ ] Download some image assest from internet, add them to the game   

## 🔧 Necessary Functions

### Core Game Functions (Implemented)
```javascript
// Game initialization and setup
init()                    // Initialize game and start loop
createLevel()            // Generate platforms, enemies, and coins
setupEventListeners()    // Setup keyboard input handlers

// Game loop functions
gameLoop()               // Main game loop (60 FPS)
handleInput()            // Process keyboard input
updatePlayer()           // Update player physics and position
updateEnemies()          // Update enemy AI and movement
updateParticles()        // Update particle effects
render()                 // Draw all game objects

// Collision detection
isColliding(rect1, rect2)        // AABB collision detection
checkPlatformCollisions()        // Handle platform interactions
checkEnemyCollisions()           // Handle enemy interactions
checkCoinCollisions()            // Handle coin collection

// Game state management
loseLife()               // Handle player death
levelComplete()          // Handle level completion
gameOver()               // Handle game over state
restartGame()            // Reset game to initial state
nextLevel()              // Progress to next level

// UI updates
updateScore()            // Update score display
updateLives()            // Update lives display
updateCoins()            // Update coins display

// Visual effects
createJumpParticles()    // Create jump effect particles
createDeathParticles()   // Create enemy death particles
createCoinParticles()    // Create coin collection particles

// Rendering functions
drawBackground()         // Draw sky gradient and clouds
drawPlatforms()          // Draw all platforms with texture
drawPlayer()             // Draw Mario character
drawEnemies()            // Draw all enemies
drawCoins()              // Draw collectible coins
drawParticles()          // Draw particle effects
drawCloud(x, y)          // Draw individual cloud
```

### Functions to Implement (Future)
```javascript
// Sound system (Implemented)
playSound(soundName)     // Play sound effects ✅
playMusic(trackName)     // Play background music ✅
stopAllSounds()          // Stop all audio ✅

// Power-ups (Implemented)
createPowerUp(type, x, y)    // Create power-up object ✅
checkPowerUpCollisions()     // Handle power-up collection ✅
applyPowerUp(type)           // Apply power-up effects ✅
shootFireball()              // Shoot fireball when Fire Mario ✅
updateFireballs()            // Update fireball physics ✅
takeDamage()                 // Handle power-up downgrades ✅

// Enhanced animations (Implemented)
updateAnimations()       // Update sprite animations ✅
drawAnimatedSprite()     // Draw animated character sprites ✅

// Enemy variety (Implemented)
updateGoomba()           // Basic enemy AI ✅
updateKoopa()            // Koopa enemy with shell mechanics ✅
updateFlyingEnemy()      // Flying enemy with sine wave movement ✅
updateBossEnemy()        // Boss enemy with health and special attacks ✅
updateKoopaShell()       // Koopa shell physics ✅
handleEnemyDefeat()      // Enemy-specific defeat behavior ✅
handleEnemyJumpAttack()  // Enemy-specific jump attack handling ✅

// Level management
loadLevel(levelNumber)   // Load specific level data
saveProgress()           // Save game progress
loadProgress()           // Load saved progress

// Mobile support
handleTouchInput()       // Process touch controls
createVirtualButtons()   // Create on-screen controls
```

## 🎮 Game Configuration

### Current Settings
```javascript
// Player properties
player.speed = 3         // Horizontal movement speed
player.jumpPower = 12    // Jump velocity
player.width = 30        // Player width
player.height = 40       // Player height

// Physics constants
gravity = 0.6            // Downward acceleration
friction = 0.85          // Movement deceleration

// Game settings
canvas.width = 800       // Game canvas width
canvas.height = 400      // Game canvas height
startingLives = 3        // Initial player lives
coinValue = 50           // Points per coin
enemyValue = 100         // Points per enemy defeat
```

## 🚀 Development Notes

### Performance Considerations
- Game runs at 60 FPS using `requestAnimationFrame`
- Efficient collision detection with early returns
- Particle cleanup to prevent memory leaks
- Optimized rendering order for best performance

### Code Organization
- Modular function structure for easy maintenance
- Centralized game state management
- Consistent naming conventions
- Clear separation of concerns (input, physics, rendering)

### Extension Guidelines
- Follow established patterns when adding new features
- Maintain consistent object structure for game entities
- Use the particle system for visual feedback
- Update UI functions when adding new game stats

This documentation serves as a roadmap for continued development and maintenance of the Mario game project. 