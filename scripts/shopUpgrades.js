let allUpgrades = loadStuff().upgrades ||
 [
    {
        id: 0,
        name: "Healthy Hearts",
        icon: "https://api.iconify.design/hugeicons/healtcare.svg",
        description: "Gain extra hearts to feel extra healthy.",
        exactEffect: "Currently gaining {x} hearts.",
        maxLevels: 10,
        boughtLevels: 0,
        costType:"predefined",
        predefinedCost:[5,10,15,25,40,60,80,100,140,200],
        baseCost: 5
    },{
        id: 1,
        name: "Experience Expediter",
        icon: "https://api.iconify.design/fluent/star-add-32-filled.svg",
        description: "Become more experienced at collecting experience.",
        maxLevels: 20,
        boughtLevels: 0,
        costType: "linear",
        baseCost: 5,
        costIncrement: 12
    },{
        id: 2,
        name: "A Greater Selection",
        icon: "https://api.iconify.design/streamline-ultimate/card-add-1-bold.svg",
        description: "Adds an extra card to the selection screen at the end of each level.",
        maxLevels: 1,
        boughtLevels: 0,
        costType: "flat",
        baseCost: 2000
    },{
        id: 3,
        name: "Special Card Odds Up",
        icon: "https://api.iconify.design/subway/file-1.svg",
        description: "Increases the chance of finding special cards at the end of each level.",
        maxLevels: 10,
        boughtLevels: 0,
        costType: "linear",
        baseCost: 20,
        costIncrement: 12,

    },{
        id: 4,
        name: "Combo Wombat",
        icon: "https://api.iconify.design/token/wombat.svg",
        description: "Pairing cards starts a combo. Pairing more cards without losing a life grants more gold and XP.",
        maxLevels: 1,
        boughtLevels: 0,
        costType: "flat",
        baseCost: 30,
    },{
        id: 5,
        name: "No Negative Nancy",
        icon: "https://api.iconify.design/icon-park-solid/bad-two.svg",
        description: "Reduces the chance of finding negative cards at the end of each level.",
        maxLevels: 10,
        boughtLevels: 0,
        costType: "linear",
        baseCost: 30,
        costIncrement: 13,
    }
]

export function addSvg(name, svgSrc){
    allUpgrades.find(upgrade => upgrade.name === name).svgSrc = svgSrc;
}

export function getShopUpgrades() {
    return allUpgrades
}

export function buyShopUpgrade(name){
    allUpgrades.find(upgrade => upgrade.name === name).boughtLevels += 1
    saveStuff({upgrades: allUpgrades})
}
