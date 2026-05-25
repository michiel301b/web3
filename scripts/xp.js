let xp = loadStuff().xp || 0
let level = loadStuff().level || 0;

on("cardSolved", () => {
    updateXP(10)
})

on("bonusXP", () => {
    updateXP(5)
})

on("levelCompleted", () => {
    updateXP(50)
})

function updateXP(deltaXP) {
    xp += deltaXP;
    saveStuff({ xp })
    checkIfNewLevel()
    document.getElementsByClassName("xp-text-game")[0].textContent = `${xp} XP ⭐`
}

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
    xp = 0;
    level = 1;
    saveStuff({ xp, level })
}
function getXP() {
    return loadStuff().xp || 0
}

function getLevel() {
    return loadStuff().level || 1;
}

function checkIfNewLevel() {
    const previous = loadStuff().level || 1;
    const current = checkLevel();
    if (current > previous) {
        level = current
        saveStuff({ level })
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