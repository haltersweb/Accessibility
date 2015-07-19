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

    var $currentDialog = null, // a reference to the dialog box to be shown
        $triggerElement = null, // a reference to the element that triggered the dialog box
        $screenBlock, // a reference to the dimmed layer that blocks what's behind it.
        $contentsToBlock; // a reference to content containers that are blocked when dialog is visible.
    /*
        assign click event to open the modal window
    */
    $('[data-controls="modal"]').on('click', function (evt) {
        // identify the modal
        $currentDialog = $('#' + $(this).attr('aria-controls'));
        // identify what content containers will be blocked when the modal is active
        $contentsToBlock = $('.page-wrapper');
        //unblock overlay content from screen reader
        //position and show overlay
        //bind esc to trigger close button
        //put focus on close button.
        showDialog($currentDialog, $contentsToBlock);
    });
    $('[data-widget="modal"] [data-control="close"]').on('click', function (evt) {
        var $closeModalBtn = $(this),
            $screenBlock = $('.block-screen'),
            $contentsToBlock=$('.page-wrapper');

        closeDialog();
        NAME.access.removeBlockFocus($blockedContainers);
        NAME.access.focusTrigger();
    });
    function showDialog($dialog, $blockedContainers) {
        var $firstActionableElement = $dialog.find(NAME.focusables).not('[data-bookends]').eq(0);
        // if there is no actionable element inside dialog, make the dialog the actionable element
        if ($firstActionableElement.length === 0) {
            $dialog.attr('tabindex', '0');
            $firstActionableElement = $dialog;
        }
        //if $blockedContainers has been passed into the function then this is a modal
        if ($blockedContainers) {
            // identify the element that blocks the content
            $screenBlock = $('.block-screen');
            //show screen blocker
            $screenBlock.addClass('active');
            //add bookends to modal
            addBookends($dialog);
            //constrain tabbing to bookends
            bookendFocus($dialog);
            //position in center
            positionModal();
            //block focus in blocked containers & hide page content from reader
            NAME.access.blockFocus($blockedContainers, $firstActionableElement);
        // else this is a tooltip
        } else {
            //position relative to trigger
        }
        // flag the trigger used to open dialog
        NAME.access.tagTrigger();
        // reveal dialog content to screen reader
        $dialog.attr("aria-hidden", "false");
        // show the dialog box
        $dialog.addClass('active');
        //bind esc to close the dialog box
        $dialog.on('keyup.esc-key', function (event) {
            escapeKeyClose(event);
        });
        //put focus on close button
        $firstActionableElement.focus();
        console.log('openModal function run.');
    }
    function addBookends($container) {
        var bookendMarkup = '<div tabindex="0" data-bookends></div>';
        //first check to see if bookends already exists
        if($('[data-bookends]').length > 0) {
            return true;
        }
        //add bookends
        $container.prepend(bookendMarkup);
        $container.append(bookendMarkup);
    }
    function bookendFocus($container) {
        // Capture focus events on bookends to contain tabbing within a container
        // Note: We don't need to know the direction, because the only way to
        // tab to the first bookend is to shift tab (backwards), and
        // the only way to tab to the last bookend is to tab (forwards).
        var $bookends = $container.find('[data-bookends]');
        // First check to make sure the bookends exist
        if ($bookends.size() > 0) {
            // Focusing first bookend sends focus to last real focusable element
            $bookends.eq(0).on('focus.bookend-focus', function (event) {
                var $focusableElements = $container.find(NAME.focusables);
                $focusableElements.eq(-2).focus();
            });
            // Focusing last bookend sends focus to the first real focusable element
            $bookends.eq(1).on('focus.bookend-focus', function (event) {
                var $focusableElements = $container.find(NAME.focusables);
                $focusableElements.eq(1).focus();
            });
        }
    }
    function positionModal() {

    }
    /*
        function to open a dialog box
    */
    function openDialog($dialog, modalOrTooltip, $blockedContainers) {
        var $closeModalBtn = $dialog.find('[data-control="close"]');
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
            if ($currentDialog) {
                hideDialog($currentDialog);
            }
        }
    }
    /*
        function to close a dialog box
    */
    function hideDialog($dialog) {
        /*
        1. set aria-hidden = true;
        2. hide dialog;
        */
        console.log('closeModal function run.');
    }

}(jQuery, NAME));
