/**
 * @author Adina Halter
 * Accessible Tab Navigation
 */

/*global
    alert, NAME, $, jQuery
*/
(function ($, NAME) {
    'use strict';
    var codeContainers = $('[data-code]');
    codeContainers.each(function () {
        var id = $(this).attr('data-code'),
            html = $("#" + id).html(),
            noTabs = html.match(/[^<]*/)[0].replace(/\n/, "").length,
            re = new RegExp("\n\t{" + noTabs + "}|^\t{" + noTabs + "}", "g");
        html = html.replace(/</g, '&lt;');
        html = html.replace(/>/g, '&gt;');
        html = html.replace(re, '\n');
        $(this).html('<pre><code>' + html + '</code></pre>');
    });
}(jQuery, NAME));
