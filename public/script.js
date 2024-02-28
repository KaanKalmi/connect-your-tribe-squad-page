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

let i = 0;
let stars = document.querySelector('.star1 + .star2 + star3 + star4');
let aarde = document.querySelector('.aarde');
let raket = document.querySelector('.rocket');
let number = document.querySelector('.number');
let site = document.querySelector('.website');
let preloader = document.querySelector('.preloader')



let interval = setInterval(function(){
    number.innerHTML = i+'<span>%</span>';
    number.style.height = i+'%';
    i++
    if(i == 101){
        clearInterval(interval)
    setTimeout(function(){
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        site.style.opacity = '1';
        site.style.visibility = 'visible';
      
    })
    }
},40)
