/**
 * @author Adina Halter
 * Accessible Star Rating
 */
(function () {
    'use strict';
    var stars = document.getElementsByClassName('svg-star'),
        starRadio = document.getElementsByClassName('rating-radio');
    for(var i = 0; i < stars.length; i++) {
        stars[i].addEventListener('mouseenter', function(){
            this.parentNode.classList.add('hovering');
            this.classList.add('hovered');
        }, false);
        stars[i].addEventListener('mouseleave', function(){
            this.parentNode.classList.remove('hovering');
            this.classList.remove('hovered');
        }, false);
        stars[i].addEventListener('click', function(){
            this.previousElementSibling.click();
        }, false);
        starRadio[i].addEventListener('change', function(){
            this.parentNode.classList.add('changed');
        }, false);
    }
}());
