const students = [
    { name: "Алихан", rating: 94, achievements: 5, dateJoined: "2026-02-20", isPremium: false },
    { name: "Мария", rating: 98, achievements: 8, dateJoined: "2026-02-26", isPremium: true }
];

// Функция ранжирования для Премиум-компаний
function getTopTalents(data) {
    return data.sort((a, b) => {
        // Приоритет тем, кто больше загрузил достижений и имеет выше рейтинг
        return (b.rating + b.achievements) - (a.rating + a.achievements);
    }).slice(0, 10); // Отдаем топ-10
}
function renderStudentFeed() {
    const feed = document.getElementById('student-feed');
    students.forEach(student => {
        const card = `
            <div class="student-card">
                <img src="avatar_${student.id}.jpg" class="post-img">
                <div class="card-info">
                    <h4>${student.name}</h4>
                    <p>${student.description}</p>
                    <div class="achievements-grid">
                        </div>
                    <button class="btn-request" onclick="sendInterviewRequest(${student.id})">
                        Кинуть запрос на общение
                    </button>
                </div>
            </div>
        `;
        feed.innerHTML += card;
    });
}
function checkCaseAccess(caseId) {
    const currentCase = cases.find(c => c.id === caseId);
    const hoursSincePost = (new Date() - currentCase.postedAt) / 36e5;

    if (currentCase.isTopBrand && hoursSincePost < 48) {
        if (!user.isPremium) {
            alert("Этот кейс доступен только Премиум-пользователям еще " + (48 - hoursSincePost).toFixed(0) + " часов");
            return false;
        }
    }
    return true;
}
function showForm(role) {
    // Смена вкладок
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Смена форм
    if (role === 'student') {
        document.getElementById('student-form').style.display = 'flex';
        document.getElementById('company-form').style.display = 'none';
    } else {
        document.getElementById('student-form').style.display = 'none';
        document.getElementById('company-form').style.display = 'flex';
    }
}

function submitToGoogle(type) {
    const form = document.getElementById(type + '-form');
    const formData = new FormData(form);
    
    // ССЫЛКИ НА РАЗНЫЕ ФОРМЫ (Или одну, но с разными ID)
    let googleFormURL = "";
    let dataEntries = {};

    if (type === 'student') {
        googleFormURL = "URL_ФОРМЫ_СТУДЕНТОВ";
        dataEntries = {
            "entry.111": formData.get('fullName'),
            "entry.222": formData.get('email'),
            "entry.333": formData.get('portfolio'),
            "entry.444": formData.get('age')
        };
        localStorage.setItem('userRole', 'student');
    } else {
        googleFormURL = "URL_ФОРМЫ_КОМПАНИЙ";
        dataEntries = {
            "entry.555": formData.get('compName'),
            "entry.666": formData.get('email'),
            "entry.777": formData.get('bin')
        };
        localStorage.setItem('userRole', 'company');
    }

    // Отправка
    const finalData = new FormData();
    for (let key in dataEntries) { finalData.append(key, dataEntries[key]); }

    fetch(googleFormURL, {
        method: "POST",
        mode: "no-cors",
        body: finalData
    }).then(() => {
        alert("Регистрация " + type + " прошла успешно!");
        window.location.href = "feed.html"; // Переход в ленту
    });
}
// Функция навигации между экранами
function navigateTo(screenId) {
    // Скрываем все секции
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('profile-screen').style.display = 'none';

    // Показываем нужную
    document.getElementById(screenId).style.display = 'block';
}

// Переключение между Студентом и Компанией в окне регистрации
function toggleRole(role) {
    const isStudent = role === 'student';
    
    // Переключаем видимость полей
    document.getElementById('student-fields').style.display = isStudent ? 'flex' : 'none';
    document.getElementById('company-fields').style.display = isStudent ? 'none' : 'flex';
    
    // Переключаем активную вкладку (стили)
    document.getElementById('tab-stud').classList.toggle('active', isStudent);
    document.getElementById('tab-comp').classList.toggle('active', !isStudent);
}

// Обработка регистрации
function handleAuth(type) {
    const name = document.getElementById(type === 'student' ? 's-name' : 'c-name').value;
    const email = document.getElementById(type === 'student' ? 's-email' : 'c-email').value;

    if (!name || !email) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    // Сохраняем в localStorage для имитации базы данных
    const userData = { type, name, email, verified: true };
    localStorage.setItem('currentUser', JSON.stringify(userData));

    // Переходим в профиль
    navigateTo('profile-screen');
    renderProfileData(userData);
}

function fakeVerify() {
    alert("Код подтверждения отправлен на вашу почту!");
}
function switchTab(role) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('student-form').style.display = (role === 'student') ? 'block' : 'none';
    document.getElementById('company-form').style.display = (role === 'company') ? 'block' : 'none';
}

function register(type) {
    const name = document.getElementById(type === 'student' ? 's-name' : 'c-name').value;
    const email = document.getElementById(type === 'student' ? 's-email' : 'c-email').value;

    if(!name || !email) return alert("Fill all fields");

    const userObj = {
        type: type,
        name: name,
        email: email,
        isVerified: type === 'company' // Компании по умолчанию верифицированы для демо
    };

    // Сохраняем в LocalStorage
    localStorage.setItem('currentUser', JSON.stringify(userObj));
    
    // Имитация базы данных (добавляем в общий список)
    let allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    allUsers.push(userObj);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    renderProfile(userObj);
}

function renderProfile(user) {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('profile-screen').style.display = 'block';
    
    document.getElementById('prof-name').innerHTML = user.name;
    document.getElementById('prof-sub').innerText = user.email;

    if(user.type === 'student') {
        document.getElementById('student-grid').style.display = 'grid';
        document.getElementById('company-cases').style.display = 'none';
    } else {
        document.getElementById('student-grid').style.display = 'none';
        document.getElementById('company-cases').style.display = 'block';
        document.getElementById('verified-mark').style.display = 'inline';
    }
}

// Загрузка фото в сетку (имитация поста)
function uploadPost(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        const grid = document.getElementById('student-grid');
        const div = document.createElement('div');
        div.className = 'post-item';
        div.innerHTML = `<img src="${url}">`;
        grid.appendChild(div);
    }
}
let selectedRole = 'student';

// Функция переключения экранов
function showScreen(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    // Показываем нужный
    const target = document.getElementById(screenId);
    target.style.display = (screenId === 'screen-auth') ? 'flex' : 'block';
    window.scrollTo(0,0);
}

// Кнопки возраста (Yes/No)
function selectAge(btn) {
    // Снимаем выделение со всех кнопок в ряду
    btn.parentElement.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
    // Выделяем нажатую
    btn.classList.add('selected');
}

function setRole(role) {
    selectedRole = role;
    document.getElementById('t-s').classList.toggle('active', role === 'student');
    document.getElementById('t-c').classList.toggle('active', role === 'company');
}

function completeRegistration() {
    const name = document.getElementById('user-name').value;
    if(!name) return alert("Введите имя!");

    document.getElementById('prof-title').innerText = name;
    
    // Эмуляция сохранения
    localStorage.setItem('user', JSON.stringify({name, role: selectedRole}));
    
    // Переход сразу в профиль
    showScreen('screen-profile');
}

// Добавление фото в профиль и дублирование в ленту
function addPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        
        // 1. Добавляем в сетку профиля
        const grid = document.getElementById('profile-posts');
        const post = document.createElement('div');
        post.className = 'post-item';
        post.innerHTML = `<img src="${url}">`;
        grid.appendChild(post);

        // 2. Добавляем в общую ленту (Feed)
        const feed = document.getElementById('global-feed');
        const feedPost = document.createElement('div');
        feedPost.className = 'feed-card';
        feedPost.innerHTML = `
            <div class="card-user">@${document.getElementById('prof-title').innerText}</div>
            <img src="${url}">
            <div class="card-footer">Лайк | Откликнуться</div>
        `;
        feed.prepend(feedPost);
    }
}