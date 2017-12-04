/*global
    window, console, SPEECH_SYNTH
*/
/* @author Adina Halter
*/

/*
SCREEN READER CODE
*/

;(function () {
    'use script';
    const keyboard = {
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'enter': 13,
            'back': 8
        },
        stringView = document.getElementById('stringView'), /* FOR TESTING ONLY: TO BE REMOVED */
        focusables = document.querySelectorAll('a, button, [tabindex], input, textarea, select'),
        x1Hints = {
            rlArrow: "Use right and left arrows to review.",
            udArrow: "Use up and down arrows for more options.",
            ok: "Press OK to select."
        };
    function deleteAriaHidden(elem) {
        const hiddenElements = elem.querySelectorAll('[aria-hidden="true"]');
        for (let i = 0; i < hiddenElements.length; i += 1) {
            hiddenElements[i].remove();
        }
    }
    function deleteCssHiddenElems(elem) {
        const elemsToCheck = elem.getElementsByTagName('*');
        for (let i = 0; i < elemsToCheck.length; i += 1) {
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
        const newLines = new RegExp(/\r?\n|\r/g), /* finds \n, \r, and \r\n */
            extraSpaces = new RegExp(/  +/g); /* finds more than one consecutive space */
            spaceDot = new RegExp(/ +\./g);
            multiDot = new RegExp(/\.\.+/g);
        string = string.replace(newLines, ' '); /* change a new line to a space */
        string = string.replace(extraSpaces, ' '); /* change space clusters to a single space */
        string = string.replace(spaceDot, '.');
        string = string.replace(multiDot, '.');
        return string;
    }
    function getRole(elem) {
        let role = null;
        const ariaRolesFromNodeName = {
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
            let role = null;
            /* FIGURE OUT IF COMBO OR LISTBOX */
            return role;
        }
        function whichInputRole(elem) {
            let role = null;
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
    function getLabel(elem) {
        const id = elem.id;
        let label = document.querySelector('[for="' + id + '"]'),
            title = '';
        if (!label) {
            const parent = elem.parentNode;
            label = (parent.nodeName === 'LABEL') ? parent : label;
        }
        if (label) {
            title = label.textContent;
            return title;
        }
        return null;
    }
    function getValue(elem, role) {
        let value = '';
        if (role !== 'textbox') {
            return null;
        }
        value = elem.value;
        value = (value === '') ? null : (value + ' selected.');
        return value;
    }
    function getAriaLabel(elem) {
        const ariaLabel = elem.getAttribute('aria-label');
        if (ariaLabel) {
            return ariaLabel;
        }
        return null;
    }
    function getAriaLabelledby(elem) {
        const ariaLabelledbyId = elem.getAttribute('aria-labelledby');
        if (ariaLabelledbyId) {
            return document.getElementById(ariaLabelledbyId).textContent;
        }
    }
    function getTitle(elem, role) {
        const target = elem;
        let title = '';
        title = getAriaLabelledby(elem);
        if (title) { return title; }
        title = getAriaLabel(elem);
        if (title) { return title; }
        if (role === 'textbox' ||
            role === 'radio' ||
            role === 'checkbox') {
            title = getLabel(elem);
            return title;
        }
        if (target.textContent) { // will only be true if elem is block or inline element
            title = target.textContent;
            return title;
        }
        return null;
    }
    function getDescriptions(elem) {
        const idListString = elem.getAttribute('aria-describedby'),
            descrArray = [];
        let idArray = [];
        if (!idListString) {
            return null;
        }
        idArray = idListString.split(' ');
        for (let i = 0; i < idArray.length; i += 1) {
            let text = document.getElementById(idArray[i]).textContent;
            descrArray.push(text);
        }
        return descrArray;
    }
    function getStates(elem, role) {
        let states = '';
        if (role !== 'textbox' &&
            role !== 'radio' &&
            role !== 'checkbox') {
            return null;
        }
        // checked vs unchecked
        if (role === 'radio' || role === 'checkbox') {
            if (elem.checked || elem.getAttribute('aria-required') === 'true') {
                states += 'Checked. ';
            } else {
                states += 'Unchecked. ';
            }
        }
        //required
        if (elem.required || elem.getAttribute('aria-required') === 'true') {
            states += 'Required. ';
        }
        // invalid
        if (elem.getAttribute('aria-invalid') === 'true') {
            states += 'Invalid. ';
        }
        states = (states === '') ? null : states;
        return states;
    }
    function changeState() {
        // TO DO: when a state change happens on a checkbox or radio announce the state change.
    }
    function getPageName() {
        //h1 first, then <title> text if h1 doesn't exist
        let titleElem = document.querySelector('h1'),
            pageName = null;
        // if there is a read flag then title shouldn't be read
        if (document.querySelector('[data-page-title-read]')) {
            return null;
        }
        if (!titleElem) {
            titleElem = document.querySelector('title');
        }
        pageName = (titleElem) ? titleElem.textContent : null;
        titleElem.dataset.pageTitleRead = 'true';
        return pageName;
    }
//TO DO: <h1> content change listener. If content changes remove data-page-title-read flag from h1 elem (for SPAs)

    function getSectionName(elem, role) {
        const readSection = document.querySelector('[data-section-title-read]');
        let name = '';
        if (role !== 'radio' &&
            role !== 'checkbox' &&
            role !== 'textbox' &&
            role !== 'gridcell' &&
            role !== 'cell') {
            return null;
        }
        function removeReadFlag(readSection) {
            if (readSection) {
                delete readSection.dataset.sectionTitleRead;
            }
        }
        // for form fields
        function getLegend(elem) {
            let target = elem;
            //crawl upwards through DOM (limit BODY) looking for: a) role = group || role = radiogroup || elem = fieldset
            while (
                target.nodeName !== 'FIELDSET' &&
                target.getAttribute('role') !== 'group' &&
                target.getAttribute('role') !== 'radiogroup' &&
                target.nodeName !== 'BODY') {
                target = target.parentElement;
            }
            //if nodeName === 'BODY' return null;
            if (target.nodeName === 'BODY') {
                removeReadFlag();
                target.dataset.sectionTitleRead = 'true';
                return null;
            }
            if (target === readSection) {
                return null;
            } else {
                removeReadFlag(readSection);
                target.dataset.sectionTitleRead = 'true';
            }
            if (target.nodeName === 'FIELDSET') {
                const legend = target.firstElementChild;
                if (legend.nodeName !== 'LEGEND') {
                    return null;
                }
                return legend.textContent;
            } else {
                let ariaName = '';
                ariaName = getAriaLabelledby(target);
                if (ariaName) { return ariaName; }
                ariaName = getAriaLabel(target);
                if (ariaName) { return ariaName; }
            }
        }
        // for table and grid cells
        function getCaption() {

            return null;
        }
        if (role === 'radio' || role === 'checkbox' || role === "textbox") {
            name = getLegend(elem);
        }
        if (role === 'gridcell' || role === 'cell') {
            name = getCaption();
        }
        return name;
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
        if (target) {
            target.textContent = string;
        }
    }
    function sendStringToSynth(string) {
        if (SPEECH_SYNTH) {
            SPEECH_SYNTH.cancelSpeech();
            SPEECH_SYNTH.textToSpeech(string);
        }
    }
    function sendStringToX1() {
        // wait on Aru to finish
    }
    function constructAnnouncement(elem) {
        const role = getRole(elem);
        let spokenRole = '',
            text = [],
            voText = '';
        spokenRole = (role === 'cell' || role === 'gridcell') ? null : role;
        text = [
            getPageName(),
            getSectionName(elem, role),
            getTitle(elem, role),
            spokenRole,
            getStates(elem, role),
            getDescriptions(elem),
            getValue(elem, role),
            getHints()
        ];
        //build text from textArray and add ". " between indexes
        for (let i = 0; i <= text.length; i += 1) {
            if (text[i]) {
                voText = voText + text[i] + '. ';
            }
        }
        voText = tidySpaces(voText);
        return voText;
    }
    function announceText(evt, elem) {
        let voText = '';
        elem = elem || this;
        voText = constructAnnouncement(elem);
        sendStringToTextWindow(voText, stringView);
        sendStringToSynth(voText);
    }
    function eventBindings() {
        for (let i = 0; i < focusables.length; i += 1) {
            focusables[i].addEventListener('focus', announceText, false);
        }
    }
    function numPadAnnounce() {
        document.addEventListener('keydown', function (evt) {
            let voText = '';
            const kc = evt.keyCode,
                num = {
                    'one': 49,
                    'two': 50,
                    'three': 51,
                    'four': 52,
                    'five': 53,
                    'six': 54,
                    'seven': 55,
                    'eight': 56,
                    'nine': 57,
                    'zero': 48
                };
            if (kc === num.one ||
                kc === num.two ||
                kc === num.three ||
                kc === num.four ||
                kc === num.five ||
                kc === num.six ||
                kc === num.seven ||
                kc === num.eight ||
                kc === num.nine ||
                kc === num.zero) {
                switch (kc) {
                case num.one:
                    voText = 'one';
                    break;
                case num.two:
                    voText = 'two';
                    break;
                case num.three:
                    voText = 'three';
                    break;
                case num.four:
                    voText = 'four';
                    break;
                case num.five:
                    voText = 'five';
                    break;
                case num.six:
                    voText = 'six';
                    break;
                case num.seven:
                    voText = 'seven';
                    break;
                case num.eight:
                    voText = 'eight';
                    break;
                case num.nine:
                    voText = 'nine';
                    break;
                case num.zero:
                    voText = 'zero';
                    break;
                }
                sendStringToTextWindow(voText, stringView);
                sendStringToSynth(voText);
            }
        });
    }
    function pageLoadConfig() {
        /* announce the focused element on load */
        announceText(null, document.activeElement);
    }
    function config() {
        numPadAnnounce();
        eventBindings();
        pageLoadConfig();
    }
    //window.setTimeout(config, 5000);
    config();
}());
