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
        storeDpadEvent = null,
        ariaRolesFromNodeName = {
            'BUTTON': 'button',
            'A': 'link',
            'TD': 'cell',
            'TABLE': 'table',
            'DIV': '',
            'INPUT': 'input'
            // TO DO: ADD SUBTILTY FOR CHECKBOX AND RADIO USING 'INPUT'S TYPE
        },
        stringView = document.getElementById('stringView'),
        focusables = document.querySelectorAll('a, button, [tabindex], input');
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
//TO DO: HIDE CERTAIN CONTENT FROM SCREEN READER
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
        var gridTitle = '';
        if (storeDpadEvent === null || storeDpadEvent === keyboard.up || storeDpadEvent === keyboard.down) {
            gridTitle = getGridTitle(map);
        }
        var string = gridTitle + map.title.trim() + '. ' + announcedRole;
        return string;
    }
    /*
    sendStringToTextWindow() & sendStringToSynth() to be removed later
    */
    function sendStringToTextWindow(string, target) {
        target.textContent = string;
    }
    function sendStringToSynth(string) {
        SPEECH_SYNTH.cancelSpeech();
        SPEECH_SYNTH.textToSpeech(string);
    }
    function getTtsUrl(string) {
        //var ttsUrl = 'http://vrextts.g.comcast.net/tts?text=' + string;
        var ttsUrl = 'http://ccr.voice-guidance-tts.xcr.comcast.net/tts?text=' + string;
        return ttsUrl;
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
    function getAndAnnounceText(evt, elem) {
        var map = {};
        var string = '';
        elem = elem || this;
        map = buildMap(elem);
        string = genString(map);
        string = tidySpaces(string);
        sendStringToTextWindow(string, stringView);
        //sendStringToSynth(string);
        //
        //playMp3(string);
    }
    function captureDpadEvents (evt) {
        if (
            evt.keyCode === keyboard.right ||
            evt.keyCode === keyboard.left ||
            evt.keyCode === keyboard.up ||
            evt.keyCode === keyboard.down ||
            evt.keyCode === keyboard.enter
        ) {
            storeDpadEvent = evt.keyCode;
        }
    }
    function eventBindings() {
        for (var i = 0; i < focusables.length; i += 1) {
            focusables[i].addEventListener('focus', getAndAnnounceText, false);
        }
        document.addEventListener('keydown', captureDpadEvents, false);
    }
    eventBindings();


    context = new AudioContext();
    source = null;
    function playMp3(string) {
        bufferLoader = new BufferLoader(
            context,
            [
                //'tts.mp3'
                //'http://ccr.voice-guidance-tts.xcr.comcast.net/tts?text=Test'
                //'http://vrextts.g.comcast.net/tts?text=this%20is%20a%20simple%20call'
                'http://odol-atsec-pan-36.voice-guidance-tts.xcr.comcast.net/tts?text=Test'
                //'http://odol-atsec-pan-36.voice-guidance-tts.xcr.comcast.net/tts?text=' + string
            ],
            finishedLoading
        );
        bufferLoader.load();
    }
    function finishedLoading(bufferList) {
        console.log('LOAD COMPLETE');
        source = context.createBufferSource();
        source.buffer = bufferList[0];
        source.connect(context.destination);
        source.start();
    }
    document.getElementById('useToTest').addEventListener('click', function () {
        //window.location=getTtsUrl('this is a text to speech test.');
        playMp3();
    });
    getAndAnnounceText(null, document.activeElement); /* to announce the focused element on load */
}());
