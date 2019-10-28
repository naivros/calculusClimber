//RoomID
id = location.href.split("/")[location.href.split("/").length - 2]

blocks = []
recvBlocks = []
tileWidth = 30;
tileHeight = 30;
roomWidth = 21; //!important odd number only...
roomHeight = 300;

roomWidth += 3
roomHeight += 2
playerNumber = ""
var frameRate = 1 / 60; // Seconds
var frameDelay = frameRate * 1000; // ms
var width = 1280;
var height = 720;
var canvas = ctx = false;
var loopTimer = false;
modalActive = false;
//importImages
c = document.getElementById("game");
grid = document.getElementById("grid");
boostPad = document.getElementById("boostPad");
question = document.getElementById("question");
questionDeactivated = document.getElementById("questionDeactivated");

blocks = [];
ball = {
    position: {
        x: 0,
        y: c.height - 2 * tileHeight
    },
    velocity: {
        x: 0,
        y: 10
    },
    mass: 0.2, //kg
    radius: tileHeight, // 1px = 1cm
    restitution: -0.6
};
var boink = new Audio('/static/assets/music/boink.mp3');
var socket = io.connect("http://158.69.210.200:3001");
socket.emit('create', id);
socket.emit('requestPlayerNum', id);
//If we receive the number that we requested...
socket.on('recvPlayerNum', function(playerCount) {
    if (playerNumber == "" && playerCount < 3) {
        playerNumber = playerCount
        //Initialize Game, after receiving a valid PlayerNumber
        isInit();
    } else {
        toastr.warning("This lobby is full.")
    }
    console.log("You are player #: " + playerCount);
});
socket.on("sendQuestion", function (question) {
    modalActive = true
    console.log(question)
    $(".answer").removeClass("answer")
    x = getRandomArbitrary(1, 4);
    otherAnswers = [];
    correctAnswer = question["a1"]
    otherAnswers.push(question["a2"], question["a3"], question["a4"]);
    ball.velocity.x = 0
    $("#loadedQuestion").html(question["q"])
    switch (x) {
        case 1:
        /* Ideal system would be receiving a question from the server, and having this function as a serverside function to protect the information's class of "correct" from being shown to the user, then using a socket to emit "answer-b";
        hey server is b the correct answer?
        server: yes.
        */
            $("#answer1").html(correctAnswer).addClass("answer")
                tmp = getRandomArbitrary(0, otherAnswers.length)
                $("#answer2").html(otherAnswers[tmp]);
                otherAnswers.splice(tmp, 1)
                tmp = getRandomArbitrary(0, otherAnswers.length)
                $("#answer3").html(otherAnswers[tmp]);
                otherAnswers.splice(tmp, 1)
                tmp = getRandomArbitrary(0, otherAnswers.length)
                $("#answer4").html(otherAnswers[tmp]);
                otherAnswers.splice(tmp, 1)
            break;
        case 2:
            $("#answer2").html(correctAnswer).addClass("answer")
            tmp = getRandomArbitrary(0, otherAnswers.length)
            $("#answer1").html(otherAnswers[tmp]);
            otherAnswers.splice(tmp, 1)
            tmp = getRandomArbitrary(0, otherAnswers.length)
            $("#answer3").html(otherAnswers[tmp]);
            otherAnswers.splice(tmp, 1)
            tmp = getRandomArbitrary(0, otherAnswers.length)
            $("#answer4").html(otherAnswers[tmp]);
            otherAnswers.splice(tmp, 1)
            break;
        case 3:
            $("#answer3").html(correctAnswer).addClass("answer")
            tmp = getRandomArbitrary(0, otherAnswers.length)
            $("#answer1").html(otherAnswers[tmp]);
            otherAnswers.splice(tmp, 1)
            tmp = getRandomArbitrary(0, otherAnswers.length)
            $("#answer2").html(otherAnswers[tmp]);
            otherAnswers.splice(tmp, 1)
            tmp = getRandomArbitrary(0, otherAnswers.length)
            $("#answer4").html(otherAnswers[tmp]);
            otherAnswers.splice(tmp, 1)
            break;
        case 4:
            $("#answer4").html(correctAnswer).addClass("answer")
            tmp = getRandomArbitrary(0, otherAnswers.length)
            $("#answer1").html(otherAnswers[tmp]);
            otherAnswers.splice(tmp, 1)
            tmp = getRandomArbitrary(0, otherAnswers.length)
            $("#answer2").html(otherAnswers[tmp]);
            otherAnswers.splice(tmp, 1)
            tmp = getRandomArbitrary(0, otherAnswers.length)
            $("#answer3").html(otherAnswers[tmp]);
            otherAnswers.splice(tmp, 1)
            break;
    }
 $('.modal').modal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: 0.65, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 300, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
      });
$('.modal').modal("open")
});
//If we receive another player's grid... let's save it!

socket.on("recvBlocks", function(sentBlocks) {
    recvBlocks = sentBlocks

});
//Document is loaded, make calculations with DOM Elements...
$(document).ready(function() {
    var c = document.getElementById("game");
    if (tileWidth * roomWidth > c.width) {
        startPosW = 0;
    } else {
        startPosW = ((c.width - (tileWidth * roomWidth)) / 2)
    }

    if (tileHeight * roomHeight > c.height) {
        startPosH = c.height - (tileHeight * roomHeight);
    } else {
        startPosH = ((c.height - (tileHeight * roomHeight)) / 2)
    }
    console.log(startPosH)
    var ctx = c.getContext("2d");
    var img = document.getElementById("backdrop");
    var grid = document.getElementById("grid");
    player = document.getElementById("player1");
    player2 = document.getElementById("player2");
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function cookies() {

}

//Keyboard input for game...
function up(x) {
if(!modalActive){
    if (Math.abs(ball.velocity.y < 10)) {
        if (count == 0) {
            ball.velocity.y -= 10
            count += 1
        }
    }
}
}

function left(x) {
if(!modalActive){
    if (x) {
        if (Math.abs(ball.velocity.x < 3)) {
            ball.velocity.x -= Math.abs(joystick.deltaX() / 300)
        }
    } else {
        if (Math.abs(ball.velocity.x < 3)) {
            ball.velocity.x -= Math.abs(1.5)
        }
    }
}
}

function down(x) {
if(!modalActive){
    ball.velocity.x = 0;
}
}

function right(x) {
if(!modalActive){
    if (x) {
        if (Math.abs(ball.velocity.x < 3)) {
            ball.velocity.x += Math.abs(joystick.deltaX() / 300)
        }
    } else {
        if (Math.abs(ball.velocity.x < 3)) {
            ball.velocity.x += Math.abs(1.5)
        }
    }
}
}

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            left(false);
            break;
        case 38:
            up(false);
            break;
        case 39:
            right(false);
            break;
        case 40:
            down(false);
            break;
        case 32:
            up(false);
            break;
    }
};
//Recieve Message from another User

socket.on("msg", function(data) {
    toastr.info("" + data.message);
});
//Hit Enter on Textbox
$("#message").keyup(function(event) {
    if (event.keyCode === 13) {
        data = {
            id: id,
            message: $("#message").val()
        }
        socket.emit("sendMsg", data);
        $("#message").val("");
    }
});
var playerNumber = getCookie("playerNumber" + id)

//Initialization onReady();
var setup = function() {

    if (playerNumber == 1) {
        spawnX = ((c.width - (tileWidth * roomWidth)) / 2) + (((roomWidth - 1) / 4) * tileWidth)
    }
    if (playerNumber == 2) {
        spawnX = ((c.width - (tileWidth * roomWidth)) / 2) + (((roomWidth - 1) / 4) * 3 * tileWidth)
    }
    midX = ((c.width - (tileWidth * roomWidth)) / 2) + (((roomWidth - 1) / 2) * tileWidth)
    ball.position.x = spawnX
    Cd = 0.47; // Dimensionless
    rho = 1.22; // kg / m^3
    A = Math.PI * ball.radius * ball.radius / (10000); // m^2
    ag = 9.81; // m / s^2

    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    ctx.font = '16px Bowlby One SC'
    socket.emit("blocks", {
        id: id,
        blocks: blocks
    })
    loopTimer = setInterval(loop, frameDelay);
}
//Main Game Loop....
var loop = function() {

    //Fd = -1/2 * Cd * A * rho * v * v
    Fx = (-0.50 * Cd * A * rho * ball.velocity.x * ball.velocity.x * ball.velocity.x) / Math.abs(ball.velocity.x);
    Fy = (-0.50 * Cd * A * rho * ball.velocity.y * ball.velocity.y * ball.velocity.y) / Math.abs(ball.velocity.y);
    Fx = (isNaN(Fx) ? 0 : Fx);
    Fy = (isNaN(Fy) ? 0 : Fy);
    //Acceleration
    ax = Fx / ball.mass;
    ay = ag + (Fy / ball.mass);
    //Velocity
    if(ball.velocity.x + ball.velocity.y != 0 && playerNumber < 2){
      socket.emit("blocks", {
          id: id,
          blocks: blocks
      })
    }
    //Velocity
    ball.velocity.x += ax * frameRate;
    ball.velocity.y += ay * frameRate;
    //Position
    ball.position.x += ball.velocity.x * frameRate * 100;
    ball.position.y += ball.velocity.y * frameRate * 100;

    //Clear the Canvas
    clear();
    //Create A Grid
    createGrid();
    //CollisionDetection
    testCollision();
    //BroadcastPosition
    broadcast();
    //testAnalogInput
    testVirtualJoystick();
    spawnParticles();
    ctx.stroke();
    ctx.save();
    genObj();
    ctx.drawImage(player, ball.position.x, ball.position.y, tileWidth, tileHeight);
    if (typeof x !== "undefined" && typeof y !== "undefined") {
        ctx.drawImage(player2, x, y, tileWidth, tileHeight);
    }
    ctx.restore();
    socket.on("otherPlayerLocation", function(data) {
        if (data.x !== ball.position.x || data.y !== ball.position.y) {
            x = data.x
            y = data.y
            rHeight = data.rHeight
        }
    });
    if (ball.position.y < 100) {

        startPosH = startPosH + 2

    }
    if (ball.position.y < 300) {
        startPosH = startPosH + 1
    }
    if (ball.position.y < 200) {
        startPosH = startPosH + 1
    }
}
//Generates Border around the canvas...
function createGrid() {
    if (playerNumber == 1) {
        for (w = 0; w < roomWidth / 2; w++) { //TOP
            wOffset = w * tileWidth + startPosW
            hOffset = 0 + startPosH
            ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
        }
        for (w = 0; w < roomWidth / 2; w++) { //Bottom
            origWOffset = startPosW
            origHOffset = startPosH
            wOffset = w * tileWidth + origWOffset
            hOffset = (roomHeight - 1) * tileHeight + origHOffset
            ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
        }
        for (h = 1; h < roomHeight - 1; h++) { //Left
            origWOffset = startPosW
            origHOffset = startPosH
            wOffset = 0 + origWOffset
            hOffset = h * tileHeight + origHOffset
            if ((roomHeight - h - 1) % 5 == 0) {
                offset = -(roomHeight - h - 1).toString().length * 14

                ctx.fillText(roomHeight - h - 1, wOffset + offset, hOffset + 21);
            }
            ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
        }
        for (h = 1; h < roomHeight - 1; h++) { //Right
            origHOffset = startPosH
            wOffset = midX - (0.5 * tileWidth)
            hOffset = (h * tileHeight) + origHOffset
            ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
        }
        if (typeof rHeight !== "undefined") {
            for (h = 1; h < roomHeight - 1; h++) { //Left
                origWOffset = startPosW
                origHOffset = startPosH
                wOffset = (roomWidth - 1) * tileWidth + origWOffset
                hOffset = (h * tileHeight) + rHeight
                ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
                if ((roomHeight - h - 1) % 5 == 0) {
                    ctx.fillText(roomHeight - h - 1, wOffset + tileWidth + 5, hOffset + 21);
                }
            }
            for (h = 1; h < roomHeight - 1; h++) { //Right
                origHOffset = startPosH
                wOffset = midX + (0.5 * tileWidth)
                hOffset = (h * tileHeight) + rHeight
                ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
            }
            for (w = roomWidth / 2; w < roomWidth; w++) { //TOP
                wOffset = w * tileWidth + startPosW
                hOffset = 0 + rHeight
                ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
            }
            for (w = roomWidth / 2; w < roomWidth; w++) { //TOP
                origWOffset = startPosW
                origHOffset = startPosH
                wOffset = w * tileWidth + origWOffset
                hOffset = (roomHeight - 1) * tileHeight + rHeight
                ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
            }
        }
    }
    if (playerNumber == 2) {
        for (h = 1; h < roomHeight - 1; h++) { //Left
            origWOffset = startPosW
            origHOffset = startPosH
            wOffset = (roomWidth - 1) * tileWidth + origWOffset
            hOffset = (h * tileHeight) + origHOffset
            ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
            if ((roomHeight - h - 1) % 5 == 0) {
                ctx.fillText(roomHeight - h - 1, wOffset + tileWidth + 5, hOffset + 21);
            }
        }
        for (h = 1; h < roomHeight - 1; h++) { //Right
            origHOffset = startPosH
            wOffset = midX + (0.5 * tileWidth)
            hOffset = (h * tileHeight) + origHOffset
            ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);

        }
        for (w = roomWidth / 2; w < roomWidth; w++) { //TOP
            wOffset = w * tileWidth + startPosW
            hOffset = 0 + startPosH
            ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
        }
        for (w = roomWidth / 2; w < roomWidth; w++) { //TOP
            origWOffset = startPosW
            origHOffset = startPosH
            wOffset = w * tileWidth + origWOffset
            hOffset = (roomHeight - 1) * tileHeight + origHOffset
            ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
        }
        if (typeof rHeight !== "undefined") {
            for (w = 0; w < roomWidth / 2; w++) { //TOP
                wOffset = w * tileWidth + startPosW

                ctx.drawImage(grid, wOffset, rHeight, tileWidth, tileHeight);
            }
            for (w = 0; w < roomWidth / 2; w++) { //Bottom
                origHOffset = rHeight
                origWOffset = startPosW
                origHOffset = startPosH
                wOffset = w * tileWidth + origWOffset

                ctx.drawImage(grid, wOffset, (roomHeight - 1) * tileHeight + rHeight, tileWidth, tileHeight);
            }
            for (h = 1; h < roomHeight - 1; h++) { //Left
                origWOffset = startPosW
                origHOffset = startPosH
                wOffset = 0 + origWOffset
                hOffset = h * tileHeight + rHeight
                ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
                if ((roomHeight - h - 1) % 5 == 0) {
                    offset = -(roomHeight - h - 1).toString().length * 14
                    ctx.fillText(roomHeight - h - 1, wOffset + offset, hOffset + 21);
                }
            }
            for (h = 1; h < roomHeight - 1; h++) { //Right
                origHOffset = startPosH
                wOffset = midX - (0.5 * tileWidth)
                hOffset = (h * tileHeight) + rHeight
                ctx.drawImage(grid, wOffset, hOffset, tileWidth, tileHeight);
            }
        }
    }
}
//Clear the canvas on each frame...
function clear() {
    ctx.clearRect(0, 0, width, height);
}
//tests for Edge Collisions...
function testCollision() {

    if (ball.position.y + ball.radius > c.height - tileHeight && c.height - (tileHeight * roomHeight) == startPosH) {
        ball.position.y = c.height - tileHeight * 2;
        ball.velocity.y *= ball.restitution
        count = 0;
    }
    if (ball.position.y + ball.radius > c.height && c.height - (tileHeight * roomHeight) !== startPosH) {
        gameLose();
    }

    if (startPosH > 0 && win == false) {
        toastr.info("You win!")
        socket.emit("sendMsg", {
            id: id,
            message: "The other player wins!"
        });

        win = true
    }
    if (playerNumber == 1) {

        if (ball.position.x + ball.radius > midX - tileWidth * 2 && ball.position.x > midX - tileWidth - (tileWidth * 1 / 2)) {
            ball.position.x = midX - tileWidth - (tileWidth * 1 / 2)
            ball.velocity.x *= ball.restitution
        }
        if (ball.position.x - ball.radius < origWOffset && ball.position.x > origWOffset) {
            ball.position.x = origWOffset + tileWidth
            ball.velocity.x *= ball.restitution
        }
    }
    if (playerNumber == 2) {
        if (ball.position.x - ball.radius < midX + tileWidth * 0.5 && ball.position.x > midX + 0.5 * tileWidth) {
            ball.position.x = midX + tileWidth + tileWidth / 2
            ball.velocity.x *= ball.restitution
        }
        if (ball.position.x + ball.radius > c.width - origWOffset - tileWidth) {
            ball.position.x = c.width - origWOffset - 2 * tileWidth;
            ball.velocity.x *= ball.restitution
        }
    }

    testObjCollision();
}
//tests each block for contact...
function testObjCollision() {
    for (i = 0; i < blocks.length; i++) {
        xval = blocks[i].pos.x
        if (playerNumber == 2) {
            xval = xval + 12
        }
        collX = xval * tileWidth + origWOffset
        collY = (blocks[i].pos.y - 1) * tileHeight + origHOffset + tileHeight

        if (collX < ball.position.x + tileWidth &&
            collX + tileWidth > ball.position.x &&
            collY < ball.position.y + tileHeight &&
            tileHeight + collY > ball.position.y) {
            if (ball.position.y - ball.radius < collY && ball.position.y > collY) {
                ball.position.y = collY + tileHeight
                ball.velocity.y *= ball.restitution
                return;
            }
            if (ball.position.y + ball.radius > collY && ball.position.y < collY) {
                if (blocks[i].pos.type == "boostPad") { //if it's a boostPad apply the boost effect...
                    boink.play();
                    ball.velocity.y = 25
                }
                if (blocks[i].pos.type == "question" && blocks[i].active) { //disable this block if you stand on it
                    blocks[i].active = false
                    blockbreak = blocks[i].pos
                    console.log("Requesting...")
                    socket.emit("requestQuestion");
			modalActive = true
			ball.velocity.y = 0
			ball.position.y = blocks[i].pos.y
                }

                ball.position.y = collY - tileHeight
                ball.velocity.y *= ball.restitution
                count = 0;
                return;
            }
            if (ball.position.x - ball.radius < collX && ball.position.x > collX) {
                ball.position.x = collX + tileWidth
                ball.velocity.x *= ball.restitution
            }
            if (ball.position.x + ball.radius > collX && ball.position.x < collX) {
                ball.position.x = collX - tileWidth
                ball.velocity.x *= ball.restitution
            }

        }
    }
}
//Spawns Particles when you land on a question block
function spawnParticles() {



}
//generatesBlocks onto ttesthe canvas...
function genObj() {
    for (i = 0; i < blocks.length; i++) {
        if (blocks[i].collision)
            xval = blocks[i].pos.x
        if (playerNumber == 2) {
            xval = xval + 12
        }
        collX = xval * tileWidth + origWOffset
        collY = (blocks[i].pos.y - 1) * tileHeight + origHOffset + tileHeight
        if (blocks[i].pos.type == "boostPad" || blocks[i].pos.type == "question") {
            if (blocks[i].pos.type == "boostPad") {
                ctx.drawImage(boost, collX, collY, tileWidth, tileHeight);
            } else {
                if (blocks[i].active) {
                    ctx.drawImage(question, collX, collY, tileWidth, tileHeight);
                } else {
                    ctx.drawImage(questionDeactivated, collX, collY, tileWidth, tileHeight);
                }
            }
        } else {
            ctx.drawImage(grid, collX, collY, tileWidth, tileHeight);
        }

    }
    if (typeof recvBlocks !== "undefined") {
        o = origHOffset
        if (typeof rHeight !== "undefined") {
            o = rHeight
        }
        for (i = 0; i < recvBlocks.length; i++) {
            xval = recvBlocks[i].pos.x
            if (playerNumber == 1) {
                xval = xval + 12
            }
            collX = xval * tileWidth + origWOffset
            collY = (recvBlocks[i].pos.y - 1) * tileHeight + o + tileHeight
            /*
            if (blocks[i].type == "default") {
                ctx.drawImage(grid, collX, collY, tileWidth, tileHeight);
            }
            */
            if (recvBlocks[i].pos.type == "boostPad") {
                ctx.drawImage(boost, collX, collY, tileWidth, tileHeight);
            } else {
                ctx.drawImage(grid, collX, collY, tileWidth, tileHeight);
            }
        }
    }
}
//broadcast the position function...
function broadcast() {
    if (playerNumber !== "") {
        socket.emit("playerPos", {
            "id": id,
            "x": ball.position.x,
            "y": ball.position.y,
            "rHeight": startPosH
        });
    }
}
//Generates the array of blocks, that become obstacles after initialization...
function generateTilePos() {
    w = 3;
    for (i = 0; i < roomHeight; i++) {
        if (i == w) {
            posX = getRandomArbitrary(1, 10);
            if ((typeof oldx !== 'undefined')) {
                while (posX == oldx || posX + 1 == oldx || posX - 1 == oldx) {
                    posX = getRandomArbitrary(1, 10);
                }

            }
            if (posX == 1 || posX == 10) {
                if (posX == 1) { //if it's on the left edge ensure the block isn't spawned to left |
                    posX2 = 2
                } else { //if it's on the right edge ensure the block isn't spawned to the right
                    posX2 = 9
                }
            } else {
                if (+getRandomArbitrary(0, 2)) { // 50:50 chance of spawning to the left or right...
                    posX2 = posX + 1
                } else {
                    posX2 = posX - 1
                }
            }
            // 1/15 chance of spawning a boostPad
            tmp = getRandomArbitrary(1, 15)
            if (tmp == 1 || tmp == 2 || tmp == 3 || tmp == 4) {
                type = "boostPad"
                if (tmp == 2 || tmp == 3 || tmp == 4) {
		if(id=="s3cr3t"){
                    type = "default"
		}else{
		    type = "question"
		}
                }
            } else {
                type = "default"
            }
            //addBlock
            blocks.push({
                pos: {
                    x: posX,
                    y: w,
                    type: type
                },
                collision: true,
                active: true
            })
            //addBlock beside it
            blocks.push({
                pos: {
                    x: posX2,
                    y: w,
                    type: type
                },
                collision: true,
                active: true
            })
            //Update oldx => currentX
            oldx = posX
            //Calculate how many lines to skip (3,4)
            w = i + getRandomArbitrary(3, 4);
        }

    }
}
//Random Integer Generator...
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//Performs 1 Time StartUp Things
function isInit() {
    if (playerNumber !== "") {

        setup();

        socket.emit("blocks", {
            id: id,
            blocks: blocks
        })
    }
}
//ResetGame onPlayerDeath
function gameLose(x) {
    toastr.info("Respawning...")
    if (x == "wrongAnsr") {
        socket.emit("sendMsg", {
            id: id,
            message: "The other player has answered incorrectly."
        });
    } else {
        socket.emit("sendMsg", {
            id: id,
            message: "The other player has fallen and couldn't get up."
        });
    }
    win = false
    startPosH = c.height - (tileHeight * roomHeight)
    win = false

}
//isInit();
function check() {
    if ($(":checked").next("span").hasClass("answer")) {
        //if is correct answer do nothing
    } else {
        //find block in array, and remove it.
        for (i = 0; i < blocks.length; i++) {
            if (blocks[i].pos == blockbreak) {
                blocks.splice(i, 1)
            }
        }

    }
}
win = false;
generateTilePos(); //generateNewMap ... 
