/**
 * BeatPen Main Logic
 * Обработка ИИ-тестов и динамическое обновление карточки пользователя
 */

async function startAITest() {
    const btn = document.getElementById('test-btn');
    const container = document.getElementById('ai-quiz-container');
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');

    // Состояние загрузки
    if (btn) {
        btn.innerText = "Generating test with AI...";
        btn.disabled = true;
    }

    try {
        // Отправляем запрос на сервер Flask (app.py)
        const response = await fetch('/generate_test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Здесь можно динамически менять сферу в зависимости от выбора пользователя
            body: JSON.stringify({ sphere: "Fullstack Web Development" }) 
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        
        // Прячем стартовую кнопку и показываем интерфейс квиза
        btn.style.display = 'none';
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });

        // Рендерим первый вопрос
        renderQuestion(data.questions[0], questionEl, optionsEl);

    } catch (error) {
        console.error("BeatPen Error:", error);
        alert("Failed to connect to AI. Make sure app.py is running and API key is set.");
        btn.innerText = "Try Again";
        btn.disabled = false;
    }
}

function renderQuestion(q, questionEl, optionsEl) {
    questionEl.innerText = q.question;
    optionsEl.innerHTML = ''; // Очистка старых вариантов

    q.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'btn btn-secondary';
        button.style.width = '100%';
        button.style.textAlign = 'left';
        button.innerText = option;

        button.onclick = () => {
            if (option === q.correct_answer) {
                handleSuccess();
            } else {
                handleFailure();
            }
        };
        optionsEl.appendChild(button);
    });
}

function handleSuccess() {
    alert("Perfect! Your BeatPen card is leveling up.");
    updateSkillBars();
}

function handleFailure() {
    alert("Not quite right. Review the topic and try again to boost your score!");
}

/**
 * Анимация роста графиков на 3-й странице (Your skills, visualized)
 */
function updateSkillBars() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        // Увеличиваем высоту каждой колонки на случайную величину для эффекта динамики
        const currentHeight = parseInt(bar.style.height) || 30;
        const newHeight = Math.min(100, currentHeight + (Math.random() * 20 + 10));
        
        bar.style.transition = "height 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        bar.style.height = `${newHeight}%`;
        
        // Меняем цвет на более яркий при успехе
        if (newHeight > 80) {
            bar.style.filter = "brightness(1.5) drop-shadow(0 0 10px #6e56cf)";
        }
    });
}