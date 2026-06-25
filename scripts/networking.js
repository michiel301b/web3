window.oldFetch = window.fetch


function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return Date.now() >= payload.exp * 1000
}

setInterval(() => {
    let token = localStorage.getItem("token")
    if (token && isTokenExpired(token)) {
        alert("Your session has expired. Please log in again")
        logout()
    }
},1000)

window.fetch = async function(url, options = {}) {
    const token = localStorage.getItem("token")

    if (!token || isTokenExpired(token)) {
        alert("Your session has expired. Please log in again")
        logout()
    }

    options.headers = new Headers(options.headers || {});
    options.headers.set("Authorization", `Bearer ${token}`);
    return window.oldFetch(url, options)
}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
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
    })
        .then((response) => response.json())
        .then(data => {
            window.location.replace("home_page.html");
        })
}

function getPreferences() {
    return fetch("http://localhost:8000/player/preferences", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((resp) => {
        if (resp.status !== 200){
            alert("Something went wrong while trying to get user preferences from the server: " + resp.statusText)
        }else{
            return resp
        }
    })
}

function postPreferences() {
    let api = loadStuff().API
    const solvedColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--card-back-solved")
        .trim()
    const unsolvedColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--card-back-unsolved")
        .trim()

    console.log("solved "+solvedColor)
    console.log("unsolved "+unsolvedColor)
    console.log("api "+api)
    return fetch("http://localhost:8000/player/preferences", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            color_found: solvedColor,
            color_closed: unsolvedColor,
            api: api
        })
    }).then((resp) => {
        if (resp.status !== 204){
            alert("Something went wrong while trying to set user preferences on the server: " + resp.statusText)
        }else{
            return resp
        }
    })
}