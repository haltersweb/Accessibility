/*global
    jQuery
*/
/* @author Adina Halter
 * Run Accessibility Tests in JS
 */
// ACCTESTS Namespacing
var ACCTESTS = {};
(function ($, ACCTESTS) {
    'use strict';
    var i,
        styleSheets = document.styleSheets;
    ACCTESTS.turnOffCss = function () {
        for (i = 0; i < styleSheets.length; i += 1) {
            styleSheets.item(i).disabled = true;
        }
    };
    ACCTESTS.turnOnCss = function () {
        for (i = 0; i < styleSheets.length; i += 1) {
            styleSheets.item(i).disabled = false;
        }
    };
    ACCTESTS.getListOfHeadings = function () {
        var $headings = $('h1, h2, h3, h4, h5, h6'),
            $headingsList = $('<ul id="headingsList">');
        for (i = 0; i < $headings.length; i += 1) {
            $headingsList.append('<li>' + $headings.get(i).tagName + ': ' + $headings.eq(i).text() + '</li>');
        }
        $('body').prepend($headingsList);
    };
}(jQuery, ACCTESTS));




