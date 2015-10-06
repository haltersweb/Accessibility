/**
 * @author Adina Halter
 * Accessible Tab Navigation
 */
(function ($, NAME) {
    'use strict';
    $('a.btn, button').on('click', function (evt) {
        evt.preventDefault();
        alert("You clicked me!!");
    });
}(jQuery, NAME));
