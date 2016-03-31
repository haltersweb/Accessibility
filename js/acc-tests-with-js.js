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
        $accTester = $('#accTester'),
        $accResultsWindow = $('#accResultsWindow'),
        $accResults = $('#accResults'),
        styleSheets = document.styleSheets,
        $pageImages = $('img'),
        $pageSvgs = $('svg');
    function resizeImages() {
        $('head').append('<style id="resizeImgCss">.acctests-resize-img { width: 50px; height: 50px }</style>');
        $pageImages.addClass('acctests-resize-img');
        $pageSvgs.attr('class', ($pageSvgs.attr('class') + " acctests-resize-img"));
    }
    ACCTESTS.turnOffCss = function () {
        for (i = 0; i < styleSheets.length; i += 1) {
            if (styleSheets.item(i).ownerNode.id !== "accTesterCss") {
                styleSheets.item(i).disabled = true;
            }

        }
        resizeImages();
    };
    ACCTESTS.turnOnCss = function () {
        for (i = 0; i < styleSheets.length; i += 1) {
            styleSheets.item(i).disabled = false;
        }
        $('#resizeImgCss').remove();
    };
    ACCTESTS.getListOfHeadings = function () {
        var $headings = $('h1, h2, h3, h4, h5, h6'),
            $headingsList = $('<ul id="headingsList">');
        for (i = 0; i < $headings.length; i += 1) {
            if ($headings.eq(i).closest('#accTester').length === 0) {
                $headingsList.append('<li>' + $headings.get(i).tagName + ': ' + $headings.eq(i).text() + '</li>');
            }
        }
        $accResults.html($headingsList);
    };
    function showResultsWindow() {
        $accResultsWindow.show();
    }
    function hideResultsWindow() {
        $accResultsWindow.hide();
    }
    function bindTests() {
        $('#readingOrder .acc-test').on('click', function () {
            ACCTESTS.turnOffCss();
        });
        $('#readingOrder .acc-reset').on('click', function () {
            ACCTESTS.turnOnCss();
        });
        $('#headingOrder .acc-test').on('click', function () {
            ACCTESTS.getListOfHeadings();
            showResultsWindow();
        });
        $('#headingOrder .acc-reset').on('click', function () {
            hideResultsWindow();
        });
    }
    bindTests();
}(jQuery, ACCTESTS));




