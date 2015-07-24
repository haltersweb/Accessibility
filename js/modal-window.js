/**
 * @author Adina Halter
 * Accessible Modal Window
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
            positionTooltip();
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
    function positionTooltip(prop) {
        var newPos = {
                maxWidth: '', // reset maxWidth/maxHeight in case theywere set in another tooltip
                maxHeight: ''
            },
            showOn = fn.activeTooltip.showOn,
            appearFrom = fn.activeTooltip.appearFrom,
            space = {
                left: prop.trigger.left - prop.window.scrollLeft,
                right: prop.window.width + prop.window.scrollLeft - (prop.trigger.left + prop.trigger.width),
                top: prop.trigger.top - prop.window.scrollTop,
                bottom: prop.window.height + prop.window.scrollTop - (prop.trigger.top + prop.trigger.height)
            };
        // Determine which side the tooltip will appear (left / right), can be forced through settings
        if ($.inArray(showOn, ["left", "right"]) < 0) {
            if (space.left > space.right) {
                showOn = "left";
            }
            else {
                showOn = "right";
            }
        }

        switch (showOn) {
            case "left":
                newPos.left = prop.trigger.left - prop.tooltip.width - fn.activeTooltip.distance / 2;
                if (newPos.left < prop.window.scrollLeft){
                    // this will shrink the tooltip and keep it on the screen if it goes past the left edge
                    newPos.maxWidth = space.left - fn.activeTooltip.distance / 2;
                    newPos.left = prop.window.scrollLeft;
                }
                break;
            case "right":
                fn.$tooltip.addClass('toLeft'); // this is where the arrow is positioned
                newPos.left = prop.trigger.left + prop.trigger.width + fn.activeTooltip.distance / 2;
                if (newPos.left + prop.tooltip.width > space.right){
                    // this will shrink the tooltip and keep it on the screen if it goes past the right edge
                    newPos.maxWidth = space.right - fn.activeTooltip.distance / 2;
                }
                break;
        }
        if (newPos.maxWidth){
            //maxWidth was set so we need to reset the tooltip height property
            fn.$tooltip.css({
                maxWidth: newPos.maxWidth + 'px'
            });
            prop.tooltip.height = fn.$tooltip.outerHeight();
        }

        // Determine which side the tooltip will appear (top / bottom), can be forced through settings
        if ($.inArray(appearFrom, ["top", "bottom"]) < 0) {
            if (space.top > space.bottom) {
                appearFrom = "top";
            }
            else {
                appearFrom = "bottom";
            }
        }

        switch (appearFrom) {
            case "bottom":
                newPos.top = prop.trigger.top;
                break;
            case "top":
                fn.$tooltip.addClass('alignBottom'); // this is the arrow position
                newPos.top = (prop.trigger.top + prop.trigger.height/2) - prop.tooltip.height + prop.tooltip.paddingTop + 15 + 11;// 15 is from the position of the arrow pseudo element, 11 is from half the height of the arrow
                if (newPos.top < prop.window.scrollTop){
                    // reset top if tooltip goes off the top of the screen
                    newPos.top = prop.window.scrollTop;
                }
                break;
        }

        for (var key in newPos){
            if (newPos.hasOwnProperty(key) && !isNaN(parseFloat(newPos[key]))){
                newPos[key] = (newPos[key] < 0 ? 0 : newPos[key]) + 'px';
            }
        }

        return newPos;
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
        $currentTrigger = null;
    }

}(jQuery, NAME));
