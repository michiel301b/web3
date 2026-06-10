const saveData = JSON.parse(localStorage.saveData || null) || {};

function saveStuff(obj) {
    saveData.obj = { ...saveData.obj, ...obj }
    saveData.time = new Date().getTime();
    localStorage.saveData = JSON.stringify(saveData);
}

const defaultSaveData = {
    gold: 0,
    xp: 0,
    level: 1,
    users: [],
};

function loadStuff() {
    return saveData.obj || structuredClone(defaultSaveData);
}

function deleteSavefile() {
    let data = {
        obj: structuredClone(defaultSaveData),
        time: Date.now(),
    };

    localStorage.saveData = JSON.stringify(data);
    location.reload()
}