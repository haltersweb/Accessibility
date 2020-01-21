/**
 * @author Adina Halter
 * Accessible Date Picker
 */

/*global
    NAME, jQuery
*/
(function ($, NAME) {
    'use strict';
    //TO DO:
        //F6 to toggle between dialog and application
        //click out to go to application
        //click in to go to dialog
        //WRITE WITH VANILLA JS
    let dp = { // dp stands for "date picker"
      widget : document.getElementById('datePicker'),
      calendar : document.getElementById('datePickerCalendar'),
      close : document.getElementById('closeDatePicker')
      },
      launchDatePicker = document.getElementById('launchDatePicker'),
      dateInput = document.getElementById('date'), //WILL NEED TO RENAME GENERIC ID
      days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var
        $datePicker = $('#datePicker'), //REMOVE
        $calendar = $('#datePickerCalendar'), //REMOVE
        $launchDatePicker = $('#launchDatePicker'), //REMOVE
        $closeDatePicker = $('#closeDatePicker'), //REMOVE
        $dateInput = $('#date'); //REMOVE;
    function getTheDate(dateQueryString) { // FUNCTION IS OK
        dateQueryString = dateQueryString || '';
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
        date = { // FUNCTION IS OK
            day: d.getDay(), //weekday as a number (0-6)
            date: d.getDate(), //day as a number (1-31)
            month: d.getMonth(), //month as a number (0-11)
            year: d.getFullYear() //four digit year (yyyy)
        };
        return date;
    }
    // returns true if the year is a leap year
    function leapYear(year) { // FUNCTION IS OK
        return ((year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0)));
    }
    // get the number of days in a particular month for particular year (feb leap year)
    function daysInMonth(month, year) { // FUNCTION IS OK
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
    function createCalendar(date) { // FUNCTION IS OK
        date = date || {};
        let monthAndYear = dp.widget.querySelector('#monthAndYear'),
            dpGrid = dp.calendar.querySelector('tbody'),
            dayIndex = 0,
            firstDayOfMonth = new Date((date.month + 1) + '/1/' + date.year).getDay(),
            numDaysInMo = daysInMonth(date.month, date.year);
        const DAYS_IN_WEEK = 7,
              NUM_ROWS = 6;
        // always clear calendar first
        dpGrid.innerHTML = '';
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
                tdHtml += `<td tabindex="-1" role="button"
                        class="${((dayIndex === date.date) ? 'selected' : '')}"
                        aria-label="${(emptyCell ? '' : (days[j] + ', ' + dayIndex + ' ' + months[date.month] + ', ' + date.year))}"
                        data-date="${(emptyCell ? '' : dayIndex)}"
                        data-month="${(emptyCell ? '' : date.month)}"
                        data-year="${(emptyCell ? '' : date.year)}"
                        aria-hidden="${emptyCell}">${(emptyCell ? '' : dayIndex)}</td>\n`;
            }
            tr.innerHTML = tdHtml;
            fragment.append(tr);
            dpGrid.append(fragment);
        }
        // populate month and year
        monthAndYear.textContent = `${months[date.month]} ${date.year}`;
    }
    // which date on the grid is currently selected?  returns the grid cell and mo, date, yr
    function getSelectedDate() {
        var currentCell = dp.calendar.querySelector('.selected[data-date]'),
            date = parseInt(currentCell.getAttribute('data-date')),
            month = parseInt(currentCell.getAttribute('data-month')),
            year = parseInt(currentCell.getAttribute('data-year'));
        return {currentCell: currentCell, date: date, month: month, year: year};
    }
    // focus on the td[role=button] grid cell that is currently selected (assumes only one)
    function focusOnSelectedDate() { // FUNCTION IS OK
        dp.widget.querySelector('.selected[data-date]').focus();
    }
    // returns the next or prior month, year, and the number of days in that month
    function changeByMonth(month, year, back) { // FUNCTION IS OK
        back = back || false;
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
        return {month: month, year: year, numDaysInMo: numDaysInMo};
    }
    // returns the next or prior year and the number of days in the month during that year (i.e. feb leap)
    function changeByYear(month, year, back) { // FUNCTION IS OK
        back = back || false;
        let numDaysInMo,
            addend = 1;
        if (back) {
            addend = -1;
        }
        year = year + addend;
        numDaysInMo = daysInMonth(month, year);
        return {year: year, numDaysInMo: numDaysInMo};
    }
    function positionDatePicker(anchorElem, xLocale, yLocale) { //FUNCTION IS OK
        // anchorElem is the element that you want to place the date picker in reference to
        // xLocale will be "left" or "right" to state which anchor element's corner you want date picker's 0,0 point to line up with
        // yLocale will be "top" or "bottom" to state which anchor element's corner you want date picker's 0,0 point to line up with
        // for example, if you want your date picker's top/left (0,0) point to align with a button's bottom/left point you would say 'left', 'bottom'
        let bcr = anchorElem.getBoundingClientRect();
        dp.widget.style.left = bcr[xLocale] + 'px';
        dp.widget.style.top = bcr[yLocale] + 'px';
    }
    function bindClickEvents() {
        // when button to launch date picker is clicked:
            //show the date picker
            //focus on either the date in the input field or the current date if input field is empty
        $launchDatePicker.on('click', function () {
            createCalendar(getTheDate());
            // Maintain tabbing within date picker
            NAME.dialog.addBookends($datePicker);
            positionDatePicker($launchDatePicker[0], 'left', 'bottom');
            $datePicker.show();
            focusOnSelectedDate();
            return false;
        });
        // when button to close the date picker is clicked:
            // hide the date picker
            // focus on the launcher button
        $closeDatePicker.on('click', function () {
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
            var $this = $(this),
                dateQueryString = (parseInt($this.attr('data-month')) + 1) + '/' + $this.attr('data-date') + '/' + $this.attr('data-year');
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
            //var {date, month, year} = getSelectedDate(),
            var selectedDate = getSelectedDate(),
                date = selectedDate.date,
                month = selectedDate.month,
                year = selectedDate.year,
                prevOrNextMonth,
                targetDate,
                numDaysInMo,
                back = (this.id === 'backOneMonth') ? true : false;
            // get the prior/next month, year, and num days in this prior/next month
            //({month, year, numDaysInMo} = changeByMonth(month, year, back));
            prevOrNextMonth = changeByMonth(month, year, back);
            month = prevOrNextMonth.month;
            year = prevOrNextMonth.year;
            numDaysInMo = prevOrNextMonth.numDaysInMo;
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
            //var {date, month, year} = getSelectedDate(),
            var selectedDate = getSelectedDate(),
                date = selectedDate.date,
                month = selectedDate.month,
                year = selectedDate.year,
                prevOrNextYear,
                targetDate,
                numDaysInMo,
                back = (this.id === 'backOneYear') ? true : false;
            // get the prior/next year, and num days in the month of the year (aka Feb)
            //({year, numDaysInMo} = changeByYear(month, year, back));
            prevOrNextYear = changeByYear(month, year, back);
            year = prevOrNextYear.year;
            numDaysInMo = prevOrNextYear.numDaysInMo;
            // if date > # days in new year's month (aka Feb), target date = # days in new year's month (else same as date)
            targetDate = (date > numDaysInMo) ? numDaysInMo : date;
            createCalendar(getTheDate((month + 1) + '/' + targetDate + '/' + year));
            focusOnSelectedDate();
            return false;
        });
        // button generates this month's calendar and takes you to today's date on the calendar
        $('#goToToday').on('click', function () {
            var d = new Date();
            createCalendar(getTheDate((d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()));
            focusOnSelectedDate();
            return false;
        });
/* NEED TO DECIDE IF THIS IS EVEN NECESSARY. IF SO I'LL NEED TO DEAL WITH ARIA-EXPANDED LOGIC THAT IS NO LONGER THERE.
        // if the area outside the date picker is clicked
            // (figure this out by seeing if the target clicked is within the date picker)
            // then focus on
        $(document).on('click', function (evt) {
            if (($(evt.target).closest($datePicker).length === 0) && ($launchDatePicker.attr('aria-expanded') === 'true')) {
                //$closeDatePicker.click();
                //return false;
            }
        });
*/
        $('#showKeyboardShortcuts').on('click', function () {
            var $this = $(this),
                $content = $('#' + $this.attr('aria-owns'));
            $content.toggle();
            if ($content.is(':visible')) {
                $this.attr('aria-expanded', 'true');
                return false;
            }
            $this.attr('aria-expanded', 'false');
            return false;
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
        // Change date
            // ARROW keys change date.  right/left changes by day.  up/down changes by week
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (!evt.shiftKey &&
                    (evt.keyCode === NAME.keyboard.right ||
                        evt.keyCode === NAME.keyboard.left ||
                        evt.keyCode === NAME.keyboard.up ||
                        evt.keyCode === NAME.keyboard.down)) {
                //var {currentCell, date, month, year} = getSelectedDate(),
                let selectedDate = getSelectedDate(),
                    currentCell = selectedDate.currentCell,
                    date = selectedDate.date,
                    month = selectedDate.month,
                    year = selectedDate.year,
                    addend,
                    targetDate,
                    targetCell,
                    newMonth,
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
                targetCell = dp.widget.querySelector('[data-date="' + targetDate + '"]');
                currentCell.classList.remove('selected');
                if (targetCell) {
                    targetCell.classList.add('selected');
                    focusOnSelectedDate();
                    return false;
                }
                if (targetDate <= 0) {
                    //({month, year, numDaysInMo} = changeByMonth(month, year, true));
                    newMonth = changeByMonth(month, year, true);
                    month = newMonth.month;
                    year = newMonth.year;
                    numDaysInMo = newMonth.numDaysInMo;
                    targetDate = numDaysInMo + targetDate;
                } else if (targetDate > numDaysInMo) {
                    targetDate = targetDate - numDaysInMo;
                    //({month, year} = changeByMonth(month, year));
                    newMonth = changeByMonth(month, year);
                    month = newMonth.month;
                    year = newMonth.year;
                }
                createCalendar(getTheDate((month + 1) + '/' + targetDate + '/' + year));
                focusOnSelectedDate();
                return false;
            }
        });
        // Change Month
            // PageUp/PageDown (fn + up/fn + dn) click the previous/next month buttons when the picker cells have focus
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if ((!evt.ctrlKey && !evt.metaKey) && (evt.keyCode === NAME.keyboard.pageUp || evt.keyCode === NAME.keyboard.pageDown)) {
                if (evt.keyCode === NAME.keyboard.pageUp) {
                    $('#backOneMonth').click();
                    return false;
                }
                $('#forwardOneMonth').click();
                return false;
            }
        });
        // Change Year
            // CTRL+PageUp/CTRL+PageDown (PC) || CMD+fn+up/CMD+fn+down (Mac) click the prev/next year buttons when the picker cells have focus
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if ((evt.ctrlKey || evt.metaKey) && (evt.keyCode === NAME.keyboard.pageUp || evt.keyCode === NAME.keyboard.pageDown)) {
                if (evt.keyCode === NAME.keyboard.pageUp) {
                    $('#backOneYear').click();
                    return false;
                }
                $('#forwardOneYear').click();
                return false;
            }
        });
        // HOME (fn + left) takes you to the first day of the month
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (evt.keyCode === NAME.keyboard.home) {
                //var {currentCell} = getSelectedDate(),
                let selectedDate = getSelectedDate(),
                    currentCell = selectedDate.currentCell,
                    targetCell = dp.widget.querySelector('[data-date="' + 1 + '"]');
                currentCell.classList.remove('selected');
                targetCell.classList.add('selected');
                focusOnSelectedDate();
                return false;
            }
        });
        // END (fn + right) takes you to the last day of the month
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (evt.keyCode === NAME.keyboard.end) {
                //var {currentCell, month, year} = getSelectedDate(),
                let selectedDate = getSelectedDate(),
                    currentCell = selectedDate.currentCell,
                    month = selectedDate.month,
                    year = selectedDate.year,
                    targetDate = daysInMonth(month, year),
                    targetCell = dp.widget.querySelector('[data-date="' + targetDate + '"]');
                currentCell.classList.remove('selected');
                targetCell.classList.add('selected');
                focusOnSelectedDate();
                return false;
            }
        });
        // Go to today
            // T clicks the previous/next month buttons when the picker cells have focus
        $('#datePicker').on('keydown', '[data-date]', function (evt) {
            if (evt.keyCode === 84) {
                $('#goToToday').click();
                return false;
            }
        });
        // TAB on last button before grid takes focus into calendar grid's currently selected date
            // assign event to last button found in divs before the picker grid's div. This assumes that there are buttons before the picker grid.
        $('#datePicker').find('[role="application"]').prevAll('div').find('button').last().on('keydown', function (evt) {
            if (!evt.shiftKey && evt.keyCode === NAME.keyboard.tab) {
                focusOnSelectedDate();
                return false;
            }
        });
        // SHIFT+TAB on first button after grid takes focus into calendar grid's currently selected date
            // assign event to first button found in divs after the picker grid's div. This assumes that there are buttons after the picker grid.
        $('#datePicker').find('[role="application"]').nextAll('div').find('button').first().on('keydown', function (evt) {
            if (evt.shiftKey && evt.keyCode === NAME.keyboard.tab) {
                focusOnSelectedDate();
                return false;
            }
        });
    }
    bindKeyEvents();
    bindClickEvents();
    NAME.drag.simpleDrag(dp.widget);

}(jQuery, NAME));
