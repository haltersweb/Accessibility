/*global
    window, console
*/
/* @author Adina Halter
*/
(function () {
    'use script';
    var keyboard = {
            enter: 13,
            left: 37,
            up: 38,
            right: 39,
            down: 40
        },
        ariaRolesFromNodeName = {
            'BUTTON': 'button',
            'A': 'link',
            'TD': 'cell',
            'TABLE': 'table',
            'DIV': ''
            // ADD ROLE FOR CHECKBOX AND RADIO USING 'INPUT'S TYPE
        },
        focusables = document.querySelectorAll('a, button, [tabindex="0"]'),
        stringView = document.getElementById('stringView');
    function getRole(elem) {
        var role = null;
        role = elem.getAttribute('role');
        if (!role) {
            role = ariaRolesFromNodeName[elem.nodeName];
        }
        if (!role) {
            role = '';
        }
        return role;
    }
    function getTitle(elem, role) {
        var ariaLabelledbyId = elem.getAttribute('aria-labelledby'),
            ariaLabel = elem.getAttribute('aria-label'),
            title;
        if (ariaLabelledbyId) {
            title = document.getElementById(ariaLabelledbyId).textContent;
            return tidySpaces(title);
        }
        if (ariaLabel) {
            title = ariaLabel;
            return title;
        }
        if (role === 'table' && elem.getElementsByTagName('caption').length === 1) {
            title = elem.getElementsByTagName('caption')[0].textContent;
            return tidySpaces(title);
        }
//TO DO: IF ELEM IS RADIO OR CHECKBOX AND HAS FIELDSET (label will be a composite of legend title and elem title)
        if (elem.textContent) { // will only be true if elem is block or inline element
//IMPORTANT!!
//FIRST COPY THE INNERHTML TO A TEMP CONTAINER
//THEN REMOVE ALL "HIDDEN" TEXT ELEMENTS
//FINALLY RETURN THE TEXT CONTENT FROM THE TEMP CONTAINER
            title = elem.textContent;
            return tidySpaces(title);
        }
        return '';
    }
    function getDescription(elem) {
        //TO DO: ADD DESCRIPTION WITH ARIA-DESCRIBEDBY
    }
    function buildMap(elem) {
        var map = {};
        map.elem = elem;
        map.role = getRole(elem);
        map.title = getTitle(elem, map.role);
        return map;
    }
    function genString(map) {
        var announcedRole = (map.role === 'cell' || map.role === 'gridcell') ? '' : map.role + '.';
        var gridTitle = getGridTitle(map);
        var string = gridTitle + map.title.trim() + '. ' + announcedRole;
        return string;
    }
    function sendString(string, target) {
        target.textContent = string;
    }
    function findThisSection(elem) {
        while (
            !elem.dataset.section
            &&
            elem.nodeName !== 'BODY'
        ) {
            elem = elem.parentElement;
        }
        if (elem.dataset.section) {
            return elem;
        }
        return null;
    }
    function getGridTitle(map) {
        var cell,
            row,
            grid,
            title;
        if (map.elem.previousElementSibling) {
            return '';
        }
        if (
            map.role === 'cell' ||
            map.role === 'gridcell'
        ) {
            cell = map.elem;
            row = cell.parentElement;
            grid = row.parentElement;
            while (
                grid.nodeName !== 'TABLE'
                &&
                grid.getAttribute('role') !== 'grid'
                &&
                grid.getAttribute('role') !== 'table'
                &&
                grid.nodeName !== 'BODY'
            ) {
                grid = grid.parentElement;
            }
            if (grid.nodeName !== 'BODY') {
                title = getTitle(grid, getRole(grid));
                title = (title !== '') ? (title + '. ') : title;
                return title;
            }
        }
        return '';
    }
    function deleteAriaHidden(elem) {
        var hiddenElements = elem.querySelectorAll('[aria-hidden="true"]');
        for (var i = 0; i < hiddenElements.length; i += 1) {
            hiddenElements[i].remove();
        }
    }
    function deleteCssHiddenElems(elem) {
        var elemsToCheck = elem.getElementsByTagName('*');
        for (var i = 0; i < elemsToCheck.length; i += 1) {
            if (
                window.getComputedStyle(elemsToCheck[i])['display'] === 'none'
                ||
                window.getComputedStyle(elemsToCheck[i])['visibility'] === 'hidden'
            ) {
                elemsToCheck[i].remove();
            }
        }
    }
    function tidySpaces(string) {
        var newLines = new RegExp(/\r?\n|\r/g), /* finds \n, \r, and \r\n */
            extraSpaces = new RegExp(/  +/g); /* finds more than one consecutive space */
        string = string.replace(newLines, ' '); /* change a new line to a space */
        string = string.replace(extraSpaces, ' '); /* change space clusters to a single space */
        return string;
    }
    for (var i = 0; i < focusables.length; i += 1) {
        focusables[i].addEventListener('focus', function () {
            document.querySelector('.focus').classList.toggle('focus');
            this.classList.toggle('focus');
            var map = {};
            var string;
            map = buildMap(this);
            string = genString(map);
            string = tidySpaces(string);
            sendString(string, stringView);
        });
        focusables[i].addEventListener('keydown', function (evt) {
            if (
                evt.keyCode === keyboard.right ||
                evt.keyCode === keyboard.left ||
                evt.keyCode === keyboard.up ||
                evt.keyCode === keyboard.down
            ) {
                var thisSection = findThisSection(this),
                    newSection = null;
                switch (evt.keyCode) {
                case (keyboard.left):
                    if (this.previousElementSibling) {
                        this.previousElementSibling.focus();
                    }
                    break;
                case (keyboard.right):
                    if (this.nextElementSibling) {
                        this.nextElementSibling.focus();
                    }
                    break;
                case (keyboard.up):
                    newSection = document.querySelector('[data-section="' + (parseInt(thisSection.dataset.section) - 1) + '"]');
                    if (newSection) {
                        newSection.querySelector('button, [tabindex="0"]').focus();
                    }
                    break;
                case (keyboard.down):
                    newSection = document.querySelector('[data-section="' + (parseInt(thisSection.dataset.section) + 1) + '"]');
                    if (newSection) {
                        newSection.querySelector('button, [tabindex="0"]').focus();
                    }
                    break;
                default:
                    return false;
                }
            }
        });
        document.querySelector('.focus').focus();
    }
}());