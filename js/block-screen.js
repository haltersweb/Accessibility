/**
 * @author Adina Halter
 * Dim Screen
 */
(function($) {
	'use strict';
	/*
	dim screen and block interaction with content under the dim screen
	*/
	NAME.dimScreen = function ($blockingScreen, $blockedContainers, $defaultFocus) {
		/*
		show screen dimmer
		*/
		$blockingScreen.show();
		/*
		make sure nothing is tabbable within blocked area
		*/
		NAME.access.blockFocus($blockedContainers, $defaultFocus);
	};
	/*
	hide screen dimmer and restore content to an unblocked state
	*/
	NAME.unDimScreen = function ($blockingScreen, $blockedContainers) {
		/*
		hide screen dimmer
		*/
		$blockingScreen.hide();
		/*
		re-allow tabbability within previously de-tabbed elements
		*/
		NAME.access.removeFocusBlock($blockedContainers);
	};
}(jQuery));