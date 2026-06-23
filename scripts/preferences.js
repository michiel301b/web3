
document.querySelector(".color-switch-container")
    .addEventListener("change", (e) => {
        if (e.target.name === "theme") {
            setTheme(e.target.value)
            postPreferences()
        }
    })

document.getElementById("api-selector").addEventListener("change", (e) => {
    setAPI(e.target.value)
    postPreferences()
})

document.getElementById("email-change-confirm").addEventListener("click", () => changeEmail(document.getElementById("email-input").value))

function setTheme(theme) {
    document.documentElement.dataset.theme = theme

    document.querySelectorAll('input[name="theme"]').forEach(r => {
        r.checked = r.value === theme;
    });

    saveStuff({theme})
}

function setAPI(API) {
    document.getElementById("api-selector").value = API
    saveStuff({API})
}

getPreferences().then(response => response.json())
    .then(setLocalPreferences);

function setLocalPreferences(prefs) {
    let localClosed = prefs.color_closed
    let localFound = prefs.color_found
    let localPreferredAPI = prefs.preferred_api
    console.log(prefs)

    if (localClosed !== "" && localFound !== "") {
        if (localClosed === "cadetblue" &&  localFound === "#82dc7c") {
            setTheme("light")
        }
        if (localClosed === "#19626a" &&  localFound === "#4caf50") {
            setTheme("dark")
        }
        if (localClosed === "#00d4ff" &&  localFound === "#00ff9a") {
            setTheme("rainbow")
        }
    }
    else {
        setTheme("light")
    }

    if (localPreferredAPI !== "") {
        setAPI(localPreferredAPI)
    }
    else {
        setAPI("ShAPI")
    }
}

function changeEmail(email) {
    let data = loadStuff()
    let username = localStorage.getItem("username")
    const user = data.users.find(u => u.username === username);

    if (user) {
        user.email = email;
        saveStuff(data);
    }
    fetch("http://localhost:8000/player/email", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
        })
    }).then(response => {
        if (response.status !== 204) {
            alert("Something went wrong while trying to change your email: " + response.statusText)
        }
        else {
            alert("Email changed successfully.")
        }
    })
}

