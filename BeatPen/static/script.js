// Функция для добавления задачи в To-do List
function addTodo() {
    const input = document.getElementById('todoInput');
    const taskText = input.value.trim();
    
    if (taskText === "") {
        alert("Сначала напиши что-нибудь!");
        return;
    }

    const ul = document.getElementById('todoItems');
    const li = document.createElement('li');
    
    // Создаем текст и кнопку удаления внутри новой задачи
    li.innerHTML = `
        <span>${taskText}</span>
        <button onclick="this.parentElement.remove()" style="border:none; background:none; color:#ff5252; cursor:pointer; font-weight:bold;">✕</button>
    `;
    
    ul.appendChild(li);
    input.value = ""; // Очищаем поле ввода
}

// Функция для бокового меню (пока просто уведомления)
function showSection(name) {
    console.log("Переход в раздел: " + name);
    // Можно добавить выделение активного пункта меню
    const items = document.querySelectorAll('.sidebar li');
    items.forEach(item => item.style.fontWeight = 'normal');
    event.target.style.fontWeight = 'bold';
}