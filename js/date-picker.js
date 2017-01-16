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
    function getTheDate(dateQueryString = '') {
        let d, date;
        // d is a Date object of the dateQueryString if passed.
        // if no dateQueryString is passed then the Date object is created from:
        // a) either the input field value or b) today's date
        if (dateQueryString) {
            d = new Date(dateQueryString);
        } else {
            d = ($dateInput.val())
                ? new Date($dateInput.val())
                : new Date();
        }
        date = {
            day: d.getDay(), //weekday as a number (0-6)
            date: d.getDate(), //day as a number (1-31)
            month: d.getMonth(), //month as a number (0-11)
            year: d.getFullYear() //four digit year (yyyy)
        };
        return date;
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
    function createCalendar(date = {}) {
        let $monthAndYear = $datePicker.find('#monthAndYear'),
            $datePickerGrid = $datePicker.find('tbody'),
            dayIndex = 0,
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
                tdHtml += '<td tabindex="-1" role="button" '
                        + 'class="' + ((dayIndex === date.date) ? 'selected' : '') + '" '
                        + 'aria-label="' + (emptyCell ? '' : (days[j] + ', ' + dayIndex + ' ' + months[date.month] + ', ' + date.year))
                        + '" data-date="' + (emptyCell ? '' : dayIndex)
                        + '" data-month="' + (emptyCell ? '' : date.month)
                        + '" data-year="' + (emptyCell ? '' : date.year)
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
    function getSelectedDate() {
        let $currentCell = $('.selected[data-date]'),
            date = parseInt($currentCell.attr('data-date')),
            month = parseInt($currentCell.attr('data-month')),
            year = parseInt($currentCell.attr('data-year'));
        return {$currentCell, date, month, year};
    }
    function focusOnSelectedDate() {
        document.querySelectorAll('.selected[data-date]')[0].focus();
    }
    function backOneMonth(m, y) {
        m = m - 1;
        if (m < 0) {
            m = 11;
            y = y - 1;
        }
        return {m, y};
    }
    // opening calendar announces hint with aria-live
    // shift arrow keys change month/year by triggering <- -> <= =>
    // tabbing away closes the widget
    // when closes via esc focus goes back to trigger
    // when closes via date select focus goes to date input field
    function bindClickEvents() {
        $launchDatePicker.on('click', function () {
            $(this).attr('aria-expanded', 'true');
            clearCalendar();
            createCalendar(getTheDate());
            $datePicker.show();
            focusOnSelectedDate();
        });
        $closeDatePicker.on('click', function () {
            $(this).attr('aria-expanded', 'false');
            $datePicker.hide();
            clearCalendar();
        });
        $('#datePicker').on('click', '[data-date]', function () {
            let $this = $(this),
                dateQueryString = ($this.attr('data-month') + 1) + '/' + $this.attr('data-date') + '/' + $this.attr('data-year');
            $dateInput.val(dateQueryString);
            $closeDatePicker.click();
        });
        $('#backOneMonth').on('click', function () {
            let {date, month, year} = getSelectedDate(),
                targetDate,
                $targetCell,
                {m, y} = backOneMonth(month, year);
            month = m;
            year = y;
            // month = month - 1
            // if month - 1 < 0 then month = 11
            // if month === 11 then year = year - 1
            // get num days in month of this prior month
            /*

                month = month - 1;
                if (month < 0) {
                    month = 11;
                    year = year - 1;
                }
                const DAYS_IN_MONTH = daysInMonth({month, year});
            */


            // if date > num days in prior month date = num days in prior month


            // clear calendar
            // createCalendar(getTheDate((month + 1) + '/' + targetDate + '/' + year));
            // focus on selected
            /*
                clearCalendar();
                createCalendar(getTheDate((month + 1) + '/' + targetDate + '/' + year));
                focusOnSelectedDate();
            */
        });
        $('#forwardOneMonth').on('click', function () {
            // calculate and forward one month
        });
    }
    function bindKeyEvents() {
        $('#datePicker').on('keydown', function (evt) {
            // ESC key closes date picker
            if (evt.keyCode === NAME.keyboard.esc) {
                $closeDatePicker.click();
            }
        });
        $('#datePicker').on('keydown', 'button', function (evt) {
            // ENTER and SPACE clicks all buttons in the date picker
            if (evt.keyCode === NAME.keyboard.space || evt.keyCode === NAME.keyboard.enter) {
                $(this).click();
            }
        });
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            // ARROW keys change date.  right/left changes by day.  up/down changes by week
            let {$currentCell, date, month, year} = getSelectedDate(),
                addend,
                targetDate,
                $targetCell;
            const DAYS_IN_MONTH = daysInMonth({month, year});
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
            $targetCell = $('#datePicker').find('[data-date="' + targetDate + '"]');
            $currentCell.removeClass('selected');
            if ($targetCell[0]) {
                $targetCell.addClass('selected');
                focusOnSelectedDate();
                return;
            }
            if (targetDate <= 0) {
                let {m, y} = backOneMonth(month, year);
                month = m;
                year = y;
                /*
                month = month - 1;
                if (month < 0) {
                    month = 11;
                    year = year - 1;
                }
                */
                const DAYS_IN_MONTH = daysInMonth({month, year});
                targetDate = DAYS_IN_MONTH + targetDate;
            } else if (targetDate > DAYS_IN_MONTH) {
                targetDate = targetDate - DAYS_IN_MONTH;
                month = month + 1;
                if (month === 12) {
                    month = 0;
                    year = year + 1;
                }
            }
            clearCalendar();
            createCalendar(getTheDate((month + 1) + '/' + targetDate + '/' + year));
            focusOnSelectedDate();
        });
        // SHIFT+ARROW KEYS CLICK THE ADVANCE BY MONTH AND ADVANCE BY YEAR
    }
    bindClickEvents();
    bindKeyEvents();
//TO DO: WRITE WITH VANILLA JS
}(jQuery, NAME));
