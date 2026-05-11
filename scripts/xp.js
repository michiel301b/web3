let xp = parseInt(localStorage.getItem("xp") || 0);
let level = parseInt(localStorage.getItem("level") || 0);

on("cardSolved", () => {
    xp += 10;
    localStorage.setItem("xp", xp)
})

on("levelCompleted", () => {
    xp += 50;
    localStorage.setItem("xp", xp)
});

