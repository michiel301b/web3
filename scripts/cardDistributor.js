let standardPossibleCards = ["▲", "■", "●", "⬟", "A", "B", "C", "D", "E", "F"];
let endLevelPossibleCards = ["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ","ψ","ω"]
let deckOfCards = []
const STARTING_DECK_SIZE = 2;
let endLevelCardAmount = 3;
let deckSize = 0;
let selected = [-1, -1]
let shuffledDeckOfCards = []
let solvedPairs = []
let uiLocked = false
let maxLives = 9 + (loadStuff().level || 1);
let livesLeft = maxLives
function initEventListeners() {
    document.getElementById("confirm-choice").addEventListener("click", nextLevel)
    document.getElementById("end-game-button").addEventListener("click", endGame)
    on("levelUp", () => {
        document.getElementsByClassName("level-text-game")[0].classList.add("levelup");
        setTimeout(() => {
            document.getElementsByClassName("level-text-game")[0].classList.remove("levelup");
        }, 10000);
    })
}

function shuffleDeckOfCards(deckOfCards) {
    shuffledDeckOfCards = deckOfCards.concat(deckOfCards)
    for (let i = 0; i < shuffledDeckOfCards.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeckOfCards[i], shuffledDeckOfCards[j]] = [shuffledDeckOfCards[j], shuffledDeckOfCards[i]];
    }
    return shuffledDeckOfCards;
}

function generateHearts() {
    let heartcontainer = document.getElementsByClassName("heart-container")[0];
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement("img");
        heart.id = `heart${i}`;
        heart.className = "heart";
        heart.src = "https://pics.clipartpng.com/midle/Heart_Shape_PNG_Clipart-3166.png";
        heart.alt = "heart icon"
        if (i + 1 > livesLeft) {
            heart.classList.add("broken");
        }
        heartcontainer.appendChild(heart);
    }

    if (livesLeft > 10) {
        const extra = document.createElement("span")
        extra.id = "extra"
        extra.textContent = `+${livesLeft - 10}`
        heartcontainer.appendChild(extra)
    }
}

function generateCardHtml(){
    shuffledDeckOfCards = shuffleDeckOfCards(deckOfCards);
    console.log(shuffledDeckOfCards);
    let cardholder = document.getElementById("card-holder");
    for (let i = 0; i < shuffledDeckOfCards.length; i++) {

        let card = document.createElement("div");
        card.classList.add("card");
        card.id = "card-" + i;

        card.addEventListener("click",  () => {
            cardClick(card.id);
        });

        let p = document.createElement("p");
        card.appendChild(p);
        cardholder.appendChild(card);
    }
}

function startGame() {
    if (deckSize === 0) {
        deckSize = STARTING_DECK_SIZE
        deckOfCards = []
    }
    while(deckOfCards.length < deckSize) {
        deckOfCards.push(standardPossibleCards[deckOfCards.length]);
    }
    generateCardHtml();
    generateHearts();
    document.getElementById("startGameButton").classList.add("hidden")
    document.getElementById("restartGameButton").classList.remove("hidden");
}

function resetLevel() {
    document.getElementById("card-holder").innerHTML = "";
    document.getElementsByClassName("heart-container")[0].innerHTML = "";
    solvedPairs = [];
    selected = [-1, -1];
    uiLocked = false;
    //deckSize += 1;
    startGame();
}

function resetGame() {
    document.getElementById("card-holder").innerHTML = "";
    document.getElementsByClassName("heart-container")[0].innerHTML = "";
    deckOfCards = [];
    solvedPairs = [];
    selected = [-1, -1];
    uiLocked = false;
    deckSize = 0;
    healAllHearts();
    startGame();
}

function cardClick(id){
    if (uiLocked || document.getElementById(id).classList.contains("solved-card")) {
        return;
    }
    let cardId = id.slice(5) // removes "card-" from the element id
    console.log("clicked" + cardId + ", selected = " + selected);
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
        uiLocked = true;
        if (checkMatchResult === ""){
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
            post("cardSolved");
            setTimeout(function(){uiLocked = false}, 400);
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

function levelDone() {
    let cardSelector = document.getElementById("level-complete-card-selector")
    cardSelector.innerHTML = "";
    let indexListOfNewCards = []
    for (let i = 0; i < endLevelCardAmount; i++) {
        let randomIndex = Math.floor(Math.random() * endLevelPossibleCards.length)
        while (indexListOfNewCards.includes(endLevelPossibleCards[randomIndex])){
            randomIndex = Math.floor(Math.random() * endLevelPossibleCards.length);
        }
        indexListOfNewCards[i] = randomIndex;
        let card = document.createElement("input");
        card.classList.add("card");
        card.id = "selector-card-" + indexListOfNewCards[i];
        card.type = "radio";
        card.name = "card-selector";
        card.classList.add("card-selector");

        let label = document.createElement("label");
        label.htmlFor = "selector-card-" + indexListOfNewCards[i];
        label.classList.add("card-selector-label");
        label.innerText = endLevelPossibleCards[indexListOfNewCards[i]];


        card.addEventListener("change", (event)=> {
            console.log("clicked" + event.target.id);
            let explanation = document.getElementById("level-complete-card-explanation");
            explanation.innerText = event.target.value;
        })

        cardSelector.appendChild(card);
        cardSelector.appendChild(label);

    }
    post("levelCompleted")
    document.getElementById("card-container").classList.add("blurred");
    document.getElementById("blurscreen").classList.remove("hidden");

}

function nextLevel() {
    document.getElementById("card-container").classList.remove("blurred");
    document.getElementById("blurscreen").classList.add("hidden");
    let selectedCard = document.querySelector('input[name="card-selector"]:checked');
    console.log(selectedCard.id)
    let temp = endLevelPossibleCards.splice(selectedCard.id.slice(14),1)

    deckOfCards.push(temp[0])
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
    if (livesLeft > 10) {
        let text = document.getElementById("extra");
        text.textContent = `+${livesLeft - 10}`
        return
    }
    if (maxLives > 10 && livesLeft === 10) {
        let text = document.getElementById("extra");
        text.remove()
    }
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

initEventListeners()
