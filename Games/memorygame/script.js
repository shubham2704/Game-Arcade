/* Memory Game Project 
420-423-DW Internet AppsII - Teacher: L. Ruhlmannn
Dawson College Winter 2019 Section 02
Camillia Elachqar 1738572
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//App initialization
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
"use strict";
var gs = {}; //Global namespace

addEvent(window, 'load', init);
addEvent(window, 'load', preloadImgs);

function init() {
    //App constants
    gs.NbOfPixelsToArrangeLayout = 800;
    gs.pathToImgsStr = "images/";
    gs.topBgStrForAllCards = "sun-hi.png";

    gs.totalNbOfCards = 16;

    gs.smallestIdLetter = 'A';
    gs.largestIdLetter = 'P';
    gs.smallestIdLetterLowercase = 'a';
    gs.largestIdLetterLowercase = 'p';
    gs.beginningOfGridItemIdStr = 'grid-item-';

    //The game board has a background hidden image that will change every new game
    initGameBgs();

    //Arrange web page layout
    arrangeWebPageLayout();

    //Set app variables, game controls and console to pre-game
    setPreGame();

    //Add event listeners
    addEvent(window, 'resize', arrangeWebPageLayout);
    addEvent(document.getElementsByTagName("body")[0], "click", clickFn);
    addEvent(document, 'keyup', keyBoardFn);
}


function preloadImgs() {
    var srcStrArray = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg',
        'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg', gs.topBgStrForAllCards,
        'A.png', 'B.png', 'C.png', 'D.png', 'E.png', 'F.png', 'G.png',
        'H.png', 'I.png', 'J.png', 'K.png', 'L.png', 'M.png', 'N.png',
        'O.png', 'P.png', 'stop2.jpg', 'playagain2.jpg', 'play2.jpg',
        'cartoon-sun-light.jpg', 'chick_baby_cute_easter_blue.png',
        'brown-bird.jpg', 'pink-silly-bird.jpg', 'branch-bird.png', 'yellow-birds.jpg'
    ];

    for (var i = 0; i < srcStrArray.length; i++) {
        var img = new Image();
        img.src = gs.pathToImgsStr.concat(srcStrArray[i]);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Game States
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Set game variables
function initGameVariables() {
    gs.cardSelected1 = null;
    gs.cardSelected2 = null;

    gs.nbOfCardsOnBoard = gs.totalNbOfCards;

    gs.AreCardsSelectable = false;
    gs.isGameStarted = false;

    gs.isPlayControlEnabled = true;
    gs.isStopControlEnabled = false;
    gs.isPlayAgainControlEnabled = false;
}

function setPreGame() {
    //Make sure all app variables are reset 
    initGameVariables();

    //Init cards in card array
    initCardArray();

    //Set controls and game console
    enableControl("play");
    disableControl("stop");
    disableControl("playagain");
    displayMsgToGameConsole("Press  <img class=\"mini-controls\" src=\"images/play2.jpg\"> to start the game!");
}

function setToGame() {
    //Make sure all app variables are reset
    initGameVariables();

    //Randomly assign game images to grid items of the board grid and display top images
    setGameImgsAndInitCardFields();

    //Set hidden background image behind cards
    setGameBg();

    //Set controls and game console
    disableControl("play");
    enableControl("stop");
    enableControl("playagain");
    displayMsgToGameConsole("Try matching pairs to reveal the hidden image!");

    //Make cards selectable for Game
    gs.AreCardsSelectable = true;
    gs.isGameStarted = true;
}

function setToNewGame() {
    incrementGameBgNb();
    setToGame();
    displayMsgToGameConsole("You restarted a game! Try matching pairs to reveal the hidden image!");
}

function setToStopGame() {
    removeAllCards();
    disableControl("play");
    disableControl("stop");
    enableControl("playagain");
    displayMsgToGameConsole("Press on <img class=\"mini-controls\" src=\"images/playagain2.jpg\"> to start a new game.");
    gs.AreCardsSelectable = false;
    gs.isGameStarted = false;
}

function setToGameWon() {
    setToStopGame();
    displayMsgToGameConsole("YOU WON!!! Good job!");
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Event handlers
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Function called when mouse click in window
function clickFn(event) {
    if (event == undefined) {
        throw "Invalid Argument";
    }
    if (event.defaultPrevented) {
        throw "Event prevented";
    }

    var idStr = event.target.id;

    //For PLAY button
    if (idStr === "play" && gs.isPlayControlEnabled) {
        setToGame();
    }

    //For PLAY AGAIN button
    else if (idStr === "playagain" && gs.isPlayAgainControlEnabled) {
        setToNewGame();
    }

    //For STOP button
    else if (idStr === "stop" && gs.isStopControlEnabled) {
        setToStopGame();
    }

    //For game cards clicked through the images within grid items with tags [A,P]
    else if (isIdLetterStrValid(idStr)) {
        cardSelectedHandler(idStr);
    }

    //For game cards clicked through grid items with tags [grid-item-A, grid-item-P]
    else if (isGridItemIdValid(idStr)) {
        cardSelectedHandler(idStr.charAt(gs.beginningOfGridItemIdStr.length));
    }
}

//Function called when "keyup" event
function keyBoardFn(event) {
    if (event == undefined) {
        throw "Invalid Argument";
    }
    if (event.defaultPrevented) {
        throw "Event prevented";
    }

    var key = event.key || event.keyCode || event.code; //key will hold either a char or the unicode of the char or the keycode of the key pressed

    //For every letter from A, B, ... P and a, b, c ... p, 
    //check if key = to those characters or to their unicodes or to their keyboard codes
    var char1 = gs.smallestIdLetter;
    var char2 = gs.smallestIdLetterLowercase;
    for (char1 = gs.smallestIdLetter; char1.charCodeAt(0) <= gs.largestIdLetter.charCodeAt(0); char1 = String.fromCharCode(char1.charCodeAt(0) + 1),
        char2 = String.fromCharCode(char2.charCodeAt(0) + 1)) {
        //If key holds a char between "A" and "P" or "a" and "p"
        if (key == char1 || key == char2) {
            cardSelectedHandler(char1);
            break;
        }
        //If key holds the unicode of a char between "A" and "P" or "a" and "p"
        else if (key == char2.charCodeAt(0) || key == char1.charCodeAt(0)) {
            cardSelectedHandler(String.fromCharCode(char1.charCodeAt(0)));
            break;
        }
        //If key holds the code of a keyboard key corresponding to "KeyA" to "KeyP"
        else if (key === "Key".concat(char1)) {
            cardSelectedHandler(char1);
            break;
        }
    }
}

function cardSelectedHandler(idLetStr) {
    if (idLetStr == undefined || !isIdLetterStrValid(idLetStr)) {
        throw "Invalid Argument";
    }
    if (!gs.AreCardsSelectable && !gs.isGameStarted) {
        alert("Press PLAY to start a game !");
    } else {
        var card = getCardWithLetterIdx(idLetStr);

        if (card.isOnBoardBool && !card.isTurnedBool && gs.AreCardsSelectable) {
            //If its the 1st selected card
            if (gs.cardSelected1 == null) {
                gs.cardSelected1 = card;
                card.showGameImg();
            }

            //If its the second selected card
            else {
                gs.cardSelected2 = card;
                card.showGameImg();
                gs.AreCardsSelectable = false;
                //If cards match
                if (card.gameImageStr === gs.cardSelected1.gameImageStr) {
                    displayMsgToGameConsole("You found a pair!");
                    window.setTimeout(removeSelectedCards, 1000);
                }
                //If cards dont match
                else {
                    card.showGameImg();
                    displayMsgToGameConsole("Oups try again!");
                    disableControl("playagain");
                    disableControl("stop");
                    window.setTimeout(hideSelectedCards, 1500); //reenables control
                }
            }
        }
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Game Board Display
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Initialize card sin card array and set top image of cards in Game Board
function initCardArray() {
    gs.cardArray = [];

    var letter = 'A';
    for (var i = 0; i < gs.totalNbOfCards; i++) {
        gs.cardArray[i] = new Card(letter);

        //Second, set top image on game board in web page
        gs.cardArray[i].showTopImg();

        letter = String.fromCharCode(letter.charCodeAt() + 1); //increment letter from A, B, ... P
    }
}

//Set game images of cards in Game Board
function setGameImgsAndInitCardFields() {
    var imgSrcArray = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg',
        'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg',
        'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg',
        'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg'
    ];

    var letter = 'A';
    var randomIdx = 0;
    for (var i = 0; i < gs.totalNbOfCards; i++) {
        //First assign random game image
        do {
            randomIdx = Math.floor(Math.random() * imgSrcArray.length); //gives a random index for the imgSrcArray
        } while (imgSrcArray[randomIdx] == undefined);

        gs.cardArray[i].setGameImg(imgSrcArray[randomIdx]);
        delete imgSrcArray[randomIdx]; //changes it to undefined once image assigned

        //Second, set top image on game board in web page
        gs.cardArray[i].initCardFields();
        gs.cardArray[i].showTopImg();

        letter = String.fromCharCode(letter.charCodeAt() + 1); //increment letter from A, B, ... P
    }
}

function hideSelectedCards() {
    disableControl("playagain");
    disableControl("stop");

    gs.cardSelected1.showTopImg();
    gs.cardSelected2.showTopImg();
    gs.cardSelected1 = null;
    gs.cardSelected2 = null;
    gs.AreCardsSelectable = true;

    enableControl("playagain");
    enableControl("stop");
}

function removeSelectedCards() {
    gs.cardSelected1.removeFromBoard();
    gs.cardSelected2.removeFromBoard();
    gs.cardSelected1 = null;
    gs.cardSelected2 = null;
    gs.AreCardsSelectable = true;
    gs.nbOfCardsOnBoard = gs.nbOfCardsOnBoard - 2;
    if (gs.nbOfCardsOnBoard == 0) {
        setToGameWon();
    }
}

function removeAllCards() {
    for (var i = 0; i < gs.cardArray.length; i++) {
        if (gs.cardArray[i] == undefined) {
            throw 'Unexpected undefined element in cards array';
        }
        gs.cardArray[i].removeFromBoard();
    }
} //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Game Board Background Display
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initGameBgs() {
    gs.gameBgSrcArray = ['pink-silly-bird.jpg', 'chick_baby_cute_easter_blue.png',
        'brown-bird.jpg', 'branch-bird.png', 'yellow-birds.jpg'
    ];
    gs.gameBgNb = 0;

}

function incrementGameBgNb() {
    if (gs.gameBgNb == 4) {
        gs.gameBgNb = 0;
    } else {
        gs.gameBgNb++;
    }
}

function setGameBg() {
    document.getElementById('grid-container').style.backgroundImage = "url('" + gs.pathToImgsStr + gs.gameBgSrcArray[gs.gameBgNb] + "')";

    if (gs.gameBgSrcArray[gs.gameBgNb] == 'chick_baby_cute_easter_blue.png') {
        document.getElementById('grid-container').style.backgroundSize = "450px";
    } else if (gs.gameBgSrcArray[gs.gameBgNb] == 'brown-bird.jpg') {
        document.getElementById('grid-container').style.backgroundSize = "525px";
    } else {
        document.getElementById('grid-container').style.backgroundSize = "600px";
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Webpage Layout, Game Control Display, Game Console Display
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function arrangeWebPageLayout() {
    if (window.innerWidth < gs.NbOfPixelsToArrangeLayout) {
        document.getElementsByTagName('header').innerHTML = '<h1>MEMORY<br>GAME</h1>';
        document.getElementsByTagName('header')[0].style.height = '250px';
        document.getElementById('howto-section').style.width = '70%';
    } else {
        document.getElementsByTagName('header').innerHTML = '<h1>MEMORY GAME</h1>';
        document.getElementsByTagName('header')[0].style.height = '125px';
        document.getElementById('howto-section').style.width = '40%';
    }
}

function displayMsgToGameConsole(msgStr) {
    if (msgStr == undefined || (typeof msgStr != "string")) {
        throw "Invalid Argument";
    }
    document.getElementById("game-console").innerHTML = msgStr;
}

function disableControl(idStr) {
    if (idStr == undefined || !(idStr === "play" || idStr === "playagain" || idStr === "stop") || (typeof idStr != "string")) {
        throw "Invalid Argument";
    }
    document.getElementById(idStr).style.opacity = '0.3';
    document.getElementById(idStr).style.filter = 'alpha(opacity = 30)';
    if (idStr === "play") {
        gs.isPlayControlEnabled = false;
    } else if (idStr === "playagain") {
        gs.isPlayAgainControlEnabled = false;
    } else if (idStr === "stop") {
        gs.isStopControlEnabled = false;
    }
}

function enableControl(idStr) {
    if (idStr == undefined || !(idStr === "play" || idStr === "playagain" || idStr === "stop") || (typeof idStr != "string")) {
        throw "Invalid Argument";
    }
    document.getElementById(idStr).style.opacity = '1';
    document.getElementById(idStr).style.filter = '';
    if (idStr === "play") {
        gs.isPlayControlEnabled = true;
    } else if (idStr === "playagain") {
        gs.isPlayAgainControlEnabled = true;
    } else if (idStr === "stop") {
        gs.isStopControlEnabled = true;
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Class "Card"
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Top of a card: Image of class "letter" with a background (that is the same for all)
//Bottom of a card: Image of game
//When card is on board 
//3 states
//isOnBoard && !isTurned = initial state, game image is not visible
//isOnBoard && isTurned = when selected, game image is visible
//!isOnBoard = card have been matched and is not on board anymore
function Card(idLetterStr) {
    if (idLetterStr == undefined || !isIdLetterStrValid(idLetterStr)) {
        throw 'Invalid Argument for Card constructor';
    }
    this.idLetterStr = idLetterStr;
    this.gameImageStr = "";
    this.isTurnedBool = false;
    this.isOnBoardBool = true;

    this.setGameImg = function (gameImageStr) {
        if (gameImageStr == undefined) {
            throw 'Invalid Argument';
        }
        this.gameImageStr = gameImageStr;
    };
    this.getGridItemId = function () {
        return ('grid-item-' + this.idLetterStr);
    };
    this.initCardFields = function () {
        this.isTurnedBool = false;
        this.isOnBoardBool = true;
    };
    this.showGameImg = function () {
        if (this.isOnBoardBool === false) {
            throw "Error";
        }
        document.getElementById(this.getGridItemId()).innerHTML = '<img id=\"' + this.idLetterStr + '\" src=\"images/' + this.gameImageStr + '\"></img>';
        this.isTurnedBool = true;
    };

    this.showTopImg = function () {
        if (this.isOnBoardBool) {
            document.getElementById(this.getGridItemId()).innerHTML = '<img class=\"letter\" id=\"' + this.idLetterStr + '\" src=\"images/' + this.idLetterStr + '.png\">';
            document.getElementById(this.getGridItemId()).style.backgroundColor = "whitesmoke";
            document.getElementById(this.getGridItemId()).style.backgroundImage = "url('" + gs.pathToImgsStr + gs.topBgStrForAllCards + "')";
            this.isTurnedBool = false;
        }
    };

    this.removeFromBoard = function () {
        document.getElementById(this.getGridItemId()).innerHTML = "";
        document.getElementById(this.getGridItemId()).style.backgroundImage = "none";
        document.getElementById(this.getGridItemId()).style.backgroundColor = "transparent";
        this.isTurnedBool = null;
        this.isOnBoardBool = false;
    };
}

function isIdLetterStrValid(idLetterStr) {
    if (idLetterStr == undefined || (typeof idLetterStr != "string")) {
        throw "Error";
    }
    return (idLetterStr.length === 1 &&
        idLetterStr.charCodeAt(0) >= gs.smallestIdLetter.charCodeAt(0) &&
        idLetterStr.charCodeAt(0) <= gs.largestIdLetter.charCodeAt(0));
}

function getCardWithLetterIdx(idLetStr) {
    if (idLetStr == undefined || !isIdLetterStrValid(idLetStr)) {
        throw "Invalid Argument";
    }
    var idxOfCardInArray = idLetStr.charCodeAt(0) - gs.smallestIdLetter.charCodeAt(0);
    return gs.cardArray[idxOfCardInArray];
}

function isGridItemIdValid(idStr) {
    if (idStr == undefined || (typeof idStr != "string")) {
        throw "Error";
    }
    return (idStr.length == (gs.beginningOfGridItemIdStr + 'A').length &&
        idStr.charCodeAt(gs.beginningOfGridItemIdStr.length) >= gs.smallestIdLetter.charCodeAt(0) &&
        idStr.charCodeAt(gs.beginningOfGridItemIdStr.length) <= gs.largestIdLetter.charCodeAt(0));
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Other Helper Methods
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addEvent(obj, type, fn) {
    if (obj == undefined || type == undefined || fn == undefined || typeof type != "string") {
        throw 'Invalid Argument';
    }
    if (obj && obj.addEventListener) { // W3C
        obj.addEventListener(type, fn, false);
    } else if (obj && obj.attachEvent) { // Older IE 
        obj.attachEvent('on' + type, fn);

    }
}