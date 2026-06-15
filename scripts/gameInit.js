import {getCardExplanations,addSvg} from "/web3/scripts/cardExplanations.js";

export async function fetchIcons() {
    const allCards = getCardExplanations()
    let cards = []
    for (let item of allCards) {
        cards.push(item)
    }
    return await Promise.all(
        cards.map(async (card) => {
            const res = await window.oldFetch(card.imgSrc)
                .then(res => res.text())
            addSvg(card.card, res)
            return res
        })
    )
}

export function initEventListeners({nextLevel,endGame,startGame}) {
    document.getElementById("confirm-choice").addEventListener("click", nextLevel)
    document.getElementById("end-game-button").addEventListener("click", endGame)
    document.getElementById("restartGameButton").addEventListener("click", endGame)
    document.getElementById("returnToHomeButton").addEventListener("click", () => window.location.href = "http://localhost:63342/web3/Templates/home_page.html")
    document.getElementById("startGameButton").addEventListener("click", startGame)
    on("levelUp", () => {
        document.getElementsByClassName("level-text-game")[0].classList.add("levelup")
        setTimeout(() => {
            document.getElementsByClassName("level-text-game")[0].classList.remove("levelup")
        }, 10000)
    })
}