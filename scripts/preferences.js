
document.querySelector(".color-switch-container")
    .addEventListener("change", (e) => {
        if (e.target.name === "theme") {
            document.documentElement.dataset.theme = e.target.value
            let theme = e.target.value
            saveStuff({theme})
        }
    })

document.getElementById("api-selector").addEventListener("change", (e) => {
    let API = e.target.value
    saveStuff({API})
    console.log(e.currentTarget.value)
})

getPreferences().then((response) => {
    console.log(response.json())
    return response
})