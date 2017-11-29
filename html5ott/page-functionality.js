/*global
    window, console
*/
/* @author Adina Halter
*/

/*
ARROWING CODE
*/
(function () {
    'use script';
    var keyboard = {
            left: 37,
            up: 38,
            right: 39,
            down: 40
        },
        focusablesQueryString = 'a, button, [tabindex], input',
        focusables = document.querySelectorAll(focusablesQueryString),
        videoLaunchers = document.querySelector('[data-launcher]');
    function openPlayer() {
        document.getElementById('videoPlayer').classList.removeClass('hidden');
    }
    function findThisSection(elem) {
        while (
            !elem.dataset.section
            &&
            elem.nodeName !== 'BODY'
        ) {
            elem = elem.parentElement;
        }
        if (elem.dataset.section) {
            return elem;
        }
        return null;
    }
    for (var i = 0; i < focusables.length; i += 1) {
        focusables[i].addEventListener('keydown', function (evt) {
            if (
                evt.keyCode === keyboard.right ||
                evt.keyCode === keyboard.left ||
                evt.keyCode === keyboard.up ||
                evt.keyCode === keyboard.down
            ) {
                var thisSection = findThisSection(this),
                    newSection = null;
                switch (evt.keyCode) {
                case (keyboard.left):
                    if (this.previousElementSibling) {
                        this.previousElementSibling.focus();
                    }
                    break;
                case (keyboard.right):
                    if (this.nextElementSibling) {
                        this.nextElementSibling.focus();
                    }
                    break;
                case (keyboard.up):
                    newSection = document.querySelector('[data-section="' + (parseInt(thisSection.dataset.section) - 1) + '"]');
                    if (newSection) {
                        newSection.querySelector(focusablesQueryString).focus();
                    }
                    break;
                case (keyboard.down):
                    newSection = document.querySelector('[data-section="' + (parseInt(thisSection.dataset.section) + 1) + '"]');
                    if (newSection) {
                        newSection.querySelector(focusablesQueryString).focus();
                    }
                    break;
                default:
                    return false;
                }
            }
        });
        focusables[i].addEventListener('focus', function () {
            document.querySelector('.focus').classList.toggle('focus');
            this.classList.toggle('focus');
        });

    }
    document.querySelector('.focus').focus();
}());
