// Опциональный JavaScript для дополнительной функциональности

// Функция для автоматического обновления возраста на основе даты рождения
function updateAge() {
    const birthDateElements = document.querySelectorAll('[data-birth-date]');
    birthDateElements.forEach(element => {
        const birthDate = new Date(element.getAttribute('data-birth-date'));
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        element.textContent = age + ' лет';
    });
}

// Функция для добавления возможности копирования контактов
function initContactCopy() {
    const contactLinks = document.querySelectorAll('.contact-card a[href^="tel:"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // На мобильных устройствах это откроет приложение для звонка
            // На десктопе можно добавить копирование в буфер обмена
            if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                e.preventDefault();
                const phoneNumber = this.getAttribute('href').replace('tel:', '');
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    alert('Номер скопирован: ' + phoneNumber);
                });
            }
        });
    });
}

// Функция для сохранения страницы в офлайн режиме (Service Worker не используется, но можно добавить кэширование)
function initOfflineSupport() {
    if ('serviceWorker' in navigator) {
        // Можно добавить Service Worker для полной офлайн поддержки
        console.log('Service Worker поддерживается');
    }
}

// Функция для печати медицинской карты
function printMedCard() {
    window.print();
}

// Добавление кнопки печати (опционально)
function addPrintButton() {
    const medcardContent = document.querySelector('.medcard-content');
    if (medcardContent) {
        const printBtn = document.createElement('button');
        printBtn.textContent = '🖨️ Печать';
        printBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 1000;';
        printBtn.onclick = printMedCard;
        document.body.appendChild(printBtn);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateAge();
    initContactCopy();
    initOfflineSupport();
    
    // Добавляем кнопку печати только на страницах медкарт
    if (document.querySelector('.medcard-header')) {
        addPrintButton();
    }
});

// Функция для проверки обновлений страницы (опционально)
function checkForUpdates() {
    // Можно добавить проверку обновлений через API
    console.log('Проверка обновлений...');
}

// Экспорт функций для использования в других скриптах (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateAge,
        initContactCopy,
        printMedCard
    };
}

