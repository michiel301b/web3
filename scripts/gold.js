let gold = parseInt(localStorage.getItem("gold") || 0);

on("cardSolved", () => {
    gold += 1;
    localStorage.setItem("gold", gold)
});

on("levelCompleted", () => {
    gold += 3;
    localStorage.setItem("gold", gold)
});

