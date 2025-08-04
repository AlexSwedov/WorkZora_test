document.addEventListener('DOMContentLoaded', () => {
	
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
});