/*global
    jQuery, NAME
*/
/**
 * Accessibility Helpers
 */
(function ($, NAME) {
    'use strict';
    var $container = $('#autocomplete'),
        $input = $('#search'),
        inputVal = "",
        $clear = $('#clear'),
        $results = $('#results'),
        results = [],
        $submit = $('#submit'),
        $live = $('[aria-live]'),
        interval,
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
    	var resultsMarkup = "";
    	for (var i = 0; i < results.length; i += 1) {
    		resultsMarkup += liMarkup + results[i] + "</li>";
    	}
    	$results.html(resultsMarkup);
    	$results.show();
    }
    function announceResults() {
    	var number = results.length,
    		textToRead = number + " results are available. " + directions;
//TO DO: add small time delay between results and directions.
    	NAME.access.announcements($live, textToRead);
    }
    function processAutocomplete($thisInput) {
    	var thisResult = [];
		// if input value didn't change, return
		if ($thisInput.val() === inputVal) {
			return false;
		}
		// save new input value and get autocomplete results
		inputVal = $thisInput.val();
		thisResult = fakeAjaxResults();

		// if autocomplete results didn't change, return
		/*
		if (JSON.stringify(thisResult) === JSON.stringify(results)) {
			return false;
		}
		*/
		// save autocomplete results and build list HTML
		results = thisResult;
		buildListHtml(results);
		// if list length === 0 then close results and don't say anything
		if (results.length === 0) {
			var announcement = ($input.val().length === 0) ? "" : "No search results";

			$results.hide();
			NAME.access.announcements($live, announcement);
			return;
		}
		announceResults();
    }
// TO DO: on focus get value of input field
// TO DO: need a debounce?
    function eventListeners() {
    	$input.on('keyup', function (e) {
// TO DO: return on return, tab, arrows
			processAutocomplete($(this));



    	});
    }
    function init() {
    	eventListeners();
    }
    init();
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