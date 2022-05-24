import $ from 'jquery';

const $headBtn = $('.headerNavigation__btn');
const $toggleTarget = $(".toggleTarget");


$headBtn.on('click', function () {
    $headBtn.toggleClass('toggleBtn', 'toggleBtnSt');
    $toggleTarget.slideToggle(600);

})



