
let cardExplanations = [
    {card:"Heart",          category:"shapes",type:"special",description:"Heals 2 hearts when paired",imgSrc:"https://api.iconify.design/mdi/heart.svg"},
    {card:"Hollow-Heart",   category:"shapes",type:"special",description:"Heals 1 heart when paired",imgSrc:"https://api.iconify.design/mdi/heart-outline.svg"},
    {card:"Star",           category:"shapes",type:"special",description:"Grants double xp when paired",imgSrc:"https://api.iconify.design/mdi/star.svg"},
    {card:"Hollow-Star",    category:"shapes",type:"special",description:"Grants 1.5x xp when paired",imgSrc:"https://api.iconify.design/mdi/star-outline.svg"},
    {card:"Square",         category:"shapes",type:"normal",description:"Just a boring square",imgSrc:"https://api.iconify.design/mdi/square.svg"},
    {card:"Hollow-Square",  category:"shapes",type:"normal",description:"Just a boring square",imgSrc:"https://api.iconify.design/mdi/square-outline.svg"},
    {card:"Circle",         category:"shapes",type:"normal",description:"Just a boring circle",imgSrc:"https://api.iconify.design/mdi/circle.svg"},
    {card:"Hollow-Circle",  category:"shapes",type:"normal",description:"Just a boring circle",imgSrc:"https://api.iconify.design/mdi/circle-outline.svg"},
    {card:"Pentagon",       category:"shapes",type:"normal",description:"Just a boring pentagon",imgSrc:"https://api.iconify.design/mdi/pentagon.svg"},
    {card:"Hollow-Pentagon",category:"shapes",type:"normal",description:"Just a boring pentagon",imgSrc:"https://api.iconify.design/mdi/pentagon-outline.svg"},
    {card:"Droplet",        category:"shapes",type:"normal",description:"Just a boring droplet",imgSrc:"https://api.iconify.design/mdi/water.svg"},
    {card:"Hollow-Droplet", category:"shapes",type:"normal",description:"Just a boring droplet",imgSrc:"https://api.iconify.design/mdi/water-outline.svg"},
    {card:"Duplicate",      category:"shapes",type:"special",description:"Appears twice as often, easier to match",imgSrc:"https://api.iconify.design/material-symbols/auto-awesome-motion-sharp.svg"},
    {card:"Washing-Machine",category:"appliances",type:"special",description:"Shuffles unsolved cards when paired",imgSrc:"https://api.iconify.design/mdi/washing-machine.svg"},
    {card:"Shredder",       category:"appliances",type:"special",description:"Shreds two unsolved matching cards",imgSrc:"https://api.iconify.design/lucide/shredder.svg"},
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

export function setcallback(card,callback){
    cardExplanations.find(item => item.card === card).callback = callback;
}

export function addSvg(card, svgSrc){
    cardExplanations.find(item => item.card === card).svgSrc = svgSrc;
}