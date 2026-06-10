document.getElementById("loginForm").addEventListener("submit", registerOrLogin);





async function registerOrLogin(event) {
    event.preventDefault();

    let form = event.target;
    let currentLoginAttempt = {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value
    }
    let validBool = validateCredentials(currentLoginAttempt.username, currentLoginAttempt.email, currentLoginAttempt.password);
    if (validBool) {
        let localUsers = loadStuff().users || []
        for (let user of localUsers) {
            if (user.email === currentLoginAttempt.email) {
                if (user.username === currentLoginAttempt.username && user.password === await hashString(currentLoginAttempt.password)) {
                    await loginUser(currentLoginAttempt);
                    return false;
                }
                alert("email is already in use, but other credentials may not match.");
                console.log(user.username, currentLoginAttempt.username, user.password, await hashString(currentLoginAttempt.password))
                return false;
            }
        }
        await registerUser(currentLoginAttempt);
        await loginUser(currentLoginAttempt);
        return false;
    }
    else {
        document.getElementById("bad-login-entry").classList.remove("hidden");
    }
    return false;
}

function validateCredentials(username, email, password) {
    if (username.length < 3) {
        return false
    }
    if (!email.includes("@")) {
        return false
    }
    if (password.length < 8) {
        return false
    }
    return true;
}

async function loginUser(currentLoginAttempt) {
    currentLoginAttempt.password = await hashString(currentLoginAttempt.password)
    const user = window.oldFetch("http://localhost:8000/memory/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: currentLoginAttempt.username,
            email: currentLoginAttempt.email,
            password: currentLoginAttempt.password
        })
    }).then(res => {
        if (res.status === 200) {
            return res.json()
        }
        else{
            throw new Error(res.statusText);
        }
    })
        .then((data) => {
            localStorage.setItem("token",data.token)
            window.location.replace("http://localhost:63342/web3/Templates/home_page.html");
        })
        .catch(err => console.log(err));
    console.log("logged in ", currentLoginAttempt)
}

async function registerUser(currentLoginAttempt) {
    currentLoginAttempt.password = await hashString(currentLoginAttempt.password)
    let users = loadStuff().users || [{}]
    users.push(currentLoginAttempt);
    saveStuff({users});
    console.log("registered ", currentLoginAttempt)

    const user = window.oldFetch("http://localhost:8000/memory/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: currentLoginAttempt.username,
            email: currentLoginAttempt.email,
            password: currentLoginAttempt.password
        })
    }).then(res => console.log(res.status))
}

async function hashString(str) {
    return str;
}


// async function hashString(str) {                         //inconsistent????
//     const data = new TextEncoder().encode(str);
//     const hashBuffer = await crypto.subtle.digest("SHA-256", data);
//
//     return [...new Uint8Array(hashBuffer)]
//         .map(b => b.toString(16).padStart(2, "0"))
//         .join("");
// }

// let strings = ["test1","name","password","reallylongpasswordforsomereasonidonevenknow","12345678"]
//
// testHashString()
// testHashString()
//
// async function testHashString() {
//     for (let string of strings) {
//         console.log(string);
//         console.log(await hashString(string))
//     }
// }

