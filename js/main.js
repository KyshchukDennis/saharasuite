document.addEventListener('DOMContentLoaded', () => {
    const isLogged = localStorage.getItem('isLogged');
    const userName = localStorage.getItem('userName') || 'Гість'; // Отримуємо ім'я з пам'яті
    const authTrigger = document.getElementById('auth-trigger');

    if (isLogged === 'true' && authTrigger) {
        authTrigger.innerHTML = `
            <div class="user-logged-info">
                <i class="fa-solid fa-circle-user" style="color: var(--bg-green);"></i>
                <span>${userName}</span> 
            </div>
            <div class="auth-dropdown" id="auth-dropdown">
                <a href="#" id="logout-btn" style="color: #e74c3c; font-weight: bold;">Вийти</a>
            </div>
        `;
        // ... далі твій код на logoutBtn

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLogged');
                window.location.reload();
            });
        }
    }
});

// 2. БУРГЕР МЕНЮ
const burger = document.getElementById('burger-menu');
const navLinks = document.getElementById('nav-links');

if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (burger) burger.classList.remove('open');
        if (navLinks) navLinks.classList.remove('active');
    });
});

// 3. ЛОГІКА ВИПАДАЮЧОГО МЕНЮ АВТОРИЗАЦІЇ
const authTrigger = document.getElementById('auth-trigger');
if (authTrigger) {
    authTrigger.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const authDropdown = document.getElementById('auth-dropdown');
        if (authDropdown) authDropdown.classList.toggle('active');
    });
}

document.addEventListener('click', () => {
    const authDropdown = document.getElementById('auth-dropdown');
    if (authDropdown) authDropdown.classList.remove('active');
});

// 4. ЛОГІКА ФОРМИ ПІДПИСКИ
const subscribeForm = document.getElementById('email-form');
const successMsg = document.getElementById('success-msg');

if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        subscribeForm.style.display = 'none'; 
        successMsg.style.display = 'block'; 
    });
}

// 5. ФОРМА ВХОДУ (login.html)
const loginForm = document.getElementById('login-form');
const forgotLink = document.getElementById('forgot-link');
const loginFields = document.getElementById('login-fields');
const recoverFields = document.getElementById('recover-fields');
const authTitle = document.getElementById('auth-title');
const authBtn = document.getElementById('auth-btn');
const errorMsg = document.getElementById('error-msg');

if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFields.style.display = 'none';
        recoverFields.style.display = 'flex';
        authTitle.innerText = "Відновлення пароля";
        authBtn.innerText = "Надіслати код";
        forgotLink.style.display = 'none';
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('username').value; 
        const password = document.getElementById('password').value;

        const formData = { email, password };

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // --- ОСЬ ЦЯ ЧАСТИНА, ПРО ЯКУ ТИ ПИТАВ ---
            const responseText = await response.text(); 
            console.log("Відповідь сервера (сирий текст):", responseText); 

            try {
                const result = JSON.parse(responseText); 
                if (result.status === 'success') {
                    localStorage.setItem('isLogged', 'true');
                    localStorage.setItem('userName', result.user_name);
                    window.location.href = 'index.html';
                } else {
                    alert(result.message);
                }
            } catch (e) {
                console.error("Сервер повернув не JSON. Текст відповіді:", responseText);
                alert("Помилка сервера. Глянь у консоль!");
            }
            // --- КІНЕЦЬ ПРАВКИ ---

        } catch (error) {
            console.error('Критична помилка входу:', error);
            alert("Сервер не відповідає!");
        }
    });
}
// 6. ФОРМА РЕЄСТРАЦІЇ (ВИПРАВЛЕНО)
const regForm = document.getElementById('register-form');

if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        // 1. Отримуємо дані з полів (ПЕРЕВІР ID!)
        const firstName = document.getElementById('reg-first-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        // ТУТ БУЛА ПОМИЛКА - ТЕПЕР ВІРНО:
        const confirmPassword = document.getElementById('reg-confirm-password').value; 
        const phone = document.getElementById('reg-phone') ? document.getElementById('reg-phone').value : "000";

        // 2. Перевірка паролів
        if (password !== confirmPassword) {
            const errorMsg = document.getElementById('reg-error-msg');
            if (errorMsg) errorMsg.style.display = 'block';
            else alert("Паролі не збігаються!");
            return;
        }

        // 3. Формуємо об'єкт
        const formData = {
            first_name: firstName,
            email: email,
            password: password,
            phone: phone
        };

        try {
            const response = await fetch('api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // Перевіряємо, чи повернув сервер текст (якщо там помилка PHP)
            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error("Сервер повернув не JSON:", text);
                alert("Помилка сервера. Перевір консоль (F12) -> Network");
                return;
            }

            if (result.status === 'success') {
                // Пряма логіка успіху, якщо showSuccessMessage не визначена
                regForm.style.display = 'none';
                const successBlock = document.getElementById('reg-success');
                const successTitle = document.getElementById('success-user-msg');
                if (successBlock) successBlock.style.display = 'block';
                if (successTitle) successTitle.innerText = `Вітаємо, ${firstName}!`;
            } else {
                alert(result.message);
            }

        } catch (error) {
            console.error('Помилка:', error);
            alert("Сервер не відповідає!");
        }
    });
}