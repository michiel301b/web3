let standardPossibleCards = ["▲", "■", "●", "⬟", "A", "B", "C", "D", "E", "F"];
let deckOfCards = []
const STARTING_DECK_SIZE = 4;
let deckSize = 0;
let selected = [-1, -1]
let shuffledDeckOfCards = []
let solvedPairs = []
let uiLocked = false
let maxLives = 10
let livesLeft = maxLives

function shuffleDeckOfCards(deckOfCards) {
    shuffledDeckOfCards = deckOfCards.concat(deckOfCards)
    for (let i = 0; i < shuffledDeckOfCards.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeckOfCards[i], shuffledDeckOfCards[j]] = [shuffledDeckOfCards[j], shuffledDeckOfCards[i]];
    }
    return shuffledDeckOfCards;
}

function generateCardHtml(){
    shuffledDeckOfCards = shuffleDeckOfCards(deckOfCards);
    console.log(shuffledDeckOfCards);
    let cardholder = document.getElementById("card-holder");
    for (let i = 0; i < shuffledDeckOfCards.length; i++) {
        cardholder.innerHTML += "<div class='card' onclick='cardClick(id)' id='card-"+i+"'>" +
            "<p></p>" +
            "</div>";
    }
}

function startGame() {
    if (deckSize === 0) {
        deckSize = STARTING_DECK_SIZE
    }
    while(deckOfCards.length < deckSize) {
        deckOfCards.push(standardPossibleCards[deckOfCards.length]);
    }
    generateCardHtml();
    document.getElementById("startGameButton").classList.add("hidden")
    document.getElementById("restartGameButton").classList.remove("hidden");
}

function resetLevel() {
    document.getElementById("card-holder").innerHTML = "";
    solvedPairs = [];
    selected = [-1, -1];
    uiLocked = false;
    deckSize += 1;
    startGame();
}

function cardClick(id){
    if (uiLocked || document.getElementById(id).classList.contains("solved-card")) {
        return;
    }
    let cardId = id.slice(5) // removes "card-" from the element id
    console.log("clicked", cardId, ", selected = ", selected);
    if (cardId === selected[0] || cardId === selected[1]) {
        return;
    }else if (selected[0] === -1) {
        selected[0] = cardId;
    }
    else if (selected[1] === -1) {
        selected[1] = cardId;
    }
    flipCard(id, cardId);
    console.log("flipped card " + cardId + ", selected = " + selected);
    if (selected[1] >= 0) {
        let checkMatchResult = checkMatch()
        if (checkMatchResult === ""){
            uiLocked = true;
            setTimeout(function(){resetCard(selected[0]);
                resetCard(selected[1]);
                breakHeart()
                uiLocked = false;
                selected = [-1, -1];}, 2000);
        }
        else {
            solvedPairs.push(checkMatchResult);
            setCardSolved(selected[0]);
            setCardSolved(selected[1]);
            selected = [-1, -1];
        }

        if(solvedPairs.sort().join("") === deckOfCards.sort().join("")) {
                levelDone();
            }
        }
    //alert(cardId)
}

function endGame() {
    setTimeout(
        window.location.href = "home_page.html",1);
}

function resetGame() {
    document.getElementById("card-holder").innerHTML = "";
    deckOfCards = [];
    solvedPairs = [];
    selected = [-1, -1];
    uiLocked = false;
    deckSize = 0;
    livesLeft = maxLives;
    startGame();
}

function levelDone() {
    document.getElementById("card-container").classList.add("blurred");
    document.getElementById("blurscreen").classList.remove("hidden");
}

function nextLevel() {
    document.getElementById("card-container").classList.remove("blurred");
    document.getElementById("blurscreen").classList.add("hidden");
    resetLevel();
}

function checkMatch(){
    if(shuffledDeckOfCards.length > 0){
        if(shuffledDeckOfCards[selected[0]] === shuffledDeckOfCards[selected[1]]){
            return shuffledDeckOfCards[selected[0]];
        }
    }
    return "";
}

function flipCard(id, cardId){
    let cardElement = document.getElementById(id);
    cardElement.style.animation = "none";
    cardElement.offsetHeight; //You apparently need this otherwise it will optimize the animation away
    cardElement.style.animation = "card-flip 0.8s ease-in-out forwards";
    setTimeout(function(){cardElement.innerHTML = "<p>"+shuffledDeckOfCards[cardId]+"</p>"},400);
}

function resetCard(cardId){
    let cardElement = document.getElementById("card-" + cardId);
    cardElement.style.animation = "none";
    cardElement.offsetHeight; //You apparently need this otherwise it will optimize the animation away
    cardElement.style.animation = "card-flip 0.8s ease-in-out backwards";
    setTimeout(function(){cardElement.innerHTML = "<p></p>"},400);
}

function setCardSolved(cardId){
    let cardElement = document.getElementById("card-" + cardId);
    setTimeout(function(){cardElement.className = cardElement.className + " solved-card"},400);
}

function breakHeart() {
    livesLeft -= 1;
    let breakingHeart = document.getElementById("heart"+livesLeft);
    if (breakingHeart){
        breakingHeart.className += " broken";
    }
    if (livesLeft <= 0){
        setTimeout(function(){alert("Game Over");
        window.location.href = "home_page.html";},1000);
    }
}

function healAllHearts() {
    while (livesLeft < maxLives) {
        healHeart();
    }
}

function healHeart() {
    if (livesLeft >= maxLives) return;
    let heartToHeal = document.getElementById("heart"+livesLeft);
    livesLeft += 1;
    heartToHeal.classList.remove("broken");
}