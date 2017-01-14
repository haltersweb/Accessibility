/**
 * @author Adina Halter
 * Accessible Date Picker
 */

/*global
    NAME, jQuery
*/
(function ($, NAME) {
    'use strict';
    var $datePicker = $('#datePicker'),
        $launchDatePicker = $('#launchDatePicker'),
        $closeDatePicker = $('#closeDatePicker'),
        $dateInput = $('#date'),
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    function getTheDate() {
        // d is either the date in the input field or today's date
        let d = ($dateInput.val() !== '')
                ? new Date($dateInput.val())
                : new Date(),
            day = {
                day: d.getDay(), //weekday as a number (0-6)
                date: d.getDate(), //day as a number (1-31)
                month: d.getMonth(), //month as a number (0-11)
                year: d.getFullYear() //four digit year (yyyy)
            };
        //console.log(day);
        return day;
    }
    function setTheDate() {

    }
    function leapYear(year) {
        return ((year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0)));
    }
    function daysInMonth({month, year} = {}) {
        //console.log(month);
        //console.log(year);
        switch (month) {
        case (1):
            return (leapYear(year)) ? 29 : 28;
        case (3):
        case (5):
        case (8):
        case (10):
            return 30;
        default:
            return 31;
        }
    }
    function createCalendar() {
        let $monthYear = $datePicker.find('#monthYear'),
            $datePickerGrid = $datePicker.find('tbody'),
            dayIndex = 0,
            date = getTheDate(),
            firstDayOfMonth = new Date((date.month + 1) + '/1/' + date.year).getDay();
        const DAYS_IN_MONTH = daysInMonth(date),
            DAYS_IN_WEEK = 7,
            NUM_ROWS = 6;
        // create days grid
        for (let i = 0; i < NUM_ROWS; i += 1) {
            let tr = document.createElement('tr'),
                fragment = document.createDocumentFragment(),
                tdHtml = '';
            for (let j = 0; j < DAYS_IN_WEEK; j += 1) {
                let emptyCell = true;
                if ((dayIndex !== 0) || (j >= firstDayOfMonth)) {
                    dayIndex += 1;
                }
                emptyCell = (dayIndex === 0 || dayIndex > DAYS_IN_MONTH);
                //tdHtml += '<td tabindex="0" role="button" aria-label="' + days[date.day] + ' ' + date.date + ' ' + months[date.month] + ' ' + date.year + '" data-day="' + (emptyCell ? 0 : dayIndex) + '" aria-hidden="' + emptyCell + '">' + (emptyCell ? '' : dayIndex) + '</td>';
                tdHtml += '<td tabindex="0" role="button" aria-label="' + (emptyCell ? '' : (days[j] + ', ' + dayIndex + ' ' + months[date.month] + ', ' + date.year)) + '" data-day="' + (emptyCell ? 0 : dayIndex) + '" aria-hidden="' + emptyCell + '">' + (emptyCell ? '' : dayIndex) + '</td>';
            }
            tr.innerHTML = tdHtml;
            fragment.append(tr);
            $datePickerGrid.append(fragment);
        }
        // populate month and year
        $monthYear.text(months[date.month] + ' ' + date.year);
    }
    function clearCalendar() {
        let $datePickerGrid = $datePicker.find('tbody');
        $datePickerGrid.empty();
    }
    // opening calendar announces hint with aria-live
    // esc triggers close button
    // date focus announces date with aria-live
    // on close (or maybe on selection) date populates in input field
    // focus on current date
    // arrow keys change day focus
    // arrow keys may need to generate previous or next calendar
    // shift arrow keys change month/year by triggering <- -> <= =>
    $launchDatePicker.on('click', function () {
        $(this).attr('aria-expanded', 'true');
        clearCalendar();
        createCalendar();
        $datePicker.show();
    });
    $closeDatePicker.on('click', function () {
        $(this).attr('aria-expanded', 'false');
        $datePicker.hide();
        clearCalendar();
    });
//TO DO: WRITE WITH VANILLA JS
}(jQuery, NAME));
