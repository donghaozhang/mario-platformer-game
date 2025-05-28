# Super Mario Game

A fun HTML5 Mario-style platformer game built with vanilla JavaScript, HTML, and CSS.

## Features

- **Classic Mario gameplay** with jumping, running, and enemy stomping
- **Physics system** with gravity, friction, and collision detection
- **Multiple platforms** at different heights for challenging gameplay
- **Enemies (Goombas)** that move back and forth on platforms
- **Collectible coins** scattered throughout the level
- **Particle effects** for jumps, enemy defeats, and coin collection
- **Score system** with points for coins and defeating enemies
- **Lives system** with game over functionality
- **Level progression** with increasing difficulty
- **Responsive design** that works on different screen sizes
- **No external assets required** – graphics are drawn with pure JavaScript

## How to Play

### Controls
- **Arrow Keys**: Move Mario left and right
- **Spacebar**: Jump
- **R Key**: Restart the game at any time

### Objective
- Collect all the golden coins to complete the level
- Avoid or defeat the red Goomba enemies
- Don't fall off the platforms or you'll lose a life
- Try to achieve the highest score possible!

### Scoring
- **Coins**: 50 points each
- **Defeating enemies**: 100 points each
- **Level completion**: Bonus points

### Game Mechanics
- **Jump on enemies** to defeat them and earn points
- **Touching enemies** from the side will cost you a life
- **Falling off the screen** will cost you a life
- **Collect all coins** to advance to the next level
- **3 lives** to start - game over when all lives are lost

## Getting Started

1. Open `index.html` in any modern web browser
2. The game will start automatically
3. Use the controls to play
4. Have fun!

## Technical Details

- Built with **HTML5 Canvas** for smooth 2D graphics
- **Modular JavaScript architecture** with 8 focused modules (1,746 total lines)
- **CSS3** for modern styling and responsive design
- **60 FPS** game loop using `requestAnimationFrame`
- **AABB collision detection** for platforms, enemies, and collectibles
- **Web Audio API** sound system with background music and effects
- **Frame-based animation system** for sprites and visual effects
- **Power-up system** with damage hierarchy and fireball mechanics
- **3 unique levels** with moving platforms and secret areas
- **Particle system** for comprehensive visual feedback

### Architecture Overview
- **gameState.js**: Centralized state management and `Player` class
- **soundSystem.js**: Complete audio system with Web Audio API
- **levelSystem.js**: Level data and interactive elements using an `Enemy` class
- **physics.js**: Physics engine with collision detection
- **particles.js**: Visual effects system
- **animations.js**: Sprite animation framework
- **renderer.js**: Complete rendering system
- **main.js**: Game loop and core functionality

## Browser Compatibility

This game works in all modern browsers that support HTML5 Canvas:
- Chrome 4+
- Firefox 2+
- Safari 3.1+
- Edge 9+
- Opera 9+

## Implemented Features

### ✅ Completed Systems
- **Sound System**: Web Audio API with background music and sound effects
- **Power-ups**: Mushroom (grow), Fire Flower (fireballs), Star (invincibility)
- **Enhanced Animations**: Walking cycles, jumping animations, 3D coin spinning
- **Multiple Levels**: 3 unique levels with different themes and layouts
- **Advanced Mechanics**: Moving platforms, breakable blocks, secret areas
- **Particle Effects**: Comprehensive visual feedback system

### 🚀 Future Enhancements
Potential features that could be added:
- More enemy types (Koopa Troopas, flying enemies)
- Boss battles
- More worlds/levels
- Local high score storage
- Mobile touch controls
- Gamepad support
- Level editor mode

Enjoy playing Super Mario Game! 