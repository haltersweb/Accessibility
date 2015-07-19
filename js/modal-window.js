/**
 * @author Adina Halter
 * Accessible Modal Window
 */
(function ($, NAME) {
    'use strict';
    var $currentDialog = null, // a reference to the current dialog box being shown
        $screenBlock = $('.block-screen'), // a reference to the dimmed layer that blocks what's behind it.
        $contentsToBlock = $('.page-wrapper'); // a reference to content containers that are blocked when dialog is visible.
    /*
        assign click event to open the modal window
    */
    $('[data-controls="modal"]').on('click', function (evt) {
        // identify the modal
        $currentDialog = $('#' + $(this).attr('aria-controls'));
        showDialog($currentDialog, $contentsToBlock);
    });
    /*
        assign click event to close the modal window
    */
    $('[data-widget="modal"] [data-control="close"]').on('click', function (evt) {

        hideDialog($currentDialog);
    });
    /*
        function to open a dialog box where:
            $dialog: is the dialog to open
            $blockedContainers: (OPTIONAL) contents to block if dialog is a modal
    */
    function showDialog($dialog, $blockedContainers) {
        //find the first actionable element in the dialog box
        var $firstActionableElement = $dialog.find(NAME.focusables).not('[data-bookends]').eq(0);
        // if there is no actionable element inside dialog, make the dialog the actionable element
        if ($firstActionableElement.length === 0) {
            $dialog.attr('tabindex', '0');
            $firstActionableElement = $dialog;
        }
        // IF we are blocking content then this is a MODAL
        if ($blockedContainers) {
            //show screen blocker
            $screenBlock.addClass('active');
            //add bookends to modal
            addBookends($dialog);
            //position modal in center of screen
            positionModal();
            //block focus in blocked containers & hide page content from reader
            NAME.access.blockFocus($blockedContainers, $firstActionableElement);
        // ELSE this is a TOOLTIP
        } else {
            //position relative to trigger
            positionTooltip();
        }
        // flag the trigger used to open the dialog
        NAME.access.tagTrigger();
        // show the dialog box
        $dialog.addClass('active');
        // reveal dialog content to screen reader
        $dialog.attr("aria-hidden", "false");
        //bind ESC key to close the dialog box
        $dialog.on('keyup.esc-key', function (event) {
            escapeKeyClosesDialog(event);
        });
        //put focus on dialog box's close button
        $firstActionableElement.focus();
    }
    function addBookends($container) {
        var bookendMarkup = '<div tabindex="0" data-bookends></div>';
        //first check to see if bookends already exist.  If so, don't do anything.
        if ($('[data-bookends]').length > 0) {
            return true;
        }
        //add bookends
        $container.prepend(bookendMarkup);
        $container.append(bookendMarkup);
        //constrain tabbing to bookends
        bookendFocus($container);
    }
    function bookendFocus($container) {
        // Capture focus events on bookends to contain tabbing within a container
        // Note: We don't need to know the direction, because the only way to
        // tab to the first bookend is to shift tab (backwards), and
        // the only way to tab to the last bookend is to tab (forwards).
        var $bookends = $container.find('[data-bookends]');
        // First check to make sure bookends already exist
        if ($bookends.size() > 0) {
            // Focusing first bookend sends focus to last real focusable element
            $bookends.eq(0).on('focus', function (event) {
                var $focusableElements = $container.find(NAME.focusables);
                $focusableElements.eq(-2).focus();
            });
            // Focusing last bookend sends focus to the first real focusable element
            $bookends.eq(1).on('focus', function (event) {
                var $focusableElements = $container.find(NAME.focusables);
                $focusableElements.eq(1).focus();
            });
        }
    }
    /*
        function to position modal in center of screen
    */
    function positionModal() {

    }
    /*
        function to position tooltip relative to trigger
    */
    function positionTooltip() {

    }
    /*
        esc key closes dialog
    */
    function escapeKeyClosesDialog(event) {
        if (event.keyCode === NAME.keyboard.esc) {
            console.log('ESC key pushed');
            // If focus is in a form field, the ESC key should not close the overlay
            // because form fields have default ESC behavior on their own.
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
        function to hide a dialog box
    */
    function hideDialog($dialog) {
        /*
        1. set aria-hidden = true;
        2. hide dialog;
        */

        var $blockedContainers = $contentsToBlock;

        // identify the screen element that lays over the blocked content
        $screenBlock = $('.block-screen');
        //show screen blocker
        $screenBlock.removeClass('active');
        //block focus in blocked containers & hide page content from reader
        NAME.access.removeBlockFocus($blockedContainers);
        // hide the dialog box
        $dialog.removeClass('active');
        // hide dialog content from screen reader
        $dialog.attr("aria-hidden", "true");
        // remove ESC key event
        $dialog.off('keyup.esc-key');
        // focus on the trigger that had opened the dialog
        NAME.access.focusTrigger();
        // reset local variable
        $currentDialog = null;
    }

}(jQuery, NAME));
