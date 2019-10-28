
var canvas = document.getElementById('game');
    cw = canvas.width;
    ch = canvas.height;
    cx = null;
    fps = 45;
    tileWidth = 12
    frameRate = 1/40; // Seconds
var character = {
    position: {x: cw/2, y: 5},
    velocity: {x: 10, y: 0},
    mass: 0.1, //kg
    radius: 24, // 1px = 1cm
    restitution: -0.7
};
    var Cd = 0.47;  // Dimensionless
    var rho = 1.22; // kg / m^3
    var A = Math.PI * character.radius * character.radius / (10000); // m^2
    var ag = 9.81;  // m / s^2
    var mouse = {x: 0, y: 0, isDown: false};

    player = document.getElementById("player")

    if (typeof (canvas.getContext) !== undefined) {
        cx = canvas.getContext('2d');

        setInterval(myGameLoop, 1000 / fps);
    }

function myGameLoop() {
  physics();
  broadCastPos();
    cx.clearRect(0,0,cw,ch);
    cx.drawImage(player, character.position.x,character.position.y,character.radius,character.radius)
    console.log(character.position.y)
    cx.drawImage(player2, 100,0,100,100)
    console.log("gameloop")
}
function physics(){
      // Drag force: Fd = -1/2 * Cd * A * rho * v * v
      var Fx = -0.5 * Cd * A * rho * character.velocity.x * character.velocity.x * character.velocity.x / Math.abs(character.velocity.x);
      var Fy = -0.5 * Cd * A * rho * character.velocity.y * character.velocity.y * character.velocity.y / Math.abs(character.velocity.y);

      Fx = (isNaN(Fx) ? 0 : Fx);
      Fy = (isNaN(Fy) ? 0 : Fy);

          // Calculate acceleration ( F = ma )
      var ax = Fx / character.mass;
      var ay = ag + (Fy / character.mass);
          // Integrate to get velocity
      character.velocity.x += ax*frameRate;
      character.velocity.y += ay*frameRate;

          // Integrate to get position
      character.position.x += character.velocity.x*frameRate*100;
      character.position.y += character.velocity.y*frameRate*100;

  // Handle collisions
  if (character.position.y > ch - character.radius){
      character.velocity.y *= character.restitution;
      character.position.y = ch - character.radius;
  }
  if (character.position.x > cw - character.radius) {
      character.velocity.x *= character.restitution;
      character.position.x = cw - character.radius;
  }
  if (character.position.x < character.radius) {
      character.velocity.x *= character.restitution;
      character.position.x = character.radius;
  }

}
function broadCastPos(){

  if (playerNumber !== "") {
  socket.emit("playerPos", {"id": id,"x": ball.position.x,"y":ball.position.y});
  }

}
  id = location.href.split("/")[location.href.split("/").length - 2]
var socket = io.connect("localhost:3001");
    socket.emit('create', id);
    socket.emit('requestPlayerNum', id);
    socket.on('recvPlayerNum', function (playerCount) {
      if(playerNumber == "" && playerCount < 3){
        playerNumber = playerCount
      }else{
        alert("Too many players in lobby.")
      }
    });
