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
    ACCTESTS.formOrphans = function () {
        var $formFields = $('input, select, textarea'),
            formId = "",
            $formLabels = $('label'),
            $formLabel,
            $orphanFields,
            $orphanLabels,
            $multiLabels,
            $orphanLists = $('<div id="orphanLists">'),
            $orphanFieldsList = $('<ul id="orphanFieldsList">'),
            $orphanLabelsList = $('<ul id="orphanLabelsList">'),
            $multiLabelsList = $('<ul id="multiLabelsList">');
        // match each form id with label
        $formFields.each(function () {
            formId = $(this).attr('id');
            $formLabel = $('label[for="' + formId + '"]');
            if ($formLabel.length === 1) {
                $(this).attr("data-orphan", "no");
                $formLabel.attr("data-orphan", "no");
                return true;
            }
            if ($formLabel.length > 1) {
                $(this).attr("data-orphan", "no");
                $formLabel.attr("data-orphan", "multi");
                return true;
            }
            $(this).attr("data-orphan", "yes");
        });
        $formLabels.not('[data-orphan]').attr("data-orphan", "yes");
        // list all orphan form fields
        $orphanFields = $('[data-orphan="yes"]').filter('input, select, textarea');
        for (i = 0; i < $orphanFields.length; i += 1) {
            $orphanFieldsList.append('<li>' + $orphanFields.get(i).tagName + ':' + $orphanFields.get(i).type + '#' + $orphanFields.get(i).id + '</li>');
        }
        // list all orphan labels
        $orphanLabels = $('label[data-orphan="yes"]');
        for (i = 0; i < $orphanLabels.length; i += 1) {
            $orphanLabelsList.append('<li>' + $orphanLabels.get(i).tagName + ': ' + $orphanLabels.eq(i).text() + '</li>');
        }
        // list all multiple labels
        $multiLabels = $('label[data-orphan="multi"]');
        for (i = 0; i < $multiLabels.length; i += 1) {
            $multiLabelsList.append('<li>' + $multiLabels.get(i).tagName + ': ' + $multiLabels.eq(i).text() + '</li>');
        }
        // append lists
        $orphanLists.append($('<h4>Orphan Fields</h4>'), $orphanFieldsList, $('<h4>Orphan Labels</h4>'), $orphanLabelsList, $('<h4>Duplicate Labels</h4>'), $multiLabelsList);
        populateResultsContainer($orphanLists);
    };
    ACCTESTS.clearOrphanFlag = function () {
        $('[data-orphan]').removeAttr('data-orphan');
    };
    ACCTESTS.fieldSets = function () {
        var $checkAndRadios = $(':checkbox, :radio').filter('[name]'),
            names = {},
            name = "",
            $fieldset,
            $legend;
        $checkAndRadios.each(function () {
            name = $(this).attr('name');
            if (!names[name]) {
                names[name] = 1;
                return true;
            }
            names[name] = names[name] + 1;
        });
        $.each(names, function (key, val) {
            if (val > 1) {
                $fieldset = $(':checkbox, :radio').filter('[name="' + key + '"]').eq(0).closest('fieldset');
                if ($fieldset.length !== 1) {
                    //missing fieldset
                    console.log('missing FIELDSET for [name="' + key + '"]');
                    return true;
                }
                $legend = $fieldset.children('legend:first-child');
                if ($legend.length !== 1) {
                    //missing legend
                    console.log('missing LEGEND for [name="' + key + '"]');
                    return true;
                }
            }
        });
    };
    function visualTag() {
        // use :before or maybe background color to tag offenders
    }
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
        $('#formOrphans .acc-test').on('click', function () {
            ACCTESTS.formOrphans();
            showResultsWindow();
        });
        $('#formOrphans .acc-reset').on('click', function () {
            ACCTESTS.clearOrphanFlag();
            hideResultsWindow();
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
