/**
 * @author Adina Halter
 * Accessible Tab Navigation
 */
(function ($, NAME) {
    'use strict';
alert('test');
    $('[data-widget="tab-menu"]').find('a').on('click', function (evt) {
    	var $this = $(this),
    		$targetContent;
    	$this.closest('[data-widget="tab-menu"]').find('a').removeClass('current');
    	$this.addClass('current');
    	$targetContent = $($this.attr('href'));
    	$targetContent.siblings('.content-panel').removeClass('current');
    	$targetContent.addClass('current');
    });
    /*
		toggle between single content panel view and full content view
    */
    $('#singleContainerView').on('click', function (evt) {
    	$('.tabbed-content').addClass('single-container-view');
    });
    $('#allContentView').on('click', function (evt) {
    	$('.tabbed-content').removeClass('single-container-view');
    });
}(jQuery, NAME));
