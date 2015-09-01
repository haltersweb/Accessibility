/**
 * @author Adina Halter
 * Accessible Form Error Handling
 */
(function ($, NAME) {
    'use strict';
    $('button[type="submit"]').on('click', function (evt) {
        var formErrors = [],
            $errorList;
        formErrors = validateForm();
        if (formErrors.length === 0) {
            // no errors.  Post the form.
            return;
        }
        // there were errors. Do not post.
        evt.preventDefault();
        $errorList = generateErrorMsg(formErrors);
        $('form').prepend($errorList);
        //focus on first offending field
        $('#' + formErrors[0].inputId).focus();
    });
    /*
        function to validate form
    */
    function validateForm() {
        var formErrors = [];
        //clear any prior error messaging
        clearErrorMsgs();
        //enter your validation script here:

        //replace with your error results but use this error format:
        formErrors = [
            {
                "inputId"  : "lastName",
                "errorMsg" : "Enter your last name."
            },
            {
                "inputId"  : "date",
                "errorMsg" : "Enter your birthdate."
            }
        ];
        return formErrors;
    }
    /*
        function to clear any prior form error messaging
    */
    function clearErrorMsgs() {
        var strAriaDescribedby;
        $('.error-list').remove();
        $('[aria-invalid="true"]')
            //remove aria-invalid attribute
            .removeAttr('aria-invalid')
            //remove aria-describedby error IDs
            .each(function (index) {
                strAriaDescribedby = $(this).attr('aria-describedby');
                $(this).attr('aria-describedby', strAriaDescribedby.replace(/\S+Error\s*/, ""));
            })
        ;
    }
    /*
        function to generate error list jQuery object and apply aria tagging
    */
    function generateErrorMsg(formErrors) {
        var numErrors = formErrors.length,
            $errorList = $('<ul class="form-row error-list bullet singletons">'),
            $offendingField,
            strOffendingAriaDescribedby;
        $.each(formErrors, function (i, val) {
            //create error message list item
            $errorList.append('<li><a href="#' + val.inputId + '" id="' + val.inputId + 'Error"><span class="accessibly-hidden">Error ' + (i + 1) + ' of ' + numErrors + ': </span>' + val.errorMsg + '</a></li>');
            $offendingField = $('#' + val.inputId);
            //add aria-invalid attribute
            $offendingField.attr('aria-invalid', 'true');
            //save existing aria-describedby if it exists.
            strOffendingAriaDescribedby = (!$offendingField.attr('aria-describedby')) ? "" : $offendingField.attr('aria-describedby');
            //generate aria-describedby value
            strOffendingAriaDescribedby = val.inputId + 'Error ' + strOffendingAriaDescribedby;
            //add aria-describedby error IDs
            $offendingField.attr('aria-describedby', strOffendingAriaDescribedby);
        });
        return $errorList;
    }
}(jQuery, NAME));