/*global
    jQuery, window
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
    ACCTESTS.increaseFontSize200 = function () {
        var htmlElem = document.getElementsByTagName('html')[0],
            htmlFontSize,
            htmlFontSizeNum,
            htmlFontSizeUnit,
            accTester = document.getElementById('accTester');
        htmlFontSize = window.getComputedStyle(htmlElem, null).getPropertyValue('font-size');
        htmlElem.setAttribute("data-font-size", htmlFontSize);
        htmlFontSizeNum = htmlFontSize.match(/[0-9\.]*/);
        htmlFontSizeUnit = htmlFontSize.replace(htmlFontSizeNum, "");
        htmlFontSizeNum = parseFloat(htmlFontSizeNum) * 2;
        htmlElem.style.fontSize = (htmlFontSizeNum.toString()) + htmlFontSizeUnit;
        // reset font size for #accTester
        accTester.style.fontSize = htmlFontSize;
    };
    ACCTESTS.decreaseFontSize100 = function () {
        var htmlElem = document.getElementsByTagName('html')[0],
            htmlFontSize;
        if (!htmlElem.getAttribute("data-font-size")) {
            console.log("data-font-size doesn't exist");
            return false;
        }
        htmlFontSize = htmlElem.getAttribute("data-font-size");
        htmlElem.style.fontSize = htmlFontSize;
        htmlElem.removeAttribute("data-font-size");
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
        $('#fontSize .acc-test').on('click', function () {
            ACCTESTS.increaseFontSize200();
        });
        $('#fontSize .acc-reset').on('click', function () {
            ACCTESTS.decreaseFontSize100();
        });
    }
    function loadCss() {
        var myCss = document.createElement('link');
        myCss.rel = "stylesheet";
        myCss.type = 'text/css';
        myCss.id = "accTesterCss";
        myCss.href = 'file:///Users/ahalte200/Box%20Sync/Mac%20Desktop/Git_Repositories/Accessibility/css/acc-tests-with-js.css';
        document.getElementsByTagName('head')[0].appendChild(myCss);
    }
    function initialize() {
        loadCss();
        bindTests();
    }
    initialize();
}(jQuery, ACCTESTS));
