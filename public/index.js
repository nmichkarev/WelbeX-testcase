const LOGIN_PAGE = 'login-page';
const LIST_PAGE = 'list-page';
const CREATE_PAGE = 'create-page';
const UPDATE_PAGE = 'update-page';

const appData = {
    posts: []
};

window.onload = function() {
    const token = appData.token = localStorage.getItem('token');
    if (!token) {
        switchPage('login');
        return;
    }
    appData.headers = {
        authorization: `bearer ${token}`,
        'Content-Type': 'application/json'
    }

    updatePosts()
}

const parseResponse = response => {
    if (response.status > 399) return response.text().then(err => { throw err });
    return response.text()
}

function switchPage(page) {
    
    const loginPage = document.getElementById(LOGIN_PAGE);
    loginPage.style.display = 'none';
    const listPage = document.getElementById(LIST_PAGE)
    listPage.style.display = 'none';
    const createPage = document.getElementById(CREATE_PAGE)
    createPage.style.display = 'none';
    const updatePage = document.getElementById(UPDATE_PAGE)
    updatePage.style.display = 'none';

    switch (page) {
        case 'login':
            loginPage.style.display = 'block';
            break;
        case 'list':
            listPage.style.display = 'block';
            break;
        case 'create':
            createPage.style.display = 'block';
            document.getElementById('post-content').focus();
        break;
        case 'edit':
            updatePage.style.display = 'block';
            document.getElementById('post-content-update').focus();
        break;
    }
}

function appendPostsHtml(posts) {  
    const postsContainer = document.getElementById('list-page-posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        postsContainer.appendChild(createPostElement(post))
    });
}

function createPostElement(post) {
    const postContainer = document.createElement('li');
    postContainer.className = 'post'
    const postContainerHtml = `
        <div class="inline-block" style="max-width: calc(100% - 240px);">${post.content}</div>
        <div class="inline-block float-right">
            <div class="edit-post-button button" data-id="${post.id}">Редактировать</div>
            <div class="delete-post-button button" data-id="${post.id}">Удалить</div>
        </div>
        <div class="mt-5 font-light text-sm italic">
            <div class="inline-block mr-5">Автор: ${post.author.login}</div>|
            <div class="inline-block ml-5">Создан: ${post.createdAt}</div>
        </div>
    `
    postContainer.innerHTML = postContainerHtml;
    return postContainer;
}

function updatePosts() {
    return fetch('/posts', {
        headers: {
            authorization: `bearer ${appData.token}`
        }
    })
        .then(response => {
            if (response.status > 399) { return response.text() }
            return response.json();
        })
        .then(posts => {
            appData.posts = posts;
            return posts;
        })
        .then(appendPostsHtml)
        .then(() => switchPage('list'))
        .catch(err => {
            alert(err);
            switchPage('login');
        })
}

function updatePostCreatePage() {
    const post = appData.posts[appData.editingPost];
    
    document.getElementById('post-content').value = post ? post.content : '';
}

function updateEditPostPage() {
    const post = appData.posts.find(post => post.id === appData.editingPost);
    document.getElementById('post-content-update').value = post.content;
}

function logIn(login, password) {
    return fetch('/auth/login', {
        body: JSON.stringify({ login, password }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(parseResponse)
    .then(setToken)
    .then(updatePosts)
}

function register(login, password) {
    return fetch('/auth/register', {
        body: JSON.stringify({ login, password }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(parseResponse)
    .then(setToken)
    .then(updatePosts);
}

function setToken(token) {
    localStorage.setItem('token', token);
    appData.token = token;
    appData.headers = {
        authorization: `bearer ${token}`,
        'Content-Type': 'application/json'
    }
}

function checkIfLoggedIn() {
    return localStorage.getItem('token');
}

function handleLoginClick() {
    const login = document.getElementById('login-field').value;
    const password = document.getElementById('password-field').value;
    logIn(login, password)
        .then(() => switchPage('list'))
        .catch(alert);
}

function handleRegisterClick() {
    const login = document.getElementById('login-field').value;
    const password = document.getElementById('password-field').value;
    register(login, password)
        .then(() => switchPage('list'))
        .catch(alert);
}

function handleCreatePostClick() {
    switchPage('create');
}

function handleEditPostClick(postId) {
    appData.editingPost = +postId;
    updateEditPostPage();
    switchPage('edit')
}

function handleDeletePostClick(postId) {
    const sure = confirm('Хотите удалить?');
    if (!sure) return;
    fetch(`posts/${postId}`, {
        method: 'DELETE',
        headers: appData.headers
    }).then(parseResponse)
    .then(updatePosts)
    .catch(e => {
        alert(e);
    })
}

function uploadMediaCreate() {
    const file = fileupload.files[0]
    uploadMedia(file, 'post-content');
}

function uploadMediaUpdate() {
    const file = fileuploadupdate.files[0]
    uploadMedia(file, 'post-content-update');
}

function uploadMedia(file, appendSelector) {
    const formData = new FormData();
    formData.append('file', file);
    const isImage = file.type.indexOf('image') === 0;
    const isVideo = file.type.indexOf('video') === 0;

    if (!isImage && !isVideo) return;
    fetch('/media/upload', {
        method: 'POST',
        body: formData,
        headers: {
            authorization: `bearer ${appData.token}`
        }
    }).then(parseResponse).then(filepath => {
        console.log('on append')
        appendMedia(appendSelector, 'files/' + filepath, isVideo);
    }) 
}

function appendMedia(selector, path, isVideo) {
    const media = isVideo 
    ? '<video autoplay src="' + path +'" />'
    : '<image src="' + path +'" />';
    document.getElementById(selector)
        .value += '\n' + media + '\n';
}

function savePost() {
    const postContent = document.getElementById('post-content').value;

    fetch('/posts', {
        method: 'POST',
        headers: appData.headers,
        body: JSON.stringify({ content: postContent })
    }).then(response => {
        if (response.status > 399) return response.text().then(err => { throw err });
        updatePosts();
    }).then(resetCreatePage)
    .catch(err => {
        console.log(err.message)
        alert(err)
    });
}

function updatePost() {
    const postContent = document.getElementById('post-content-update').value;

    fetch(`/posts/${appData.editingPost}`, {
        method: 'PATCH',
        headers: appData.headers,
        body: JSON.stringify({ content: postContent })
    }).then(parseResponse)
    .then(updatePosts)
    .catch(err => {
        console.log(err.message)
        alert(err)
    });   
}

function resetCreatePage() {
    document.getElementById('post-content').value = '';
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}

document.addEventListener('click', ev => {
    switch (ev.target.id) {
        case 'button-login':
            handleLoginClick();
            break;
        case 'button-reg':
            handleRegisterClick();
            break;
        case 'list-page-create-button':
            handleCreatePostClick();
            break;
        case 'create-page-back':
        case 'update-page-back':
            switchPage('list');
            break;
        case 'create-page-media-button':
            fileupload.click()
            break;
        case 'create-page-save-button':
            savePost();
            break;
        case 'update-page-media-button':
            fileuploadupdate.click();
            break;
        case 'update-page-save-button':
            updatePost();
            break;
        case 'list-page-logout':
            logout();
            break;
        default:
            break;
    }
})

document.addEventListener('click', ev => {
    switch (ev.target.className.split(' ')[0]) {
        case 'edit-post-button':
            handleEditPostClick(ev.target.dataset.id)
            break;
        case 'delete-post-button':
            handleDeletePostClick(ev.target.dataset.id);
            break;
    }
})

document.addEventListener('change', ev => {
    if (ev.target.id === 'fileupload') {
        uploadMediaCreate()
    }
    if (ev.target.id === 'fileuploadupdate') {
        uploadMediaUpdate();
    }
})
