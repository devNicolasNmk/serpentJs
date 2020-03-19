window.onload = function(){

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30
    var ctx;
    var delay = 1000;
    var snakee;
    var canvas;

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
        snakee = new Snake( [ [6,4], [5,4], [4,4] ] );
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
        setTimeout(refreshCanvas, delay);
    }

    function drawBlock(ctx, position)
    {   
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);      
    }

    function Snake(body)
    {
        this.body = body;
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
            nextPosition[0] += 1;
            //ajouter nextposition en 1er indice
            this.body.unshift(nextPosition);
            //supprimer le dernier indice (la queue du snake)
            this.body.pop();
        }
    }

}