// ========== ПЕРЕМЕННЫЕ ==========

// Объявление переменной. let — означает, что значение можно менять.
// participants — массив (список) всех участников розыгрыша.
// [] — пустой массив (пока нет ни одного участника).
let participants = [];

// let — переменная, которую можно изменять.
// angle — текущий угол поворота колеса в радианах.
// 0 — начальный угол (колесо не повёрнуто).
let angle = 0;

// ========== СОХРАНЕНИЕ И ЗАГРУЗКА ==========

// function — объявление функции (блока кода, который можно вызвать по имени).
// saveData — название функции (сохраняет данные).
// () — пустые скобки означают, что функция не принимает параметров.
// { ... } — фигурные скобки ограничивают тело функции.
function saveData() {
    // const — объявление константы (значение нельзя изменить).
    // data — объект, который содержит три свойства: participants, title, angle.
    // { ... } — фигурные скобки создают объект.
    // participants: participants — свойство participants получает значение из переменной participants.
    // document.getElementById('titleText') — находит HTML-элемент с id="titleText".
    // .innerText — берёт текст внутри этого элемента (название колеса).
    // angle: angle — свойство angle получает значение из переменной angle.
    const data = {
        participants: participants,
        title: document.getElementById('titleText').innerText,
        angle: angle
    };

    // localStorage — встроенное хранилище браузера (данные не удаляются после перезагрузки).
    // .setItem() — метод для сохранения данных в хранилище.
    // 'wheelData' — ключ (имя), по которому данные будут сохранены.
    // JSON.stringify(data) — превращает объект data в строку (текст), потому что localStorage хранит только строки.
    localStorage.setItem('wheelData', JSON.stringify(data));
}

// function — объявление функции.
// loadData — название функции (загружает данные).
function loadData() {
    // const — константа.
    // saved — переменная для хранения загруженных данных.
    // localStorage.getItem('wheelData') — получает данные по ключу 'wheelData' из хранилища.
    const saved = localStorage.getItem('wheelData');

    // if — условный оператор (если условие истинно, выполняется код внутри { ... }).
    // saved — если переменная saved не пустая (там есть данные) → условие истинно.
    if (saved) {
        // try — блок для перехвата ошибок (если внутри что-то пойдёт не так).
        try {
            // const — константа.
            // data — переменная для хранения распарсенных данных.
            // JSON.parse(saved) — превращает строку saved обратно в объект JavaScript.
            const data = JSON.parse(saved);

            // participants = data.participants || [] — если data.participants существует, берём его, иначе — пустой массив [].
            participants = data.participants || [];

            // document.getElementById('titleText') — находит элемент с id="titleText".
            // .innerText = data.title || 'Колесо' — устанавливает текст внутри элемента.
            // Если data.title есть — ставим его, иначе ставим 'Колесо'.
            document.getElementById('titleText').innerText = data.title || 'Колесо';

            // if (data.angle !== undefined) — если в сохранённых данных есть угол поворота (не undefined)...
            if (data.angle !== undefined) {
                // ...то присваиваем переменной angle это значение.
                angle = data.angle;
            }
        } catch (e) {
            // catch — выполняется, если в блоке try произошла ошибка.
            // console.error() — выводит сообщение об ошибке в консоль разработчика.
            // 'Ошибка загрузки:' — текст сообщения.
            // e — объект ошибки.
            console.error('Ошибка загрузки:', e);
        }
    }

    // render() — вызывает функцию для отрисовки списка участников на странице.
    render();
    // draw() — вызывает функцию для отрисовки колеса на canvas.
    draw();
}

// autoSave — функция автоматического сохранения.
function autoSave() {
    saveData(); // Просто вызывает функцию saveData().
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

// trimWheelText — обрезает длинные тексты для отображения на колесе.
// text — параметр (строка, которую нужно обрезать).
// max = 12 — параметр по умолчанию (максимальная длина 12 символов).
function trimWheelText(text, max = 12) {
    // if — условие.
    // text.length > max — если длина строки больше max (12)...
    // ? — тернарный оператор (если true, то берём значение до :, если false — после :).
    // text.slice(0, max) + '…' — обрезаем строку от 0 до max символов и добавляем троеточие.
    // : text — иначе возвращаем исходную строку.
    return text.length > max ? text.slice(0, max) + '…' : text;
}

// getRandomColor — возвращает случайный цвет из палитры.
function getRandomColor() {
    // const — константа.
    // colors — массив цветов в формате HEX (#RRGGBB).
    const colors = [
        '#110000',    // Кроваво-красный (очень тёмный красный)
        '#220000',    // Чуть светлее
        '#330001',    // Красный с оттенком
        '#440001',
        '#550001',
        '#660001',
        '#770002',
        '#880002',
        '#990002',
        '#aa0002',
        '#bb0002',
        '#ff2225',    // Ярко-красный
        '#ff3336',    // Ярко-красный с оранжевым оттенком
    ];

    // return — возвращает значение из функции.
    // colors[Math.floor(Math.random() * colors.length)] — случайный элемент из массива:
    // Math.random() — возвращает случайное число от 0 до 0.999...
    // * colors.length — умножает на длину массива (13).
    // Math.floor() — округляет вниз до целого числа.
    // colors[...] — берёт элемент массива по этому индексу.
    return colors[Math.floor(Math.random() * colors.length)];
}

// escapeHtml — защита от XSS-атак (превращает опасные символы в безопасные HTML-сущности).
// str — строка, которую нужно очистить.
function escapeHtml(str) {
    // if (!str) — если строка пустая (falsy)...
    if (!str) return ''; // ...возвращаем пустую строку.

    // return — возвращает результат.
    // str.replace() — заменяет части строки по заданному правилу.
    // /[&<>]/g — регулярное выражение: ищет символы &, <, >.
    // g — флаг "global" (находит все вхождения, а не только первое).
    // (m) => { ... } — стрелочная функция, m — найденный символ.
    return str.replace(/[&<>]/g, (m) => {
        // if — проверяем, какой символ найден.
        if (m === '&') return '&amp;';   // & превращаем в &amp; (безопасный амперсанд)
        if (m === '<') return '&lt;';     // < превращаем в &lt; (безопасный знак меньше)
        if (m === '>') return '&gt;';     // > превращаем в &gt; (безопасный знак больше)
        return m; // Если ничего не подошло — возвращаем исходный символ.
    });
}

// ========== УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ ==========

// openSettings — открывает панель настроек.
function openSettings() {
    // document.getElementById('settingsPanel') — находит элемент с id="settingsPanel".
    // .classList.add('open') — добавляет к этому элементу CSS-класс "open".
    // Класс "open" в CSS делает панель видимой (меняет transform).
    document.getElementById('settingsPanel').classList.add('open');

    // document.getElementById('mainCard') — находит главную карточку.
    // .classList.add('shifted') — добавляет класс "shifted" (сдвигает карточку вправо).
    document.getElementById('mainCard').classList.add('shifted');
}

// closeSettings — закрывает панель настроек.
function closeSettings() {
    // .classList.remove('open') — удаляет класс "open" (панель скрывается).
    document.getElementById('settingsPanel').classList.remove('open');
    // .classList.remove('shifted') — удаляет класс "shifted" (карточка возвращается на место).
    document.getElementById('mainCard').classList.remove('shifted');
}

// focusTitle — устанавливает курсор в поле редактирования названия.
function focusTitle() {
    // document.getElementById('titleText') — находит элемент с названием.
    // .focus() — устанавливает фокус (курсор) на этот элемент.
    document.getElementById('titleText').focus();
}

// addEventListener — добавляет обработчик события.
// 'blur' — событие "потеря фокуса" (когда пользователь кликнул вне поля).
// saveData — функция, которая вызовется при потере фокуса (сохранит название).
document.getElementById('titleText').addEventListener('blur', saveData);

// toggleAuthor — открывает/закрывает блок с информацией об авторе.
function toggleAuthor() {
    // document.getElementById('authorPopup') — находит блок с информацией об авторе.
    // .classList.toggle('open') — переключает класс "open" (добавляет, если нет, удаляет, если есть).
    document.getElementById('authorPopup').classList.toggle('open');

    // document.querySelector('.author-btn') — находит первый элемент с классом "author-btn".
    // .classList.toggle('active') — переключает класс "active" (поворачивает стрелку).
    document.querySelector('.author-btn').classList.toggle('active');
}

// toggleText — раскрывает длинное имя участника в списке.
// element — HTML-элемент, по которому кликнули.
function toggleText(element) {
    // .classList.toggle('expanded') — переключает класс "expanded".
    // Класс "expanded" в CSS разрешает перенос текста на новую строку.
    element.classList.toggle('expanded');
}

// ========== УПРАВЛЕНИЕ УЧАСТНИКАМИ ==========

// addParticipant — добавляет нового участника.
function addParticipant() {
    // const — константа.
    // input — переменная для поля ввода.
    // document.getElementById('nameInput') — находит поле ввода по id.
    const input = document.getElementById('nameInput');

    // const — константа.
    // name — введённое имя.
    // input.value.trim() — берёт текст из поля, .trim() удаляет пробелы в начале и конце.
    const name = input.value.trim();

    // if (!name) — если имя пустое (false)...
    if (!name) return; // ...выходим из функции (ничего не делаем).

    // participants.push() — добавляет новый элемент в конец массива participants.
    participants.push({
        name: name,                      // имя участника
        color: getRandomColor(),         // случайный цвет (вызов функции)
        comment: ""                      // пустой комментарий
    });

    // input.value = '' — очищаем поле ввода (ставим пустую строку).
    input.value = '';

    render();   // перерисовываем список участников
    draw();     // перерисовываем колесо
    autoSave(); // сохраняем изменения
}

// removeParticipant — удаляет участника по индексу.
// i — индекс (позиция) участника в массиве (начинается с 0).
function removeParticipant(i) {
    // participants.splice(i, 1) — удаляет 1 элемент из массива на позиции i.
    participants.splice(i, 1);

    render();
    draw();
    autoSave();
}

// changeComment — изменяет комментарий участника.
// index — индекс участника в массиве.
// value — новое значение комментария (строка).
function changeComment(index, value) {
    participants[index].comment = value; // присваиваем новое значение
    autoSave(); // сохраняем
}

// changeColor — изменяет цвет сектора участника.
// index — индекс участника.
// color — новый цвет (строка в формате HEX, например "#ff0000").
function changeColor(index, color) {
    participants[index].color = color; // присваиваем новый цвет
    render(); // перерисовываем список (чтобы обновить цвет кнопки)
    draw();   // перерисовываем колесо
    autoSave();
}

// addEventListener — добавляет обработчик события на поле ввода.
// 'keypress' — событие "нажатие клавиши".
// (e) => { ... } — стрелочная функция, e — объект события.
document.getElementById('nameInput').addEventListener('keypress', (e) => {
    // if (e.key === 'Enter') — если нажатая клавиша — Enter...
    if (e.key === 'Enter') {
        addParticipant(); // ...вызываем функцию добавления участника.
    }
});

// ========== ОТРИСОВКА СПИСКА ==========

// render — отображает список участников на странице.
function render() {
    // const — константа.
    // list — элемент, в который будем вставлять список.
    const list = document.getElementById('list');

    // list.innerHTML = '' — очищаем содержимое списка (удаляем всё).
    list.innerHTML = '';

    // let — переменная, которую можно изменить.
    // percent — процент вероятности для каждого участника.
    // participants.length ? ... : 0 — если есть участники, вычисляем процент, иначе 0.
    // (100 / participants.length).toFixed(1) — 100 делим на количество участников, округляем до 1 знака.
    let percent = participants.length ? (100 / participants.length).toFixed(1) : 0;

    // participants.forEach() — перебирает каждого участника в массиве.
    // (p, i) => { ... } — стрелочная функция, p — текущий участник, i — его индекс.
    participants.forEach((p, i) => {
        // const — константа.
        // div — создаём новый HTML-элемент <div>.
        const div = document.createElement('div');

        // div.className = 'item' — присваиваем элементу CSS-класс "item".
        div.className = 'item';

        // div.innerHTML = `...` — устанавливаем внутреннее HTML-содержимое элемента.
        // Обратные кавычки ` ` позволяют вставлять переменные через ${...}.
        div.innerHTML = `
            <div class="left">
                <div class="name" onclick="toggleText(this)">#${i + 1} ${escapeHtml(p.name)}</div>
                <div class="percent">${percent}%</div>
                <input type="text" placeholder="Комментарий..." value="${escapeHtml(p.comment || '')}"
                    oninput="changeComment(${i}, this.value)"
                    style="margin-top:4px; width:100%; border:none; background:#1a1a1a; color:#fff; border-radius:6px; padding:4px 6px; font-size:12px;">
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
                <button onclick="this.nextElementSibling.click()"
                    style="width:28px; height:28px; border:none; border-radius:8px; cursor:pointer; background:${p.color}; color:white; font-size:14px;">🌢</button>
                <input id="color-${i}" type="color" value="${p.color}" onchange="changeColor(${i}, this.value)"
                    style="position:absolute; opacity:0; pointer-events:none;">
                <button class="remove" onclick="removeParticipant(${i})">×</button>
            </div>
        `;

        // list.appendChild(div) — добавляем созданный <div> в конец списка.
        list.appendChild(div);
    });
}

// ========== ОТРИСОВКА КОЛЕСА ==========

// draw — рисует колесо на canvas.
function draw() {
    // const — константа.
    // canvas — элемент <canvas> с id="wheel".
    const canvas = document.getElementById('wheel');

    // const — константа.
    // ctx — контекст рисования 2D (объект с методами для рисования).
    const ctx = canvas.getContext('2d');

    // ctx.clearRect(0, 0, 300, 300) — очищает прямоугольную область на canvas.
    // 0, 0 — координаты левого верхнего угла (x, y).
    // 300, 300 — ширина и высота области.
    ctx.clearRect(0, 0, 300, 300);

    // const — константа.
    // count — количество участников.
    const count = participants.length;

    // if (count === 0) — если участников нет...
    if (count === 0) {
        // ctx.beginPath() — начинает новый путь (контур) для рисования.
        ctx.beginPath();
        // ctx.arc(150, 150, 150, 0, 2 * Math.PI) — рисует круг (дугу).
        // 150, 150 — центр круга (x, y).
        // 150 — радиус.
        // 0 — начальный угол (0 радиан = 0 градусов).
        // 2 * Math.PI — конечный угол (360 градусов).
        ctx.arc(150, 150, 150, 0, 2 * Math.PI);
        // ctx.fillStyle = '#131313' — устанавливаем цвет заливки (тёмно-серый).
        ctx.fillStyle = '#131313';
        // ctx.fill() — заливает контур цветом fillStyle.
        ctx.fill();
        return; // выходим из функции (дальше не рисуем).
    }

    // const — константа.
    // step — угол одного сектора в радианах.
    // (2 * Math.PI) / count — полный круг (2π) делим на количество участников.
    const step = (2 * Math.PI) / count;

    // for — цикл (повторяет код для каждого участника).
    // let i = 0 — начальное значение счётчика.
    // i < count — условие продолжения (пока i меньше количества участников).
    // i++ — увеличиваем счётчик на 1 после каждой итерации.
    for (let i = 0; i < count; i++) {
        // ctx.beginPath() — начинаем новый контур (для одного сектора).
        ctx.beginPath();
        // ctx.moveTo(150, 150) — перемещает "перо" в центр круга (начало рисования).
        ctx.moveTo(150, 150);
        // ctx.arc() — рисует дугу (сектор) от одного угла до другого.
        // i * step + angle — начальный угол сектора (с учётом поворота).
        // (i + 1) * step + angle — конечный угол сектора.
        ctx.arc(150, 150, 150, i * step + angle, (i + 1) * step + angle);

        // ctx.fillStyle — цвет заливки сектора.
        // participants[i]?.color — цвет участника (?. — безопасное обращение, если участника нет).
        // || '#131313' — если цвета нет, используем тёмно-серый.
        ctx.fillStyle = participants[i]?.color || '#131313';
        // ctx.fill() — заливаем сектор цветом.
        ctx.fill();

        // ctx.save() — сохраняет текущее состояние canvas (чтобы потом восстановить).
        ctx.save();
        // ctx.translate(150, 150) — перемещает начало координат в центр круга.
        ctx.translate(150, 150);
        // ctx.rotate() — поворачивает систему координат на угол сектора (чтобы текст был направлен от центра).
        // i * step + step / 2 + angle — угол в середине сектора.
        ctx.rotate(i * step + step / 2 + angle);

        // ctx.fillStyle = '#fff' — устанавливаем цвет текста (белый).
        ctx.fillStyle = '#fff';
        // ctx.font — устанавливает шрифт текста.
        // participants.length > 6 ? '10px Arial' : '12px Arial' — если участников больше 6, шрифт меньше.
        ctx.font = participants.length > 6 ? '10px Arial' : '12px Arial';
        // ctx.textAlign = 'center' — выравнивание текста по центру.
        ctx.textAlign = 'center';

        // const — константа.
        // text — имя участника (или пустая строка, если нет участника).
        const text = participants[i]?.name || '';
        // const — константа.
        // shortText — обрезанное имя (вызов функции trimWheelText).
        const shortText = trimWheelText(text);

        // ctx.fillText(shortText, 100, 5) — рисует текст на canvas.
        // shortText — текст для отображения.
        // 100 — координата X (100 пикселей от центра).
        // 5 — координата Y (5 пикселей от центра).
        ctx.fillText(shortText, 100, 5);

        // ctx.restore() — восстанавливает сохранённое состояние canvas (отменяет translate и rotate).
        ctx.restore();
    }
}

// ========== ВРАЩЕНИЕ И ВЫБОР ПОБЕДИТЕЛЯ ==========

// spin — запускает анимацию вращения колеса.
function spin() {
    // if (!participants.length) — если участников нет (0)...
    if (!participants.length) return; // ...выходим из функции (не вращаем).

    // let — переменная, которую можно изменить.
    // spins — количество дополнительных оборотов (случайное число от 5 до 10).
    // Math.random() * 5 — случайное число от 0 до 4.999...
    // + 5 — добавляем 5, получаем от 5 до 9.999...
    let spins = Math.random() * 5 + 5;

    // let — переменная.
    // target — конечный угол поворота (начальный угол + дополнительные обороты в радианах).
    // spins * 2 * Math.PI — переводим обороты в радианы (один оборот = 2π радиан).
    let target = angle + spins * 2 * Math.PI;

    // let — переменная.
    // start — начальный угол поворота (запоминаем перед анимацией).
    let start = angle;

    // const — константа.
    // duration — длительность анимации в миллисекундах (2000 мс = 2 секунды).
    const duration = 2000;

    // let — переменная.
    // startTime — время начала анимации (пока null, заполнится при первом кадре).
    let startTime = null;

    // function animate(time) — рекурсивная функция для анимации (вызывает сама себя).
    // time — текущее время (в миллисекундах), передаётся браузером.
    function animate(time) {
        // if (!startTime) — если startTime ещё не установлен...
        if (!startTime) {
            // ...устанавливаем startTime равным текущему времени.
            startTime = time;
        }

        // let — переменная.
        // progress — прогресс анимации (от 0 до 1).
        // (time - startTime) / duration — сколько времени прошло от начала, делённое на общую длительность.
        let progress = (time - startTime) / duration;

        // if (progress < 1) — если анимация ещё не закончена...
        if (progress < 1) {
            // angle — вычисляем текущий угол с easing-функцией (плавное замедление).
            // 1 - Math.pow(1 - progress, 3) — кубическая функция замедления (ease-out cubic).
            angle = start + (target - start) * (1 - Math.pow(1 - progress, 3));

            draw(); // перерисовываем колесо с новым углом

            // requestAnimationFrame(animate) — просим браузер вызвать функцию animate на следующем кадре.
            requestAnimationFrame(animate);
        } else {
            // else — анимация закончена.
            angle = target; // устанавливаем точный конечный угол.
            draw(); // финальная перерисовка.
            pickWinner(); // определяем победителя.
        }
    }

    // requestAnimationFrame(animate) — запускаем анимацию (первый кадр).
    requestAnimationFrame(animate);
}

// pickWinner — определяет победителя по текущему углу поворота.
function pickWinner() {
    // const — константа.
    // count — количество участников.
    const count = participants.length;

    // const — константа.
    // step — угол одного сектора в радианах.
    const step = (2 * Math.PI) / count;

    // let — переменная.
    // pointerAngle — угол, на который указывает стрелка (сверху).
    // angle + Math.PI / 2 — добавляем 90 градусов (π/2), потому что стрелка сверху.
    // % (2 * Math.PI) — берём остаток от деления на полный круг (чтобы угол был от 0 до 2π).
    let pointerAngle = (angle + Math.PI / 2) % (2 * Math.PI);

    // let — переменная.
    // index — индекс победителя в массиве.
    // (2 * Math.PI - pointerAngle) / step — вычисляем, какой сектор под стрелкой.
    // Math.floor() — округляем вниз.
    // % count — берём остаток от деления на количество участников (на случай, если индекс вышел за пределы).
    let index = Math.floor((2 * Math.PI - pointerAngle) / step) % count;

    // document.getElementById('winner') — находит элемент для отображения победителя.
    // .textContent = ... — устанавливает текст внутри элемента.
    document.getElementById('winner').textContent = 'Победитель: #' + (index + 1) + ' ' + participants[index].name;
}

// ========== ЭКСПОРТ ==========

// exportParticipantsToCSV — экспортирует список участников в CSV файл.
function exportParticipantsToCSV() {
    // if (participants.length === 0) — если участников нет...
    if (participants.length === 0) {
        // alert() — показывает всплывающее окно с сообщением.
        alert('Нет участников для экспорта');
        return; // выходим из функции.
    }

    // let — переменная.
    // csvContent — строка с содержимым CSV-файла.
    // \n — символ новой строки.
    let csvContent = "№,Имя,Цвет,Комментарий\n";

    // participants.forEach() — перебираем каждого участника.
    participants.forEach((p, index) => {
        // const — константа.
        // safeName — имя с экранированными кавычками ("" заменяем на """").
        // .replace(/"/g, '""') — заменяет все двойные кавычки на две двойные кавычки (CSV-формат).
        const safeName = p.name.replace(/"/g, '""');

        // const — константа.
        // safeComment — комментарий с экранированными кавычками.
        const safeComment = (p.comment || '').replace(/"/g, '""');

        // += — добавляем строку к существующей переменной.
        // `${index + 1},"${safeName}","${p.color}","${safeComment}"\n` — строка с данными участника.
        csvContent += `${index + 1},"${safeName}","${p.color}","${safeComment}"\n`;
    });

    // const — константа.
    // blob — объект Blob (бинарные данные) для создания файла.
    // [ "\uFEFF" + csvContent ] — массив с данными (BOM + содержимое).
    // \uFEFF — символ BOM (Byte Order Mark), нужен для правильного отображения кириллицы в Excel.
    // { type: 'text/csv;charset=utf-8;' } — MIME-тип файла (CSV с кодировкой UTF-8).
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });

    // const — константа.
    // link — создаём новый элемент <a> (ссылка).
    const link = document.createElement('a');

    // const — константа.
    // url — создаём временную ссылку на blob-объект.
    const url = URL.createObjectURL(blob);

    // link.href = url — устанавливаем ссылку на файл.
    link.href = url;
    // link.download = 'participants.csv' — устанавливаем имя файла для скачивания.
    link.download = 'participants.csv';

    // document.body.appendChild(link) — добавляем ссылку на страницу (невидимо).
    document.body.appendChild(link);
    // link.click() — программно кликаем по ссылке (начинается скачивание).
    link.click();
    // document.body.removeChild(link) — удаляем ссылку со страницы.
    document.body.removeChild(link);
    // URL.revokeObjectURL(url) — освобождаем память, занятую временной ссылкой.
    URL.revokeObjectURL(url);
}

// ========== ИМПОРТ ==========

// document.getElementById('importFile') — находит скрытый input для выбора файла.
// .addEventListener('change', ...) — добавляем обработчик события "выбор файла".
document.getElementById('importFile').addEventListener('change', function (event) {
    // const — константа.
    // file — выбранный пользователем файл.
    const file = event.target.files[0];

    // if (!file) — если файл не выбран...
    if (!file) return; // ...выходим из функции.

    // const — константа.
    // reader — объект FileReader для чтения содержимого файла.
    const reader = new FileReader();

    // reader.onload = function (e) { ... } — обработчик события "чтение завершено".
    reader.onload = function (e) {
        // const — константа.
        // content — содержимое файла (текст).
        const content = e.target.result;

        // const — константа.
        // lines — массив строк, полученный разделением content по переводу строки.
        // /\r?\n/ — регулярное выражение (перевод строки \r\n или \n).
        const lines = content.split(/\r?\n/);

        // let — переменная.
        // newParticipants — массив новых участников, полученных из файла.
        let newParticipants = [];

        // let — переменная.
        // previewText — строка для предпросмотра имён.
        let previewText = '';

        // for — цикл по всем строкам файла.
        for (let i = 0; i < lines.length; i++) {
            // let — переменная.
            // line — текущая строка, очищенная от пробелов в начале и конце.
            let line = lines[i].trim();

            // if (line === '') — если строка пустая...
            if (line === '') continue; // ...пропускаем её.

            // if (i === 0 && (line.includes('Имя') || line.includes('№'))) — если это первая строка и она похожа на заголовок...
            if (i === 0 && (line.includes('Имя') || line.includes('№'))) {
                continue; // ...пропускаем заголовок.
            }

            // let — переменная.
            // parts — массив частей строки, разделённых запятыми.
            let parts = line.split(',');

            // let — переменная.
            // name — имя участника (первая часть, очищенная от кавычек).
            let name = parts[0].replace(/^"|"$/g, '').trim();

            // let — переменная.
            // color — цвет участника (вторая часть), если нет — случайный цвет.
            let color = parts[1] ? parts[1].replace(/^"|"$/g, '').trim() : getRandomColor();

            // let — переменная.
            // comment — комментарий (третья часть), если нет — пустая строка.
            let comment = parts[2] ? parts[2].replace(/^"|"$/g, '').trim() : '';

            // if (parts[0].match(/^\d+$/) && parts[1]) — если первая часть — число (номер), а вторая часть существует...
            // /^\d+$/ — регулярное выражение: только цифры от начала до конца.
            if (parts[0].match(/^\d+$/) && parts[1]) {
                // ...то имя берём из второй части.
                name = parts[1].replace(/^"|"$/g, '').trim();
                // комментарий — из третьей части.
                comment = parts[2] ? parts[2].replace(/^"|"$/g, '').trim() : '';
            }

            // if (name) — если имя не пустое...
            if (name) {
                // ...добавляем участника в массив.
                newParticipants.push({ name: name, color: color, comment: comment });
                // добавляем имя в строку предпросмотра.
                previewText += `➕ ${name}\n`;
            }
        }

        // if (newParticipants.length > 0) — если есть новые участники...
        if (newParticipants.length > 0) {
            // ...добавляем всех новых участников в основной массив.
            participants.push(...newParticipants);
            render(); // перерисовываем список
            draw();   // перерисовываем колесо
            autoSave(); // сохраняем

            // Показываем предпросмотр импорта
            const previewDiv = document.getElementById('importPreview');
            previewDiv.innerHTML = `✅ Импортировано: ${newParticipants.length} участников<br>${previewText.replace(/\n/g, '<br>')}`;

            // Через 3 секунды очищаем предпросмотр
            setTimeout(() => {
                previewDiv.innerHTML = '';
            }, 3000);
        } else {
            // Если не найдено ни одного имени — показываем сообщение об ошибке
            alert('Не удалось найти участников в файле');
        }
    };

    // Читаем файл как текст в кодировке UTF-8
    reader.readAsText(file, 'UTF-8');
});

// ========== ОЧИСТКА ==========

// clearAllData — удаляет всех участников и сбрасывает всё состояние
function clearAllData() {
    // confirm() — показывает диалог подтверждения с кнопками "ОК" и "Отмена"
    if (confirm('Вы уверены, что хотите всё сбросить?')) {
        participants = []; // очищаем массив участников
        angle = 0; // сбрасываем угол поворота колеса
        document.getElementById('titleText').innerText = 'Колесо'; // сбрасываем название
        document.getElementById('winner').innerHTML = ''; // очищаем сообщение о победителе
        render(); // перерисовываем список
        draw(); // перерисовываем колесо
        localStorage.removeItem('wheelData'); // удаляем сохранённые данные из localStorage
    }
}

// ========== ЗАПУСК ==========

// loadData() — загружает сохранённые данные при загрузке страницы
loadData();