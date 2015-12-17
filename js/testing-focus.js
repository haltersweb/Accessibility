/**
 * @author Adina Halter
 * Accessible Drop Menu and Menu Drawer
 */
(function ($, NAME) {
    'use strict';
	$('body').on('keydown', function (evt) {
        if (evt.keyCode === NAME.keyboard.space) {
            console.log(document.activeElement);
        }
    });
}(jQuery, NAME));
