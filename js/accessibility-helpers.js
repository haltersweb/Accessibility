/**
 * Accessibility Helpers
 */
(function ($) {
    'use strict';
    NAME.keyboard = {
        ctrl:   17,
        tab:     9,
        enter:  13,
        esc:    27,
        space:  32,
        left:   37,
        up:     38,
        right:  39,
        down:   40,
        back:    8,
        del:    46
    };
    /*
    a string of selectors identifying focusable elements.
    */
    NAME.focusables = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    /*
    General helpers namespacing
    */
    NAME.general = {};
    NAME.general.senseClickOutside = function ($evtTarget, $container) {
        if (($evtTarget).closest($container).length === 0) {
            return true;
        }
    };
    NAME.general.debounce = function (func, delay, immediate) {
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
    Accessibility namespacing
    */
    NAME.access = {};
    /*
    will not let you focus on anything within a blocked area
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
    removes focus blocking that was set with NAME.blockFocus method
    */
    NAME.access.removeBlockFocus = function ($blockedContainers) {
        $blockedContainers.off('focusin.blockingFocus');
        $blockedContainers.removeAttr('aria-hidden');
    };
    /*
    aria tagging while expanding content
    */
    NAME.access.ariaExpand = function ($expandingContainer) {
        $expandingContainer.attr({
            "aria-hidden" : "false",
            "aria-expanded" : "true"
        });
    };

    /*
    aria tagging while contracting content
    */
    NAME.access.ariaContract = function ($expandingContainer) {
        $expandingContainer.attr({
            "aria-hidden" : "true",
            "aria-expanded" : "false"
        });
    };

    /*
    tag trigger ($OPTIONALtrigger can be used to override default trigger capture)
    NOTE:  preferrable to pass $OPTIONALtrigger because Safari does not focus during click event.
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
    focuses on trigger and removes trigger tag
    */
    NAME.access.focusTrigger = function () {
        var $trigger = $('[data-trigger="true"]');
        $trigger.focus().removeAttr('data-trigger');
    };

    /*
    injects hidden announcement to be read by screen-readers
    $ariaContainer is an existing, accessibly-hidden empty element with either aria-hidden="polite" or role="alert"
    */
    NAME.access.announcements = function ($ariaContainer, textToRead) {
        $ariaContainer.text(textToRead);
        setTimeout(function () {
            $ariaContainer.text('');
        }, 1000);
    }

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
