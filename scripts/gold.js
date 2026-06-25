let gold = loadStuff().gold || 0;
let runGold = 0;
let goldMultiplier = loadStuff().goldMultiplier || 1;

on("cardSolved", () => {
    gold += 1 * goldMultiplier;
    runGold += 1 * goldMultiplier;
    updateGold()
});

on("levelCompleted", () => {
    gold += 3 * goldMultiplier;
    runGold += 3 * goldMultiplier;
    updateGold()
});

function updateGold() {
    saveStuff({  gold })
    document.getElementsByClassName("gold-text-game")[0].textContent = `Gold This Run: ${Math.floor(runGold)}🪙`
}

function getGold () {
    return gold;
}

function spendGold(cost) {
    gold -= cost;
    if (gold < 0) {console.warn("negative gold")}
    saveStuff({ gold });
    document.getElementsByClassName("gold-text")[0].textContent = `${Math.floor(gold)} Gold 🪙`;
}

on("buyUpgrade", (e) => {
    let upgrade = e;
    if (upgrade.id === 6) { // name === "Midas' touch"
        goldMultiplier = 1 + upgrade.boughtLevels * 0.05;
        saveStuff( { goldMultiplier })
    }

})