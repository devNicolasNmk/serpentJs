window.onload = function(){

    let canvas;
    let ctx;
    let delay = 100;
    let xCoord = 0;
    let yCoord = 0;

    init();

    function init()
    {
        //creation du canvas
        canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 600;
        canvas.style.border = "1px solid";
        
        //insertion dans le dom
        document.body.appendChild(canvas);
        
        //creation du context de dessin
        ctx = canvas.getContext('2d');

        //appel de la fonction du refresh du canvas
        refreshCanvas();

    }

    function refreshCanvas()
    {
        xCoord += 5;
        yCoord += 5;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(xCoord, yCoord, 100, 50);
        setTimeout(refreshCanvas, delay);

    }

}