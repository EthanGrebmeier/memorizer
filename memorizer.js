
let gameSpace = document.getElementById("game_space");
let start = document.getElementById('start');
let title = document.getElementById('title');
let squareCount = document.getElementById('square_count');
let highScore = document.getElementById('high_score');
let liveCount = document.getElementById('live_count');

let level = 1;

let cols = 9;
let rows = 4;

let pickList = [];

let gameArray = [];
let selectedArray = [];

let selected = 2;
let lives = 3;

let clickable = false;
let clicked = 0;

let play = true;

let clickList = [];

class Square {
    constructor(x, y, element){
        this.x = x;
        this.y = y;
        this.element = element;
        this.selected = false;
        this.clicked = false;
        element.style.background = "#43eb8a";
        element.onclick = function(){
            if (clickable){
                if (this.clicked){
                    gameArray[x][y].clicked=false;
                    this.clicked = false;
                    element.style.background = "#43eb8a";
                    clicked -= 1;
                } else if (clicked < (level+1)) {
                    gameArray[x][y].clicked=true;
                    this.clicked = true;
                    element.style.background = "#83a2ff";
                    clicked += 1;
                }

                squareCount.innerText = selected - clicked;
            }
        };
    }
}


function initialize(){
    try {
        highScore.innerText = localStorage.getItem('highScore');
    } catch (e) {
        localStorage.setItem('highScore', 0);
        highScore.innerText = "0";

    }

    for (let row = 0; row <= rows; row++){
        gameArray.push([]);
        for (let col = 0; col <= cols; col++){
            let square = document.createElement("span");
            square.classList.add("square");
            gameSpace.appendChild(square);
            gameArray[row].push(new Square(row, col, square));
        }
    }

}

function picker(){
    pickList = [];
    for (let i = 0; i < selected; i++){
        let choice = getRandomInt((cols + 1) *(rows+1));
        while (pickList.includes(choice)){
            choice = getRandomInt((cols + 1) *(rows+1));
        }
        pickList.push(choice);
    }
    return pickList;
}

function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

start.onclick = function() {

    if (play){
        liveCount.innerText = lives;
        highScore.innerText = localStorage.getItem('highScore');
        title.innerText =  `Level ${level}`;
        squareCount.innerText = selected;
        pickList = picker();
        selectedArray = [];
        for (let pick = 0; pick < pickList.length; pick++ ){

            let picked = gameArray[Math.floor(pickList[pick] / 10)][(pickList[pick] % 10)];

            picked.selected = true;
            picked.element.style.background = "#83a2ff";
            selectedArray.push(picked.x.toString() + picked.y.toString());
        }
        start.disabled = true;
        start.classList.remove('start');
        start.classList.add('disabled');
        setTimeout(function(){
            rainbow();
        }, 3000);
        setTimeout(function(){
            clickable = true;
            start.classList.remove('disabled');
            start.classList.add('submit');
            start.innerText = "Submit";
            play = false;
            start.disabled = false;
        }, 4500);


    } else {

        for(let curRow=0; curRow <= rows; curRow++){
            for(let curCol=0; curCol <= cols; curCol++){
                let checked = gameArray[curRow][curCol];
                if (checked.clicked){
                    clickList.push(checked.x.toString() + checked.y.toString());
                }

            }
        }

        clickList = clickList.sort();
        selectedArray = selectedArray.sort();

        if(comparer(clickList, selectedArray)){
            levelEnd();
        } else {
            lives -= 1;
            liveCount.innerText = lives;
        }

        if (lives == 0){
            gameEnd();
        }
        clickList = [];
    }
};

function comparer(list1, list2){
    if(list1.length == list2.length){
        for (let item = 0; item < clickList.length; item++) {
            if ((list1[item] != list2[item])) {
                return false;
            }
        }
        return true;
    }
}


function rainbow(){
    let colorArray = ["#eb0305", "#eb8527", "#ebe744", "#6ceb58", "#ebe744", "#9e79eb", "#eb4fbd", "#43eb8a"];
    for (let color = 0; color <= colorArray.length; color++) {
        for (let col = 0; col <= cols; col++) {
            setTimeout(function () {
                colColorChange(colorArray[color], col);
                colFlipAnimation(col)
            }, (50) * col + (color * 100) );
        }
    }
}

function colColorChange(color, col){
    for (let i = 0; i <= rows; i++){
        gameArray[i][col].element.style.background = color;
    }
}

function colFlipAnimation(col){
    for (let i = 0; i <= rows; i++){
        gameArray[i][col].element.classList.add('square_animate');
    }
}

function changeAll(color){
    for(let curCol=0; curCol <= cols; curCol++){
        for (let i = 0; i <= rows; i++){
            gameArray[i][curCol].element.style.background = color;
        }
    }
}

function removeClass(removed){
    for(let curCol=0; curCol <= cols; curCol++){
        for (let i = 0; i <= rows; i++){
            gameArray[i][curCol].element.classList.remove(removed);
        }
    }
}

function levelEnd(){
    title.innerText =  "Congratulations!";
    if (level > localStorage.getItem('highScore')){
        localStorage.setItem('highScore', level);
        highScore.innerText = localStorage.getItem('highScore')
    }
    lives = 3;
    start.disabled = true;
    start.classList.remove("submit");
    start.classList.add("disabled");
    changeAll("#eb8527");
    removeClass('square_animate');
    setTimeout(function(){
        changeAll("#9e79eb");
    },500);
    setTimeout(function(){
        changeAll("#eb8527");
    },1000);
    setTimeout(function(){
        changeAll("#9e79eb");
    },1500);
    setTimeout(function(){
        toIntermission();
    }, 2000);
}


function toIntermission(){
    clickable = false;
    start.classList.remove("disabled");
    start.classList.add("start");
    start.disabled = false;
    start.innerText = "Continue?";
    start.classList.add("start");
    level += 1;
    selected += 1;
    clicked = 0;
    for (let r = 0; r <= rows; r++){
        for (let c = 0; c <=cols; c++){
            let sq = gameArray[r][c];
            sq.selected = false;
            sq.clicked = false;
        }
    }
    play = true;
    changeAll("#43eb8a");
}

function gameEnd(){
    start.disabled = true;
    clickable = false;
    start.classList.remove("submit");
    start.classList.add("disabled");
    title.innerText = "Game Over!"
    for (let r = 0; r <= rows; r++){
        for (let c = 0; c <=cols; c++){
            console.log(gameArray[r][c]);
            if(gameArray[r][c].selected &! gameArray[r][c].clicked){
                gameArray[r][c].element.style.background = "#e5e33e";
            }
            if( gameArray[r][c].clicked &!  gameArray[r][c].selected){
                gameArray[r][c].element.style.background = "#43eb8a";
            }
        }
    }
    setTimeout(function(){
        changeAll("#eb4132");
    },1500);
    setTimeout(function(){
        changeAll("#000000");
    },2000);
    setTimeout(function(){
        changeAll("#eb4132");
    },2500);
    setTimeout(function(){
        resetGame();
    },3000);
}

function resetGame(){
    for (let r = 0; r <= rows; r++){
        for (let c = 0; c <=cols; c++){
            let sq = gameArray[r][c];
            sq.selected = false;
            sq.clicked = false;
        }
    }
    start.classList.remove("disabled");
    start.classList.add("start");
    start.disabled = false;
    start.innerText = "Start"
    changeAll("#43eb8a");
    play = true;
    selected = 2;
    lives = 3;
    level = 1;
    clicked = 0;

}

document.addEventListener("load", initialize());




