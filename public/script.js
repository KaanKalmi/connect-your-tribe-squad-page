let dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    let select = dropdown.querySelector('.select');
    let caret = dropdown.querySelector('.caret');
    let menu = dropdown.querySelector('.menu');
    let options = dropdown.querySelectorAll('.menu li');
    let selected = dropdown.querySelector('.selected');


select.addEventListener('click', () => {
select.classList.toggle('select-clicked');
caret.classList.toggle('caret-rotate');
menu.classList.toggle('menu-open');
});

options.forEach(option => {
    option.addEventListener('click', () => {
        option.classList.toggle('active');
    });
});
});

