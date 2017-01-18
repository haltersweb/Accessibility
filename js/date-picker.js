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
    // returns true if the year is a leap year
    function leapYear(year) {
        return ((year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0)));
    }
    // get the number of days in a particular month for particular year (feb leap year)
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
    // remove all markup from the tbody of the calendar grid table
    function clearCalendar() {
        let $datePickerGrid = $datePicker.find('tbody');
        $datePickerGrid.empty();
    }
    // which date on the grid is currently selected?  returns the grid cell and mo, date, yr
    function getSelectedDate() {
        let $currentCell = $('.selected[data-date]'),
            date = parseInt($currentCell.attr('data-date')),
            month = parseInt($currentCell.attr('data-month')),
            year = parseInt($currentCell.attr('data-year'));
        return {$currentCell, date, month, year};
    }
    // focus on the td[role=button] grid cell that is currently selected (assumes only one)
    function focusOnSelectedDate() {
        document.querySelectorAll('.selected[data-date]')[0].focus();
    }
    // returns the next or prior month, year, and the number of days in that month
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
    // returns the next or prior year and the number of days in the month during that year (i.e. feb leap)
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
    function bindClickEvents() {
        // when button to launch date picker is clicked:
            //change its aria-expanded state
            //show the date picker
            //focus on either the date in the input field or the current date if input field is empty
        $launchDatePicker.on('click', function () {
            $(this).attr('aria-expanded', 'true');
            createCalendar(getTheDate());
            $datePicker.show();
            focusOnSelectedDate();
            return false;
        });
        // when button to close the date picker is clicked:
            // change the launcher button's aria-expanded state
            // hide the date picker
            // focus on the launcher button
        $closeDatePicker.on('click', function () {
            $launchDatePicker.attr('aria-expanded', 'false');
            $datePicker.hide();
            $launchDatePicker.focus();
            return false;
        });
        // when a date cell (with a date in it) is clicked on:
            // get the date assigned to this cell
            // put that value into the date input field
            // close the date picker
            //focus on the date input field
        $('#datePicker').on('click', '[data-date]:not([data-date=""])', function () {
            let $this = $(this),
                dateQueryString = ($this.attr('data-month') + 1) + '/' + $this.attr('data-date') + '/' + $this.attr('data-year');
            $dateInput.val(dateQueryString);
            $closeDatePicker.click();
            $dateInput.focus();
            return false;
        });
        // when the back/forward month button is clicked
            // decide whether it is forward or backward
            // get the new month date
            // generate new calendar
            // focus on new date
        $('#backOneMonth, #forwardOneMonth').on('click', function () {
            let {date, month, year} = getSelectedDate(),
                targetDate,
                numDaysInMo,
                back = (this.id === 'backOneMonth') ? true : false;
            // get the prior/next month, year, and num days in this prior/next month
            ({month, year, numDaysInMo} = changeByMonth(month, year, back));
            // if date > # days in this new month, target date = # days in new month (else same as prior date)
            targetDate = (date > numDaysInMo) ? numDaysInMo : date;
            createCalendar(getTheDate((month + 1) + '/' + targetDate + '/' + year));
            focusOnSelectedDate();
            return false;
        });
        // when the back/forward year button is clidked
            // decide whether it is forward or backward
            // get the new year date
            // generate new calendar
            // focus on new date
        $('#backOneYear, #forwardOneYear').on('click', function () {
            let {date, month, year} = getSelectedDate(),
                targetDate,
                numDaysInMo,
                back = (this.id === 'backOneYear') ? true : false;
            // get the prior/next year, and num days in the month of the year (aka Feb)
            ({year, numDaysInMo} = changeByYear(month, year, back));
            // if date > # days in new year's month (aka Feb), target date = # days in new year's month (else same as date)
            targetDate = (date > numDaysInMo) ? numDaysInMo : date;
            createCalendar(getTheDate((month + 1) + '/' + targetDate + '/' + year));
            focusOnSelectedDate();
            return false;
        });
        // button generates this month's calendar and takes you to today's date on the calendar
        $('#goToToday').on('click', function () {
            let d = new Date();
            createCalendar(getTheDate((d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()));
            focusOnSelectedDate();
            return false;
        });
        // if the area outside the date picker is clicked
            // (figure this out by seeing if the target clicked is within the date picker)
            // then close the date picker if it is currently opened
        $(document).on('click', function (evt) {
            if (($(evt.target).closest($datePicker).length === 0) && ($launchDatePicker.attr('aria-expanded') === 'true')) {
                $closeDatePicker.click();
                return false;
            }
        });
    }
    function bindKeyEvents() {
        // ESC key clicks close date picker
        $('#datePicker').on('keydown', function (evt) {
            if (evt.keyCode === NAME.keyboard.esc) {
                $closeDatePicker.click();
                return false;
            }
        });
        // ENTER and SPACE clicks all buttons in the date picker
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (evt.keyCode === NAME.keyboard.space || evt.keyCode === NAME.keyboard.enter) {
                $(this).click();
                return false;
            }
        });
        // ARROW keys change date.  right/left changes by day.  up/down changes by week
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (!evt.shiftKey &&
                    (evt.keyCode === NAME.keyboard.right ||
                        evt.keyCode === NAME.keyboard.left ||
                        evt.keyCode === NAME.keyboard.up ||
                        evt.keyCode === NAME.keyboard.down)) {
                let {$currentCell, date, month, year} = getSelectedDate(),
                    addend,
                    targetDate,
                    $targetCell,
                    numDaysInMo = daysInMonth(month, year);
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
                    return false;
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
                return false;
            }
        });
        // SHIFT+R/L keys click the forward/back by month buttons when the picker cells have focus
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (evt.shiftKey && (evt.keyCode === NAME.keyboard.right || evt.keyCode === NAME.keyboard.left)) {
                if (evt.keyCode === NAME.keyboard.left) {
                    $('#backOneMonth').click();
                    return false;
                }
                $('#forwardOneMonth').click();
                return false;
            }
        });
        // SHIFT+U/D keys click the forward/back by year buttons when the picker cells have focus
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (evt.shiftKey && (evt.keyCode === NAME.keyboard.up || evt.keyCode === NAME.keyboard.down)) {
                if (evt.keyCode === NAME.keyboard.up) {
                    $('#backOneYear').click();
                    return false;
                }
                $('#forwardOneYear').click();
                return false;
            }
        });
        // TAB on last calendar control (#forwardOneMonth) takes focus back into calendar grid
        $('#datePicker').on('keydown', '#forwardOneMonth', function (evt) {
            if (!evt.shiftKey && evt.keyCode === NAME.keyboard.tab) {
                focusOnSelectedDate();
                return false;
            }
        });
        // SHIFT TAB on first calendar control (#close) closes date picker
        $('#datePicker').on('keydown', '#closeDatePicker', function (evt) {
            if (evt.shiftKey && evt.keyCode === NAME.keyboard.tab) {
                $closeDatePicker.click();
                return false;
            }
        });
        // TAB on last calendar control (.selected) closes date picker
        $('#datePicker').on('keydown', '.selected[data-date]', function (evt) {
            if (!evt.shiftKey && evt.keyCode === NAME.keyboard.tab) {
                $closeDatePicker.click();
                return false;
            }
        });
    }
    bindKeyEvents();
    bindClickEvents();
// TO DO: create hints button
//TO DO: WRITE WITH VANILLA JS
}(jQuery, NAME));
