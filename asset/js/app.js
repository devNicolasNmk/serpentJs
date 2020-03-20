window.onload = function(){

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30
    var ctx;
    var delay = 100;
    var snakee;
    var canvas;
    var applee;

    init();

    function init()
    {
        //creation du canvas
        canvas              = document.createElement('canvas');
        canvas.width        = canvasWidth;
        canvas.height       = canvasHeight;
        canvas.style.border = "1px solid";
        //insertion dans le dom
        document.body.appendChild(canvas);
        //creation du context de dessin
        ctx = canvas.getContext('2d');
        snakee = new Snake( [ [6,4], [5,4], [4,4] ] , "right" );
        applee = new apple([10,10]);
        //appel de la fonction du refresh du canvas
        refreshCanvas();

    }

    function refreshCanvas()
    {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        //appel de la fonction d'avancée
        snakee.advance();
        //dessine le serpent
        snakee.draw();
        //dessine la pomme
        applee.draw();
        setTimeout(refreshCanvas, delay);
    }

    function drawBlock(ctx, position)
    {   
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);      
    }

    function Snake(body, direction)
    {
        this.body = body;
        this.direction = direction;
        //declaration de la fonction de dessin du serpent
        this.draw = function()
        {
           //sauvegarde le contexte 
            ctx.save();
            ctx.fillStyle = "#ff0000";
            //dessine le serpent
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            };
            ctx.restore(); 
        };
        //declaration de la fonction utilisée pour faire avancer le snake(x)
        this.advance = function()
        {
            //copie l'element
            var nextPosition = this.body[0].slice();
            // modifie le contenu du body selon la direction choisie
            switch(this.direction)
            {
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
                    throw("invalide Direction");
            }
            //ajouter nextposition en 1er indice
            this.body.unshift(nextPosition);
            //supprimer le dernier indice (la queue du snake)
            this.body.pop();
        }
        // indique les directions permises
        this.setDirection =function(newDirection)
        {
            var allowedDirections;
            switch (this.direction) 
            {
                case "left":
                case "right":
                    allowedDirections =["up","down"]
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"]
                    break;
                default:
                    throw ("invalide Direction");
            }
            // si la direction est permise on enregistre  la direction
            if(allowedDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }

        };
    }

    function apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            //sauve les parametres avant 
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize /2;
            var x = position[0]*blockSize + radius;
            var y = position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            //restaure les parametres apres
            ctx.restore();
        }
    }

    document.onkeydown = function handleKeyDown(e)
    {
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
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }

}