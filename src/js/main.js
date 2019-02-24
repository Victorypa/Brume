let nav = document.getElementById('navigation')

let menu = document.getElementById('menu')

                    menu.addEventListener('click', () => {
                    nav.classList.toggle("show");
                    menu.classList.toggle("show");
                  })

const tabsHeader = document.querySelectorAll('.tabs-header');
const tabsContent = document.querySelectorAll('.tabs-content');
const tabTitleClass = '.tab-title';

// "Closest()" IE polyfill
const closest = (el, selector) => {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    } else {
      el = el.parentElement;
    }
  }
  return null;
}

const showContent = () => {
	for (let i=0, child; child=tabsHeader[i]; i++) {
		const tabTitles = child.children;
		for (let i=0, tabTitle; tabTitle=tabTitles[i]; i++) {
			const tabItems = closest(tabTitle, tabTitleClass).parentElement.nextElementSibling.children;
			console.log(tabItems);
			if (tabTitles[i].dataset.state == 'active') {
				tabTitles[i].classList.add('is-showed');
				[].forEach.call(tabItems, () => {
					tabItems[i].classList.add('is-showed');
				});
			} else {
				tabTitles[i].classList.remove('is-showed');
				[].forEach.call(tabItems, () => {
					tabItems[i].classList.remove('is-showed');
				});
			};
		};
	};
};
// Отображаем установленные по умолчанию табы при загрузке
showContent();

const activateTab = e => {
	const target = closest(e.target, '.tab-title');
	const tabItems = closest(target, '.tab-title').parentElement.nextElementSibling.children;
	const targetSiblings = Array.prototype.filter.call(closest(target, '.tab-title').parentNode.children, (child) => child !== target);
	targetSiblings.forEach(sib => {
		sib.classList.remove('is-showed');
		sib.setAttribute('data-state', 'hidden');
	});
	target.classList.add('is-showed');
	target.setAttribute('data-state', 'active');
	showContent();
};

[].forEach.call(tabsHeader, el => {
    el.addEventListener('click', activateTab);
});

