/*
CHROME SPEECH SYNTHESIZER (TO EMULATE THE VOICE OUT)
*/
var SPEECH_SYNTH = SPEECH_SYNTH || {};
(function () {
    SPEECH_SYNTH.textToSpeech = function (string) {
        var msg = new SpeechSynthesisUtterance(string);
        window.speechSynthesis.speak(msg);
    };
    SPEECH_SYNTH.cancelSpeech = function () {
        window.speechSynthesis.cancel();
    };
}());