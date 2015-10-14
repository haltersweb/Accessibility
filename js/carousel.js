/**
 * @author Adina Halter
 * Accessible Carousel
 */
(function ($, NAME) {
    'use strict';
	var $carousel = $('.carousel'), // a reference to the current carousel
    	$carouselItemsContainer = $carousel.find('.carousel-items'), // a reference to the container holding the carousel panels
    	$carouselItems = $carouselItemsContainer.children(), // a reference to the carousel panels
    	totalItems = $carouselItems.length, // number of panels in the carousel
    	$arrows = $carousel.find('[class^="carousel-arrow"]'), // back and forward buttons
		$lentils = $carousel.find('.lentil'), // lentil navigation commonly found at the bototm of carousels
		delayToFocus = 1000; // set a delay to allow animation to complete before focusing and changing arrow button state

    $lentils.click(function (evt) {
    	var $this = $(this),
    		frameNumber = parseInt($this.attr('data-carousel-item'));
		stopCarouselAnimation();
    	changeCarouselFrame(frameNumber);
		window.setTimeout(function() {
			$carouselItems.filter('[data-carousel-item="' + frameNumber + '"]').focus();
		}, delayToFocus);
	});
    $arrows.click(function (evt) {
		var currentFrame,
			targetFrame,
			$this = $(this);
		if ($this.hasClass('disabled')) {
			return;
		}
		stopCarouselAnimation();
		currentFrame = parseInt($carouselItemsContainer.attr('data-carousel-item-shown'));
		if ($this.is('[class*="left"]')) { //if left arrow
			targetFrame = (currentFrame === 1) ? 1 : (currentFrame - 1);
		} else { //else right arrow
			targetFrame = (currentFrame === totalItems) ? totalItems : (currentFrame + 1);
		}
		changeCarouselFrame(targetFrame);
		window.setTimeout(function() {
			$carouselItems.filter('[data-carousel-item="' + targetFrame + '"]').focus();
		}, delayToFocus);
	});
	$carousel.on('keydown', function (evt) {
		if (evt.keyCode === NAME.keyboard.left) {
			$arrows.filter('[class*="left"]').trigger('click');
			return;
		}
		if (evt.keyCode === NAME.keyboard.right) {
			$arrows.filter('[class*="right"]').trigger('click');
			return;
		}
	});
	$carouselItemsContainer.focusin(function () {
		stopCarouselAnimation();
	});
	NAME.access.ariaHideContent($carouselItems.not('[data-carousel-item="1"]'));
	startCarouselAnimation();
	function animateCarousel() {
		var carouselItem = parseInt($carouselItemsContainer.attr('data-carousel-item-shown'));
    	if (carouselItem === totalItems) {
    		carouselItem = 1;
    	} else {
    		carouselItem += 1;
    	}
    	changeCarouselFrame(carouselItem);
	};
	function startCarouselAnimation() {
//ADINA:
//is it OK that this is a local variable holding the interval?
//what if there are two carousels on a page
		window.carouselAnimation = setInterval(function () {
	    	animateCarousel();
	    }, 3000);
	};
	function stopCarouselAnimation() {
//ADINA:
//is it OK that this is a local variable holding the interval?
//what if there are two carousels on a page
//DO I NEED TO MAKE A CAROUSEL CONSTRUCTOR?
		clearInterval(window.carouselAnimation);
	};
	function changeCarouselFrame(carouselItem) {
		var $currentCarouselItem,
			$newCarouselItem;
    	$currentCarouselItem = $carouselItems.not('[aria-hidden="true"]');
    	$newCarouselItem = $carouselItems.filter('[data-carousel-item="' + carouselItem + '"]');
    	lentilChangeState($lentils.filter('[data-carousel-item="' + carouselItem + '"]'));
    	NAME.access.ariaHideContent($currentCarouselItem);
    	NAME.access.ariaShowContent($newCarouselItem);
    	$carouselItemsContainer.attr('data-carousel-item-shown', carouselItem);
		window.setTimeout(function() {
			arrowChangeState(carouselItem);
		}, delayToFocus);
	}
	function arrowChangeState(currentFrame) {
		console.log('arrowChangeState() is running');
    	$arrows.removeClass('disabled');
    	if (currentFrame === 1) {
    		$arrows.filter('[class*="left"]').addClass('disabled');
    		return;
    	}
    	if (currentFrame === totalItems) {
    		$arrows.filter('[class*="right"]').addClass('disabled');
    	}
	}
	function lentilChangeState($lentil) {
		$lentil.addClass('enabled')
			.siblings('.enabled').removeClass('enabled');
	}
}(jQuery, NAME));
