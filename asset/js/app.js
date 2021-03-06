window.onload = function () {

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30
    var ctx;
    var delay = 100;
    var snakee;
    var canvas;
    var applee;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score;
    var timeOut;

    /**
     * 
     * gestion du serpent
     * 
     */
    class Snake {
        constructor(body, direction) {
            this.body = body;
            this.direction = direction;
            this.ateApple = false;
            //declaration de la fonction de dessin du serpent
            this.draw = function () {
                //sauvegarde le contexte 
                ctx.save();
                ctx.fillStyle = "#ff0000";
                //dessine le serpent
                for (var i = 0; i < this.body.length; i++) {
                    drawBlock(ctx, this.body[i]);
                }
                ;
                ctx.restore();
            };
            //declaration de la fonction utilisée pour faire avancer le snake(x)
            this.advance = function () {
                //copie l'element
                var nextPosition = this.body[0].slice();
                // modifie le contenu du body selon la direction choisie
                switch (this.direction) {
                    case "left":
                        nextPosition[0] -= 1;
                        break;
                    case "right":
                        nextPosition[0] += 1;
                        break;
                    case "down":
                        nextPosition[1] += 1;
                        break;
                    case "up":
                        nextPosition[1] -= 1;
                        break;
                    default:
                        throw ("invalid Direction");
                }
                //ajouter nextposition en 1er indice
                this.body.unshift(nextPosition);
                if (!this.ateApple) {
                    this.body.pop();
                }
                else {
                    this.ateApple = false;
                }
            };
            // indique les directions permises
            this.setDirection = function (newDirection) {
                var allowedDirections;
                switch (this.direction) {
                    case "left":
                    case "right":
                        allowedDirections = ["up", "down"];
                        break;
                    case "down":
                    case "up":
                        allowedDirections = ["left", "right"];
                        break;
                    default:
                        throw ("invalid Direction");
                }
                // si la direction est permise on enregistre  la direction
                if (allowedDirections.indexOf(newDirection) > -1) {
                    this.direction = newDirection;
                }
            };
            this.checkCollision = function () {
                var wallCollision = false;
                var snakeCollision = false;
                var head = this.body[0];
                var rest = this.body.slice(1);
                var snakeX = head[0];
                var snakeY = head[1];
                var minX = 0;
                var minY = 0;
                var maxX = widthInBlocks - 1;
                var maxY = heightInBlocks - 1;
                var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
                var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
                if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                    wallCollision = true;
                }
                for (var i = 0; i < rest.length; i++) {
                    if (snakeX == rest[i][0] && snakeY === rest[i][1]) {
                        snakeCollision = true;
                    }
                }
                return wallCollision || snakeCollision;
            };
            this.isEatingApple = function (appleToEat) {
                var head = this.body[0];
                if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                    return true;
                }
                else {
                    return false;
                }
            };
        }
    }
    
    /**
     * 
     * gestion de la pomme
     * 
     */
    class apple {
        constructor(position) {
            this.position = position;
            this.draw = function () {
                //sauve les parametres avant 
                ctx.save();
                ctx.fillStyle = "#33cc33";
                ctx.beginPath();
                var radius = blockSize / 2;
                var x = this.position[0] * blockSize + radius;
                var y = this.position[1] * blockSize + radius;
                ctx.arc(x, y, radius, 0, Math.PI * 2, true);
                ctx.fill();
                //restaure les parametres apres
                ctx.restore();
            };
            this.setNewPosition = function () {
                var newX = Math.round(Math.random() * (widthInBlocks - 1));
                var newY = Math.round(Math.random() * (heightInBlocks - 1));
                this.position = [newX, newY];
            };
            this.isOnSnake = function (snakeToCheck) {
                var isOnSnake = false;
                for (var i = 0; i < snakeToCheck.body.length; i++) {
                    if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                        isOnSnake = true;
                    }
                }
                return isOnSnake;
            };
        }
    }

    init();

    /**
     * 
     * initialisation de la partie
     * 
     */
    function init() {
        //creation du canvas
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.display = "block";
        canvas.style.border = "30px solid grey";
        canvas.style.borderRadius = "10px";
        canvas.style.margin = "50px auto";
        // // canvas.style.backgroundColor = "#ddd";
        canvas.style.backgroundImage = "url('bg.png') no-repeat center center"; 
        //insertion dans le dom
        document.body.appendChild(canvas);
        //creation du context de dessin
        ctx = canvas.getContext('2d');
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],
            [3, 4],
            [2, 4]
        ], "right");
        applee = new apple([10, 10]);
        //appel de la fonction du refresh du canvas
        score = 0;
        refreshCanvas();

    }

    /**
     * 
     * gestion du refresh du canvas
     * 
     */
    function refreshCanvas() {
        snakee.advance();
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)) {
                score++;
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                }
                while (applee.isOnSnake(snakee))
            }

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            //dessine le serpent
            snakee.draw();
            //dessine la pomme
            applee.draw();

            timeOut = setTimeout(refreshCanvas, delay);
        }

    }

    /**
     * 
     * affichage du game over
     * 
     */
    function gameOver() {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyez sur la touche espace pour rejouer", centreX, centreY - 120);

        ctx.fillText("Appuyez sur la touche espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }

    /**
     * permet de refaire une partie
     * 
     */
    function restart() {
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],
            [3, 4],
            [2, 4]
        ], "right");
        applee = new apple([10, 10]);
        score = 0;
        clearTimeout(timeOut);
        //appel de la fonction du refresh du canvas
        refreshCanvas();

    }

    /**
     * affiche le score
     */
    function drawScore() {
        ctx.save();
        ctx.font = "bold 100px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    //gestion des touches pressées
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }

}