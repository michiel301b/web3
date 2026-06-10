import {addSvg, getShopUpgrades, buyShopUpgrade} from "/web3/scripts/shopUpgrades.js";

let selectedUpgrade = undefined


async function fetchIcons() {
    const shopIcons = getShopUpgrades()
    return await Promise.all(
        shopIcons.map(async (upgrade) => {
            const res = await window.oldFetch(upgrade.icon)
                .then(res => res.text())
            addSvg(upgrade.name, res)
            return res
        })
    )
}

await fetchIcons()

document.getElementById("shop-button").addEventListener("click", openShop)

// const shopOverlay = document.getElementById("shop-overlay");
const shopPopup = document.getElementById("shop-screen");



function openShop() {
    shopPopup.classList.remove("hidden");
    homepage.classList.add("blurred");
    overlay.classList.remove("hidden");
    document.getElementById("shop-screen-upgrade-explanation").classList.add("hidden");
    selectedUpgrade = undefined
    updateGoldInShop()
}

function updateGoldInShop() {
    document.getElementById("shop-title").innerText = "Upgrade Shop | " + getGold() + " 🪙" ;
}

// shopOverlay.addEventListener("click", () => {
//     shopOverlay.classList.add("hidden");
//     shopPopup.classList.add("hidden");
//     homepage.classList.remove("blurred");
// });
//
shopPopup.addEventListener("click", (event) => {
    event.stopPropagation();
});

document.getElementById("buy-button").addEventListener("click", (event) => {
    if (!selectedUpgrade) return;
    if (selectedUpgrade.boughtLevels >= selectedUpgrade.maxLevels) return;
    let cost = calculateCost(selectedUpgrade);
    if (cost <= getGold()) {
        spendGold(cost);
        buyShopUpgrade(selectedUpgrade.name)
    }
    post("buyUpgrade",selectedUpgrade);
    updateShop()
    updateGoldInShop()
    selectUpgrade("upgrade_"+selectedUpgrade.id);
})

function createShop() {
    console.log("trying to load all shop upgrades...");
    let shopUpgrades = getShopUpgrades();

    for (let i = 0; i < shopUpgrades.length; i++) {
        let upgrade = document.createElement("div");
        upgrade.classList.add("upgrade");
        upgrade.innerHTML += shopUpgrades[i].svgSrc;
        upgrade.id = "upgrade_" + shopUpgrades[i].id;
        upgrade.innerHTML.replace('width="1em" height="1em"','');
        upgrade.children[0].classList.add("upgrade-icon");
        upgrade.innerHTML += shopUpgrades[i].boughtLevels + "/" + shopUpgrades[i].maxLevels + "<br>";
        let cost = calculateCost(shopUpgrades[i]);
        if (shopUpgrades[i].boughtLevels >= shopUpgrades[i].maxLevels) {
            upgrade.classList.add("unavailable-upgrade")
            upgrade.innerHTML += "Sold out";
        }
        else {
            upgrade.innerHTML += cost + " 🪙";
        }
        if (cost > getGold()) {
            upgrade.classList.add("unaffordable-upgrade")
        }
        upgrade.addEventListener("click", () => selectUpgrade(upgrade.id))
        document.getElementById("shop-screen-buttons").appendChild(upgrade);
    }
}


function calculateCost(upgrade) {
    if (upgrade.costType === "predefined") {
        return upgrade.predefinedCost[upgrade.boughtLevels];
    }
    if (upgrade.costType === "linear") {
        return upgrade.baseCost + upgrade.boughtLevels * upgrade.costIncrement;
    }
    if (upgrade.costType === "exponential") {
        return upgrade.baseCost * (upgrade.costIncrement ** upgrade.boughtLevels);
    }
    else { // upgrade.costType === "flat"
        return upgrade.baseCost * (upgrade.boughtLevels+1);
    }

}



function selectUpgrade(id) {
    let upgradeId = id.slice(8)
    selectedUpgrade = getShopUpgrades()[upgradeId];
    if (selectedUpgrade) {
        document.getElementById("shop-screen-upgrade-explanation").classList.remove("hidden");
    }
    let icon = document.getElementById("explanation-icon");
    icon.outerHTML = selectedUpgrade.svgSrc.replace("<svg",'<svg class="upgrade-icon" id="explanation-icon"');

    document.getElementById("upgrade-name").innerText = selectedUpgrade.name;
    document.getElementById("upgrade-explanation").innerText = selectedUpgrade.description;
    let cpal; //current price and level
    if (selectedUpgrade.boughtLevels >= selectedUpgrade.maxLevels) {
        cpal = "Sold out      "  + selectedUpgrade.boughtLevels + "/" + selectedUpgrade.maxLevels;
    }
    else {
        cpal = calculateCost(selectedUpgrade) + " 🪙      " + selectedUpgrade.boughtLevels + "/" + selectedUpgrade.maxLevels;
    }
    document.getElementById("current-price-and-level").innerText = cpal;
}

function updateShop(){
    document.getElementById("shop-screen-buttons").innerHTML = "";
    createShop();
    createShop();
    createShop();
    createShop();
    createShop();
    createShop();
    createShop();
}

updateShop()
