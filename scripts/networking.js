window.oldFetch = window.fetch;


function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("token: ",token);
    console.log("payload: ",payload);
    console.log("exp: ", payload.exp);
    console.log("now: ",Date.now());
    return Date.now() >= payload.exp * 1000;
}

window.fetch = async function(url, options = {}) {
    const token = localStorage.getItem("token");
    console.log("token: ", token);

    if (!token || isTokenExpired(token)) {
        logout();
        throw new Error("Token expired");
    }

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`
    }
    return window.oldFetch(url, options);
}

function logout() {
    //todo
    localStorage.removeItem("token");
    window.location.replace("/web3/Templates/login.html");
}