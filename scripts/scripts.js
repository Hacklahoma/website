// 
//  This file contains any scripts that will be run on the Hacklahoma website.
//
//  scripts.js
//  HacklahomaWebsite
// 

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
		
		if(scrollTop > stickyNavTop) {
			$('#navBar').addClass('fixed');
		} else {
			$('#navBar').removeClass('fixed');
		}
	};
	
	stickyNav();
	
	$(window).on({
		scroll: function() {
			stickyNav();
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
    var aChildren = $("a[id$='Link']").toArray();
    
    var aArray = []; // create the empty aArray
    for(var i = 0; i < aChildren.length; i++) {
    	var aChild = aChildren[i];
    	var ahref = $(aChild).attr('href');
    	aArray.push(ahref);
    } // this for loop fills the aArray with attribute href values
    
    $(window).scroll(function() {
    	var windowPos = $(window).scrollTop(); // get the offset of the window from the top of the page
    	var windowHeight = $(window).height(); // get the height of the window
    	var docHeight = $(document).height();
    	
    	for(var i = 0; i < aArray.length; i++) {
    		var theID = aArray[i];
    		var divPos = $(theID).offset().top; // get the offset of the div from the top of the page
    		divPos = divPos - 50; // fix for navBar height
    		var divHeight = $(theID).height(); // get the height of the div in question
    		divHeight = divHeight + 50; // correction for our previous adjustment so that the end of the div is calculated properly
    		
    		if(windowPos >= divPos && windowPos < (divPos + divHeight)) {
    			$("a[href=" + theID + "]").addClass("active");
    			$("a[href=" + theID + "]").addClass("underline");
    		} else {
    			$("a[href=" + theID + "]").removeClass("active");
    			$("a[href=" + theID + "]").removeClass("underline");
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
$('.infoButton').on('click', function() {
	$('#infoFormPopup').css("display", "block");
});

/*
	Closes the information popup.
*/
$('.infoFormClose').on('click', function() {
	$('#infoFormPopup').css("display", "none");
});
