// Enemies our player must avoid
var Enemy = function(x, y, move) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.rX = x;
    this.rY = y;
    this.movement = move;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.movement * dt;
    if (this.x > 505 && this.movement > 0) {
      this.x = -Resources.get(this.sprite).width;
    } else if (this.x < -Resources.get(this.sprite).width && this.movement < 0){
      this.x = 505 + Resources.get(this.sprite).width;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// The player controlled by the user
const Player = function() {
    // the image/spirte for our player
    this.sprite = 'images/char-boy.png';
    // The coordinates for the start

    this.x = 250;
    this.y = 390;
}


//
Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x > 82) {
        this.x -= 100;
    } else if (key === 'right' && this.x < 402) {
        this.x += 100;
    } else if (key === 'up' && this.y > 0) {
        this.y -= 83;
    } else if (key === 'down' && this.y < 390) {
        this.y += 83;
    }
    if (this.firstInput) {
      this.startTime = Date.now();
      this.firstInput = false;
    }

}

Player.prototype.update = function() {
    if (this.x === 250) {
      this.x = (505 - Resources.get(this.sprite).width)/2;
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [new Enemy(0,50, 60), new Enemy(50,140, 100), new Enemy(100, 230, 80),
                    new Enemy(-200, 230, 90), new Enemy(-200, 140, 80), new Enemy(-250, 50, 70)];
const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
player.firstInput = true;

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
