// Retrieve your data from locaStorage
var saveData = JSON.parse(localStorage.saveData || null) || {};

// Store your data.
function saveStuff(obj) {
    saveData.obj = { ...saveData.obj, ...obj }
    // saveData.foo = foo;
    saveData.time = new Date().getTime();
    localStorage.saveData = JSON.stringify(saveData);
}

// Do something with your data.
function loadStuff() {
    return saveData.obj || "default";
}