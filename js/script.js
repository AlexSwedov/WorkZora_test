	// зміна мов в хедері ---------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
	const dropdown = document.querySelector('.language-dropdown');
	const toggleButton = dropdown.querySelector('.language-dropdown__toggle');
	const languageMenu = dropdown.querySelector('.language-dropdown__menu');
	const currentFlag = toggleButton.querySelector('.current-flag');
	const menuItems = languageMenu.querySelectorAll('li');

	// Функція для перемикання видимості меню
	function toggleMenu() {
		const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
		toggleButton.setAttribute('aria-expanded', !isExpanded);
		languageMenu.setAttribute('aria-hidden', isExpanded); // Перемикаємо aria-hidden
	}

	// Обробник кліку на кнопці-перемикачі
	toggleButton.addEventListener('click', (event) => {
		event.stopPropagation(); // Запобігаємо закриттю, якщо клік всередині
		toggleMenu();
	});

	// Обробник кліку на пункті меню
	menuItems.forEach(item => {
		item.addEventListener('click', () => {
			const selectedLang = item.dataset.lang; // Отримуємо код мови
			const selectedFlagSrc = item.querySelector('img').src; // Отримуємо шлях до прапора

			// Оновлюємо прапор на кнопці
			currentFlag.src = selectedFlagSrc;
			currentFlag.alt = item.textContent.trim(); // Оновлюємо alt-текст

			// Можна додати клас 'selected' для візуалізації
			menuItems.forEach(li => li.classList.remove('selected'));
			item.classList.add('selected');

			// Закриваємо меню
			toggleMenu();

			// Тут ви можете додати логіку для фактичної зміни мови на сторінці
			// наприклад: console.log('Змінити мову на:', selectedLang);
			// Або викликати функцію changeLanguage(selectedLang);
			console.log(`Мова змінена на: ${selectedLang}`);
		});
	});

	// Закриття меню при кліку поза ним
	document.addEventListener('click', (event) => {
		if (!dropdown.contains(event.target)) {
			toggleButton.setAttribute('aria-expanded', 'false');
			languageMenu.setAttribute('aria-hidden', 'true');
		}
	});

	// Ініціалізація: встановлення початкової вибраної мови (наприклад, української)
	// Шукаємо початковий елемент і додаємо йому клас 'selected'
	const initialLang = document.querySelector('.language-dropdown__menu li[data-lang="en"]');
	if (initialLang) {
		initialLang.classList.add('selected');
		currentFlag.src = initialLang.querySelector('img').src;
		currentFlag.alt = initialLang.textContent.trim();
	}

	// випадаюче меню в хедері ----------------------------------------------------------------------------
	const dropdownItems = document.querySelectorAll('.menu__item-dropdown');

	dropdownItems.forEach(dropdownItem => {
	dropdownItem.addEventListener('click', function(event) {
		event.preventDefault();
		const clickedItem = this;

		// Перебираємо всі елементи dropdownItems
		dropdownItems.forEach(item => {
			// Якщо елемент не є тим, на який клікнули, і він має клас 'active', то закриваємо його
			if (item !== clickedItem && item.classList.contains('active')) {
			item.classList.remove('active');
			}
		});

		// Якщо поточний елемент вже відкритий, ми НІЧОГО не робимо (не закриваємо його).
		// Якщо він закритий, ми його відкриваємо.
		if (!clickedItem.classList.contains('active')) {
			clickedItem.classList.add('active');
		}
		// Якщо ви хочете, щоб клік на відкрите меню все ж закривав його,
		// залиште clickedItem.classList.toggle('active');
		// Інакше, використовуйте логіку вище або таку:
		// clickedItem.classList.toggle('active'); // Цей рядок закриває при повторному кліку
	});
	});

	// Додатково, для закриття меню при кліку поза ним
	document.addEventListener('click', function(event) {
	dropdownItems.forEach(item => {
		// Якщо клік був поза поточним елементом dropdownItem і він відкритий
		if (!item.contains(event.target) && item.classList.contains('active')) {
			item.classList.remove('active');
		}
	});
	});
	
	// таби у випадаючому меню ----------------------------------------------------------------------------
	
	const tabButtons = document.querySelectorAll('.tab-button');
	const tabContents = document.querySelectorAll('.tab-content');

	tabButtons.forEach(button => {
		button.addEventListener('click', (event) => { // Додайте 'event' як параметр
			event.preventDefault(); // Запобігаємо стандартній дії браузера

			// Перевіряємо, чи кнопка, на яку клікнули, вже активна
			if (button.classList.contains('active')) {
				return; // Якщо так, просто виходимо з функції і нічого не робимо
			}

			// Видаляємо клас 'active' з усіх кнопок табів
			tabButtons.forEach(btn => btn.classList.remove('active'));
			// Додаємо клас 'active' до поточної кнопки
			button.classList.add('active');

			// Видаляємо клас 'active' з усіх блоків контенту
			tabContents.forEach(content => content.classList.remove('active'));

			// Отримуємо ID контенту, який потрібно показати
			const targetTabId = button.dataset.tab; // Використовуємо data-tab атрибут
			const targetTabContent = document.getElementById(targetTabId);

			// Додаємо клас 'active' до відповідного блоку контенту
			if (targetTabContent) {
				targetTabContent.classList.add('active');
			}
		});
	});
	
	// безперервний рядок marquee ---------------------------------------------------------------------------------
	const marquee = document.querySelector('.company__marquee');
	const content = marquee.querySelector('.company__marquee_inner');

	const clone1 = content.cloneNode(true);
	marquee.appendChild(clone1);
	const clone2 = content.cloneNode(true);
	marquee.appendChild(clone2);

	function updateAnimationDuration() {
		const contentWidth = content.offsetWidth;
		const speed = 20;
		const duration = contentWidth / speed;
		
		marquee.style.setProperty('--marquee-duration', `${duration}s`);
	}

	updateAnimationDuration(); 
	window.addEventListener('resize', updateAnimationDuration);
});