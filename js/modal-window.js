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
            $modal = $('#' + $modalTrigger.attr('aria-controls'));
        //flag trigger used to open overlay
        NAME.access.tagTrigger();
        //show screen blocker
        $blockScreen.addClass('active');
        //unblock overlay content from screen reader
        //position and show overlay
        //bind esc to trigger close button
        //put focus on close button.
        openDialog($modal, "modal", $blockedContainers);
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
    function openDialog($dialog, modalOrTooltip, $blockedContainers) {
        var $closeModalBtn = $dialog.find('[data-control="close"]');
        $dialog.attr("aria-hidden", "false");
        if (modalOrTooltip = "modal") {
            //position in center
            //block focus in blocked containers & hide page content from reader
            NAME.access.blockFocus($blockedContainers, $closeModalBtn);
        }
        if (modalOrTooltip = "tooltip") {
            //position relative to [data-trigger="true"]
        }
        $dialog.addClass('active');
        //bind esc to trigger close button
        $dialog.on('keyup.esc-key-closes-dialog', function (event) {
            escapeKeyClose(event);
        });
        //put focus on close button
        $closeModalBtn.focus();
        console.log('openModal function run.');
    }
    /*
        esc key closes dialog
    */
        // Close the overlay using the escape key
    function escapeKeyClose (event) {
        if (event.keyCode === NAME.keyboard.esc) {
            // If focus is in a form field, the escape key should not close the overlay
            // because form fields have default escape behavior on their own.
            if ($(':focus').filter('input, textarea').length > 0) {
                return;
            }
            // Close the current overlay
            if ($currentOverlay) {
                hideOverlay($currentOverlay);
            }
        }
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
