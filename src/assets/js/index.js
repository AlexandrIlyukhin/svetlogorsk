import $ from 'jquery';
/*

let $headBtn = $('.headerNavigation__btn');

$headBtn.on('click', function (){

});
*/

const $headBtn = $('.headerNavigation__btn');

$headBtn.on('click', function (){
    $headBtn.toggleClass('toggleBtn','toggleBtnSt');
    //$headBtn.removeClass('toggleBtnSt').addClass('toggleBtn');

})

//$headBtn.toggleClass('.toggleBtn','.toggleBtnSt');