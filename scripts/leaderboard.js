const check = () => {
    return fetch('http://localhost:8000/memory/scores')
        .then(res => res.json())
}

check().then(json => parseScoreJSON(json))

function parseScoreJSON(json) {
    console.log(json)


}