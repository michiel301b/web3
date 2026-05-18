
let cardExplanations = [
    {card:"Heart",type:"special",description:"Heals 2 hearts when paired",imgSrc:"https://api.iconify.design/mdi/heart.svg"},
    {card:"Hollow-Heart",type:"special",description:"Heals 1 heart when paired",imgSrc:"https://api.iconify.design/mdi/heart-outline.svg"},
    {card:"Hollow-Star",type:"special",description:"Grants 1.5x xp when paired",imgSrc:"https://api.iconify.design/mdi/star-outline.svg"},
    {card:"Star",type:"special",description:"Grants double xp when paired",imgSrc:"https://api.iconify.design/mdi/star.svg"},
    {card:"Square",type:"normal",description:"Just a boring square",imgSrc:"https://api.iconify.design/mdi/square.svg"},
    {card:"Hollow-Square",type:"normal",description:"Just a boring square",imgSrc:"https://api.iconify.design/mdi/square-outline.svg"},
    {card:"Circle",type:"normal",description:"Just a boring circle",imgSrc:"https://api.iconify.design/mdi/circle.svg"},
    {card:"Hollow-Circle",type:"normal",description:"Just a boring circle",imgSrc:"https://api.iconify.design/mdi/circle-outline.svg"},
]




function addCardExplanation(card,description = "Normal card",imgSrc = ""){
    let newCard = {card:card,description:description,imgSrc:imgSrc};
    cardExplanations.push(newCard);
}

export function getCardExplanations() {
    return cardExplanations;
}

export function getCardExplanation(card) {
    return cardExplanations.find(item => item.card === card)
}

export function setcallback(callback,card){
    cardExplanations.find(item => item.card === card).callback = callback;
}

export function addSvg(card, svgSrc){
    cardExplanations.find(item => item.card === card).svgSrc = svgSrc;
}