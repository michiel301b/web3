import {fetchIcons,initEventListeners} from "/scripts/gameInit.js"
import {nextLevel,endGame,startGame,setAllCallbackFunctions} from "/scripts/gameLogic.js"


fetchIcons()
initEventListeners({nextLevel,endGame,startGame})
setAllCallbackFunctions()
