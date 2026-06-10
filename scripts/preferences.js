
document.querySelector(".color-switch-container")
    .addEventListener("change", (e) => {
        if (e.target.name === "theme") {
            document.documentElement.dataset.theme = e.target.value;
        }
    });

document.getElementById("api-selector").addEventListener("change", (e) => {
    console.log(e.currentTarget.value)
})