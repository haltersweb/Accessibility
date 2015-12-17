(function ($) {
    'use strict';
    /*

    */
    NAME.colorTableContent = function ($tableId, text, color, boldBoolean) {
    	var $cells = $tableId.find('td'),
    		fontWeight = boldBoolean ? "bold" : "normal";
    	$cells.each(function (i) {
    		if ($(this).text() === text) {
    			$(this).css({
    				"color" : color,
    				"font-weight" : fontWeight
    			})
    		}
    	})
    };
}(jQuery));
