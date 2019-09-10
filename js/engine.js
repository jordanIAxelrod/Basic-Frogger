/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas element's height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        hearts = [1,2,3,4],
        wonOrLost = false,
        leaderboard = [],
        count = 0,
        res = false;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        openScreen();
        // main();
    }
    /* The open screen presents the game and asks the user to select a player image.
     */
    function openScreen() {

      const allCharacters = new Queue.Dequeue(['images/char-boy.png',
                                                 'images/char-cat-girl.png',
                                                 'images/char-horn-girl.png',
                                                 'images/char-pink-girl.png',
                                                 'images/char-princess-girl.png']);
      _openScreen(allCharacters);


    }
    function _openScreen(charList) {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.font = '40px Cambria';
      ctx.fillText('Get to Safety!', 100, 200);
      ctx.font = '30px Cambria';
      ctx.fillText('Choose your character:', 100, 250);
      ctx.font = '20px Cambria';
      const previous = ctx.fillText('Previous', 20, 300);
      let shownCharacters = charList.getList();
      let count = 0;
      for (char of shownCharacters) {
        ch = Resources.get(char);
        ctx.drawImage(Resources.get('images/Selector.png'), 110 + 100 * count, 275);
        ctx.drawImage(ch, 110 + 100 * count, 275);
        count += 1;
      }
      ctx.fillText('Next', 420, 300);

      function selector(event) {
        const canvX = canvas.getBoundingClientRect().left;
        const canvY = canvas.getBoundingClientRect().top;
        const x = event.pageX - canvX;
        const y = event.pageY - canvY;
        if (x >= 10 && x < 100 &&
          y >= 285 && y < 305) {
              prev(charList);
            } else if (checkCharacter(0, x, y)) {
              playerClick(charList, 0);
            } else if (checkCharacter(1, x, y)) {
              playerClick(charList,1);
            } else if (checkCharacter(2, x, y)) {
              playerClick(charList,2);
            } else if (x >= 420 && x < 480 &&
                       y >= 285 && y <= 305) {
              next(charList);
            }
      }

      function checkCharacter(num, x, y) {
        return x >= 110 + num * 100 && x < 110 + (1 + num) * 100 &&
                   y >= 275 && y < 475;
      }

      /* previous cycles backwards in the dequeue and repaints the window
       */
      function prev(charList) {
        charList.previous();
        canvas.removeEventListener('click', selector);
        _openScreen(charList);
      }

      /* Next cycles forward in the dequeue and repaints the window
       */
      function next(charList) {
        charList.next();
        canvas.removeEventListener('click', selector);
        _openScreen(charList);
      }
      canvas.addEventListener('click', selector);
    }
    /* When the user selects a character image, that image is set as the
     * sprite of the player class and the game begins.
     */
    function playerClick(charList, num) {
      player.sprite = charList.getList()[num];
      res = true;
      reset(res);
      main();
    }



    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is the check collision function. It loops through the enemies
     * to check if the player is inside or touching the player.
     */
    function checkCollisions() {
      const playerTop = player.y,
            playerLeft = player.x,
            playerRight = player.x + Resources.get(player.sprite).width,
            playerBottom = player.y + Resources.get(player.sprite).height;
      for (var enemy of allEnemies) {
        const enemyTop = enemy.y + 10,
              enemyLeft = enemy.x + 20,
              enemyRight = enemy.x + Resources.get(enemy.sprite).width-23,
              enemyBottom = enemy.y + Resources.get(enemy.sprite).height-100;
        if (!(playerRight < enemyLeft ||
              playerLeft > enemyRight ||
              playerBottom < enemyTop ||
              playerTop > enemyBottom)) {
                res = true;
                setTimeout(reset,20, res);
              }
      }
    }
    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        if (player.y < 58) {
          gameWon();
        }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
          if (!wonOrLost) {
            // Before drawing, clear existing canvas
            ctx.clearRect(0,0,canvas.width,canvas.height);

            /* Loop through the number of rows and columns we've defined above
             * and, using the rowImages array, draw the correct image for that
             * portion of the "grid"
             */
            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                    /* The drawImage function of the canvas' context element
                     * requires 3 parameters: the image to draw, the x coordinate
                     * to start drawing and the y coordinate to start drawing.
                     * We're using our Resources helpers to refer to our images
                     * so that we get the benefits of caching these images, since
                     * we're using them over and over.
                     */
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }
            // Renders the hearts representing the remaining lives
            for (i = 0; i < hearts.length; i++) {
              // Resources.get('images/Heart.png').width = 20;
              // Resources.get('images/Heart.png').height = 20;
              ctx.drawImage(Resources.get('images/Heart.png'), 420 + i *25, 50, 20, 30);
            }
            renderEntities();
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset(r) {
      if (res){
        for (var enemy of allEnemies) {
          enemy.x = enemy.rX;
        }
        player.x = (505 - Resources.get(player.sprite).width)/2;
        player.y = 390;
        hearts.pop();
        if (hearts.length === 0) {
          gameLost();
        }
        res = false;
      }
    }

    /* New screen comes up asking if they want to play again
     */
    function gameLost() {
      wonOrLost = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '20px Cambria';
      ctx.fillText('Oh no! You died!',100, 100);
      ctx.fillText('Click to play again',75, 175);
      document.addEventListener('click', playAgain);


     }

     /* New win screen appears and asks if the user wants to play again
      */
    function gameWon() {
      if (count === 0) {
        timeTaken = Date.now() - player.startTime;
        if (leaderboard.length < 3) {
          leaderboard.push(timeTaken);
        } else if (timeTaken < leaderboard[2]){
          leaderboard[2] = timeTaken;

        }
      }
      leaderboard.sort(function(a,b){return a-b});
      count++;
      wonOrLost = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '20px Cambria';
      ctx.fillText('You won!',100, 100);
      ctx.fillText('Leaderboard:',100, 150);
      if (leaderboard.length >= 1) {
        ctx.fillText(`1: ${leaderboard[0]}`, 100, 180);
      }
      if (leaderboard.length >= 2) {
        ctx.fillText(`2: ${leaderboard[1]}`,100,210);
      }
      if (leaderboard.length === 3) {
        ctx.fillText(`3: ${leaderboard[2]}`,100,240);
      }
      player.firstInput = true;
      document.addEventListener('click', playAgain);
    }

    /* Resets the play area after win or loss
     */
    function playAgain() {
      count = 0;
      hearts = [1, 2, 3,4];
      wonOrLost = false;
      res = true;
      reset(res);
      document.removeEventListener('click', playAgain);
    }
    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Heart.png',
        'images/Selector.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
