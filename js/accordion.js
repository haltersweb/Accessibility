/**
 * @author Adina Halter
 * Accessible Tab Navigation
 */
(function ($, NAME) {
    'use strict';



    $('.accordion-trigger').on('click', function (evt) {
        var $trigger = $(this),
            $triggerParent = $trigger.parent(),
            $expandingContainer = $triggerParent.next('.accordion');
        evt.preventDefault(); //focus stays on trigger
        $triggerParent.toggleClass('expanded');
        if ($triggerParent.hasClass('expanded') === true) {
            NAME.access.ariaExpand($trigger, $expandingContainer);
        } else {
            NAME.access.ariaContract($trigger, $expandingContainer);
        }
    });











}(jQuery, NAME));
