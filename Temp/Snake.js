window.addEventListener("keydown", function (e) { if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) { e.preventDefault(); } }, false);
            
        var canvas = document.getElementById('game');
        var nr = document.getElementById('numer');
        var context = canvas.getContext('2d');
var stig = document.getElementById('stig');
var score = 0;
var TS = 0;
        
        canvas.height = Math.round((window.innerHeight * 0.9)/10) * 10;
        canvas.width = Math.round((window.innerWidth * 0.9)/10) * 10; 
        
        var gaming = true;
        
        

        bh = canvas.height;
        bw = canvas.width;
    
        var grid = Math.round((bh+bw)/50);
        var count = 0;

        var snake = {
          x: grid * 2,
          y: grid * 2,

          // snake velocity. moves one grid length every frame in either the x or y direction
          dx: grid,
          dy: 0,

          // keep track of all grids the snake body occupies
          cells: [],

          // length of the snake. grows when eating an apple
          maxCells: 4
        };
        var apple = {
          x: grid * 4,
          y: grid * 4
        };

        // get random whole numbers in a specific range
        // @see https://stackoverflow.com/a/1527820/2124254
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }

        // game loop
        function loop() {
            
          requestAnimationFrame(loop);
        
          // slow game loop to 15 fps instead of 60 (60/15 = 4)
          if (++count < 4) {
            return;
          }
          if(!gaming){
                return;
            }  
            if (score > TS){
                TS = score;
                
            }
            
          count = 0;
          context.clearRect(0,0,canvas.width,canvas.height);

          // move snake by it's velocity
          snake.x += snake.dx;
          snake.y += snake.dy;
            
            
            if(!Number.isInteger(snake.x/grid)){
                document.getElementById("texti").innerHTML += "A";
                snake.x = Math.floor(snake.x/grid) * grid;
            }else if (!Number.isInteger(snake.y/grid)){
                document.getElementById("texti").innerHTML += "Ö";
                snake.y = Math.floor(snake.y/grid) * grid;
            }
            if(!Number.isInteger(apple.x/grid)){
                document.getElementById("texti").innerHTML += "A";
                apple.x = Math.floor(apple.x/grid) * grid;
            }else if (!Number.isInteger(apple.y/grid)){
                document.getElementById("texti").innerHTML += "Ö";
                apple.y = Math.floor(apple.y/grid) * grid;
            }

          // wrap snake position horizontally on edge of screen
          if (snake.x < 0) {
            snake.x = canvas.width - grid;
          }
          else if (snake.x >= canvas.width) {
            snake.x = 0;
          }

          // wrap snake position vertically on edge of screen
          if (snake.y < 0) {
            snake.y = canvas.height - grid;
          }
          else if (snake.y >= canvas.height) {
            snake.y = 0;
          }

          // keep track of where snake has been. front of the array is always the head
          snake.cells.unshift({x: snake.x, y: snake.y});

          // remove cells as we move away from them
          if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
          }
            //Draw cell walls
            /*for (var x = -grid; x <= bw; x += grid) {
                context.moveTo(x + grid, grid);
                context.lineTo(x + grid, bh + grid);
            }

            for (var x = -grid; x <= bh; x += grid) {
                context.moveTo(grid, x + grid);
                context.lineTo(bw + grid, x + grid);
            }
        context.strokeStyle = "#103A18";
        context.stroke();*/
            
          // draw apple
          context.fillStyle = 'red';
          context.fillRect(apple.x + 2, apple.y + 2, grid-4, grid-4);

          // draw snake one cell at a time
          context.fillStyle = 'green';
          snake.cells.forEach(function(cell, index) {

            // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
            context.fillRect(cell.x + 1, cell.y + 1, grid-2, grid-2);  

            // snake ate apple
            if (cell.x === apple.x && cell.y === apple.y) {
              snake.maxCells++;

              // Set apple at random position within the grid 
              apple.x = getRandomInt(0, bw/grid) * grid;
              apple.y = getRandomInt(0, bh/grid) * grid;
            }
              score = snake.cells.length
              if(score >= TS && (document.body.scrollTop < 100 || document.documentElement.scrollTop < 100)){
                    stig.innerHTML = /*"<a id='stig' style='color: #FFB53F'> Nýtt met! </a>" + */score + "/" + TS;
                }else{
              stig.innerHTML = score + "/" + TS;}
            //nr.innerHTML = "" + bh + "/" + bw + "<br>" + "grid: " + grid + "<br>" + "x " + cell.x + " y " + cell.y + " <br> x " + apple.x + " y " + apple.y + "<br>" + snake.cells.length; 
              
              
            // check collision with all cells after this one (modified bubble sort)
            for (var i = index + 1; i < snake.cells.length; i++) {

              // snake occupies same space as a body part. reset game
              if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.dx = 0;
                snake.dy = 0;
                  context.fillStyle = 'white'; 
                  context.fillRect(cell.x + 0.5, cell.y + 0.5, grid-1, grid-1); 
                  setTimeout(() =>{
                             
                    snake.x = 160;
                    snake.y = 160;
                    snake.cells = [];
                    snake.maxCells = 4;
                    snake.dx = grid;
                    snake.dy = 0;    
                
                  }, 1500);}
            }
          });
        }

        // listen to keyboard events to move the snake
        document.addEventListener('keydown', function(e) {
          // prevent snake from backtracking on itself by checking that it's 
          // not already moving on the same axis (pressing left while moving
          // left won't do anything, and pressing right while moving left
          // shouldn't let you collide with your own body)

          // left arrow key
          if (e.which === 37 && snake.dx === 0) {
            snake.dx = -grid;
            snake.dy = 0;
              
          }
          // up arrow key
          else if (e.which === 38 && snake.dy === 0) {
            snake.dy = -grid;
            snake.dx = 0;
             
          }
          // right arrow key
          else if (e.which === 39 && snake.dx === 0) {
            snake.dx = grid;
            snake.dy = 0;
              
          }
          // down arrow key
          else if (e.which === 40 && snake.dy === 0) {
            snake.dy = grid;
            snake.dx = 0;
              
          }
        });

        // start the game
        requestAnimationFrame(loop);