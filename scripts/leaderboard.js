const displaydata = loadStuff();
document.getElementsByClassName("gold-text")[0].textContent = `${displaydata.gold} Gold 🪙`
document.getElementsByClassName("xp-text")[0].textContent = `${displaydata.xp} XP ⭐`
document.getElementsByClassName("level-text")[0].textContent = `Level: ${displaydata.level} 🚀`

document.getElementById("leaderboard-button").addEventListener("click", summonLeaderboardPopup)


const homepage = document.getElementById("homepage-container");
const lbOverlay = document.getElementById("leaderboard-overlay");
const lbPopup = document.getElementById("leaderboard-screen");

lbOverlay.addEventListener("click", () => {
    lbOverlay.classList.add("hidden");
    lbPopup.classList.add("hidden");
    homepage.classList.remove("blurred");
});

lbPopup.addEventListener("click", (event) => {
    event.stopPropagation();
});

function summonLeaderboardPopup() {
    lbPopup.classList.remove("hidden");
    homepage.classList.add("blurred");
    lbOverlay.classList.remove("hidden");
}

function registerFakeUser() {
    const user = fetch("http://localhost:8000/memory/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "Henk",
            email: "henk@henk.henk",
            password: "henk"
        })
    }).then(res => res.json())
    .then(data => {
        console.log(data);
    })
}

//registerFakeUser();

const check = () => {
    fetch('http://localhost:8000/memory/scores')
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
}

check()