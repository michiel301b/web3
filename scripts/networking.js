window.oldFetch = window.fetch


function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split(".")[1]))
    console.log("token: ",token)
    console.log("payload: ",payload)
    console.log("exp: ", payload.exp)
    console.log("now: ",Date.now())
    return Date.now() >= payload.exp * 1000
}

window.fetch = async function(url, options = {}) {
    const token = localStorage.getItem("token")
    console.log("token: ", token)

    if (!token || isTokenExpired(token)) {
        alert(token)
        logout()
        throw new Error("Token expired")
    }

    options.headers = new Headers(options.headers || {});
    options.headers.set("Authorization", `Bearer ${token}`);
    return window.oldFetch(url, options)
}

function logout() {
    //todo
    localStorage.removeItem("token")
    window.location.replace("/web3/Templates/login.html")
}

function publishScore(score){
    let api = loadStuff().API
    const solvedColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--card-back-solved")
        .trim()
    const unsolvedColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--card-back-unsolved")
        .trim()

    fetch("http://localhost:8000/game/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            score: score,
            api: api,
            color_found: solvedColor,
            color_closed: unsolvedColor
        })
    }).then((response) => response.json())
}