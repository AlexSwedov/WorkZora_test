// Перевірка мобільного браузера ------------------------------------------------------------------------
let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
/* Додавання класу touch для HTML, якщо браузер мобільний */
function addTouchClass() {
	// Додавання класу _touch для HTML, якщо браузер мобільний
	if (isMobile.any()) document.documentElement.classList.add('touch');
}

// блокування прокрутки екрану при відкритті меню/попапу ------------------------------------------------
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains("lock")) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
};
let bodyUnlock = (delay = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = "0px";
			}
			body.style.paddingRight = "0px";
			document.documentElement.classList.remove("lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
};
let bodyLock = (delay = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight =
			window.innerWidth -
			document.querySelector(".wrapper").offsetWidth +
			"px";
		}
		body.style.paddingRight =
			window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
		document.documentElement.classList.add("lock");

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
};

// меню бургер ------------------------------------------------------------------------------------------------
function menuInit() {
	if (document.querySelector(".icon-menu")) {
		document.addEventListener("click", function (e) {
			if (bodyLockStatus && e.target.closest(".icon-menu")) {
				bodyLockToggle()
				document.documentElement.classList.toggle("menu-open")
			}
		})
	}
}
function menuOpen() {
	bodyLock()
	document.documentElement.classList.add("menu-open")
}
function menuClose() {
	bodyUnlock()
	document.documentElement.classList.remove("menu-open")
}

// зміна кольорової теми ------------------------------------------------------------------------------
function applyTheme(theme) {
	const htmlElement = document.documentElement;
	const logoImage = document.getElementById('logo-image');
	
	if (theme === 'dark') {
		htmlElement.setAttribute('data-theme', 'dark');
		logoImage.src = './img/svg/logo-dark.svg';
	} else {
		htmlElement.removeAttribute('data-theme');
		logoImage.src = './img/svg/logo-light.svg';
	}
}

// Функція-ініціалізатор, яка містить всю логіку
function initThemeToggle() {
	const themeToggle = document.getElementById('theme-toggle');
	const htmlElement = document.documentElement;

	// Перевіряємо localStorage при завантаженні сторінки
	const savedTheme = localStorage.getItem('theme');
	
	if (savedTheme) {
		applyTheme(savedTheme);
	} else {
		const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		
		if (prefersDark) {
			applyTheme('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			applyTheme('light');
			localStorage.setItem('theme', 'light');
		}
	}
	
	// Обробник подій для кнопки перемикання теми
	if (themeToggle) { // Важливо перевіряти наявність елемента
		themeToggle.addEventListener('click', () => {
			if (htmlElement.getAttribute('data-theme') === 'dark') {
					applyTheme('light');
					localStorage.setItem('theme', 'light');
			} else {
					applyTheme('dark');
					localStorage.setItem('theme', 'dark');
			}
		});
	}
}

// зміна мови -----------------------------------------------------------------------------------------

function initLanguageDropdown() {
	const dropdown = document.querySelector('.language-dropdown');
	
	if (!dropdown) {
		return;
	}

	const toggleButton = dropdown.querySelector('.language-dropdown__toggle');
	const languageMenu = dropdown.querySelector('.language-dropdown__menu');
	const currentFlag = toggleButton.querySelector('.current-flag');
	const menuItems = languageMenu.querySelectorAll('li');

	// Функція, яка оновлює UI та додає клас до <html>
	function updateLanguageUI(langCode) {
		const selectedItem = document.querySelector(`.language-dropdown__menu li[data-lang="${langCode}"]`);
		if (selectedItem) {
			menuItems.forEach(li => li.classList.remove('selected'));
			selectedItem.classList.add('selected');
			currentFlag.src = selectedItem.querySelector('img').src;
			currentFlag.alt = selectedItem.textContent.trim();
			
			// --- Додаткова логіка для додавання класу до <html> ---
			document.documentElement.setAttribute('lang', langCode);
			console.log(`Клас для мови додано: ${langCode}`);
			// --- Кінець додаткової логіки ---
		} else {
			// Якщо мова не знайдена, встановлюємо 'en' за замовчуванням
			updateLanguageUI('en');
		}
	}

	// Логіка ініціалізації мови
	const savedLang = localStorage.getItem('siteLang');
	let initialLangCode;

	if (savedLang) {
		initialLangCode = savedLang;
	} else {
		const browserLang = navigator.language.slice(0, 2);
		const supportedLangs = Array.from(menuItems).map(item => item.dataset.lang);
		
		if (supportedLangs.includes(browserLang)) {
			initialLangCode = browserLang;
		} else {
			initialLangCode = 'en';
		}
		
		localStorage.setItem('siteLang', initialLangCode);
	}
	
	updateLanguageUI(initialLangCode);

	// Функція для перемикання видимості меню
	function toggleMenu() {
		const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
		toggleButton.setAttribute('aria-expanded', !isExpanded);
		languageMenu.setAttribute('aria-hidden', isExpanded);
	}

	// Обробники подій
	toggleButton.addEventListener('click', (event) => {
		event.stopPropagation();
		toggleMenu();
	});

	menuItems.forEach(item => {
		item.addEventListener('click', () => {
			const selectedLang = item.dataset.lang;
			updateLanguageUI(selectedLang);
			localStorage.setItem('siteLang', selectedLang);
			toggleMenu();
			console.log(`Мова змінена на: ${selectedLang}`);
		});
	});

	document.addEventListener('click', (event) => {
		if (!dropdown.contains(event.target)) {
			toggleButton.setAttribute('aria-expanded', 'false');
			languageMenu.setAttribute('aria-hidden', 'true');
		}
	});
}

// зміна позицій елементів в мобільному меню ----------------------------------------------------------
function initMenuElementMover() {
	const BREAKPOINT = 1024.5;
	let resizeTimer = null;

	function moveElement() {
		const screenWidth = window.innerWidth;
		const isMenuOpen = document.documentElement.classList.contains('menu-open');

		const header = document.querySelector('.header');
		if (!header) return;

		// останній .menu__list у .header
		const menuLists = header.querySelectorAll('.menu__list');
		const menuList = menuLists.length ? menuLists[menuLists.length - 1] : null;
		const menuItems = menuList ? menuList.querySelectorAll('.menu__item') : [];

		const lastMenuItem = menuItems.length ? menuItems[menuItems.length - 1] : null; // .menu__item:last-child
		const thirdMenuItem = menuItems.length >= 3 ? menuItems[2] : null; // .menu__item:nth-child(3)

		const menuButtons = header.querySelector('.header__menu_buttons');

		const greenBtn = document.querySelector('.btn-green');
		const themeToggle = document.querySelector('.theme-toggle');

		if (!greenBtn || !themeToggle) return;

		// --- Десктоп (повернути в початкові місця з HTML) ---
		if (screenWidth > BREAKPOINT) {
			// theme-toggle -> .header .menu__list:last-child .menu__item:last-child
			if (lastMenuItem && themeToggle.parentElement !== lastMenuItem) {
				lastMenuItem.appendChild(themeToggle);
			}
			// btn-green -> .header .menu__list:last-child .menu__item:nth-child(3)
			if (thirdMenuItem) {
				if (greenBtn.parentElement !== thirdMenuItem) {
					thirdMenuItem.appendChild(greenBtn);
				}
			} else if (menuList) {
				if (greenBtn.parentElement !== menuList) {
					menuList.appendChild(greenBtn);
				}
			}
			return;
		}

		// --- Мобільна/планшетна логіка ---
		if (!isMenuOpen) {
			// меню закрите
			if (lastMenuItem && themeToggle.parentElement !== lastMenuItem) {
				lastMenuItem.appendChild(themeToggle);
			}
			if (menuButtons && greenBtn.parentElement !== menuButtons) {
				menuButtons.appendChild(greenBtn);
			}
		} else {
			// меню відкрите
			if (menuButtons && themeToggle.parentElement !== menuButtons) {
				menuButtons.appendChild(themeToggle);
			}
			if (lastMenuItem && greenBtn.parentElement !== lastMenuItem) {
				lastMenuItem.appendChild(greenBtn);
			}
		}
	}

	// запуск і підписка на події
	moveElement();

	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(moveElement, 40);
	});

	const observer = new MutationObserver((mutations) => {
		for (const m of mutations) {
			if (m.attributeName === 'class') {
				moveElement();
				break;
			}
		}
	});
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

// безперервний рядок marquee ---------------------------------------------------------------------------------
function initMarquee() {
	const marquee = document.querySelector('.company__marquee');
	
	// Перевіряємо, чи існує елемент на сторінці
	if (!marquee) {
		return;
	}

	const content = marquee.querySelector('.company__marquee_inner');

	// Клонування елементів
	const clone1 = content.cloneNode(true);
	marquee.appendChild(clone1);
	const clone2 = content.cloneNode(true);
	marquee.appendChild(clone2);

	// Функція для оновлення тривалості анімації
	function updateAnimationDuration() {
		const contentWidth = content.offsetWidth;
		const speed = 20; // Пікселів за секунду
		const duration = contentWidth / speed;
		
		marquee.style.setProperty('--marquee-duration', `${duration}s`);
	}

	// Початковий запуск і оновлення при зміні розміру вікна
	updateAnimationDuration(); 
	window.addEventListener('resize', updateAnimationDuration);
}

// слайдери ---------------------------------------------------------------------------------------------------
function initSliders() {
	// Ініціалізація першого слайдера
	const firstSlider = new Swiper(".first-slider__slider", {
		slidesPerView: 1,
		spaceBetween: 30,
		loop: true,
		keyboard: {
			enabled: true,
		},
		navigation: {
			nextEl: ".first-slider__next",
			prevEl: ".first-slider__prev",
		},
	});

	// Ініціалізація другого слайдера
	const secondSlider = new Swiper(".second-slider__slider", {
		slidesPerView: 1,
		spaceBetween: 30,
		loop: true,
		keyboard: {
			enabled: true,
		},
		navigation: {
			nextEl: ".second-slider__next",
			prevEl: ".second-slider__prev",
		},
	});
}

// акордеон ---------------------------------------------------------------------------------------------------
function initAccordions() {
	const accordions = document.getElementsByClassName("accordion");

	// Перевірка наявності акордеонів на сторінці
	if (accordions.length === 0) {
		return;
	}

	for (let i = 0; i < accordions.length; i++) {
		accordions[i].addEventListener("click", function() {
			const isActive = this.classList.contains("active");

			// Спочатку закриваємо всі панелі
			for (let j = 0; j < accordions.length; j++) {
				const panelToClose = accordions[j].nextElementSibling;
				accordions[j].classList.remove("active");
				panelToClose.style.maxHeight = null;
			}

			// Якщо поточна вкладка не була активною, відкриваємо її
			if (!isActive) {
				const panelToOpen = this.nextElementSibling;
				this.classList.add("active");
				panelToOpen.style.maxHeight = panelToOpen.scrollHeight + "px";
			}
		});
	}
}

// мобільний акордеон в футері --------------------------------------------------------------------------------
function initFooterAccordion() {
	const mediaQuery = window.matchMedia("(max-width: 768.7px)");

	function handleAccordionBehavior(mediaQuery) {
		const accordionHeadings = document.querySelectorAll(".footer__columns_column h5");

		// Функція, що відповідає за згортання/розгортання
		function toggleAccordion() {
			const isActive = this.classList.contains("active");
			const panelToToggle = this.nextElementSibling;
			
			// Закриваємо всі відкриті панелі у футері
			accordionHeadings.forEach(heading => {
			const panelToClose = heading.nextElementSibling;
			heading.classList.remove("active");
			if (panelToClose) {
				panelToClose.style.maxHeight = null;
				panelToClose.classList.remove("active");
			}
			});
			
			// Якщо поточна вкладка не була активною, відкриваємо її
			if (!isActive) {
			this.classList.add("active");
			if (panelToToggle) {
				panelToToggle.style.maxHeight = panelToToggle.scrollHeight + "px";
				panelToToggle.classList.add("active");
			}
			}
		}

		if (mediaQuery.matches) {
			// Додаємо обробники подій для мобільної версії
			accordionHeadings.forEach(heading => {
			heading.addEventListener("click", toggleAccordion);
			});
		} else {
			// Видаляємо обробники подій для десктопної версії
			accordionHeadings.forEach(heading => {
			heading.removeEventListener("click", toggleAccordion);
			heading.classList.remove("active");
			const panel = heading.nextElementSibling;
			if (panel) {
				panel.style.maxHeight = null;
			}
			});
		}
	}

	// Викликаємо функцію при завантаженні сторінки
	handleAccordionBehavior(mediaQuery);

	// Слухаємо зміни розміру екрана
	mediaQuery.addListener(handleAccordionBehavior);
}




document.addEventListener('DOMContentLoaded', () => {
	
	// ініціалізація перевірки, чи браузер мобільний ------------------------------------------------------
	addTouchClass();
	// ініціалізація "бургер-меню" ------------------------------------------------------------------------
	menuInit()
	// ініціалізація зміни кольорової теми ----------------------------------------------------------------
	initThemeToggle();
	// ініціалізація зміни мови ---------------------------------------------------------------------------
	initLanguageDropdown();
	// ініціалізація зміни позицій елементів --------------------------------------------------------------
	initMenuElementMover();
	// ініціалізація рядка marquee ------------------------------------------------------------------------
	initMarquee();
	// ініціалізація слайдерів ----------------------------------------------------------------------------
	initSliders();
	// ініціалізація аккордеону ---------------------------------------------------------------------------
	initAccordions();
	
	initFooterAccordion();
	

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

