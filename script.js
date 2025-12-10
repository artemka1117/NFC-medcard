document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');

    if (dataParam) {
        try {
            // ШАГ 1: Декодируем URL-безопасную строку Base64
            // Заменяем '-' на '+' и '_' на '/'
            const base64 = dataParam.replace(/-/g, '+').replace(/_/g, '/');
            
            // ШАГ 2: Декодируем Base64 в исходную строку (которая является UTF-8)
            const utf8Decoded = atob(base64).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('');

            // ШАГ 3: Декодируем UTF-8 проценты в читаемую строку
            const decodedJson = decodeURIComponent(utf8Decoded);

            // ШАГ 4: Парсим JSON
            const medicalInfo = JSON.parse(decodedJson);

            populatePage(medicalInfo);
            
        } catch (error) {
            console.error("Ошибка при чтении данных:", error);
            document.body.innerHTML = "<h1>Ошибка: Неверный формат данных в QR-коде.</h1>";
        }
    } else {
        document.body.innerHTML = "<h1>Ошибка: Данные не найдены.</h1><p>Отсканируйте QR-код из приложения Health ID.</p>";
    }
});

function populatePage(data) {
    const setText = (id, text) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text || 'не указано';
    };
    
    const createList = (containerId, items, itemClass, isAlert = false) => {
        const container = document.getElementById(containerId);
        if (!container || !items || items.length === 0) {
            if(container) container.innerHTML = `<p class="note">Нет данных.</p>`;
            return;
        }
        
        container.innerHTML = '';
        items.forEach(itemText => {
            if (itemText) {
                const item = document.createElement(isAlert ? 'p' : 'li');
                if (itemClass) item.className = itemClass;
                item.textContent = itemText;
                container.appendChild(item);
            }
        });
    };

    document.title = `Мед. карта - ${data.name}`;
    setText('user-name-main', data.name);
    setText('user-age-hero', `${data.age} лет`);
    setText('user-blood-type-hero', `Группа крови — ${data.bloodType}`);
    
    const userPhoto = document.getElementById('user-photo');
    if (data.photoUrl && userPhoto) {
        userPhoto.src = data.photoUrl;
        userPhoto.style.display = 'block';
    }

    setText('user-name-grid', data.name);
    setText('user-age-grid', `${data.age} лет`);
    setText('user-blood-type-grid', data.bloodType);

    createList('conditions-list', data.conditions, '');
    createList('allergies-list', data.allergies, '', true);

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
    
    setText('additional-notes', data.additionalNotes || 'Нет данных.');

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
        const mainCallBtn = document.getElementById('emergency-call-btn');
        if(mainCallBtn) mainCallBtn.href = `tel:${data.emergencyContact}`;
    } else if(contactContainer) {
        contactContainer.innerHTML = `<p class="note">Экстренный контакт не указан.</p>`;
    }
}
