import $ from 'jquery';

const $headBtn = $('.headerNavigation__btn');
const $toggleMenu = $(".toggleMenu");
$headBtn.on('click', function () {
    $headBtn.toggleClass('toggleBtn', 'toggleBtnSt');
    //$toggleMenu.slideToggle(300);
    $toggleMenu.toggleClass('menu_active', 'menu_closed');

})



