const check = () => {
    fetch('http://localhost:8000/memory/scores')
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
}

check()