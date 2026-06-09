let oldFetch = window.fetch;


function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
}

async function fetch(url, options = {}) {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
        logout();
        throw new Error("Token expired");
    }

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`
    }
    return oldFetch(url, options);
}

function logout() {
    //todo
    localStorage.removeItem("token");
}