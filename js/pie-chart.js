/*global
    console
*//**
 * @author Adina Halter
 * Accessible Drop Menu and Menu Drawer
 */
(function (console) {
    'use strict';
    /* FOR TESTING
    var wedges = document.getElementsByClassName('wedge');
    Array.prototype.forEach.call(wedges, function(wedge) {
        wedge.addEventListener('click', function() {
            this.classList.toggle('toggle');
        });
    });
     */
    /* CODE FOR TABLE PIE PATTERN */
    var pieTable = document.querySelector('[data-widget="pie chart"]'),
        pieTableCells = pieTable.querySelectorAll('.wedge');
    function getDataVals() {
        var vals = [];
        Array.prototype.forEach.call(pieTableCells, function(cell) {
            vals.push(parseInt(cell.textContent.trim(), 10));
        });
        return vals;
    }
    /* CODE TO BUILD THE PIE CHART CSS BASED ON THE TABLE DATA */
    function buildStyles() {
        var cssElem = document.createElement('style'),
            pieStyles,
            angle,
            elemDeg = 0,
            elemAfterDeg = 0,
            angleTally = 0,
            dataVals = getDataVals(),
            totalDataVals = dataVals.reduce(function(sum, value) {
                return sum + value;
            }, 0);

        console.time('test');
        /* create style sheet */
        document.head.appendChild(cssElem);
        pieStyles = cssElem.sheet;
        /* loop through table cells and, based on the wedge angle */
        for (var i = 0; i < pieTableCells.length; i += 1) {
            angle = Math.round(dataVals[i] / totalDataVals * 360);
            /* rounding sometimes causes an off-by-one issue.  Therefore, check the last angle and tweak as necessary so sum of angles is 360 */
            if (i + 1 === pieTableCells.length && angleTally + angle !== 360) {
                angle = 360 - angleTally;
            }
            /* 1) mark elements as acute, obtuse, or super */
            /* 2) find the angles in degrees for the element rotation and its ::after rotation */
            switch (true) {
            case angle < 90:
                pieTableCells[i].classList.add('acute');
                elemDeg = 90 + angleTally; /* transform: rotate(90deg + sum of prior wedge angles); */
                elemAfterDeg = angle - 90; /* transform: rotate(wedge angle - 90deg); */
                break;
            case angle < 180:
                pieTableCells[i].classList.add('obtuse');
                elemDeg = angleTally; /* transform: rotate(sum of prior wedge angles); */
                elemAfterDeg = angle - 90; /* transform: rotate(wedge angle - 90deg); */
                break;
            default:
                pieTableCells[i].classList.add('super');
                elemDeg = angleTally; /* transform: rotate(sum of prior wedge angles); */
                elemAfterDeg = angle - 180; /* transform: rotate(wedge angle - 180deg); */
                break;
            }
            /* append the styles to the new stylesheet */
            pieStyles.insertRule('.pie-it .wedge:nth-child(' + (i + 1) + ') { transform: rotate(' + elemDeg + 'deg); }', pieStyles.cssRules.length);
            pieStyles.insertRule('.pie-it .wedge:nth-child(' + (i + 1) + ')::after { transform: rotate(' + elemAfterDeg + 'deg); }', pieStyles.cssRules.length);
            /* add to the angle tally */
            angleTally += angle;
        }
        /* APPLY STYLES */
        togglePie();
    }
    function togglePie() {
        /* assigns the class to the table to apply the .pie-it css */
        pieTable.classList.toggle('pie-it');
    }
    buildStyles();
    document.getElementById('togglePie').addEventListener('click', function() {
        togglePie();
    });
    console.timeEnd('test');
}(console));



