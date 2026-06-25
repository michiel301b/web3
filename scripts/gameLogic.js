import {getCardExplanation, getCardExplanations, setCallback} from "/web3/scripts/cardExplanations.js"
import {getShopUpgrades} from "/web3/scripts/shopUpgrades.js"


//let standardPossibleCards = ["▲", "■", "●", "⬟", "A", "B", "C", "D", "E", "F"]
//let endLevelPossibleCards = ["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ","ψ","ω"]
const STARTING_VALUES = {
    STARTING_DECK_SIZE: 2,
    END_LEVEL_CARD_AMOUNT: 3,
    RARE_ODDS: 0.05,
    SPECIAL_ODDS: 0.99,
    NEGATIVE_ODDS: 0.0,
    MAX_LIVES: 9,
}
let selectedEndLevelCard
let endLevelCardAmountBonus = 0
let deckOfCards = []
let rareOdds = STARTING_VALUES.RARE_ODDS
let specialOdds = STARTING_VALUES.SPECIAL_ODDS
let negativeOdds = STARTING_VALUES.NEGATIVE_ODDS
let deckSize = STARTING_VALUES.STARTING_DECK_SIZE
let selected = [-1, -1]
let shuffledDeckOfCards = []
let solvedPairs = []
let uiLocked = false
let maxLives = STARTING_VALUES.MAX_LIVES + (loadStuff().level || 1)
let livesLeft = maxLives
let sparkleIntervalIDs = []

export function setAllCallbackFunctions() {
    setCallback("Heart", () => {
        healHeart();
        healHeart()
    }, "onpair")
    setCallback("Hollow-Heart", () => healHeart(), "onpair")
    setCallback("Star", () => {
        post("bonusXP");
        post("bonusXP")
    }, "onpair")
    setCallback("Hollow-Star", () => post("bonusXP"), "onpair")
    setCallback("Duplicate", () => deckOfCards.push(getCardExplanation("Duplicate")), "onselect")
    setCallback("Washing-Machine", shuffleUnsolvedCards, "onpair")
    setCallback("Magnet", (deck) => putMagnetsAdjacent(deck), "onshuffle")
    setCallback("Hollow-Crystal-Ball", () => {
        setTimeout(() => {
            const unsolvedCards = getAllUnsolvedCards()
            if (unsolvedCards.length <= 0) return
            reveal(unsolvedCards[Math.floor(Math.random() * unsolvedCards.length)].id)
        }, 500)
    }, "onpair")
    setCallback("Crystal-Ball", () => {
        setTimeout(() => {
            const unsolvedCards = getAllUnsolvedCards()
            if (unsolvedCards.length <= 0) return
            reveal(unsolvedCards[Math.floor(Math.random() * unsolvedCards.length)].id)
            reveal(unsolvedCards[Math.floor(Math.random() * unsolvedCards.length)].id)
        }, 500)
    }, "onpair")
    setCallback("Shredder", shredUnsolved, "onpair")
    setCallback("Broken-Heart", () => {
        breakHeart();
        breakHeart()
    }, "onpair")
    setCallback("Hollow-Broken-Heart", () => breakHeart, "onpair")
}

function shredUnsolved() {
    const unsolvedSymbols = deckOfCards.filter(card => !solvedPairs.some(solved => solved.card === card.card))
    let toShredSymbol = unsolvedSymbols[Math.floor(Math.random() * unsolvedSymbols.length)]
    let indices = [
        shuffledDeckOfCards.findIndex(card => card.card === toShredSymbol.card),
        shuffledDeckOfCards.findLastIndex(card => card.card === toShredSymbol.card)
    ]
    for (let i of indices) {
        shred("card-" + i)
    }
    solvedPairs.push(shuffledDeckOfCards[indices[0]])
}

function shred(id) {
    let card = document.getElementById(id)
    card.innerHTML = '<div class="shred s1"></div>\n' +
        '<div class="shred s2"></div>\n' +
        '<div class="shred s3"></div>\n' +
        '<div class="shred s4"></div>\n' +
        '<div class="shred s5"></div>'
    card.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    card.style.boxShadow = 'none'
    card.classList.add('shredded')
}


function startOfGameUpgrades() {
    for (let upgrade of getShopUpgrades()) {
        if (upgrade.name === "Healthy Hearts") {
            maxLives = 9 + (loadStuff().level || 1) + upgrade.boughtLevels
        }
    }
}

function shuffleDeckOfCards(deckOfCards) {
    let toShuffleDeck = deckOfCards.concat(deckOfCards)
    for (let i = 0; i < toShuffleDeck.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [toShuffleDeck[i], toShuffleDeck[j]] = [toShuffleDeck[j], toShuffleDeck[i]]
    }
    for (let card of deckOfCards) {
        if (card.callback && card.callbackMoment === "onshuffle") {
            toShuffleDeck = card.callback(toShuffleDeck)
        }
    }
    return toShuffleDeck
}

function putMagnetsAdjacent(deck) {
    const magnetIndices = []
    for (let i = 0; i < deck.length; i++) {
        if (deck[i].card === "Magnet") {
            magnetIndices.push(i)
        }
    }
    if (magnetIndices.length !== 2) {
        return deck
    }
    const randomMagnetIndex = magnetIndices[Math.floor(Math.random() * magnetIndices.length)]
    const otherMagnetIndex = magnetIndices.filter((num) => num !== randomMagnetIndex)[0]
    const candidates = getValidAdjacentCells(randomMagnetIndex).filter(x => x < deck.length)
    const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
    [deck[otherMagnetIndex], deck[randomCandidate]] = [deck[randomCandidate], deck[otherMagnetIndex]]
    return deck
}

function getValidAdjacentCells(index) {
    const size = 8
    const x = index % size
    const y = Math.floor(index / size)

    const candidates = [
        [x - 1, y], // left
        [x + 1, y], // right
        [x, y - 1], // up
        [x, y + 1]  // down
    ]

    return candidates
        .filter(([nx, ny]) =>
            nx >= 0 &&
            nx < size &&
            ny >= 0 &&
            ny < size
        )
        .map(([nx, ny]) => ny * size + nx)
}

function getAllUnsolvedCards() {
    const parent = document.querySelector(".card-grid")
    const allCards = Array.from(parent.children).filter(c => c.classList.contains("card"))
    return allCards.filter(c => !c.classList.contains("solved-card"))
}

function generateHearts() {
    let heartcontainer = document.getElementsByClassName("heart-container")[0]
    for (let i = 0; i < 10; i++) {

        const heart = document.createElement("svg")
        heart.id = `heart${i}`
        heart.className = "heart"
        heart.innerHTML = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path d=\"M0 0h24v24H0z\" fill=\"none\" /><path fill=\"currentColor\" d=\"m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z\" /></svg>'
        heart.alt = "heart icon"
        if (i + 1 > livesLeft) {
            heart.classList.add("broken")
        }
        heartcontainer.appendChild(heart)
    }

    if (livesLeft > 10) {
        const extra = document.createElement("span")
        extra.id = "extra"
        extra.textContent = `+${livesLeft - 10}`
        heartcontainer.appendChild(extra)
    }
}

function generateCardHtml() {
    shuffledDeckOfCards = shuffleDeckOfCards(deckOfCards)
    console.log(shuffledDeckOfCards)
    let cardholder = document.getElementById("card-holder")
    for (let i = 0; i < shuffledDeckOfCards.length; i++) {

        let card = document.createElement("div")
        card.classList.add("card")
        card.id = "card-" + i

        card.addEventListener("click", () => {
            cardClick(card.id)
        })

        cardholder.appendChild(card)
    }


}

export function startGame() {
    if (deckSize === 0) {
        deckSize = STARTING_VALUES.STARTING_DECK_SIZE
        deckOfCards = []
    }
    while (deckOfCards.length < deckSize) {
        let normalCards = getCardExplanations().filter(card => card.type === "normal")
        deckOfCards.push(normalCards[deckOfCards.length])
    }
    for (let card of deckOfCards) {
        if (card.callback && card.callbackMoment === "onlevelstart") {
            card.callback()
        }
    }

    startOfGameUpgrades()
    generateCardHtml()
    generateHearts()
    document.getElementById("startGameButton").classList.add("hidden")
    document.getElementById("restartGameButton").classList.remove("hidden")
}

function resetLevel() {
    document.getElementById("card-holder").innerHTML = ""
    document.getElementsByClassName("heart-container")[0].innerHTML = ""
    solvedPairs = []
    selected = [-1, -1]
    uiLocked = false
    startGame()
}

function resetGame() {
    document.getElementById("end-level-blurscreen").classList.remove("hidden")
    document.getElementById("end-run-blurscreen").classList.add("hidden")
    document.getElementById("card-holder").innerHTML = ""
    document.getElementsByClassName("heart-container")[0].innerHTML = ""
    deckOfCards = []
    solvedPairs = []
    selected = [-1, -1]
    uiLocked = false
    deckSize = 0
    startGame()
    healAllHearts()
}

function cardClick(id) {
    let cardElement = document.getElementById(id)
    if (uiLocked || cardElement.classList.contains("solved-card") || cardElement.classList.contains("shredded")) {
        return
    }
    let cardId = id.slice(5) // removes "card-" from the element id
    if (cardId === selected[0] || cardId === selected[1]) {
        return
    } else if (selected[0] === -1) {
        selected[0] = cardId
    } else if (selected[1] === -1) {
        selected[1] = cardId
    }
    flipCard(cardId)
    if (selected[1] >= 0) {
        let checkMatchResult = checkMatch()
        uiLocked = true
        if (checkMatchResult === "") {
            setTimeout(function () {
                resetCard(selected[0])
                resetCard(selected[1])
                breakHeart()
                uiLocked = false
                selected = [-1, -1]
            }, 2000)
        } else {
            solvedPairs.push(checkMatchResult)
            setCardSolved(selected[0])
            setCardSolved(selected[1])
            let second_card = getCardExplanation(shuffledDeckOfCards[selected[0]].card)
            if (second_card.callbackMoment === "onpair") {
                let callback = second_card.callback
                callback()
            }
            selected = [-1, -1]
            post("cardSolved")
            setTimeout(function () {
                uiLocked = false
            }, 400)
        }

        const same =
            solvedPairs.length === deckOfCards.length &&
            deckOfCards.every(card =>
                solvedPairs.some(deckCard => {
                    return deckCard.card === card.card
                })
            )
        if (same) {
            levelDone()
        }
    }
}

export function endGame() {
    document.getElementById("end-level-blurscreen").classList.add("hidden")
    document.getElementById("end-run-blurscreen").classList.remove("hidden")
    document.getElementById("end-run-stats").innerText = `You have earned: ${runGold} Gold and ${runXp} XP`
    let score = runXp + runGold
    document.getElementById("end-run-score").innerText = `Gold + XP = ${score} Score`
    document.getElementById("submit-score-button").addEventListener("click", () => publishScore(score))
    document.getElementById("return-home-button").addEventListener("click", () => window.location.href = "http://localhost:63342/web3/Templates/home_page.html")
    document.getElementById("play-again-button").addEventListener("click", resetGame)
}

function decideEndLevelCards() {
    let types = []
    let endLevelCardAmount = STARTING_VALUES.END_LEVEL_CARD_AMOUNT + endLevelCardAmountBonus
    if (Math.random() < negativeOdds) {
        for (let i = 0; i < endLevelCardAmount; i++) {
            types.push("negative")
        }
        return types
    }
    for (let i = 0; i < endLevelCardAmount; i++) {
        if (Math.random() < rareOdds) {
            types.push("rare")
        } else if (Math.random() < specialOdds) {
            types.push("special")
        } else {
            types.push("normal")
        }
    }
    return types
}

function preLevelDoneUpgrades() {
    for (let upgrade of getShopUpgrades()) {
        if (upgrade.id === 2) { //upgrade.name === "A Greater Selection") {
            endLevelCardAmountBonus = upgrade.boughtLevels
        }
        if (upgrade.id === 3) { //upgrade.name === "Special Card Odds Up") {
            specialOdds = STARTING_VALUES.SPECIAL_ODDS + upgrade.boughtLevels * 0.01
        }
        if (upgrade.id === 5) { //upgrade.name === "No Negative Nancy"
            negativeOdds = STARTING_VALUES.NEGATIVE_ODDS - upgrade.boughtLevels * 0.01
        }
    }
}

function levelDone() {
    for (let id of sparkleIntervalIDs) {
        clearInterval(id)
    }
    sparkleIntervalIDs = []
    preLevelDoneUpgrades()

    let cardSelector = document.getElementById("level-complete-card-selector")
    document.getElementById("level-complete-card-explanation").innerText = ""
    cardSelector.innerHTML = ""

    let endLevelSelectableCards = []
    let ELSCardTypes = decideEndLevelCards()
    for (let type of ELSCardTypes) {
        let possibleCards = getCardExplanations("", type)
        let availableCards = possibleCards.filter(
            card => !deckOfCards.includes(card) && !endLevelSelectableCards.includes(card)
        )

        if (availableCards.length === 0) {
            console.warn("couldnt find card at rarity: " + type)
            possibleCards = getCardExplanations("", "normal")
            availableCards = possibleCards.filter(
                card => !deckOfCards.includes(card) && !endLevelSelectableCards.includes(card)
            )
        }
        if (availableCards.length === 0) {
            console.warn("out of cards to deal.")
        }

        const randomCard =
            availableCards[Math.floor(Math.random() * availableCards.length)]

        endLevelSelectableCards.push(randomCard)
    }
    for (let i in endLevelSelectableCards) {
        let card = document.createElement("input")
        card.classList.add("card")
        card.id = "selector-card-" + i
        card.type = "radio"
        card.name = "card-selector"
        card.classList.add("card-selector")

        let label = document.createElement("label")
        label.htmlFor = "selector-card-" + i
        label.classList.add("card-selector-label")
        label.innerHTML = endLevelSelectableCards[i].svgSrc
        label.classList.add("card-selector-" + endLevelSelectableCards[i].type)


        card.addEventListener("change", (event) => {
            let explanation = document.getElementById("level-complete-card-explanation")
            explanation.innerText = endLevelSelectableCards[i].description
            selectedEndLevelCard = endLevelSelectableCards[i]
        })

        cardSelector.appendChild(card)
        cardSelector.appendChild(label)

    }
    post("levelCompleted")
    document.getElementById("card-container").classList.add("blurred")
    document.getElementById("end-level-blurscreen").classList.remove("hidden")
}

export function nextLevel() {
    if (!selectedEndLevelCard) return
    document.getElementById("card-container").classList.remove("blurred")
    document.getElementById("end-level-blurscreen").classList.add("hidden")
    if (selectedEndLevelCard.callbackMoment === "onselect") {
        selectedEndLevelCard.callback()
    }
    deckOfCards.push(selectedEndLevelCard)
    resetLevel()
}

function checkMatch() {
    if (shuffledDeckOfCards.length > 1) {
        if (shuffledDeckOfCards[selected[0]] === shuffledDeckOfCards[selected[1]]) {
            return shuffledDeckOfCards[selected[0]]
        }
    }
    return ""
}

function flipCard(cardId) {
    let cardElement = document.getElementById("card-" + cardId)
    cardElement.style.animation = "none"
    cardElement.offsetHeight //You apparently need this otherwise it will optimize the animation away
    cardElement.style.animation = "card-flip 0.8s ease-in-out forwards"
    setTimeout(function () {
        cardElement.innerHTML = shuffledDeckOfCards[cardId].svgSrc
    }, 400)
}

function reveal(id) {
    let cardElement = document.getElementById(id)
    let cardId = id.slice(5)
    cardElement.innerHTML = shuffledDeckOfCards[cardId].svgSrc
    cardElement.className = cardElement.className + " revealed-card"
    //const div = document.querySelector(".sparkly")

    sparkleIntervalIDs.push(setInterval(() => {
        const sparkle = document.createElement("div")
        sparkle.classList.add("sparkle")

        sparkle.style.left = Math.random() * cardElement.offsetWidth + "px"
        sparkle.style.top = Math.random() * cardElement.offsetHeight + "px"

        cardElement.appendChild(sparkle)

        setTimeout(() => sparkle.remove(), 1000)
    }, 200))

}

function resetCard(cardId) {
    let cardElement = document.getElementById("card-" + cardId)
    cardElement.style.animation = "none"
    cardElement.offsetHeight //You apparently need this otherwise it will optimize the animation away
    cardElement.style.animation = "card-flip 0.8s ease-in-out backwards"
    if (!cardElement.classList.contains("revealed-card")) {
        setTimeout(function () {
            cardElement.innerHTML = "<p></p>"
        }, 400)
    }
}

function setCardSolved(cardId) {
    let cardElement = document.getElementById("card-" + cardId)
    setTimeout(function () {
        cardElement.className = cardElement.className + " solved-card"
    }, 400)
}

function breakHeart() {
    livesLeft -= 1
    updateHeart()
}

function updateHeart() {
    if (livesLeft > maxLives) livesLeft = maxLives
    if (livesLeft > 10) {
        let text = document.getElementById("extra")
        text.textContent = `+${livesLeft - 10}`
        return
    }
    if (maxLives > 10 && livesLeft === 10) {
        let text = document.getElementById("extra")
        text.remove()
    }
    if (livesLeft < 10) {
        for (let i = 0; i <= 10; ++i) {
            let breakingHeart = document.getElementById("heart" + livesLeft)
            if (i > livesLeft) {
                if (!breakingHeart.classList.contains("broken")) {
                    breakingHeart.className += " broken"
                }
            } else {
                if (breakingHeart.classList.contains("broken")) {
                    breakingHeart.classList.remove("broken")
                }
            }
        }
    }
    if (livesLeft <= 0) {
            endGame();
    }
}

function healAllHearts() {
    while (livesLeft < maxLives) {
        healHeart()
    }
}

function healHeart() {
    livesLeft += 1
    updateHeart()
}

function shuffleUnsolvedCards() {
    const parent = document.querySelector(".card-grid")

    const allCards = Array.from(parent.children).filter(c => c.classList.contains("card"))
    const unsolvedCards = allCards.filter(c => !c.classList.contains("solved-card"))

    if (unsolvedCards.length <= 1) return

    const first = new Map()
    unsolvedCards.forEach(card => {
        first.set(card, card.getBoundingClientRect())
    })

    const shuffled = [...unsolvedCards].sort(() => Math.random() - 0.5)

    const newOrder = []
    let u = 0

    allCards.forEach(card => {
        card.style.animation = "none"
        if (card.classList.contains("solved-card")) {
            newOrder.push(card)
        } else {
            newOrder.push(shuffled[u++])
        }
    })

    newOrder.forEach(card => parent.appendChild(card))

    unsolvedCards.forEach(card => {
        const last = card.getBoundingClientRect()
        const firstPos = first.get(card)

        const dx = firstPos.left - last.left
        const dy = firstPos.top - last.top

        card.style.transition = "none"
        card.style.transform = `translate(${dx}px, ${dy}px)`

        card.offsetHeight // force reflow

        card.style.transition = "transform 300ms ease"
        card.style.transform = "translate(0, 0)"
    })
}


setAllCallbackFunctions()
