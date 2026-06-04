import {addSvg, getCardExplanation, getCardExplanations, setCallback} from "/web3/scripts/cardExplanations.js";


//let standardPossibleCards = ["▲", "■", "●", "⬟", "A", "B", "C", "D", "E", "F"];
//let endLevelPossibleCards = ["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ","ψ","ω"]
let selectedEndLevelCard = {}
let deckOfCards = []
const STARTING_DECK_SIZE = 2;
let endLevelCardAmount = 4;
let rareOdds = 0.05;
let specialOdds = 0.8;
let deckSize = 0;
let selected = [-1, -1]
let shuffledDeckOfCards = []
let solvedPairs = []
let uiLocked = false
let maxLives = 9 + (loadStuff().level || 1);
let livesLeft = maxLives
let sparkleIntervalIDs = [];


async function fetchIcons() {
    const allCards = getCardExplanations()
    let cards = []
    for (let item of allCards) {
        cards.push(item)
    }
    return await Promise.all(
        cards.map(async (card) => {
            const res = await fetch(card.imgSrc)
                .then(res => res.text())
            addSvg(card.card, res)
            return res
        })
    )
}

fetchIcons()//.finally(()=>{console.log("Done loading icons. End time: " + Date.now())})

function setAllCallbackFunctions(){
    setCallback("Heart",() => {healHeart();healHeart()},"onpair");
    setCallback("Hollow-Heart",() => healHeart(),"onpair");
    setCallback("Star",() => {post("bonusXP"); post("bonusXP")},"onpair");
    setCallback("Hollow-Star",() => post("bonusXP"),"onpair");
    setCallback("Duplicate",() => deckOfCards.push(getCardExplanation("Duplicate")),"onselect");
    setCallback("Washing-Machine",shuffleUnsolvedCards,"onpair");
    setCallback("Shredder", ()=>{},"onpair");
    setCallback("Magnet", () => {},"onshuffle");
    setCallback("Hollow-Crystal-Ball", () => {const unsolvedCards = getAllUnsolvedCards();
        reveal(unsolvedCards[Math.floor(Math.random() * unsolvedCards.length)].id)}, "onpair")


}



function initEventListeners() {
    document.getElementById("confirm-choice").addEventListener("click", nextLevel)
    document.getElementById("end-game-button").addEventListener("click", endGame)
    document.getElementById("restartGameButton").addEventListener("click", resetGame)
    document.getElementById("startGameButton").addEventListener("click", startGame)
    document.getElementById("click").addEventListener("click", shuffleUnsolvedCards)
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

function getAllUnsolvedCards() {
    const parent = document.querySelector(".card-grid");
    const allCards = Array.from(parent.children).filter(c => c.classList.contains("card"));
    return allCards.filter(c => !c.classList.contains("solved-card"));
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

        //let p = document.createElement("p");
        //card.appendChild(p);
        cardholder.appendChild(card);
    }


}

function startGame() {
    if (deckSize === 0) {
        deckSize = STARTING_DECK_SIZE
        deckOfCards = []
    }
    while(deckOfCards.length < deckSize) {
        let normalCards = getCardExplanations().filter(card => card.type === "normal");
        deckOfCards.push(normalCards[deckOfCards.length]);
    }
    for (let card of deckOfCards) {
        if (card.callback && card.callbackMoment === "onlevelstart"){
            card.callback()
        }
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
    if (cardId === selected[0] || cardId === selected[1]) {
        return;
    }else if (selected[0] === -1) {
        selected[0] = cardId;
    }
    else if (selected[1] === -1) {
        selected[1] = cardId;
    }
    flipCard(cardId);
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
            let second_card = getCardExplanation(shuffledDeckOfCards[selected[0]].card);
            if (second_card.callbackMoment === "onpair") {
                let callback = second_card.callback;
                console.log("calling: "+callback);
                callback();
            }
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

function decideEndLevelCards() {
    let types = []
    for (let i = 0; i < endLevelCardAmount; i++) {
        if (Math.random() < rareOdds) {
            types.push("rare")
        }
        else if (Math.random() < specialOdds) {
            types.push("special")
        }
        else {
            types.push("normal")
        }
    }
    return types
}

function levelDone() {
    for (let id of sparkleIntervalIDs) {
        clearInterval(id);
    }
    sparkleIntervalIDs = []

    let cardSelector = document.getElementById("level-complete-card-selector");
    document.getElementById("level-complete-card-explanation").innerText = "";
    cardSelector.innerHTML = "";

    let endLevelSelectableCards = []
    let ELSCardTypes = decideEndLevelCards()
    for (let type of ELSCardTypes) {
        let possibleCards = getCardExplanations("",type);
        let availableCards = possibleCards.filter(
            card => !deckOfCards.includes(card) && !endLevelSelectableCards.includes(card)
        );

        if (availableCards.length === 0) {
            console.warn("couldnt find card at rarity: " + type)
            possibleCards = getCardExplanations("","normal")
            availableCards = possibleCards.filter(
                card => !deckOfCards.includes(card) && !endLevelSelectableCards.includes(card)
            )
        }
        if (availableCards.length === 0) {
            console.warn("out of cards to deal.")
        }

        const randomCard =
            availableCards[Math.floor(Math.random() * availableCards.length)];

        endLevelSelectableCards.push(randomCard);
    }
    for (let i in endLevelSelectableCards) {
        let card = document.createElement("input");
        card.classList.add("card");
        card.id = "selector-card-" + i;
        card.type = "radio";
        card.name = "card-selector";
        card.classList.add("card-selector");

        let label = document.createElement("label");
        label.htmlFor = "selector-card-" + i;
        label.classList.add("card-selector-label");
        label.innerHTML = endLevelSelectableCards[i].svgSrc;


        card.addEventListener("change", (event)=> {
            let explanation = document.getElementById("level-complete-card-explanation");
            explanation.innerText = endLevelSelectableCards[i].description;
            selectedEndLevelCard = endLevelSelectableCards[i]
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
    if (selectedEndLevelCard.callbackMoment === "onselect") {
        selectedEndLevelCard.callback()
    }
    deckOfCards.push(selectedEndLevelCard)
    resetLevel();
}

function checkMatch(){
    if(shuffledDeckOfCards.length > 1){
        if(shuffledDeckOfCards[selected[0]] === shuffledDeckOfCards[selected[1]]){
            return shuffledDeckOfCards[selected[0]];
        }
    }
    return "";
}

function flipCard(cardId){
    let cardElement = document.getElementById("card-" + cardId);
    cardElement.style.animation = "none";
    cardElement.offsetHeight; //You apparently need this otherwise it will optimize the animation away
    cardElement.style.animation = "card-flip 0.8s ease-in-out forwards";
    setTimeout(function(){cardElement.innerHTML = shuffledDeckOfCards[cardId].svgSrc},400);
}

function reveal(id) {
    let cardElement = document.getElementById(id);
    let cardId = id.slice(5);
    cardElement.innerHTML = shuffledDeckOfCards[cardId].svgSrc;
    cardElement.className = cardElement.className + " revealed-card";
    //const div = document.querySelector(".sparkly");

    sparkleIntervalIDs.push(setInterval(() => {
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");

        sparkle.style.left = Math.random() * cardElement.offsetWidth + "px";
        sparkle.style.top = Math.random() * cardElement.offsetHeight + "px";

        cardElement.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
    }, 200));

}

function resetCard(cardId){
    let cardElement = document.getElementById("card-" + cardId);
    cardElement.style.animation = "none";
    cardElement.offsetHeight; //You apparently need this otherwise it will optimize the animation away
    cardElement.style.animation = "card-flip 0.8s ease-in-out backwards";
    if (!cardElement.classList.contains("revealed-card")) {
        setTimeout(function(){cardElement.innerHTML = "<p></p>"},400);
    }
}

function setCardSolved(cardId){
    let cardElement = document.getElementById("card-" + cardId);
    setTimeout(function(){cardElement.className = cardElement.className + " solved-card"},400);
}

function breakHeart() {
    livesLeft -= 1;
    updateHeart()
}

function updateHeart(){
    if (livesLeft > maxLives) livesLeft = maxLives;
    if (livesLeft > 10) {
        let text = document.getElementById("extra");
        text.textContent = `+${livesLeft - 10}`
        return
    }
    if (maxLives > 10 && livesLeft === 10) {
        let text = document.getElementById("extra");
        text.remove()
    }
    if (livesLeft < 10) {
        for (let i = 0; i <= 10; ++i) {
            let breakingHeart = document.getElementById("heart"+livesLeft);
            if (i > livesLeft) {
                if (!breakingHeart.classList.contains("broken")){
                    breakingHeart.className += " broken";
                }
            }
            else{
                if (breakingHeart.classList.contains("broken")){
                    breakingHeart.classList.remove("broken");
                }
            }
        }
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
    livesLeft += 1;
    updateHeart();
}

function shuffleUnsolvedCards() {
    const parent = document.querySelector(".card-grid");

    const allCards = Array.from(parent.children).filter(c => c.classList.contains("card"));
    const unsolvedCards = allCards.filter(c => !c.classList.contains("solved-card"));

    if (unsolvedCards.length <= 1) return;

    const first = new Map();
    unsolvedCards.forEach(card => {
        first.set(card, card.getBoundingClientRect());
    });

    for(let i = 0; i < allCards.length; i++) {
        console.log("order: "+allCards[i].id);
    }

    const shuffled = [...unsolvedCards].sort(() => Math.random() - 0.5);

    for(let i = 0; i < shuffled.length; i++) {
        console.log("shuffled: "+shuffled[i].id);
    }

    const newOrder = [];
    let u = 0;

    allCards.forEach(card => {
        card.style.animation = "none";
        if (card.classList.contains("solved-card")) {
            newOrder.push(card);
        } else {
            newOrder.push(shuffled[u++]);
        }
    });

    newOrder.forEach(card => parent.appendChild(card));

    unsolvedCards.forEach(card => {
        const last = card.getBoundingClientRect();
        const firstPos = first.get(card);

        const dx = firstPos.left - last.left;
        const dy = firstPos.top - last.top;

        card.style.transition = "none";
        card.style.transform = `translate(${dx}px, ${dy}px)`;

        card.offsetHeight; // force reflow

        card.style.transition = "transform 300ms ease";
        card.style.transform = "translate(0, 0)";
    });
}


initEventListeners()
setAllCallbackFunctions()
