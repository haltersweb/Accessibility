/**
 * @author Adina Halter
 * Accessible Modal and Tooltips
 */
(function ($, NAME) {
    'use strict';
    var $currentDialog = null, // a reference to the current dialog box being shown.
        $currentTrigger = null,
        $screenBlock = $('.block-screen'), // a reference to the dimmed layer that blocks what's behind it.
        $contentsToBlock = $('.page-wrapper'); // a reference to content containers that are blocked when dialog is visible.
    /*
        assign click event to open the modal window
    */
    $('[data-controls="modal"]').on('click', function (evt) {
        // identify the trigger
        $currentTrigger = $(this);
        // identify the modal
        $currentDialog = $('#' + $currentTrigger.attr('aria-controls'));
        showDialog($currentDialog, $contentsToBlock);
    });
    /*
        assign click event to close the modal window
    */
    $('[data-widget="modal"] [data-control="close"]').on('click', function (evt) {
        hideDialog($currentDialog);
    });
    /*
        assign click event to open the tooltip
    */
    $('[data-controls="tooltip"]').on('click', function (evt) {
        // identify the trigger
        $currentTrigger = $(this);
        // identify the modal
        $currentDialog = $('#' + $currentTrigger.attr('aria-controls'));
        showDialog($currentDialog);
    });
    /*
        assign click event to close the tooltip
    */
    $('[data-widget="tooltip"] [data-control="close"]').on('click', function (evt) {
        var $this = $(this);
        $currentDialog = $this.closest('[data-widget="tooltip"]');
        $currentTrigger = $currentDialog.closest('[data-controls="tooltip"]');
        hideDialog($currentDialog);
        return false;
    });
    /*
        function to open a dialog box where:
            $dialog: is the dialog to open
            $blockedContainers: (OPTIONAL) contents to block if dialog is a modal
    */
    function showDialog($dialog, $OPTIONALblockedContainers) {
        //find the first actionable element in the dialog box
        var $firstActionableElement = $dialog.find(NAME.focusables).not('[data-bookends]').eq(0);
        // if there is no actionable element inside dialog, make the dialog the actionable element
        if ($firstActionableElement.length === 0) {
            $dialog.attr('tabindex', '0');
            $firstActionableElement = $dialog;
        }
        // IF we are blocking content then this is a MODAL
        if ($OPTIONALblockedContainers) {
            //show screen blocker
            $screenBlock.addClass('active');
            //add bookends to modal
            addBookends($dialog);
            //position modal in center of screen
            positionModal($dialog);
            //block focus in blocked containers & hide page content from reader
            NAME.access.blockFocus($OPTIONALblockedContainers, $firstActionableElement);
        // ELSE this is a TOOLTIP
        } else {
            //position relative to trigger
            positionTooltip($dialog);
        }
        // flag the trigger used to open the dialog
        NAME.access.tagTrigger($currentTrigger);
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
    /*
        function to hide a dialog box
    */
    function hideDialog($dialog) {
        /*
        1. set aria-hidden = true;
        2. hide dialog;
        */
        console.log($dialog);
        //hide screen blocker
        $screenBlock.removeClass('active');
        //block focus in blocked containers & hide page content from reader
        NAME.access.removeBlockFocus($contentsToBlock);
        // hide the dialog box
        $dialog.removeClass('active');
        // hide dialog content from screen reader
        $dialog.attr("aria-hidden", "true");
        // remove ESC key event
        $dialog.off('keyup.esc-key');
        // focus on the trigger that had opened the dialog
        NAME.access.focusTrigger($currentTrigger);
        // reset local variable
        $currentDialog = null;
        $currentTrigger = null;
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
    function positionModal($modal) {
        // Position and show the modal window.
        var modalHeight = $modal.outerHeight();
        $modal.css({
            "position": "fixed",
            "z-index": "200",
            "margin-left": -$modal.outerWidth() / 2,
            "margin-top": -modalHeight / 2,
            "left": "50%",
            "top": "50%"
        });
        // Use absolute positioning for modal if it's too tall for viewport
        if ($(window).height() < modalHeight) {
            $modal.css({
                "position": "absolute",
                "top": $(document).scrollTop() + 10,
                "margin-top": "0"
            });
        }
    }
    /*
        function to position tooltip relative to trigger
    */
    function positionTooltip($tooltip) {
        var $parent = $tooltip.parent();
        $tooltip.css('bottom', $parent.outerHeight());
    }
    /*
        esc key closes dialog
    */
    function escapeKeyClosesDialog(event) {
        if (event.keyCode === NAME.keyboard.esc) {
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

}(jQuery, NAME));
