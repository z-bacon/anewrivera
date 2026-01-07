/**
 * Wedding Game - Boba Collection Runner
 * A simple endless runner game where the player collects bobas and avoids crates
 */

class WeddingGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) {
      console.error('Canvas element not found!');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Could not get canvas context!');
      return;
    }
    
    // Set canvas size
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Detect mobile device
    this.isMobile = window.innerWidth <= 768;
    
    // Game state
    this.gameState = 'start'; // 'start', 'playing', 'gameOver'
    this.score = 0;
    this.baseGameSpeed = this.isMobile ? 3.0 : 6; // 50% slower on mobile
    this.gameSpeed = this.baseGameSpeed;
    this.gravity = 0.8;
    this.groundHeight = 200; // Height of the ground from bottom (increased)
    this.gameLoopStarted = false; // Flag to log game loop start once
    this.drawLogged = false; // Flag to log draw function once
    
    console.log(`📱 Device: ${this.isMobile ? 'Mobile' : 'Desktop'}, Base Speed: ${this.baseGameSpeed}`)
    
    // Character
    this.player = {
      x: 100,
      y: 0,
      width: 150,
      height: 120,
      velocityY: 0,
      isJumping: false,
      jumpPower: -18,
      doubleJumpPower: -12, // Smaller second jump
      jumpsRemaining: 2, // Allow 2 jumps total (ground jump + double jump)
      currentFrame: 0,
      frameCounter: 0,
      frameDelay: 5
    };
    
    // Calculate ground Y position
    this.groundY = this.canvas.height - this.groundHeight;
    this.player.y = this.groundY - this.player.height + 28; // Move 28px down to touch ground properly
    
    // Collections
    this.bobas = [];
    this.obstacles = [];
    this.mountains = [];
    
    // Spawn timers
    this.bobaSpawnTimer = 0;
    this.bobaSpawnInterval = 100; // frames between spawns
    this.obstacleSpawnTimer = 0;
    this.obstacleSpawnInterval = 160; // Decreased from 200 to spawn crates closer
    this.baseObstacleInterval = 160; // Store base interval for difficulty scaling
    this.lastSpawnType = null; // Track what was spawned last to avoid clustering
    this.difficultyLevel = 0; // Track difficulty progression
    
    // Load sprites
    this.sprites = {
      run: [],
      jump: [],
      boba: null,
      crate: null
    };
    
    this.spritesLoaded = 0;
    this.totalSprites = 11; // 5 run + 4 jump + 1 boba + 1 crate
    
    this.loadSprites();
    
    // Create mountains for parallax background
    this.createMountains();
    
    // UI elements
    this.scoreDisplay = document.getElementById('gameScore');
    this.startScreen = document.getElementById('startScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.finalScoreDisplay = document.getElementById('finalScore');
    this.restartBtn = document.getElementById('restartBtn');
    
    // Check if all required UI elements exist
    if (!this.scoreDisplay || !this.startScreen || !this.gameOverScreen || !this.restartBtn) {
      console.error('Required game UI elements not found!', {
        scoreDisplay: !!this.scoreDisplay,
        startScreen: !!this.startScreen,
        gameOverScreen: !!this.gameOverScreen,
        restartBtn: !!this.restartBtn
      });
      return;
    }
    
    // Event listeners (setup after UI elements are confirmed to exist)
    this.setupEventListeners();
    
    // Start game loop once sprites are loaded
    this.checkSpritesLoaded();
  }
  
  resizeCanvas() {
    const wrapper = this.canvas.parentElement;
    this.canvas.width = wrapper.offsetWidth;
    this.canvas.height = wrapper.offsetHeight;
    
    console.log(`📐 Canvas resized to: ${this.canvas.width}x${this.canvas.height}`);
    
    // Recalculate mobile status and base speed on resize
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasMobile !== this.isMobile) {
      // Device type changed (e.g., rotated or window resized across breakpoint)
      const oldBaseSpeed = this.baseGameSpeed;
      this.baseGameSpeed = this.isMobile ? 3.0 : 6;
      
      // Adjust current speed proportionally if game is running
      if (this.gameState === 'playing') {
        const speedMultiplier = this.gameSpeed / oldBaseSpeed;
        this.gameSpeed = this.baseGameSpeed * speedMultiplier;
      } else {
        this.gameSpeed = this.baseGameSpeed;
      }
      
      console.log(`📱 Device changed: ${this.isMobile ? 'Mobile' : 'Desktop'}, New Base Speed: ${this.baseGameSpeed}`);
    }
    
    // Recalculate ground position on resize
    this.groundY = this.canvas.height - this.groundHeight;
    if (this.player) {
      this.player.y = this.groundY - this.player.height + 28; // Move 28px down to touch ground properly
    }
  }
  
  loadSprites() {
    // Load run sprites
    for (let i = 1; i <= 5; i++) {
      const img = new Image();
      img.src = `assets/images/gamesprites/run-0${i}.png`;
      img.onload = () => {
        this.spritesLoaded++;
        console.log(`✅ Loaded run-0${i}.png`);
      };
      img.onerror = () => {
        console.error(`❌ Failed to load run-0${i}.png from assets/images/gamesprites/`);
        this.spritesLoaded++; // Still increment to avoid infinite waiting
      };
      this.sprites.run.push(img);
    }
    
    // Load jump sprites
    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = `assets/images/gamesprites/jump-0${i}.png`;
      img.onload = () => {
        this.spritesLoaded++;
        console.log(`✅ Loaded jump-0${i}.png`);
      };
      img.onerror = () => {
        console.error(`❌ Failed to load jump-0${i}.png from assets/images/gamesprites/`);
        this.spritesLoaded++;
      };
      this.sprites.jump.push(img);
    }
    
    // Load boba
    this.sprites.boba = new Image();
    this.sprites.boba.src = 'assets/images/gamesprites/boba-floating.png';
    this.sprites.boba.onload = () => {
      this.spritesLoaded++;
      console.log('✅ Loaded boba-floating.png');
    };
    this.sprites.boba.onerror = () => {
      console.error('❌ Failed to load boba-floating.png from assets/images/gamesprites/');
      this.spritesLoaded++;
    };
    
    // Load crate
    this.sprites.crate = new Image();
    this.sprites.crate.src = 'assets/images/gamesprites/crate.png';
    this.sprites.crate.onload = () => {
      this.spritesLoaded++;
      console.log('✅ Loaded crate.png');
    };
    this.sprites.crate.onerror = () => {
      console.error('❌ Failed to load crate.png from assets/images/gamesprites/');
      this.spritesLoaded++;
    };
  }
  
  checkSpritesLoaded() {
    console.log(`📦 Sprites loaded: ${this.spritesLoaded}/${this.totalSprites}`);
    if (this.spritesLoaded >= this.totalSprites) {
      console.log('✅ All sprites loaded, starting game loop');
      this.gameLoop();
    } else {
      setTimeout(() => this.checkSpritesLoaded(), 100);
    }
  }
  
  createMountains() {
    // Create 5 mountains with different sizes and parallax speeds
    // Using solid colors #F6EAFF and #ECD8FB alternating
    const mountainData = [
      { x: -100, width: 400, height: 350, speed: 0.3, color: '#F6EAFF' },
      { x: 250, width: 300, height: 250, speed: 0.4, color: '#ECD8FB' },
      { x: 450, width: 350, height: 300, speed: 0.5, color: '#F6EAFF' },
      { x: 700, width: 250, height: 200, speed: 0.6, color: '#ECD8FB' },
      { x: 850, width: 350, height: 300, speed: 0.5, color: '#F6EAFF' }
    ];
    
    mountainData.forEach(data => {
      this.mountains.push({
        x: data.x,
        width: data.width,
        height: data.height,
        speed: data.speed,
        color: data.color
      });
    });
  }
  
  setupEventListeners() {
    // Start button
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) {
      console.log('✅ Start button found, attaching event listener');
      startBtn.addEventListener('click', () => {
        console.log('🎮 Start button clicked!');
        this.start();
      });
    } else {
      console.warn('⚠️ Start button not found');
    }
    
    // Space bar to jump (only during gameplay, and not when typing in inputs)
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        // Don't interfere if user is typing in an input field or textarea
        const activeElement = document.activeElement;
        const isTyping = activeElement && (
          activeElement.tagName === 'INPUT' || 
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.isContentEditable
        );
        
        if (!isTyping) {
          e.preventDefault();
          this.handleJump();
        }
      }
    });
    
    // Canvas click to jump (only during gameplay)
    this.canvas.addEventListener('click', () => {
      this.handleJump();
    });
    
    // Restart button
    this.restartBtn.addEventListener('click', () => {
      this.restart();
    });
  }
  
  handleJump() {
    if (this.gameState === 'playing' && this.player.jumpsRemaining > 0) {
      // First jump (from ground) uses full jump power
      if (this.player.jumpsRemaining === 2) {
        this.player.velocityY = this.player.jumpPower;
        this.player.currentFrame = 0; // Reset to first jump frame
        this.player.frameCounter = 0; // Reset frame counter for clean animation start
        console.log('🦘 First jump!');
      } 
      // Second jump (double jump) uses smaller jump power
      else if (this.player.jumpsRemaining === 1) {
        this.player.velocityY = this.player.doubleJumpPower;
        this.player.currentFrame = 0; // Reset to first jump frame
        this.player.frameCounter = 0; // Reset frame counter for clean animation start
        console.log('🦘🦘 Double jump!');
      }
      
      this.player.jumpsRemaining--;
      this.player.isJumping = true;
    }
  }
  
  start() {
    console.log('🎮 Starting game...');
    this.gameState = 'playing';
    if (this.startScreen) {
      this.startScreen.style.display = 'none';
      console.log('✅ Start screen hidden');
    } else {
      console.warn('⚠️ Start screen not found');
    }
    this.score = 0;
    this.gameSpeed = this.baseGameSpeed; // Use mobile-aware base speed
    this.difficultyLevel = 0;
    this.obstacleSpawnInterval = this.baseObstacleInterval;
    this.bobas = [];
    this.obstacles = [];
    this.bobaSpawnTimer = 0;
    this.obstacleSpawnTimer = 0;
    this.lastSpawnType = null;
    this.player.jumpsRemaining = 2;
    this.updateScore();
    console.log('✅ Game started successfully!');
  }
  
  restart() {
    this.gameState = 'playing';
    this.gameOverScreen.style.display = 'none';
    this.score = 0;
    this.gameSpeed = this.baseGameSpeed; // Use mobile-aware base speed
    this.difficultyLevel = 0;
    this.obstacleSpawnInterval = this.baseObstacleInterval;
    this.bobas = [];
    this.obstacles = [];
    this.player.y = this.groundY - this.player.height + 28; // Move 28px down to touch ground properly
    this.player.velocityY = 0;
    this.player.isJumping = false;
    this.player.jumpsRemaining = 2;
    this.bobaSpawnTimer = 0;
    this.obstacleSpawnTimer = 0;
    this.lastSpawnType = null;
    this.updateScore();
  }
  
  gameOver() {
    this.gameState = 'gameOver';
    this.gameOverScreen.style.display = 'block';
    this.finalScoreDisplay.textContent = this.score;
  }
  
  updateScore() {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = this.score;
    }
  }
  
  spawnBoba() {
    const boba = {
      x: this.canvas.width,
      y: this.groundY - this.player.height - Math.random() * 150 - 50,
      width: 30,
      height: 50,
      collected: false,
      rotation: 0, // Initial rotation angle
      rotationSpeed: 0.05 // Rotation speed per frame
    };
    this.bobas.push(boba);
    this.lastSpawnType = 'boba';
  }
  
  spawnObstacle() {
    const obstacle = {
      x: this.canvas.width,
      y: this.groundY - 40, // Changed from -60 to -40 (moved down 20px)
      width: 60,
      height: 60
    };
    this.obstacles.push(obstacle);
    this.lastSpawnType = 'obstacle';
  }
  
  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }
  
  update() {
    if (this.gameState !== 'playing') return;
    
    // Update player physics
    this.player.velocityY += this.gravity;
    this.player.y += this.player.velocityY;
    
    // Ground collision
    if (this.player.y >= this.groundY - this.player.height + 28) {
      this.player.y = this.groundY - this.player.height + 28; // Move 28px down to touch ground properly
      this.player.velocityY = 0;
      
      // Transition from jump to run
      if (this.player.isJumping) {
        this.player.isJumping = false;
        this.player.currentFrame = 0; // Start at first run frame
        this.player.frameCounter = 0; // Reset frame counter for smooth transition
      }
      
      this.player.jumpsRemaining = 2; // Reset jumps when landing
    }
    
    // Update player animation
    this.player.frameCounter++;
    if (this.player.frameCounter >= this.player.frameDelay) {
      this.player.frameCounter = 0;
      
      if (this.player.isJumping) {
        // Hold on last jump frame instead of looping
        if (this.player.currentFrame < this.sprites.jump.length - 1) {
          this.player.currentFrame++;
        }
        // Stay on last frame (jump-04) until landing
      } else {
        // Running animation - continuous loop
        this.player.currentFrame = (this.player.currentFrame + 1) % this.sprites.run.length;
      }
    }
    
    // Spawn bobas
    this.bobaSpawnTimer++;
    if (this.bobaSpawnTimer >= this.bobaSpawnInterval) {
      // Check if there's enough space from obstacles (reduced proximity check from 300 to 200)
      const hasNearbyObstacle = this.obstacles.some(obs => obs.x > this.canvas.width - 200);
      if (!hasNearbyObstacle) {
        this.spawnBoba();
        this.bobaSpawnTimer = 0;
      } else {
        // Wait a bit longer if obstacle is nearby
        this.bobaSpawnTimer = this.bobaSpawnInterval - 30;
      }
    }
    
    // Spawn obstacles
    this.obstacleSpawnTimer++;
    if (this.obstacleSpawnTimer >= this.obstacleSpawnInterval) {
      // Check if there's enough space from bobas (reduced proximity check from 300 to 200)
      const hasNearbyBoba = this.bobas.some(boba => boba.x > this.canvas.width - 200);
      if (!hasNearbyBoba) {
        this.spawnObstacle();
        // Add randomization: vary the next spawn time by ±50 frames for more variety
        const randomVariation = Math.floor(Math.random() * 100) - 50; // -50 to +50
        this.obstacleSpawnTimer = randomVariation;
      } else {
        // Wait a bit longer if boba is nearby
        this.obstacleSpawnTimer = this.obstacleSpawnInterval - 30;
      }
    }
    
    // Update bobas
    this.bobas.forEach((boba, index) => {
      boba.x -= this.gameSpeed;
      
      // Rotate boba continuously (360 degrees)
      boba.rotation += boba.rotationSpeed;
      if (boba.rotation >= Math.PI * 2) {
        boba.rotation = 0; // Reset after full rotation
      }
      
      // Check collection
      if (!boba.collected && this.checkCollision(this.player, boba)) {
        boba.collected = true;
        this.score++;
        this.updateScore();
        
        // Progressive difficulty scaling
        // Calculate proportional speed increases based on device type
        const speedIncreaseHigh = this.isMobile ? 0.2 : 0.4; // ~6.67% increase
        const speedIncreaseLow = this.isMobile ? 0.1 : 0.2;  // ~3.33% increase
        
        // Start increasing difficulty after 20 bobas collected
        if (this.score >= 20 && this.score % 2 === 0) {
          this.gameSpeed += speedIncreaseHigh;
          this.difficultyLevel++;
          
          // Decrease obstacle spawn interval (more frequent obstacles)
          // Cap at minimum of 60 frames between obstacles
          this.obstacleSpawnInterval = Math.max(60, this.baseObstacleInterval - (this.difficultyLevel * 18));
          
          console.log(`🎯 Difficulty increased! Level: ${this.difficultyLevel}, Speed: ${this.gameSpeed.toFixed(1)}, Obstacle Interval: ${this.obstacleSpawnInterval}`);
        } else if (this.score < 20 && this.score % 5 === 0 && this.score > 0) {
          // Gentle difficulty increase before level 20
          this.gameSpeed += speedIncreaseLow;
          console.log(`🎮 Gentle speed increase: ${this.gameSpeed.toFixed(1)}`);
        }
      }
      
      // Remove off-screen bobas
      if (boba.x + boba.width < 0) {
        this.bobas.splice(index, 1);
      }
    });
    
    // Update obstacles
    this.obstacles.forEach((obstacle, index) => {
      obstacle.x -= this.gameSpeed;
      
      // Check collision with player
      if (this.checkCollision(this.player, obstacle)) {
        this.gameOver();
      }
      
      // Remove off-screen obstacles
      if (obstacle.x + obstacle.width < 0) {
        this.obstacles.splice(index, 1);
      }
    });
    
    // Update mountains (parallax)
    this.mountains.forEach(mountain => {
      mountain.x -= this.gameSpeed * mountain.speed;
      
      // Loop mountains
      if (mountain.x + mountain.width < 0) {
        mountain.x = this.canvas.width;
      }
    });
  }
  
  drawMountain(mountain) {
    const radius = 20; // 20px corner radius
    
    this.ctx.fillStyle = mountain.color;
    this.ctx.beginPath();
    
    // Bottom left corner (on ground)
    this.ctx.moveTo(mountain.x, this.groundY);
    
    // Left side going up to peak with rounded corner
    const leftPeakX = mountain.x + mountain.width / 2 - radius;
    const peakY = this.groundY - mountain.height;
    this.ctx.lineTo(leftPeakX, peakY + radius);
    
    // Rounded peak
    this.ctx.arcTo(
      mountain.x + mountain.width / 2, peakY,
      mountain.x + mountain.width / 2 + radius, peakY + radius,
      radius
    );
    
    // Right side going down
    const rightPeakX = mountain.x + mountain.width / 2 + radius;
    this.ctx.lineTo(rightPeakX, peakY + radius);
    this.ctx.lineTo(mountain.x + mountain.width, this.groundY);
    
    // Close path along ground
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  draw() {
    if (!this.drawLogged) {
      console.log('🎨 Draw function called', {
        canvasWidth: this.canvas.width,
        canvasHeight: this.canvas.height,
        groundY: this.groundY,
        gameState: this.gameState
      });
      this.drawLogged = true;
    }
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.ctx.fillStyle = '#faf8ff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw mountains
    this.mountains.forEach(mountain => this.drawMountain(mountain));
    
    // Draw ground
    this.ctx.fillStyle = '#ccb4de';
    this.ctx.fillRect(0, this.groundY, this.canvas.width, this.groundHeight);
    
    // Draw bobas
    this.bobas.forEach(boba => {
      if (!boba.collected && this.sprites.boba.complete) {
        // Save the current context state
        this.ctx.save();
        
        // Move to the center of the boba
        this.ctx.translate(boba.x + boba.width / 2, boba.y + boba.height / 2);
        
        // Rotate the context
        this.ctx.rotate(boba.rotation);
        
        // Draw the boba centered on the rotation point
        this.ctx.drawImage(
          this.sprites.boba,
          -boba.width / 2,
          -boba.height / 2,
          boba.width,
          boba.height
        );
        
        // Restore the context state
        this.ctx.restore();
      }
    });
    
    // Draw obstacles
    this.obstacles.forEach(obstacle => {
      if (this.sprites.crate.complete) {
        this.ctx.drawImage(this.sprites.crate, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    });
    
    // Draw player
    const spriteArray = this.player.isJumping ? this.sprites.jump : this.sprites.run;
    const currentSprite = spriteArray[this.player.currentFrame];
    if (currentSprite && currentSprite.complete) {
      this.ctx.drawImage(
        currentSprite,
        this.player.x,
        this.player.y,
        this.player.width,
        this.player.height
      );
    }
  }
  
  gameLoop() {
    if (!this.gameLoopStarted) {
      console.log('🔄 Game loop started');
      this.gameLoopStarted = true;
    }
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize game when DOM is ready
function initGame() {
  try {
    const gameCanvas = document.getElementById('gameCanvas');
    if (gameCanvas) {
      new WeddingGame();
      console.log('🎮 Wedding game initialized successfully');
    } else {
      console.warn('⚠️ Game canvas not found');
    }
  } catch (error) {
    console.error('❌ Error initializing game:', error);
  }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initGame };
}

// Make initGame available globally
if (typeof window !== 'undefined') {
  window.initGame = initGame;
}

