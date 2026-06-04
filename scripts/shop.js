import {addSvg, getShopUpgrades} from "/web3/scripts/shopUpgrades.js";

async function fetchIcons() {
    const shopIcons = getShopUpgrades()
    return await Promise.all(
        shopIcons.map(async (upgrade) => {
            const res = await fetch(upgrade.icon)
                .then(res => res.text())
            addSvg(upgrade.name, res)
            return res
        })
    )
}

await fetchIcons()

document.getElementById("shop-button").addEventListener("click", openShop)

const shopOverlay = document.getElementById("shop-overlay");
const shopPopup = document.getElementById("shop-screen");



function openShop() {
    shopPopup.classList.remove("hidden");
    homepage.classList.add("blurred");
    shopOverlay.classList.remove("hidden");
}

shopOverlay.addEventListener("click", () => {
    shopOverlay.classList.add("hidden");
    shopPopup.classList.add("hidden");
    homepage.classList.remove("blurred");
});

shopPopup.addEventListener("click", (event) => {
    event.stopPropagation();
});

function createShop() {
    let shopUpgrades = getShopUpgrades();

    for (let i = 0; i < shopUpgrades.length; i++) {
        let upgrade = document.createElement("div");
        upgrade.classList.add("upgrade");
        upgrade.innerHTML += shopUpgrades[i].svgSrc;
        upgrade.innerHTML.replace('width="1em" height="1em"','');
        upgrade.children[0].classList.add("upgrade-icon");
        upgrade.innerHTML += shopUpgrades[i].boughtLevels + "/" + shopUpgrades[i].maxLevels + "<br>";
        upgrade.innerHTML += calculateCost(shopUpgrades[i]) + " 🪙";
        if (shopUpgrades[i].boughtLevels >= shopUpgrades[i].maxLevels) {
            upgrade.classList.add("unavailable-upgrade")
        }
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

createShop();