let allUpgrades = [
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
        maxLevels: 10,
        boughtLevels: 0,
        costType: "linear",
        baseCost: 5,
        costIncrement: 12
    },{
        id: 2,
        name: "A Greater Selection",
        icon: "https://api.iconify.design/streamline-ultimate/card-add-1-bold.svg",
        description: "Adds an extra card to the selection screen at the end of each level",
        maxLevels: 1,
        boughtLevels: 0,
        costType: "flat",
        baseCost: 200
    },{
        id: 3,
        name: "Special Card Odds Up",
        icon: "",
        description: "Increases the chance of finding special cards at the end of each level",
        maxLevels: 10,
        boughtLevels: 0,

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
}
