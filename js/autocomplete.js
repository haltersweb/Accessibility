/*global
    jQuery, NAME, window
*/
/**
 * Accessibility Helpers
 */
(function ($, NAME) {
    'use strict';
    var //$widget = $('[data-widget="a11y-autocomplete"]'),
        $input = $('#search'),
        inputVal = "",
        //$clear = $('#clear'),
        $results = $('#results'),
        results = [],
        //$submit = $('#submit'),
        $live = $('[aria-live]'),
        key = NAME.keyboard,
        //shiftKeyDown = false,
        //interval,
        directions = "Keyboard users, use up and down arrows to review and enter to select.  Touch device users, explore by touch or with swipe gestures.",
        liMarkup = '<li tabindex="-1" role="option" class="autocomplete-item">',
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
    function markSelected($selectionToMark) {
        var activeItemId = 'selectedOption';
        $selectionToMark.attr('aria-selected', 'true').attr('id', activeItemId);
        $input.attr('aria-activedescendant', activeItemId);
    }
    function clearSelected() {
        $input.attr('aria-activedescendant', '');
        $results.find('[aria-selected="true"]').attr('aria-selected', 'false').attr('id', '');
    }
    function closeResults() {
        clearSelected();
        $results.hide();
    }
    function arrowCycling(kc) {
        var $thisActiveItem = $results.find('[aria-selected="true"]'),
            $nextMenuItem;
        // don't do anything if no results
        if (!results.length) {
            return;
        }
        if (kc === key.down) {
            // find the next list item to be arrowed to
            $nextMenuItem = ($thisActiveItem.length !== 0)
                ? $thisActiveItem.next('li')
                : $results.children().eq(0); //first item in list
        }
        if (kc === key.up) {
            // find the previous list to be arrowed to
            $nextMenuItem = ($thisActiveItem.length !== 0)
                ? $thisActiveItem.prev('li')
                : $results.children().eq(-1); //last item in list
        }
        clearSelected();
        if (($results).is(':focus') && ($nextMenuItem.length === 0)) {
            if (kc === key.down) {
                $nextMenuItem = $results.children(":first-child");
            }
            if (kc === key.up) {
                $nextMenuItem = $results.children(":last-child");
            }
        }
        markSelected($nextMenuItem);
    }

    function populating() {
        var selectedText = $results.find('[aria-selected="true"]').text();
        if (selectedText === "") {
            selectedText = inputVal;
        }
        $input.val(selectedText);
// _TODO: keep results open when $input value is changed by arrowing
    }
    function arrowing(e) {
        var kc = e.keyCode;
        if (kc === key.up || kc === key.down) {
            e.preventDefault();
            arrowCycling(kc);
            populating();
        }
    }
// _TODO on focus get value of input field
    function eventListeners() {
/*
        // track on shift press
        $(window).on('keydown', function (e) {
            if (e.keyCode === 16) {
                shiftKeyDown = true;
            }
        });
        // reset on shift release
        $(window).on('keyup', function (e) {
            if (e.keyCode === 16) {
                shiftKeyDown = false;
            }
        });
*/

        $input.on('keyup', function (e) {
            var kc = e.keyCode;
            if (kc === key.up || kc === key.down || kc === key.tab || kc === key.enter) {
                return;
            }
            autocomplete();
        });
        $input.on('keydown', function (e) {
            var kc = e.keyCode;
            if (kc === key.tab) {
                clearSelected();
                return;
            }
            arrowing(e);
        });
        $results.on('focus', function () {
            clearSelected();
            markSelected($(this).children(":first-child"));
        });
        $results.on('keydown', function (e) {
            var kc = e.keyCode;
            if (kc === key.tab) {
                closeResults();
                return;
            }
            arrowing(e);
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