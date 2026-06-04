const saveData = JSON.parse(localStorage.saveData || null) || {};

function saveStuff(obj) {
    saveData.obj = { ...saveData.obj, ...obj }
    saveData.time = new Date().getTime();
    localStorage.saveData = JSON.stringify(saveData);
}

function loadStuff() {
    return saveData.obj || {
        gold: 0,
        xp: 0,
        level: 1,
        upgrades: []
    }
}