let gold = loadStuff().gold || 0;

on("cardSolved", () => {
    gold += 1;
    saveStuff({ gold })
    document.getElementsByClassName("gold-text-game")[0].textContent = `${gold} Gold 🪙`
});

on("levelCompleted", () => {
    gold += 3;
    saveStuff({  gold })
    document.getElementsByClassName("gold-text-game")[0].textContent = `${gold} Gold 🪙`
});

