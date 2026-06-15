import {fetchIcons,initEventListeners} from "/web3/scripts/gameInit.js"
import {nextLevel,endGame,startGame,setAllCallbackFunctions} from "/web3/scripts/gameLogic.js"


fetchIcons()
initEventListeners({nextLevel,endGame,startGame})
setAllCallbackFunctions()
