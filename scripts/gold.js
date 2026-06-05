let gold = loadStuff().gold || 0;

on("cardSolved", () => {
    gold += 1;
    updateGold()
});

on("levelCompleted", () => {
    gold += 3;
    updateGold()
});

function updateGold() {
    saveStuff({  gold })
    document.getElementsByClassName("gold-text-game")[0].textContent = `${gold} Gold 🪙`
}

function getGold () {
    return gold;
}

function spendGold(cost) {
    gold -= cost;
    if (gold < 0) {console.warn("negative gold")}
    saveStuff({ gold });
    document.getElementsByClassName("gold-text")[0].textContent = `${gold} Gold 🪙`;
}