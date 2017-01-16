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
    function daysInMonth(month, year) {
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
            firstDayOfMonth = new Date((date.month + 1) + '/1/' + date.year).getDay(),
            numDaysInMo = daysInMonth(date.month, date.year);
        const DAYS_IN_WEEK = 7,
            NUM_ROWS = 6;
        // always clear calendar first
        clearCalendar();
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
                emptyCell = (dayIndex === 0 || dayIndex > numDaysInMo);
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
    function changeByMonth(month, year, back = false) {
        let numDaysInMo,
            addend = 1;
        if (back) {
            addend = -1;
        }
        month = month + addend;
        if ((month < 0) || (month === 12)) {
            month = (month < 0) ? (month = 11) : month = 0;
            year = year + addend;
        }
        numDaysInMo = daysInMonth(month, year);
        return {month, year, numDaysInMo};
    }

    function changeByYear(month, year, back = false) {
        let numDaysInMo,
            addend = 1;
        if (back) {
            addend = -1;
        }
        year = year + addend;
        numDaysInMo = daysInMonth(month, year);
        return {year, numDaysInMo};
    }
    // opening calendar announces hint with aria-live
    // shift L/R arrow keys change month by triggering <- ->
    // shift U/D arrow keys change year by triggering <= =>
    // tabbing away closes the widget
    // when closes via esc focus goes back to trigger
    // when closes via date select focus goes to date input field
    // if tab to picker controls and then tab forward back into calendar, should focus on selected
    function bindClickEvents() {
        $launchDatePicker.on('click', function () {
            $(this).attr('aria-expanded', 'true');
            createCalendar(getTheDate());
            $datePicker.show();
            focusOnSelectedDate();
            return;
        });
        $closeDatePicker.on('click', function () {
            $(this).attr('aria-expanded', 'false');
            $datePicker.hide();
            return;
        });
        $('#datePicker').on('click', '[data-date]', function () {
            let $this = $(this),
                dateQueryString = ($this.attr('data-month') + 1) + '/' + $this.attr('data-date') + '/' + $this.attr('data-year');
            $dateInput.val(dateQueryString);
            $closeDatePicker.click();
            return;
        });
        $('#backOneMonth, #forwardOneMonth').on('click', function () {
            let {date, month, year} = getSelectedDate(),
                targetDate,
                numDaysInMo,
                back = (this.id === 'backOneMonth') ? true : false;
            // get the prior month, year, and num days in this prior month
            ({month, year, numDaysInMo} = changeByMonth(month, year, back));
            // if date > # days in prior month, target date = # days in prior month (else same as date)
            targetDate = (date > numDaysInMo) ? numDaysInMo : date;
            createCalendar(getTheDate((month + 1) + '/' + targetDate + '/' + year));
            focusOnSelectedDate();
            return;
        });
        $('#backOneYear, #forwardOneYear').on('click', function () {
            let {date, month, year} = getSelectedDate(),
                targetDate,
                numDaysInMo,
                back = (this.id === 'backOneYear') ? true : false;
            // get the prior year, and num days in the month of the year (aka Feb)
            ({year, numDaysInMo} = changeByYear(month, year, back));
            // if date > # days in prior year's month (aka Feb), target date = # days in year's month (else same as date)
            targetDate = (date > numDaysInMo) ? numDaysInMo : date;
            createCalendar(getTheDate((month + 1) + '/' + targetDate + '/' + year));
            focusOnSelectedDate();
            return;
        });
    }
    function bindKeyEvents() {
        $('#datePicker').on('keydown', function (evt) {
            // ESC key closes date picker
            if (evt.keyCode === NAME.keyboard.esc) {
                $closeDatePicker.click();
                return;
            }
        });
        $('#datePicker').on('keydown', 'button', function (evt) {
            // ENTER and SPACE clicks all buttons in the date picker
            if (evt.keyCode === NAME.keyboard.space || evt.keyCode === NAME.keyboard.enter) {
                $(this).click();
                return;
            }
        });
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            // ARROW keys change date.  right/left changes by day.  up/down changes by week
            let {$currentCell, date, month, year} = getSelectedDate(),
                addend,
                targetDate,
                $targetCell,
                numDaysInMo = daysInMonth(month, year);
            if (evt.shiftKey) {
                return;
            }
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
                ({month, year, numDaysInMo} = changeByMonth(month, year, true));
                targetDate = numDaysInMo + targetDate;
            } else if (targetDate > numDaysInMo) {
                targetDate = targetDate - numDaysInMo;
                ({month, year} = changeByMonth(month, year));
            }
            createCalendar(getTheDate((month + 1) + '/' + targetDate + '/' + year));
            focusOnSelectedDate();
            return;
        });
        // SHIFT+R/L KEYS CLICK THE ADVANCE BY MONTH
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (evt.shiftKey && (evt.keyCode === NAME.keyboard.right || evt.keyCode === NAME.keyboard.left)) {
                if (evt.keyCode === NAME.keyboard.left) {
                    $('#backOneMonth').click();
                    return;
                }
                $('#forwardOneMonth').click();
                return;
            }
        });
        // SHIFT+U/D KEYS CLICK THE ADVANCE BY YEAR
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (evt.shiftKey && (evt.keyCode === NAME.keyboard.up || evt.keyCode === NAME.keyboard.down)) {
                if (evt.keyCode === NAME.keyboard.up) {
                    $('#backOneYear').click();
                    return;
                }
                $('#forwardOneYear').click();
                return;
            }
        });
    }
    bindClickEvents();
    bindKeyEvents();
//TO DO: WRITE WITH VANILLA JS
}(jQuery, NAME));
