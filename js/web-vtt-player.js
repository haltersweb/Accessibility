/*global
    jQuery, NAME, console
*/
/**
 * WebVTT player
 */
(function ($, NAME, console) {
    'use strict';
    var videoElement = document.querySelector('video');
    var textTracks = videoElement.textTracks;
    var textTrack = textTracks[0];
    var $ariaContainer = $('[aria-live="polite"]');
    textTrack.oncuechange = function () {
        //"this" is a textTrack
        if (this.activeCues[0]) {
            console.log(this.activeCues[0].text);
            NAME.access.announcements($ariaContainer, this.activeCues[0].text);
        }
    };
}(jQuery, NAME, console));
