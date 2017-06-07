// 
//  This file contains any scripts that will be run on the Hacklahoma website.
//
//  scripts.js
//  HacklahomaWebsite
//  
//  Created by Tyler Walker on 2017-06-01.
//  Copyright 2017 Tyler Walker and Hacklahoma. All rights reserved.
// 

// Execute fixNavBar() when the window is scrolled. 
document.body.onscroll = function() {highlightCurrentSection();};

/*
	Fixes the navBar at the top of the screen when the user's screen is 
	in the content section, and at the bottom of the header when it isn't.
*/
$(document).ready(function() {
	var stickyNavTop = $('#navBar').offset().top;
	
	var stickyNav = function() {
		var scrollTop = $(window).scrollTop();
		
		if(scrollTop > stickyNavTop) {
			$('#navBar').addClass('fixed');
		} else {
			$('#navBar').removeClass('fixed');
		}
	};
	
	stickyNav();
	
	$(window).scroll(function() {
		stickyNav();
	});
});

/*
	Highlights the link in the navbar of the section currently displayed on the
	user's screen.
*/
function highlightCurrentSection() {
	// The position of the page where the user has scrolled.
	var scrollTop = document.body.scrollTop;
	
	// The top of the About section.
	var aboutTop = document.getElementById("about").getBoundingClientRect().top + scrollTop;
	
	// The top of the FAQ section.
	var faqTop = document.getElementById("faq").getBoundingClientRect().top + scrollTop;
	
	// The top of the Agenda section.
	var agendaTop = document.getElementById("agenda").getBoundingClientRect().top + scrollTop;
	
	// The top of the Sponsors section.
	var sponsorsTop = document.getElementById("sponsors").getBoundingClientRect().top + scrollTop;
	
	// The top of the Judges section.
	var judgesTop = document.getElementById("judges").getBoundingClientRect().top + scrollTop;
	
	// Make the link active based on the section the user is looking at.
	if(scrollTop < aboutTop) {
		$("a[id='aboutLink']").removeClass('active');
	}
	if(scrollTop >= aboutTop && scrollTop < faqTop) {
		$("a[id$='Link']").removeClass('active');
		document.getElementById("aboutLink").className = "active";
	} else if(scrollTop >= faqTop && scrollTop < agendaTop) {
		$("a[id$='Link']").removeClass('active');
		document.getElementById("faqLink").className = "active";
	} else if(scrollTop >= agendaTop && scrollTop < sponsorsTop) {
		$("a[id$='Link']").removeClass('active');
		document.getElementById("agendaLink").className = "active";
	} else if(scrollTop >= sponsorsTop && scrollTop < judgesTop) {
		$("a[id$='Link']").removeClass('active');
		document.getElementById("sponsorsLink").className = "active";
	} else if(scrollTop >= judgesTop) {
		$("a[id$='Link']").removeClass('active');
		document.getElementById("judgesLink").className = "active";
	}
}

function resizeHeader() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	$('#header').css(width, windowWidth);
	$('#header').css(height, windowHeight);
}

/*
	Animate scrolling to each section.
	
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
