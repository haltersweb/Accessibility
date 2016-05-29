/*global
    jQuery, NAME
*/
/**
 * Accessibility Helpers
 */
(function ($, NAME) {
    'use strict';
    var $widget = $('[data-widget="a11y-autocomplete"]'),
        $input = $('#search'),
        inputVal = "",
        //$clear = $('#clear'),
        $results = $('#results'),
        results = [],
        //$submit = $('#submit'),
        $live = $('[aria-live]'),
        key = NAME.keyboard,
        //interval,
        directions = "Keyboard users, use up and down arrows to review and enter to select.  Touch device users, explore by touch or with swipe gestures.",
        liMarkup = '<li tabindex="-1" role="button" class="autocomplete-item">',
        fakeResults = [
            [
                'apple',
                'avocado',
                'banana',
                'cucumber',
                'eggplant',
                'kiwi'
            ],
            [
                'banana',
                'cucumber',
                'eggplant'
            ],
            [
                'cucumber'
            ]
        ];
    // THE ARRAY WOULD REALLY COME IN VIA AJAX
    function fakeAjaxResults() {
        // no matter what character was typed...
        if ($input.val().length === 0 || $input.val().length > 3) {
            return [];
        }
        if ($input.val().length === 1) {
            return fakeResults[0];
        }
        if ($input.val().length === 2) {
            return fakeResults[1];
        }
        if ($input.val().length === 3) {
            return fakeResults[2];
        }
    }
    function buildListHtml(results) {
        var resultsMarkup = "", i = 0;
        for (i = 0; i < results.length; i += 1) {
            resultsMarkup += liMarkup + results[i] + "</li>";
        }
        $results.html(resultsMarkup);
        $results.show();
    }
    function announceResults() {
        var number = results.length,
            textToRead = number + " results are available. " + directions;
        // if results length === 0 then say "no search results"
        if (results.length === 0) {
            textToRead = "No search results";
        }
// _TODO add small time delay between results and directions.
        NAME.access.announcements($live, textToRead);
    }
    function autocomplete() {
        // if input value didn't change, return
        if ($input.val() === inputVal) {
            return;
        }
        // save new input value
        inputVal = $input.val();
        // get and save autocomplete results
        results = fakeAjaxResults();
        // build list HTML
        buildListHtml(results);
        // aria-live results
        announceResults();
    }
    function arrowing(kc) {
        var $thisActiveItem = $(document.activeElement),
            $nextMenuItem;
        // don't do anything if no results
        if (!results.length) {
            return;
        }
        // don't do anything if active item isn't the input field or a result
        if (!($thisActiveItem.is('li') || $thisActiveItem.is('[type="text"]'))) {
            return;
        }
        if (kc === key.down) {
            // find the next list item to be arrowed to
            $nextMenuItem = ($thisActiveItem.is('li'))
                ? $thisActiveItem.next('li')
                : $results.children().eq(0); //first item in list
        }
        if (kc === key.up) {
            // find the previous list to be arrowed to
            $nextMenuItem = ($thisActiveItem.is('li'))
                ? $thisActiveItem.prev('li')
                : $results.children().eq(-1); //last item in list
        }
        // if arrow moves us out of the list then the next item is the input field
        if ($nextMenuItem.length === 0) {
            $nextMenuItem = $input;
        }
        $nextMenuItem.focus();
    }
// _TODO on focus get value of input field
    function eventListeners() {
        $widget.on('keydown', function (e) {
            var kc = e.keyCode;
            if (kc === key.up || kc === key.down) {
                e.preventDefault();
                arrowing(kc);
            }
        });
        $input.on('keyup', function () {
            autocomplete();
        });
    }
    function init() {
        eventListeners();
    }
    init();
// _TODO create own aria-live container as part of input
    // focus reads aria-describedby (or maybe aria-live: polite) instructions
    // feature detect if mobile.  Change help text based on mobile or dt.
    // flag input to not to give hint again
    // input of letter (not keystroke what about virtual keyboard or mobile text):
        // opens autocomplete
        // reveal clear results button
        // gives number of results (from length) and hint (1 sec) on what to do (based on feature detect)
    // additional text inputs only announces number of results
    // closing autocomplete list clears aria-selected=true and aria-live
    // IF focus is in input field:
        // up/down arrow:
            // cycles through suggestions and input field
            // focus remains on input field
            // populates text in input field
            // adds aria-selected=true
        // ESC closes autocomplete and restores text to latest text typed
    // If ul has focus:
        // up/down arrow:
            // only travels up and down list items (doesn't cycle)
            // each input field gets focus
            // input field does not change
        // ESC closes autocomplete, focus goes back to input field
    // If autocomplete container (w/input, list, button) gets blur close autocomplete and hides clear button
    // ENTER (and arrow) populates li that either has focus or has aria-selected=true
}(jQuery, NAME));