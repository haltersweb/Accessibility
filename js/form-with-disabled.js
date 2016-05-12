/*global
    jQuery, $, NAME, alert
*/
/**
 * @author Adina Halter
 * Accessible Form Error Handling
 */
(function ($) {
    'use strict';
    var $submitButton = $('[type="submit"]'),
        $requiredFields = $('[aria-required="true"]'),
        formErrors = {
            lastName: "You must enter your last name.",
            firstName: "You must enter your first name."
        };
    $requiredFields.on('blur', function () {
        var $this = $(this),
            id = $this.attr('id'),
            $errMsg = $('#' + id + "Err");
        if ($this.val() === "") {
            $errMsg.text(formErrors[id]);
            $this.attr('data-ok', 'false');
            $submitButton.attr('aria-disabled', 'true');
            return false;
        }
        $errMsg.text("");
        $this.attr('data-ok', 'true');
        if ($('[data-ok="true"]').length === 2) {
            $submitButton.attr('aria-disabled', 'false');
        }
    });
    $('[type="checkbox"').on('change', function () {
        if ($(this).is(':checked')) {
            $('#catName').removeAttr('disabled');
            return true;
        }
        $('#catName').attr('disabled', 'disabled');
    });
    $submitButton.on('click', function (evt) {
        evt.preventDefault();
        if ($(this).attr('aria-disabled') === "true") {
            return false;
        }
        alert('Good Job filling out this form!');
    });
}(jQuery));