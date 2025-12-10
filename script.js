document.addEventListener('DOMContentLoaded', function() {
    // 1. Получаем параметр 'data' из URL
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');

    if (dataParam) {
        try {
            // 2. Декодируем строку из Base64 и парсим JSON
            const decodedJson = atob(dataParam);
            const medicalInfo = JSON.parse(decodedJson);

            // 3. Вызываем функцию для заполнения страницы
            populatePage(medicalInfo);
            
        } catch (error) {
            console.error("Ошибка при чтении данных:", error);
            document.body.innerHTML = "<h1>Ошибка: Неверный формат данных в QR-коде.</h1>";
        }
    } else {
        // Если параметра 'data' нет, показываем ошибку
        document.body.innerHTML = "<h1>Ошибка: Данные не найдены.</h1><p>Отсканируйте QR-код из приложения Health ID.</p>";
    }
});

function populatePage(data) {
    // Безопасно вставляем текстовые данные
    const setText = (id, text) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text || 'не указано';
    };
    
    // Функция для создания списков
    const createList = (containerId, items, itemClass, isAlert = false) => {
        const container = document.getElementById(containerId);
        if (!container || !items || items.length === 0) {
            if(container) container.innerHTML = `<p class="note">Нет данных.</p>`;
            return;
        }
        
        container.innerHTML = ''; // Очищаем контейнер
        items.forEach(itemText => {
            if (itemText) {
                const item = document.createElement(isAlert ? 'p' : 'li');
                if (itemClass) item.className = itemClass;
                item.textContent = itemText;
                container.appendChild(item);
            }
        });
    };

    // Заполняем заголовок
    document.title = `Мед. карта - ${data.name}`;
    setText('user-name-main', data.name);
    setText('user-age-hero', `${data.age} лет`);
    setText('user-blood-type-hero', `Группа крови — ${data.bloodType}`);
    
    // Устанавливаем фото (если есть)
    const userPhoto = document.getElementById('user-photo');
    if (data.photoUrl && userPhoto) {
        userPhoto.src = data.photoUrl;
        userPhoto.style.display = 'block';
    }

    // Заполняем основную сетку
    setText('user-name-grid', data.name);
    setText('user-age-grid', `${data.age} лет`);
    setText('user-blood-type-grid', data.bloodType);

    // Заполняем списки
    createList('conditions-list', data.conditions, '');
    createList('allergies-list', data.allergies, '', true);

    // Заполняем медикаменты
    const medsContainer = document.getElementById('medications-list');
    if (medsContainer && data.medications && data.medications.length > 0) {
        medsContainer.innerHTML = '';
        data.medications.forEach(med => {
            if(med){
                const medPill = document.createElement('article');
                medPill.className = 'med-pill';
                medPill.innerHTML = `<div><h3>${med}</h3></div>`;
                medsContainer.appendChild(medPill);
            }
        });
    } else if (medsContainer) {
        medsContainer.innerHTML = `<p class="note">Нет данных.</p>`;
    }
    
    // Дополнительные заметки
    setText('additional-notes', data.additionalNotes || 'Нет данных.');

    // Экстренный контакт
    const contactContainer = document.getElementById('emergency-contact-container');
    if (contactContainer && data.emergencyContact) {
        contactContainer.innerHTML = `
            <article class="contact-tile">
                <div>
                    <p class="contact-relation">Экстренный контакт</p>
                    <h3 id="emergency-contact-name">Родственник</h3> 
                </div>
                <a class="contact-action" href="tel:${data.emergencyContact}">📞 ${data.emergencyContact}</a>
            </article>`;
        // Также обновляем главную кнопку звонка
        const mainCallBtn = document.getElementById('emergency-call-btn');
        if(mainCallBtn) mainCallBtn.href = `tel:${data.emergencyContact}`;
    } else if(contactContainer) {
        contactContainer.innerHTML = `<p class="note">Экстренный контакт не указан.</p>`;
    }
}
