let xp = parseInt(localStorage.getItem("xp") || 0);
let level = parseInt(localStorage.getItem("level") || "1");

on("cardSolved", () => {
    xp += 10;
    localStorage.setItem("xp", xp)
    checkIfNewLevel()
    document.getElementsByClassName("xp-text-game")[0].textContent = `${xp} XP ⭐`
})

on("levelCompleted", () => {
    xp += 50;
    localStorage.setItem("xp", xp)
    checkIfNewLevel()
    document.getElementsByClassName("xp-text-game")[0].textContent = `${xp} XP ⭐`
});

const levels = {
    2: 10,
    3: 200,
    4: 300,
    5: 500,
    6: 700,
    7: 900,
    8: 1100,
    9: 1300,
    10: 1500,
    11: 2000,
    12: 2500,
    13: 3000,
    14: 3500,
    15: 4000,
    16: 4500,
    17: 5000,
    18: 5500,
    19: 6000,
    20: 7500
}

function setXP0() {
    localStorage.setItem("xp", "0");
    localStorage.setItem("level", "1");
    xp = 0;
    level = 1;
}
function getXP() {
    return localStorage.getItem("xp") || "0";
}

function getLevel() {
    return localStorage.getItem("level") || "1"
}

function checkIfNewLevel() {
    const previous = parseInt(localStorage.getItem("level") || "1");
    const current = checkLevel();
    if (current > previous) {
        localStorage.setItem("level", current.toString())
        level = current
        document.getElementsByClassName("level-text-game")[0].textContent = `Level: ${current} 🚀`
        post("levelUp")
        return true
    }
    return false
}

function checkLevel() {
    let currentLevel = 1;
    for (const [level, requiredXP] of Object.entries(levels)) {
        if (xp >= requiredXP) {
            currentLevel = parseInt(level);
        }
    }
    return currentLevel;
}