/**
 * @author Adina Halter
 * Accessible Drag and Drop
 */
/*global
    NAME
*/
(function (NAME) {
    'use strict';
    NAME.drag = {};
    NAME.drag.simpleDrag = function (elem) {
        var grabHandle = (elem.hasAttribute('aria-grabbed')) ? elem : elem.querySelector('[aria-grabbed]');
        function dragStart(event) {
            var style = window.getComputedStyle(event.target, null);
            grabHandle.setAttribute('aria-grabbed', 'true');
            event.dataTransfer.setData('text/plain',
            (parseInt(style.getPropertyValue('left'), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue('top'), 10) - event.clientY));
        }
        function dragOver(event) {
            event.preventDefault();
            return false;
        }
        function drop(event) {
            var offset = event.dataTransfer.getData('text/plain').split(',');
            elem.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
            elem.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
            grabHandle.setAttribute('aria-grabbed', 'false');
            event.preventDefault();
            return false;
        }
        function grab(event) {
            if (event.keyCode === NAME.keyboard.space) {
                grabHandle.setAttribute('aria-grabbed', 'true');
                //debugger;
                //TO DO: BIND ARROW EVENTS TEMPORARILY
                return true;
            }
        }
        function release(event) {
            if (event.type === 'blur' || event.keyCode === NAME.keyboard.enter) {
                grabHandle.setAttribute('aria-grabbed', 'false');
                // TO DO: REMOVE ARROW EVENTS
                return true;
            }
        }
        function keyMove(event) {
            var multiplier = 1,
                bcr = elem.getBoundingClientRect();
            //debugger;
            if (grabHandle.getAttribute('aria-grabbed') === 'false') {
                return true;
            }
            //console.log('KEY');
            if (event.shiftKey) {
                multiplier *= 10;
            }
            if (event.keyCode === NAME.keyboard.left || event.keyCode === NAME.keyboard.up) {
                multiplier *= -1;
            }
            if (event.keyCode === NAME.keyboard.right || event.keyCode === NAME.keyboard.left) {
                elem.style.left = bcr.left + (10 * multiplier) + 'px';
            }
            if (event.keyCode === NAME.keyboard.up || event.keyCode === NAME.keyboard.down) {
                elem.style.top = bcr.top + (10 * multiplier) + 'px';

            }
        }
        grabHandle.addEventListener('keydown', grab, false);
        grabHandle.addEventListener('keydown', keyMove, false);
        grabHandle.addEventListener('keydown', release, false);
        grabHandle.addEventListener('blur', release, false);
        elem.addEventListener('dragstart', dragStart, false);
        document.body.addEventListener('dragover', dragOver, false);
        document.body.addEventListener('drop', drop, false);
    };
}(NAME));