/**
 * @author Adina Halter
 * Accessible Tab Navigation
 */
(function ($, NAME) {
    'use strict';
    $('a.btn').on('click', function (evt) {
        evt.preventDefault();
        alert("Well, go ahead and have a lie down, then.");
    });
    $('.blind-trigger').on('click', function (evt) {
        $('.blind-container').toggleClass('accessibly-hidden');
    });
}(jQuery, NAME));
