/**
 * @author Adina Halter
 * Accessible Modal Window
 */
(function ($, NAME) {
    'use strict';
    /*
    showing the overlay:
        1. flag trigger used to open overlay
        2. show screen blocker
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
    $('[data-controls="modal"]').on('click', function (evt) {
        var $modalTrigger = $(this),
            $blockScreen = $('.block-screen'),
            $blockedContainers = $('.page-wrapper'),
            $modal = $('#' + $modalTrigger.attr('aria-controls')),
            $closeModalBtn = $modal.find('[data-control="close"]');
        //flag trigger used to open overlay
        NAME.access.tagTrigger();
        //show screen blocker
        $blockScreen.addClass('active');
        //block focus in blocked containers
        //hide page content from reader
        NAME.access.blockFocus($blockedContainers, $closeModalBtn);
        //unblock overlay content from screen reader
        //position and show overlay
        //bind esc to trigger close button
        //put focus on close button.
        openDialog();
    });
    $('[data-widget="modal"] [data-control="close"]').on('click', function (evt) {
        var $closeModalBtn = $(this),
            $blockScreen = $('.block-screen'),
            $blockedContainers=$('.page-wrapper');

        closeDialog();
        NAME.access.removeBlockFocus($blockedContainers);
        NAME.access.focusTrigger();
    });
    /*
        function to open a dialog box
    */
    function openDialog($dialog) {
        /*
        1. set aria-hidden = false;
        2. position dialog (is this a tooltip or a modal?)
        3. show dialog
        */
        console.log('openModal function run.');
    }
    /*
        function to close a dialog box
    */
    function closeDialog() {
        /*
        1. set aria-hidden = true;
        2. hide dialog;
        */
        console.log('closeModal function run.');
    }

}(jQuery, NAME));
