
const displaydata = loadStuff();
document.getElementsByClassName("gold-text")[0].textContent = `${displaydata.gold} Gold 🪙`
document.getElementsByClassName("xp-text")[0].textContent = `${displaydata.xp} XP ⭐`
document.getElementsByClassName("level-text")[0].textContent = `Level: ${displaydata.level} 🚀`

document.getElementById("leaderboard-button").addEventListener("click", openLeaderboardPopup)
document.getElementById("delete-savefile").addEventListener("click",deleteSavefile);
document.getElementById("logout-button").addEventListener("click",logout);
document.getElementById("preference-button").addEventListener("click",openPreferencePopup);





const homepage = document.getElementById("homepage-container");
const overlay = document.getElementById("overlay");
const lbPopup = document.getElementById("leaderboard-screen");
const prefPopup = document.getElementById("preferences-screen");



overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
    lbPopup.classList.add("hidden");
    prefPopup.classList.add("hidden");
    homepage.classList.remove("blurred");
});

lbPopup.addEventListener("click", (event) => {
    event.stopPropagation();
});

prefPopup.addEventListener("click", (event) => {
    event.stopPropagation();
})

function openLeaderboardPopup() {
    lbPopup.classList.remove("hidden");
    homepage.classList.add("blurred");
    overlay.classList.remove("hidden");
}

function openPreferencePopup() {
    homepage.classList.add("blurred");
    overlay.classList.remove("hidden");
    prefPopup.classList.remove("hidden");
}


