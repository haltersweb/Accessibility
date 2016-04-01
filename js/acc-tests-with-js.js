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
    function populateResultsContainer($html) {
        $accResults.html($html);
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
            if ($headings.eq(i).closest($accTester).length === 0) {
                // don't capture anything within #accTester
                $headingsList.append('<li>' + $headings.get(i).tagName + ': ' + $headings.eq(i).text() + '</li>');
            }
        }
        populateResultsContainer($headingsList);
    };
    ACCTESTS.getElemsWithClickEvents = function () {
        var el = document.getElementsByTagName('*'),
            $clickList = $('<table id="clickList"><thead><tr><th>Element</th><th>ID</th><th>Class</th><th>Text</th></tr></thead><tbody></tbody><table>'),
            jqClickEvents,
            listMarkup = "";
        for (i = 0; i < el.length; i += 1) {
            // don't capture anything within #accTester
            if ($(el[i]).closest($accTester).length === 0) {
                jqClickEvents = $._data(el[i], "events");
                if ((typeof el[i].onclick === 'function') || jqClickEvents) {
                    listMarkup = '<tr><td style="text-transform: uppercase;">' + el[i].tagName + '</td><td>' + el[i].id + '</td><td>' + el[i].className + '</td><td>' + el[i].textContent + '</td></tr>';
                    $clickList.find("tbody").append(listMarkup);
                }
            }
        }
        populateResultsContainer($clickList);
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
        $('#actionableElems .acc-test').on('click', function () {
            ACCTESTS.getElemsWithClickEvents();
            showResultsWindow();
        });
        $('#actionableElems .acc-reset').on('click', function () {
            hideResultsWindow();
        });
    }
    bindTests();
}(jQuery, ACCTESTS));




