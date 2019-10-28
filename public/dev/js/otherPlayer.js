var canvas = document.getElementById('otherPlayer'),
    cw = canvas.width,
    ch = canvas.height,
    cx2 = null,
    fps = 45,
    bX = 30,
    bY = 30,
    mX = 10,
    mY = 20;

function othergameLoop() {
    cx2.clearRect(0,0,cw,cw);

    cx2.beginPath();
    cx2.fillStyle = 'red';
    cx2.arc(bX, bY, 20, 0, Math.PI * 360);
    cx2.fill();
    if(bX >= cw || bX <= 0) { mX*=-1; }
    if(bY >= ch || bY <= 0) { mY*=-1; }

    bX+=mX;
    bY+=mY;
}
