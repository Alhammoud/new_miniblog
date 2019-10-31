const mainObj = document.getElementById('main');
const navlinkStrichObj = document.getElementById('navlinkStrich');
const loadCreateBlogPostObj = document.getElementById('loadCreateBlogPost');
const loadShowLoginObj = document.getElementById('loadShowLogin')
const youAreLoggedInObj = document.getElementById('youAreLoggedIn');
const logoutObj = document.getElementById('logout');
let currentUser = "";

const loadBlogPosts = async () => {

    const result = await fetch('http://localhost:3000/blogposts');
    const blogpostsArray = await result.json();

    let blogposts = `<div class="blogposts">`;

    for (let i = 0; i < blogpostsArray.length; i++) {
        blogposts += `<div class="blogpost">
            <h2 class="blog-header">${blogpostsArray[i].title}</h2>
            <div class="blog-body">${blogpostsArray[i].content}
            </div>
        </div>`;
    }
    blogposts += `</div>`;
    mainObj.innerHTML = blogposts;
}

const loadCreateBlogPost = () => {
    const createblogpost = `<div class="new-blogpost">
            <input type="text" placeholder="Blog-Titel eingeben" id="title" />
            <textarea rows="10" id="content"></textarea>
            <button onclick="createPost()">Artikel erstellen</button>
        </div>`;

    mainObj.innerHTML = createblogpost;
}

const loadShowLogin = () => {
    const showlogin = `<div class="new-blogpost">
            <input type="text" placeholder="Deine E-Mail" id="email" />
            <input type="password" placeholder="Dein Passwort" id="password" />
            
            <button onclick="login()">Login</button>
        </div>`;

    mainObj.innerHTML = showlogin;
}

const login = async (useremail, userpassword) => {
    let email, password;
    if (!(useremail || userpassword)) {
        email = document.getElementById('email').value.toLowerCase();
        password = document.getElementById('password').value;

        if (!(email.length > 0 && password.length > 0)) {
            alert('Bitte E-Mail und Passwort eingeben!');
            return;
        }
    } else {
        email = useremail;
        password = userpassword;
    }


    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ // Dieser body wird mit Fetch Post an den Server geschickt
                email: email,
                password: password
            })
        });
        // falls http-antwort 200 oder 304 war 
        if (response.ok) {
            // 2. das objekt als json interpretieren -> wir bekommen ein objekt
            const responseJson = await response.json();
            console.log(responseJson)

            if (responseJson.length > 0) {
                currentUser = responseJson[0].email;
                navlinkStrichObj.classList.toggle('notdisplayed');
                loadCreateBlogPostObj.classList.toggle('notdisplayed');
                youAreLoggedInObj.innerHTML = `Hallo <span style="color: goldenrod;">${currentUser}</span>, du bist eingeloggt! | `
                youAreLoggedInObj.classList.toggle('notdisplayed');
                logoutObj.classList.toggle('notdisplayed');
                loadShowLoginObj.classList.toggle('notdisplayed');
                localStorage.setItem("user", JSON.stringify(responseJson[0]));
                loadBlogPosts();
            } else {
                const sorry = `<div class="new-blogpost warning">Sorry, Login nicht erfolgreich!</div>`;
                mainObj.innerHTML = sorry;

            }

        }
    } catch (e) {
        console.log('Error: ' + e);
    }

}

// logout Funktion für Resource localhost:3000/logout mit POST:

const logout = async () => {
    try {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: currentUser
            })
        });
        // falls http-antwort 200 oder 304 war 
        if (response.ok) {
            // 2. das objekt als json interpretieren -> wir bekommen ein objekt
            const responseJson = await response.json();
            console.log(responseJson)


            if (responseJson.loggedOut) {
                navlinkStrichObj.classList.toggle('notdisplayed');
                loadCreateBlogPostObj.classList.toggle('notdisplayed');
                youAreLoggedInObj.classList.toggle('notdisplayed');
                logoutObj.classList.toggle('notdisplayed');
                loadShowLoginObj.classList.toggle('notdisplayed');
                const success = `<div class="new-blogpost warning">Du hast dich erfolgreich ausgeloggt!</div>`;
                mainObj.innerHTML = success;
                localStorage.clear();
            }
        }

    } catch (e) {
        console.log('Error: ' + e);
    }

}


// logout Funktion für Resource localhost:3000/logout mit GET:
// wird nicht mehr benutzt, durch obige Funktion logout ersetzt

const logoutGet = async () => {
    const result = await fetch('http://localhost:3000/logout');
    const resultJson = await result.json();
    console.log(resultJson);
    if (resultJson.loggedOut) {
        navlinkStrichObj.classList.toggle('notdisplayed');
        loadCreateBlogPostObj.classList.toggle('notdisplayed');
        youAreLoggedInObj.classList.toggle('notdisplayed');
        logoutObj.classList.toggle('notdisplayed');
        loadShowLoginObj.classList.toggle('notdisplayed');
        loadBlogPosts();
    }

}

const createPost = async () => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!(title.length > 0 && content.length > 0)) {
        alert('Bitte Titel und Content eingeben!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/blogpost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        });
        // falls http-antwort 200 oder 304 war 
        if (response.ok) {
            // 2. das objekt als json interpretieren -> wir bekommen ein objekt
            const responseJson = await response.json();
            // 3. als string darstellen
            const responseStr = JSON.stringify(responseJson);
            loadBlogPosts();
        }
    } catch (e) {
        console.log('Error: ' + e);
    }
}
if (localStorage.length === 0) {
    loadBlogPosts();
} else {
    const localStorageUser = JSON.parse(localStorage.getItem("user"));
    login(localStorageUser.email, localStorageUser.password);

}