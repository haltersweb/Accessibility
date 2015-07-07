/**
 * @author Adina Halter
 * Accessible Drop Menu
 */
(function ($, NAME) {
    'use strict';
    /*
        when mobile nav drawer trigger is clicked:
            1.  open drawer
            2.  bind one-time click event to close drawer button and block-screen to close drawer
    */
    $('.triptych-nav-trigger').on('click', function (evt) {
        var $pageWrapper = $('.page-wrapper'),
            $blockScreen = $('.block-screen'),
            $navigation = $('[role="navigation"]'),
            $subNav = $navigation.find('.sub-navigation'),
            $closeDrawerButton = $('.close-drawer');
        evt.stopPropagation();
        NAME.access.tagTrigger();
        NAME.access.ariaExpand($subNav);
        $navigation.removeClass('mobile-hide');
        $pageWrapper.addClass('reveal');
        $closeDrawerButton.focus();
        $blockScreen.add($closeDrawerButton).one('click', function () {
            NAME.access.ariaContract($subNav);
            $pageWrapper.removeClass('reveal');
            $navigation.addClass('mobile-hide');
            NAME.access.removeBlockFocus($pageWrapper);
            NAME.access.focusTrigger();
        });
        NAME.access.blockFocus($pageWrapper, $closeDrawerButton);
    });
    /*
        function to open a subnav
    */
    function openSubnav($nav, $subnav) {
        NAME.access.ariaExpand($subnav);
        $nav.addClass('active');
    }
    /*
        function to close an active subnav
    */
    function closeActiveSubnav() {
        var $formerActiveSubnav = $('.sub-navigation[aria-expanded="true"]'),
            $formerActiveElems = $formerActiveSubnav.closest('.navigation').find('.active');
        NAME.access.ariaContract($formerActiveSubnav);
        $formerActiveElems.removeClass('active');
    }
    /*
    when within .navigation and ESC pressed, close everything and give focus to the menu item that was the active one.
    */
    $('.navigation').on('keydown', function (evt) {
        if (evt.keyCode === NAME.keyboard.esc) {
            var $this = $(this),
                $currentMenuItem = $this.children('.active');
            closeActiveSubnav();
            $currentMenuItem.children('a').focus();
            return false;
        }
    });
    /*
        when click away from .navigation everything should close up
    */
    $('.page-wrapper').on('click', function () {
        closeActiveSubnav();
    });
    /*
        when navigation item is hovered on, reveal subnav and engage aria-tagging
    */
    $('.navigation-item').on('mouseover', function () {
        var $this = $(this),
            $navLink = $this.children('a'),
            $subnav = $navLink.next('ul');
        if ($subnav.length === 0) {
            return false;
        }
        if ($subnav.attr('aria-expanded') === 'true') {
            return;
        }
        closeActiveSubnav();
        openSubnav($this, $subnav);
    });
    /*
        when navigation item hover is removed, close subnav and clear aria-tagging
    */
    $('.navigation-item').on('mouseout', function () {
        closeActiveSubnav();
    });
    /*
        when top menu item link is clicked or ENTER, DOWN, or SPACE is pressed
            1. close any opened sub-navigation
            2. open sub-navigation and give first subnav link focus
    */
    $('.navigation-link').on('click keydown', function (evt) {
        var $this = $(this),
            $nav = $this.parent('.navigation-item'),
            $subnav = $this.next('.sub-navigation');
        if (
            evt.type === "click" ||
                evt.keyCode === NAME.keyboard.enter ||
                evt.keyCode === NAME.keyboard.down ||
                evt.keyCode === NAME.keyboard.space
        ) {
            closeActiveSubnav();
            if ($subnav.length === 0) {
                return true;
            }
            openSubnav($nav, $subnav);
            $subnav
                .find('li:first-child').addClass('active')
                .find('a').focus();
            return false;
        }
    });
    /*
        focusing on a top-navigation link clears the active class from other elems
    */
    $('.navigation-link').on('focus', function () {
        closeActiveSubnav();
    });
    /*
        when tab out of last sub-nav-link of last nav dropdown then close subnav
    */
    $('.navigation-item:last-child').find('.sub-navigation-item:last-child').children('a').on('keydown', function (evt) {
        if (evt.keyCode === NAME.keyboard.tab) {
            closeActiveSubnav();
        }
    });
    /*
        when sub-menu item is clicked or ENTER is pressed
            1. close any opened sub-navigation
            2. continue onto the url target (default event)
    */
    $('.sub-navigation-link').on('click keydown', function (evt) {
        if (evt.type === "click" || evt.keyCode === NAME.keyboard.enter) {
            closeActiveSubnav();
            //return true;
        }
    });
    /*
        sub-navigation focus cycles through all subnav elems using UP/DOWN arrows
    */
    $('.sub-navigation-link').on('keydown', function (evt) {
        var $thisActiveItem = $(this).parent('li'),
            $nextMenuItem = $thisActiveItem.next('li'),
            $previousMenuItem = $thisActiveItem.prev('li');
        if (evt.keyCode === NAME.keyboard.down) {
            $nextMenuItem = ($nextMenuItem.length === 0) ? $thisActiveItem.parent().find('li:first-child') : $nextMenuItem;
            $nextMenuItem.children('a').focus();
            return false;
        }
        if (evt.keyCode === NAME.keyboard.up) {
            $previousMenuItem = ($previousMenuItem.length === 0) ? $thisActiveItem.parent().find('li:last-child') : $previousMenuItem;
            $previousMenuItem.children('a').focus();
            return false;
        }
    });
    /*
        focusing on a sub-navigation link sets its sub-nav item class to active
    */
    $('.sub-navigation-link').on('focus', function () {
        var $this = $(this),
            $formerActiveElem = $('.sub-navigation-item.active');
        $formerActiveElem.removeClass('active');
        $this.closest('li').addClass('active');
    });
}(jQuery, NAME));
