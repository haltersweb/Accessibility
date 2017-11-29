/*global
    window, console, SPEECH_SYNTH
*/
/* @author Adina Halter
*/

/*
SCREEN READER CODE
*/

(function () {
    'use script';
    var keyboard = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            enter: 13,
            back: 8
        },
        stringView = document.getElementById('stringView'), /* FOR TESTING ONLY: TO BE REMOVED */
        focusables = document.querySelectorAll('a, button, [tabindex], input, textarea, select');
    function resetStringArray() {
        return [];
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
    function getRole(elem) {
        var role = null,
        ariaRolesFromNodeName = {
            'BUTTON': 'button',
            'A': 'link',
            'TD': 'cell',
            'TABLE': 'table',
            'DIV': null,
            'INPUT': 'input',
            /* 'SELECT': comboOrList(elem), TO DO: listbox or combobox */
            'TEXTAREA': 'textbox' /* TO DO: need to set aria-multiline = 'true' */
        };
        function comboOrList(elem) {
            var role = null;
            /* FIGURE OUT IF COMBO OR LISTBOX */
            return role;
        }
        function whichInputRole(elem) {
            var role = null;
            switch (elem.type) {
            case 'text':
                role = 'textbox';
                break;
            case 'radio':
                role = 'radio';
                break;
            case 'checkbox':
                role = 'checkbox';
                break;
            }
            return role;
        }
        role = elem.getAttribute('role');
        role = (role) ? role : ariaRolesFromNodeName[elem.nodeName];
        role = (role === 'input') ? whichInputRole(elem) : role;
        return role;
    }
    function getTitle(elem, role) {
        var ariaLabelledbyId = elem.getAttribute('aria-labelledby'),
            ariaLabel = elem.getAttribute('aria-label'),
            title = '',
            target = elem;
        function getLabel(elem) {
            var id = elem.id,
                label = document.querySelector('[for="' + id + '"]'),
                title = '';
            //label = (label) ? label : elem.parentNode('label');
            if (!label) {
                var parent = elem.parentNode;
                label = (parent.nodeName === 'LABEL') ? parent : label;
            }
            if (label) {
                title = label.textContent;
                return tidySpaces(title);
            }
            return null;
        }
        if (ariaLabelledbyId) {
            title = document.getElementById(ariaLabelledbyId).textContent;
            return tidySpaces(title);
        }
        if (ariaLabel) {
            title = ariaLabel;
            return title;
        }
        // TO DO: reassign target to label if input.  First by "for", otherwise by interior text.
        if (role === 'textbox' ||
            role === 'radio' ||
            role === 'checkbox') {
            title = getLabel(elem);
            return title;
        }
        if (target.textContent) { // will only be true if elem is block or inline element
            title = target.textContent;
            return tidySpaces(title);
        }
        return null;
    }
    function getDescriptions(elem) {
        var idListString = elem.getAttribute('aria-describedby'),
            idArray = [],
            descrArray = [];
        if (!idListString) {
            return null;
        }
        idArray = idListString.split(' ');
        for (var i = 0; i < idArray.length; i += 1) {
            var text = document.getElementById(idArray[i]).textContent;
            text = tidySpaces(text);
            descrArray.push(text);
        }
        return descrArray;
    }
    function getStates(elem, role) {
        var states = '',
        state = {
            checked: null,
            required: null,
            invalid: null
        };
        if (role !== 'textbox' &
            role !== 'radio' &
            role !== 'checkbox') {
            return null;
        }
        // checked vs unchecked
        if (role === 'radio' || role === 'checkbox') {
            if (elem.checked || elem.getAttribute('aria-required') === 'true') {
                //state.checked = 'true';
                states += 'Checked. ';
            } else {
                //state.checked = 'false';
                states += 'Unchecked. ';
            }
        }
        //required
        if (elem.required || elem.getAttribute('aria-required') === 'true') {
            //state.required = 'true';
            states += 'Required. '
        }
        // invalid
        if (elem.getAttribute('aria-invalid') === 'true') {
            //state.invalid = 'true';
            states += 'Invalid. '
        }
        states = (states === '') ? null : states;
        return states;
    }
    function changeState() {
        // TO DO: when a state change happens on a checkbox or radio announce the state change.
    }
    function getSectionName(elem, role) {
        // caption or legend or...
        function getCaption() {

        }
        function getLegend() {

        }
    }
    function getPageName() {
        //<title>, or h1
    }
    function getHints() {
        // maybe an object of hints to choose from
    }

/* PROTOTYPES */
function ElemText(role, title, descrArray) {
    this.role = role;
    this.title = title;
    this.descrArray = descrArray;
}



    /*
    FOR TESTING: sendStringToTextWindow() & sendStringToSynth() to be removed later
    */
    function sendStringToTextWindow(string, target) {
        target.textContent = string;
    }
    function sendStringToSynth(string) {
        SPEECH_SYNTH.cancelSpeech();
        SPEECH_SYNTH.textToSpeech(string);
    }
    function constructAnnouncement(elem) {
        var role = getRole(elem),
            spokenRole = '',
            text = [],
            voText = '';
        spokenRole = (role === 'cell' || role === 'gridcell') ? null : role;
        text = [
            getTitle(elem, role),
            spokenRole,
            getPageName(),
            getSectionName(elem, role),
            getStates(elem, role),
            getDescriptions(elem),
            getHints()
        ];
        //build text from textArray and add ". " between indexes
        for (var i = 0; i <= text.length; i += 1) {
            if (text[i]) {
                voText = voText + text[i] + '. ';
            }
        }
        voText = tidySpaces(voText);
        return voText;
    }
    function announceText(evt, elem) {
        var voText = '';
        elem = elem || this;
        voText = constructAnnouncement(elem);
        sendStringToTextWindow(voText, stringView);
        sendStringToSynth(voText);
    }
    function eventBindings() {
        for (var i = 0; i < focusables.length; i += 1) {
            focusables[i].addEventListener('focus', announceText, false);
        }
    }
    eventBindings();
    /* announce the focused element on load */
    announceText(null, document.activeElement);
}());
