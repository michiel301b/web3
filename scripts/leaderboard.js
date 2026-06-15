const check = () => {
    return fetch('http://localhost:8000/memory/scores')
        .then(res => res.json())
}

check().then(json => parseScoreJSON(json))

function parseScoreJSON(scores) {
    const leaderboard = document.getElementById("leaderboard-screen");

    const topScores = [...scores]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    leaderboard.innerHTML = '<h2 class="homescreen-h2">Leaderboard</h2>'
    leaderboard.innerHTML += topScores
        .map((player, index) => `
            <div class="leaderboard-entry">
                <span>#${index + 1}</span>
                <span>${escapeHTML(player.username)}</span>
                <span>${Math.round(player.score)}</span>
            </div>
        `)
        .join("");
}

function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}