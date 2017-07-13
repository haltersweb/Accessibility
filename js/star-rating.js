/*global
    NAME
*/
/**
 * @author Adina Halter
 * Accessible Star Rating
 */

 /* radio button method */
(function () {
    'use strict';
    var stars = document.getElementsByClassName('svg-star'),
        starRadio = document.getElementsByClassName('radio-rating');
    for(var i = 0; i < stars.length; i++) {
        stars[i].addEventListener('click', function(){
            this.previousElementSibling.click();
        }, false);
        starRadio[i].addEventListener('change', function(){
            this.parentNode.classList.add('changed');
        }, false);
    }
}());

/* ARIA radiogroup method */
(function (NAME) {
    'use strict';
    var ariaStars = document.querySelectorAll('[role="radio"]'),
        firstStar = ariaStars[0],
        lastStar = ariaStars[ariaStars.length - 1];

    function checkStar(targetStar, clicked) {
        if (clicked) {
            targetStar.classList.add('clicked');
        } else {
            targetStar.classList.remove('clicked');
        }
        targetStar.parentNode.classList.add('changed');
        targetStar.focus();
        for (var i = 0; i < ariaStars.length; i += 1) {
            ariaStars[i].setAttribute('aria-checked', 'false');
            ariaStars[i].setAttribute('tabindex', '-1');
        }
        targetStar.setAttribute('aria-checked', 'true');
        targetStar.setAttribute('tabindex', '0');
    }
    function nextStar(currStar) {
        return (currStar === lastStar) ? firstStar : currStar.nextElementSibling;
    }
    function prevStar(currStar) {
        return (currStar === firstStar) ? lastStar : currStar.previousElementSibling;
    }
    function bindClickEvents() {
        for (var i = 0; i < ariaStars.length; i += 1) {
            ariaStars[i].addEventListener('click', function () {
                this.classList.add('clicked');
                checkStar(this, true);
            });
        }
    }
    function bindKeyEvents() {
        for (var i = 0; i < ariaStars.length; i += 1) {
            ariaStars[i].addEventListener('keydown', function (evt) {
                switch(evt.keyCode) {
                case NAME.keyboard.up:
                case NAME.keyboard.right:
                    checkStar(nextStar(this, false));
                    break;
                case NAME.keyboard.down:
                case NAME.keyboard.left:
                    checkStar(prevStar(this, false));
                    break;
                case NAME.keyboard.space:
                    checkStar(this, false);
                }
            });
        }
    }
    bindClickEvents();
    bindKeyEvents();
}(NAME));
/*
    function checkStar(starNode) {
        set all star buttons to:
            aria-checked = false
            don't think I will need: tabindex = -1
        set starNode to:
            aria-checked = true
            don't think I will need: tabindex = 0
    }

    on star-button CLICK:
        checkStar()

    on focus:
        ???

    within ariaStarGroup:
        on arrow-right or arrow down
            1. find next star (or first star)
            2. checkStar()
        on arrow-left or arrow down
            1. find prev star (or last star)
            2. checkStar()

    on space bar
        check focused star using checkStar()
*/

