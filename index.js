//initializing id's
mycan = document.getElementById('mycanvas');
scoreCanvas = document.getElementById('score')

// initializing the height and width
width = mycan.getAttribute('width')
height = mycan.getAttribute('height')
scorewidth = scoreCanvas.getAttribute('width')
scoreheight = scoreCanvas.getAttribute('height')

// getting context as 2d for both dashboard and score card
ctx = mycan.getContext('2d')
scorectx = scoreCanvas.getContext('2d')

//initializing some varaible used further
var pause=false;
// making pause and resume btn none initially
document.getElementById('pauseBtn').style.display='none';
document.getElementById('resumeBtn').style.display='none';
document.getElementById('replayBtn').style.display='none';
document.getElementById('quitBtn').style.display='none';

function start() {
    reset()
    callBack()
    document.getElementById('score').style.display='block';
    document.getElementById('playBtn').style.display='none';
    document.getElementById('body').style.background='none';
    document.getElementById('quitBtn').style.display='block';

}

var intervalstop;
// Making some Objects required here

const ball = {
    x: width / 2,
    y: height / 2,
    r: 5,
    speed: 7,
    vel_X: 5,
    vel_Y: 5,
    color: 'blue'
}
const seperator = {
    x: 0,
    y: (height - 2) / 2,
    width: width,
    height: 2,
    color: 'white'
}
const user = {
    x: width / 2 - 25,
    y: height - 10,
    width: 50,
    height: 10,
    color: '#00FF00',
    score: 0
}
const computer = {
    x: width / 2 - 25,
    y: 0,
    width: 50,
    height: 10,
    color: '#00FF00',
    score: 0
}

// make some fucntions to make rectangle ,circle and text in order to attain modularity

function makeRect(x, y, width, height, color) {
    //makes rectangle for game dashboard
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height)
}
function makeRectForScore(x, y, width, height, color) {
    //makes rectangle for score
    scorectx.fillStyle = '#4dffff';
    scorectx.fillRect(x, y, width, height)
}
function makeCircle(x, y, r, color) {
    //makes cicle for game dashboard
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath()
    ctx.fill()
}
function makeTextHead(text, x, y, color) {
    //makes text for score for header ie. big
    scorectx.fillStyle = color;
    scorectx.font = "30px Calibri";
    scorectx.fillText(text, x, y)
}
function makeText(text, x, y, color) {
    //make text for score for normal ie. small text
    scorectx.fillStyle = color;
    scorectx.font = "20px Calibri";
    scorectx.fillText(text, x, y)
}

function makeLineForScore(x1, y1, x2, y2, color) {
    //makes line for score
    scorectx.beginPath();
    scorectx.strokeStyle = color;
    scorectx.moveTo(x1, y1);
    scorectx.lineTo(x2, y2);
    scorectx.stroke();
}

function MakeComponents() {
    //So basically this is a method of class that is used to make all the components in the webpage needed for the game

    //making Game Dashboard
    //making the outer rectangle
    makeRect(0, 0, width, height, "black");
    //making the two rectangles for computer and user
    makeRect(user.x, user.y, user.width, user.height, user.color);
    makeRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    //making the seperator at center
    makeRect(seperator.x, seperator.y, seperator.width, seperator.height, seperator.color);
    //making a ball at center on seperator
    makeCircle(ball.x, ball.y, ball.r, ball.color)

    //making ScoreCard
    makeRectForScore(0, 0, scorewidth, scoreheight)
    makeTextHead('Score', scorewidth / 2 - scorectx.measureText('Score').width + 32, 20, 'black')
    makeText('Computer', scorewidth / 2 - scorectx.measureText('Computer').width, 54, 'black')
    makeText('Player', scorewidth / 2 + scorectx.measureText('Player').width, 54, 'black')
    makeTextHead(computer.score, scorewidth / 4, 100, 'black')
    makeTextHead(user.score, scorewidth / (4 / 3), 100, 'black')
    makeLineForScore(0, 30, scorewidth, 30, 'blue')
    makeLineForScore(0, 60, scorewidth, 60, 'blue')
    makeLineForScore(scorewidth / 2, 30, scorewidth / 2, scoreheight, 'blue')

}

function restart() {
    ball.x = width / 2;
    ball.y = height / 2;
    ball.vel_Y = -ball.vel_Y;
    ball.speed = 7;
}

function completed() {
    document.getElementById('mycanvas').style.display='none';
    clearInterval(intervalstop);
    document.getElementById('pauseBtn').style.display='none';
    document.getElementById('resumeBtn').style.display='none';
    document.getElementById('replayBtn').style.display='block';
}
function callBack() {
    //This function calls the MakeComponents function after every 50ms
    document.getElementById('mycanvas').style.display='block';
    document.getElementById('pauseBtn').style.display='block';
    intervalstop = setInterval(() => {
        if(user.score == 10  || computer.score == 10){
            if(user.score==10){
                alert('You Won');
                completed();
            }
            else{
                alert("You lost");
                completed();
            }
        }
        if(pause==true){
            MakeComponents()
        }
        else if(pause==false){
            setTimeout(() => {
                MakeComponents()
                updateBall(intervalstop)
            }, 30);
        }
    }, 40);
}

function moveUser(event) {
    //this is a fucntion that runs whenever the left arrow or right arrow keys are pressed inorder to move the block of user
    key = event.code;
    switch (key) {
        case "ArrowLeft":
            //checking collison with user block and box hence used if statement
            if (user.x > 0) {
                user.x = user.x - 25;
            }
            break;
        case "ArrowRight":
            //checking collison with user block and box hence used if statement
            if (user.x < width - user.width) {
                user.x = user.x + 25;
            }
            break;
    }
}
function stopInterval(intervalstop) {
    clearInterval(intervalstop);
}
function moveComp() {
    //This fucntion moves the computer in the way like he will never miss any ball if conditions kept same as written by me.
    if (ball.x - 10 < computer.x) {
        computer.x = computer.x - 15;
    }
    else if (ball.x + ball.r + 10 > computer.x + computer.width) {
        computer.x = computer.x + 15;
    }
}
function reset() {
    ball.x= width / 2,
    ball.y= height / 2,
    user.score=0;
    computer.score=0;
    ball.vel_X= 5,
    ball.vel_Y= 5,
    document.getElementById('replayBtn').style.display='none';
}
function updateBall(intervalstop) {
    //this function is generally used to move the ball and all activities related to collision
    moveComp()
    //making ball move in dowmward direction
    ball.x = ball.x - ball.vel_X;
    ball.y = ball.y - ball.vel_Y;
    //declaring some used variables
    user_top = user.y
    user_left = user.x
    user_right = user.x + user.width
    ball_top = ball.y - ball.r
    ball_left = ball.x - ball.r
    ball_right = ball.x + ball.r
    ball_bottom = ball.y + ball.r
    computer_bottom = computer.y + computer.height
    computer_left = computer.x
    computer_right = computer.x + computer.width

    function changeDirX() {
        // changes the direction of ball if colided with sides
        ball.vel_X = -ball.vel_X;
    }
    function changeDirY() {
        // changes the direction of ball if colided with top or bottom
        ball.vel_Y = -ball.vel_Y;
    }

    if ((ball_top <= computer_bottom && ball.x >= computer_left && ball.x <= computer_right) || (ball_bottom >= user_top && ball.x + ball.r >= user_left && ball.x - ball.r <= user_right)) {
        changeDirY()
        if ((ball_top <= computer_bottom && ball.x >= computer_left && ball.x <= computer_right)) {
            computer.score++
        }
        else if (ball_bottom >= user_top && ball.x + ball.r >= user_left && ball.x - ball.r <= user_right) {
            user.score++
        }
    }
    // once the ball collide with the side of table then the direction changes
    if (ball.x - ball.r <= 0 || ball.x + ball.r >= width) {
        changeDirX()
        updateBall(intervalstop)
    }
    //once if ball collides with the top or bottom of the table
    if (ball.y - ball.r <= 0 || ball.y + ball.r >= height) {
        if(ball.y - ball.r <= 0){user.score++}
        else{computer.score++}
        restart()
    }
}
function pauseIt() {
    // clearInterval(intervalstop)
    pause=true
    document.getElementById('pauseBtn').style.display='none';
    document.getElementById('resumeBtn').style.display='block';
}
function resumeIt() {
    // clearInterval(intervalstop)
    pause=false
    document.getElementById('resumeBtn').style.display='none';
    document.getElementById('pauseBtn').style.display='block';
}
function quitIt() {
    window.location = '/PingPongGame';
}
function forPhone(x) {
    if (x.matches) {
      document.getElementById('mycanvas').style.width='280px';
      document.getElementById('score').style.width='250px';
    }
  }
var x = window.matchMedia("(max-width: 420px)")
forPhone(x);
x.addEventListener('resize',forPhone);
