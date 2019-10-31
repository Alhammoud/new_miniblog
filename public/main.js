const mainObj = document.getElementById('main');
const navCreatePostObj = document.getElementById('navCreatePost');
const navPipeObj = document.getElementById('navPipe');
const navLogoutObj = document.getElementById('navLogout');
const navLoginObj = document.getElementById('navLogin');

const loadBlogPosts = async () => {

    const result = await fetch('http://localhost:3000/blogposts');
    const blogpostsArray = await result.json();

    let blogposts = `<div class="blogposts">`;

    for(let i=0; i<blogpostsArray.length; i++) {
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

const createPost = async () => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    if(!(title.length > 0 && content.length > 0)) {
        alert('Bitte Titel und Content eingeben!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/blogpost',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            });
        // falls http-antwort 200 oder 304 war 
        if(response.ok) {
            // 2. das objekt als json interpretieren -> wir bekommen ein objekt
            const responseJson = await response.json();
            // 3. als string darstellen
            const responseStr = JSON.stringify(responseJson);
            loadBlogPosts();
        }
    }
    catch (e) {
        console.log('Error: ' + e); 
    }     
}

const loadLogin = () => {
    const login = `
        <div class="blogposts login">
            <input type="text" placeholder="email" id="email" />
            <input type="password" placeholder="password" id="password" />
            <button id="btnLogin" onclick="login()">Login</button>
        </div>`;

    mainObj.innerHTML = login;
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
                navCreatePostObj.style.display = 'inline-block';
                navPipeObj.style.display = 'inline-block';
                navLoginObj.style.display = 'none';
                navLogoutObj.style.display = 'inline-block';
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


/* 
const login = async () => {
    
    const emailObj = document.getElementById('email');
    const passwordObj = document.getElementById('password');
    try {
        const response = await fetch('http://localhost:3000/login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailObj.value,
                    password: passwordObj.value
                })
            });
        // falls http-antwort 200 oder 304 war 
        if(response.ok) {
            // 2. das objekt als json interpretieren -> wir bekommen ein objekt
            const responseObj = await response.json();
            console.log('responseObj');
            console.log(responseObj);
            if(responseObj.error != 0) {
                alert('Login failed!');

                emailObj.value = '';
                passwordObj.value = '';
                return;
            }

            navCreatePostObj.style.display = 'inline-block';
            navPipeObj.style.display = 'inline-block';
            navLoginObj.style.display = 'none';
            navLogoutObj.style.display = 'inline-block';
            if(responseObj.error===0){

                //TODO save same timestamp in LS as used for the session
                
                localStorage.setItem("user", JSON.stringify(responseObj));
            }else{
                localStorage.removeItem("user");
            }

            loadBlogPosts();
        }
    }
    catch (e) {
        console.log('Error: ' + e); 
    }  
} */

const logout = async () => {
    try {
        const response = await fetch('http://localhost:3000/logout',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        if(response.ok) {
            const responseObj = await response.json();
            if(responseObj.error != 0) {
                alert('Logout failed!');
                return;
            }

            navCreatePostObj.style.display = 'none';
            navPipeObj.style.display = 'none';
            navLoginObj.style.display = 'inline-block';
            navLogoutObj.style.display = 'none';
            loadBlogPosts();
        }
    }
    catch (e) {
        console.log('Error: ' + e); 
    }      
}

// loadBlogPosts();

navCreatePostObj.style.display = 'none';
navPipeObj.style.display = 'none';
navLogoutObj.style.display = 'none';

if (localStorage.length === 0) {
    loadBlogPosts();
} else {
    const localStorageUser = JSON.parse(localStorage.getItem("user"));
    login(localStorageUser.email, localStorageUser.password);

}