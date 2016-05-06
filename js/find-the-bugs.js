/**
 * @author Adina Halter
 * Accessible Tab Navigation
 */

/*global
    alert, NAME, $, jQuery
*/
(function ($, NAME) {
    'use strict';
    $('#yes').on('click', function () {
        alert("Huzzah!");
    });
    $('#no').on('click', function (evt) {
        evt.preventDefault();
        alert("Well, go ahead and have a lie down, then.");
    });
    $('.blind-trigger').on('click', function () {
        $('.blind-container').toggleClass('accessibly-hidden');
    });
}(jQuery, NAME));
