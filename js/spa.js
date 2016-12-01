/**
 * @author Adina Halter
 * Single Page Application
 */

/*global
    alert, NAME, $, jQuery
*/
(function ($, NAME) {
    'use strict';
    var step = 0,
        $stepContainer = $('#stepContainer'),
        $stepControls = $('.step-control'),
        $stepLinks = $('.step-link'),
        $next = $('#next'),
        $prev = $('#previous'),
        $h1 = $('h1'),
        content = $('#stepContent'),
        spaScreens = [
            {
                title: 'SPA Introduction',
                h1: 'Single-page Application Introduction',
                //content: '<label for="name">Name</label><input id="name" type="text" />'
                content: '<p>When creating an accessible single-page application (SPA) several things must happen when new content is loaded and focus must be managed correctly.</p><p>Continue through this single-page application to learn more.</p>'
            },
            {
                title: 'When New Content Loads',
                h1: 'What Must Happen When New Content is Loaded',
                //content: '<label for="flavor">Favorite Flavor</label><select name="flavor" id="flavor"><option value="chocolate">chocolate</option><option value="vanilla">vanilla</option><option value="strawberry">strawberry</option></select>'
                content: '<ul class="bullet singletons"><li>the document title must change</li><li>a screen-reader announcement must be made stating that there was a content change</li><li>focus must move to the container holding the new content in order to prompt the screen-reader to read the new content.</li></ul>'
            },
            {
                title: 'Container Focus',
                h1: 'Focusing on a Container Div',
                //content: '<label for="pets">Do you have a pet?</label><select name="pet" id="pet"><option value="yes">yes</option><option value="no">no</option></select>'
                content: '<p>Be sure that the container div which holds the updated content has:</p><ul class="bullet singletons"><li>tabindex="-1"</li><li>focus style turned off</li></ul><p>Also, it is best to delay the focus for two reasons:</p><ul class="bullet singletons"><li>The delay allows the screen-reader buffer to load the new content into the buffer</li><li>The delay gives the announcement enough time to read before moving onto reading the new content.</li></ul>'
            },
            {
                title: 'Known Issues',
                h1: 'Known Screen-reader Issues',
                //content: '<label for="petName">Pet Name</label><input id="petName" type="text" />'
                content: '<p>NVDA has a bug wherein a container\'s contents aren\'t read if the control that triggers the focus is a descendant of the container receiving focus. A bug has been filed but the chance of fixing this is small.  Therefore the announcement is all the more important to allow someone using a screen-reader to know to arrow through new content.</p><p>Voice Over on iOS does not handle in-page linked content at all.  It will skip reading the content when focus is moved to the container.  A bug has been filed.</p>'
            }
        ];
    function enableStepControls() {
        $stepControls.removeAttr('hidden');
        if (step === 0) {
            $prev.attr('hidden', 'hidden');
        }
        if (step === (spaScreens.length - 1)) {
            $next.attr('hidden', 'hidden');
        }
    }
    function enableStepLinks() {
        var i = $stepLinks.length - 1,
            $link;
        $('[data-href]').each(function () {
            var $this = $(this);
            $this.attr('href', $this.attr('data-href')).removeAttr('data-href').removeClass('not-active');
        });
        while (i > step) {
            $link = $stepLinks.eq(i);
            $link.attr('data-href', $link.attr('href')).removeAttr('href').addClass('not-active');
            i -= 1;
        }
    }
    function announceChange() {
        NAME.access.announcements($('[aria-live]'), "new page content has been loaded");
    }
    function populateScreen() {
        var screen;
        screen = spaScreens[step];
        document.title = screen.title;
        $h1.text(screen.h1);
        content.html(screen.content);
        enableStepControls();
        enableStepLinks();
    }
    function prevNext(prev) {
        prev = prev || false;
        if (prev === true) {
            step -= 1;
        } else {
            step += 1;
        }
        populateScreen();
    }
    function setFocus() {
        announceChange();
        //use a timeout function to allow for rebuffering before focusing on new content
        setTimeout(function () {
            $stepContainer.focus();
        }, 2000); // setting timeout to 2 seconds to give aria-live enough time to announce.
    }
    function bindControls() {
        $next.on('click', function () {
            prevNext();
            setFocus();
        });
        $prev.on('click', function () {
            prevNext(true);
            setFocus();
        });
        $stepLinks.on('click', function (evt) {
            //don't allow the in-page link to resolve.  Using link html for semantics only.
            evt.preventDefault();
            step = parseInt($(this).attr('data-step-link')) - 1;
            populateScreen();
            setFocus();
        });
        $('.go-to-container').on('click', function () {
            $stepContainer.focus();
        });
    }
    bindControls();
    populateScreen();
}(jQuery, NAME));
