/**
 * @author Adina Halter
 * Accessible Tab Navigation
 */
(function ($, NAME) {
    'use strict';
    $('#birthMonth').on('focus', function () {
        $(this).attr('placeholder', '');
    });
    $('#birthMonth').on('blur', function () {
        $(this).attr('placeholder', $(this).attr('data-placeholder'));
    });
    $('#submit').on('click', function () {
        if(!$('input#human').is(':checked')) {
            $('#errorMsg').text('We need to know if you are a human.').show();
        } else {
            $('#errorMsg').text('').hide();
            alert('Thanks for submitting this form');
        }
    });
    $('svg#human').on('click', function () {
        console.log($(this));
        $(this).parent().toggleClass('checked');
        $('input#human').click();
    });
}(jQuery, NAME));
