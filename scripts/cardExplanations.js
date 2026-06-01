
let cardExplanations = [
    {card:"Square",             category:"shapes",type:"normal",description:"Just a boring square",imgSrc:"https://api.iconify.design/mdi/square.svg"},
    {card:"Hollow-Square",      category:"shapes",type:"normal",description:"Just a boring square",imgSrc:"https://api.iconify.design/mdi/square-outline.svg"},
    {card:"Circle",             category:"shapes",type:"normal",description:"Just a boring circle",imgSrc:"https://api.iconify.design/mdi/circle.svg"},
    {card:"Hollow-Circle",      category:"shapes",type:"normal",description:"Just a boring circle",imgSrc:"https://api.iconify.design/mdi/circle-outline.svg"},
    {card:"Pentagon",           category:"shapes",type:"normal",description:"Just a boring pentagon",imgSrc:"https://api.iconify.design/mdi/pentagon.svg"},
    {card:"Hollow-Pentagon",    category:"shapes",type:"normal",description:"Just a boring pentagon",imgSrc:"https://api.iconify.design/mdi/pentagon-outline.svg"},
    {card:"Droplet",            category:"shapes",type:"normal",description:"Just a boring droplet",imgSrc:"https://api.iconify.design/mdi/water.svg"},
    {card:"Hollow-Droplet",     category:"shapes",type:"normal",description:"Just a boring droplet",imgSrc:"https://api.iconify.design/mdi/water-outline.svg"},
    {card:"Arrow-Down",         category:"shapes",type:"normal",description:"Just a boring arrow",imgSrc:"https://api.iconify.design/mdi/arrow-down-bold.svg"},
    {card:"Hollow-Arrow-Down",  category:"shapes",type:"normal",description:"Just a boring arrow",imgSrc:"https://api.iconify.design/mdi/arrow-down-bold-outline.svg"},
    {card:"Arrow-Up",           category:"shapes",type:"normal",description:"Just a boring arrow",imgSrc:"https://api.iconify.design/mdi/arrow-up-bold.svg"},
    {card:"Hollow-Arrow-Up",    category:"shapes",type:"normal",description:"Just a boring arrow",imgSrc:"https://api.iconify.design/mdi/arrow-up-bold-outline.svg"},
    {card:"Arrow-Left",         category:"shapes",type:"normal",description:"Just a boring arrow",imgSrc:"https://api.iconify.design/mdi/arrow-left-bold.svg"},
    {card:"Hollow-Arrow-Left",  category:"shapes",type:"normal",description:"Just a boring arrow",imgSrc:"https://api.iconify.design/mdi/arrow-left-bold-outline.svg"},
    {card:"Arrow-Right",        category:"shapes",type:"normal",description:"Just a boring arrow",imgSrc:"https://api.iconify.design/mdi/arrow-right-bold.svg"},
    {card:"Hollow-Arrow-Right", category:"shapes",type:"normal",description:"Just a boring arrow",imgSrc:"https://api.iconify.design/mdi/arrow-right-bold-outline.svg"},

    {card:"Heart",              category:"shapes",type:"special",description:"Heals 2 hearts when paired",imgSrc:"https://api.iconify.design/mdi/heart.svg"},
    {card:"Hollow-Heart",       category:"shapes",type:"special",description:"Heals 1 heart when paired",imgSrc:"https://api.iconify.design/mdi/heart-outline.svg"},
    {card:"Star",               category:"shapes",type:"special",description:"Grants double xp when paired",imgSrc:"https://api.iconify.design/mdi/star.svg"},
    {card:"Hollow-Star",        category:"shapes",type:"special",description:"Grants 1.5x xp when paired",imgSrc:"https://api.iconify.design/mdi/star-outline.svg"},
    {card:"Book",               category:"shapes",type:"special",description:"Something to do with reading probably. maybe get info?",imgSrc:"https://api.iconify.design/mdi/book-open-variant.svg"},
    {card:"Hollow-Book",        category:"shapes",type:"special",description:"Something to do with reading probably. maybe get info?",imgSrc:"https://api.iconify.design/mdi/book-open-blank-variant-outline.svg"},
    {card:"Duplicate",          category:"shapes",type:"special",description:"Appears twice as often, easier to match",imgSrc:"https://api.iconify.design/material-symbols/auto-awesome-motion-sharp.svg"},
    {card:"Washing-Machine",    category:"appliances",type:"special",description:"Shuffles unsolved cards when paired",imgSrc:"https://api.iconify.design/mdi/washing-machine.svg"},
    {card:"Shredder",           category:"appliances",type:"special",description:"Shreds two unsolved matching cards",imgSrc:"https://api.iconify.design/lucide/shredder.svg"},
    {card:"Magnet",             category:"appliances",type:"special",description:"Will always be next to another magnet",imgSrc:"https://api.iconify.design/mdi/magnet.svg"},
    {card:"Hollow-Crystal-Ball",category:"appliances",type:"special",description:"Will reveal an unsolved card",imgSrc:"https://api.iconify.design/mdi/crystal-ball.svg"},
    {card:"Crystal-Ball",       category:"appliances",type:"special",description:"Will reveal two unsolved cards",imgSrc:"https://api.iconify.design/mingcute/crystal-ball-fill.svg"},
]




function addCardExplanation(card,description = "Normal card",imgSrc = ""){
    let newCard = {card:card,description:description,imgSrc:imgSrc};
    cardExplanations.push(newCard);
}

export function getCardExplanations(category="",type="") {
    if (category === "" && type === "") {
        return cardExplanations;
    }
    if (category === "") {
        return cardExplanations.filter(card => card.type === type);
    }
    if (type === "") {
        return cardExplanations.filter(card => card.category === category);
    }
    return cardExplanations.filter(card => card.category === category && card.type === type);
}

export function getCardExplanation(card) {
    return cardExplanations.find(item => item.card === card)
}

export function setCallback(card,callback,moment="onpair"){
    cardExplanations.find(item => item.card === card).callback = callback;
    cardExplanations.find(item => item.card === card).callbackMoment = moment;
}

export function addSvg(card, svgSrc){
    cardExplanations.find(item => item.card === card).svgSrc = svgSrc;
}