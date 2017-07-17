//
//  This file contains any scripts that will be run on the Hacklahoma website.
//
//  scripts.js
//  HacklahomaWebsite
//

const mobileMaxWidth = 750; // screens smaller than this will be considered mobile.

// Global variable for the top of the nav bar.
// (Needs to be global to enable changes when the window resizes).
var stickyNavTop = $('#navBar').offset().top;

/**
	Fixes the navBar at the top of the screen when the user's screen is
	in the content section, and at the bottom of the header when it isn't.
*/
$(document).ready(function() {
	stickyNavTop = $('#navBar').offset().top;

	var stickyNav = function() {
		var scrollTop = $(window).scrollTop();

        if (window.innerWidth < mobileMaxWidth) {
            // do nothing (shh it's fine)
        } else if(scrollTop > stickyNavTop) {
			$('#navBar').addClass('fixed');
		} else {
			$('#navBar').removeClass('fixed');
		}
	};

	stickyNav();

	$(window).on({
		scroll: function() {
			stickyNav();
            if (window.innerWidth > mobileMaxWidth) {
                tracesScroll(); // in traces.js  Perf is better with one onscroll
            }
		}, resize: function() {
			if( $('#navBar').attr('class') == "absolute fixed") {
				// do nothing
			} else {
				stickyNavTop = $('#navBar').offset().top;
			}
		}
	});
});

/**
	Highlights the link in the navbar of the section currently displayed on the
	user's screen.

	Code from Melvin de Jong.
	https://theme.co/apex/forums/topic/one-page-navigation-navbar-to-highlight-section/#post-718740
*/
$(document).ready(function($) {
	/*
     * This part handles the highlighting functionality.
     * We use the scroll functionality again, some array creation and
     * manipulation, class adding and class removing, and conditional testing
     */

    // Get all links with div IDs that end in "Link" (should be only nav bar links).
    var aChildren = $("a[id$='Link']").toArray();

	// Create the empty aArray.
    var aArray = [];

    // Get the href attributes of those links.
    for(var i = 0; i < aChildren.length; i++) {
    	var aChild = aChildren[i];
    	var ahref = $(aChild).attr('href');
    	aArray.push(ahref);
    }

	// When the user scrolls
    $(window).scroll(function() {
    	// Get the offset of the window from the top of the page.
    	var windowPos = $(window).scrollTop();

    	// Get the height of the window.
    	var windowHeight = $(window).height();

    	// Can we delete this?
    	var docHeight = $(document).height();

		// Loop through all nav bar links.
    	for(var i = 0; i < aArray.length; i++) {
    		// Get the link from the array.
    		var theID = aArray[i];

    		// Get the offset of the div from the top of the page.
    		var divPos = $(theID).offset().top;

    		// Fix for navBar height.
    		divPos = divPos - 50;

    		// Get the height of the div in question.
    		var divHeight = $(theID).height();

    		// Correction for our previous adjustment so that the end of the div is calculated properly.
    		divHeight = divHeight + 50;

    		// $('#test').text("scroll: " + windowPos + " win height: " + windowHeight + " doc height: " + docHeight);

			/*
				If the user has scrolled to the bottom of the screen, highlight and underline the contact link in the nav bar
				and remove the highlight and underline from all the other links.

				Otherwise, remove the highlight and underline from the contact link in the nav bar. Futhermore, if the view port
				is between the top and bottom of the div, highlight and underline its nav bar link. Remove the highlight and underline
				from all the other links whose corresponding divs are not shown on the screen.
			*/
			if((windowPos + windowHeight) == docHeight) {
				$("a[href=" + theID + "]").removeClass("active");
    			$("a[href=" + theID + "]").removeClass("underline");

				$("a[href='#footer']").addClass("active");
				$("a[href='#footer']").addClass("underline");
			} else {
				$("a[href='#footer']").removeClass("active");
				$("a[href='#footer']").removeClass("underline");

    			if(windowPos >= divPos && windowPos < (divPos + divHeight)) {
    				$("a[href=" + theID + "]").addClass("active");
    				$("a[href=" + theID + "]").addClass("underline");
    			} else {
    				$("a[href=" + theID + "]").removeClass("active");
    				$("a[href=" + theID + "]").removeClass("underline");
    			}
			}
    	}
    });
});

/**
	Animates scrolling to each section.

	Code from Valentin Sarychev.
	http://jsfiddle.net/dizel3d/1eamwt4e/
*/

// Handle links starting with '#' only
$(document).on('click', 'a[href^="#"]', function(e) {
	// Target element ID
	var id = $(this).attr('href');

	// Target element
	var $id = $(id);
	if($id.length == 0) {
		return;
	}

	// Prevent standard hash navigation (avoid blinking in IE)
	e.preventDefault();

	// Top position relative to the document
	var pos = $id.offset().top;

	// Animated top scrolling
	$('body, html').animate({scrollTop: pos}, 500);
});

/*
	Opens a popup to get the user's name, email, phone number, and ask them
	how they heard about us.
*/
// $('.infoButton').on('click', function() {
	// $('#infoFormPopup').css("display", "block");
// });

/*
	Closes the information popup.
*/
// $('.infoFormClose').on('click', function() {
	// $('#infoFormPopup').css("display", "none");
// });
