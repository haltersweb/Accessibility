/**
 * @author Adina Halter
 * Accessible Modal Window
 */
(function ($, NAME) {
    'use strict';
    /*
    showing the overlay:
        1. flag trigger used to open overlay
        2. show blocker screen
        3. block page content
        4. hide page content from reader
        5. unblock overlay content from screen reader
        6. position and show overlay
        7. bind esc to trigger close button
        8. put focus on close button.
    hiding the overlay:
        1. remove ESC event
        2. hide overlay content from screen reader
        3. hide overlay
        4. hide blocker screen
        5. unblock page content from screen reader
        6. put focus on flagged trigger (or body)
        7. remove flag
    */

    /*
        assign click event to open the modal window
    */
    $('[data-trigger="modal"]').on('click', function (evt) {
        var $modalTrigger = $(this),
            $blockScreen = $('.block-screen'),
            $modal = $('#' + $modalTrigger.attr('aria-controls')),
            $blockedContainers=$('.page-wrapper'),
            $closeModalBtn=$modal.find('.close');
        NAME.access.tagTrigger();
        NAME.access.blockFocus($blockedContainers, $closeModalBtn);

        openModal();
    });

    /*
        function to open a subnav
    */
    function openModal($nav, $subnav) {
        //NAME.access.ariaExpand($subnav);
        console.log('openModal function run.');
    }

}(jQuery, NAME));
