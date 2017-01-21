/*global
    jQuery, NAME
*/
/**
 * Accessibility Helpers
 */
(function ($) {
    'use strict';
    NAME.keyboard = {
        back: 8, // delete key on mac
        tab: 9,
        enter: 13,
        shift: 16, // shiftKey = true
        ctrl: 17, // ctrlKey = true
        alt: 18, // (a.k.a. option on Mac) altKey = true
        esc: 27,
        space: 32,
        pageUp: 33, // fn + up on mac
        pageDown: 34, // fn + down on mac
        end: 35, // fn + right on mac
        home: 36, // fn + left on mac
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        del: 46, // fn + delete on mac
        command: 91 // metaKey = true (mac and sun machines)
    };
    /*
    a string of selectors identifying focusable elements.
    */
    NAME.focusables = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    /*
    namespacing general helpers
    */
    NAME.general = {};
    NAME.general.senseClickOutside = function ($evtTarget, $container) {
        if (($evtTarget).closest($container).length === 0) {
            // click target is outside
            return true;
        }
    };
// _TODO THIS NEEDS TO BE CLEANED UP.  WHAT IS arguments FOR?
    NAME.general.debounce = function (func, delay, immediate) {
        console.log('test');
        var timeout, result;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, delay);
            if (callNow) {
                result = func.apply(context, args);
            }
            return result;
        };
    };
    /*
    namespacing accessibility helpers
    */
    NAME.access = {};
    /*
    hides content within blocked area from screen-readers
    when an element is given focus within a blocked area the focus will move to a target element
    */
    NAME.access.blockFocus = function ($blockedContainers, $focusOnThisInstead) {
        $blockedContainers.attr('aria-hidden', 'true');
        $blockedContainers.on('focusin.blockingFocus', function () {
            if ($blockedContainers.attr('aria-hidden') === 'true') {
                $focusOnThisInstead.focus();
                return false;
            }
        });
    };
    /*
    removes focus blocking that was set with NAME.access.blockFocus method
    */
    NAME.access.removeBlockFocus = function ($blockedContainers) {
        $blockedContainers.off('focusin.blockingFocus');
        $blockedContainers.removeAttr('aria-hidden');
    };
    /*
    aria tagging while expanding content
    */
    NAME.access.ariaExpand = function ($expander, $expandingContainer) {
        $expander.attr("aria-expanded", "true");
        $expandingContainer.attr("aria-hidden", "false");
    };

    /*
    aria tagging while contracting content
    */
    NAME.access.ariaContract = function ($expander, $expandingContainer) {
        $expander.attr("aria-expanded", "false");
        $expandingContainer.attr("aria-hidden", "true");
    };

    /*
    hide visible content with aria
    use when you have a content that must still be visible i.e. carousel panels
    */
    NAME.access.ariaHideContent = function ($hideContainers) {
        // find all focusable elements
        // IMPORTANT: assumes no tabindex > -1 elems
        var $focusableHiddenElems = $hideContainers.find('a, button, input, select, textaria');
        // hide the container with aria
        $hideContainers.attr('aria-hidden', 'true');
        // remove focusability from focusable elements
        $focusableHiddenElems.attr('tabindex', "-1")
            // and add data attribute that flags the focusable elements for reset with ariaShowContent()
            .attr('data-focusable-hidden-elem', 'true');
    };

    /*
    reset the content hidden with ariaHideContent() to its original accessibility state
    */
    NAME.access.ariaShowContent = function ($blockedContainers) {
        var $focusableHiddenElems = $blockedContainers.find('[data-focusable-hidden-elem]');
        $blockedContainers.removeAttr('aria-hidden');
        $focusableHiddenElems.removeAttr('tabindex')
            .removeAttr('data-focusable-hidden-elem');
    };

    /*
    tag trigger ($OPTIONALtrigger can be used to override default trigger capture)
    NOTE: It's preferrable to pass $OPTIONALtrigger because Safari does not focus during click event.
    */
    NAME.access.tagTrigger = function ($OPTIONALtrigger) {
        var $trigger;
        if ($OPTIONALtrigger) {
            $trigger = $OPTIONALtrigger;
        } else {
            $trigger = $(document.activeElement);
        }
        $trigger.attr('data-trigger', 'true');
    };

    /*
    focuses on trigger and removes trigger tag ($OPTIONALtrigger can be used to override default trigger capture)
    */
    NAME.access.focusTrigger = function ($OPTIONALtrigger) {
        var $trigger;
        if ($OPTIONALtrigger) {
            $trigger = $OPTIONALtrigger;
        } else {
            $trigger = $('[data-trigger="true"]');
        }
        $trigger.focus().removeAttr('data-trigger');
    };

    /*
    injects hidden announcement to be read by screen-readers
    $ariaContainer is an existing, empty element with either aria-hidden="polite" or role="alert"
    */
    NAME.access.announcements = function ($ariaContainer, textToRead) {
        $ariaContainer.text(textToRead);
        setTimeout(function () {
            $ariaContainer.text('');
        }, 1000);
    };

    /*
    reads on-screen text without changing focus
    $hasTextToBeRead is either a single or array of jQuery selector(s) with the text to be read
    */
    NAME.access.duplicateTextForReading = function ($ariaContainer, $hasTextToBeRead) {
        var textToBeRead = "";
        $.each($hasTextToBeRead, function () {
            textToBeRead += $(this).text();
            textToBeRead += ' ';
        });
        NAME.access.announcements($ariaContainer, textToBeRead);
    };
}(jQuery));
