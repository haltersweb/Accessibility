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
        return day;
    }
    function setTheDate() {

    }
    function leapYear(year) {
        return ((year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0)));
    }
    function daysInMonth({month, year} = {}) {
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
        let $monthAndYear = $datePicker.find('#monthAndYear'),
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
                tdHtml += '<td tabindex="0" role="button" '
                        + 'class="' + ((dayIndex === date.date) ? 'selected' : '') + '" '
                        + 'aria-label="' + (emptyCell ? '' : (days[j] + ', ' + dayIndex + ' ' + months[date.month] + ', ' + date.year))
                        + '" data-date="' + (emptyCell ? 0 : dayIndex)
                        + '" data-month="' + (emptyCell ? 0 : date.month)
                        + '" data-year="' + (emptyCell ? 0 : date.year)
                        + '" aria-hidden="' + emptyCell + '">'
                        + (emptyCell ? '' : dayIndex)
                        + '</td>';
            }
            tr.innerHTML = tdHtml;
            fragment.append(tr);
            $datePickerGrid.append(fragment);
        }
        // populate month and year
        $monthAndYear.text(months[date.month] + ' ' + date.year);
    }
    function clearCalendar() {
        let $datePickerGrid = $datePicker.find('tbody');
        $datePickerGrid.empty();
    }
    function focusOnSelectedDate() {
        document.querySelectorAll('.selected[data-date]')[0].focus();
    }
    // opening calendar announces hint with aria-live
    // arrow keys change day focus
    // arrow keys may need to generate previous or next calendar
    // shift arrow keys change month/year by triggering <- -> <= =>
    // tabbing away closes the widget
    // when closes via esc focus goes back to trigger
    // when closes via date select focus goes to date input field
    function bindEvents() {
        $launchDatePicker.on('click', function () {
            $(this).attr('aria-expanded', 'true');
            clearCalendar();
            createCalendar();
            $datePicker.show();
            focusOnSelectedDate();
        });
        $closeDatePicker.on('click', function () {
            $(this).attr('aria-expanded', 'false');
            $datePicker.hide();
            clearCalendar();
        });
        $('#datePicker').on('keydown', function (evt) {
            if (evt.keyCode === NAME.keyboard.esc) {
                $closeDatePicker.click();
            }
        });
        $('#datePicker').on('click', '[data-date]', function () {
            let $this = $(this),
                dateQueryString = ($this.attr('data-month') + 1) + '/' + $this.attr('data-date') + '/' + $this.attr('data-year');
            $dateInput.val(dateQueryString);
            $closeDatePicker.click();
        });
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (evt.keyCode === NAME.keyboard.space || evt.keyCode === NAME.keyboard.enter) {
                $(this).click();
            }
        });
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            let $this = $(this),
                date = $this.attr('data-date'),
                month = $this.attr('data-month'),
                year = $this.attr('data-year'),
                daysInMonth = daysInMonth({month, year}),
                addend,
                targetDate;
            switch (evt.keyCode) {
            case (NAME.keyboard.left):
                addend = -1;
                break;
            case (NAME.keyboard.right):
                addend = 1;
                break;
            case (NAME.keyboard.up):
                addend = -7;
                break;
            case (NAME.keyboard.down):
                addend = 7;
                break;
            default:
                return false;
            }
            targetDate = date + addend;
            if (targetDate <= 0) {
                targetDate = daysInMonth - targetDate;
                month = month - 1;
                if (month < 0) {
                    month = 11;
                    year = year - 1;
                }
            }
            if (targetDate > daysInMonth) {
                targetDate = targetDate - daysInMonth;
                month = month + 1;
                if (month === 12) {
                    month = 0;
                    year = year + 1;
                }
            }

        });
    }
    bindEvents();
//TO DO: WRITE WITH VANILLA JS
}(jQuery, NAME));
