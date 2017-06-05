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
document.body.onscroll = function() {fixNavBar(); highlightCurrentSection()};

/*
	Determines the location of the content pane dynamically based on the user's
	screen resolution.
*/
function determineContentPaneLocation() {
	// The content pane element.
	var contentPane = document.getElementById("contentPane");
	
	// The height of the window.
	var windowHeight = window.innerHeight;
	
	// Set the top of the content pane to be the window height (places at the bottom
	// of the window).
	contentPane.style.top = windowHeight + "px";
}

/*
	Determines the location of the footer dynamically based on the user's screen resolution.
*/
function determineFooterLocation() {
	// The footer element.
	var footer = document.getElementById("footer");
	
	// The height of the window.
	var windowHeight = window.innerHeight;
	
	// The height of the contentPane.
	var contentPaneHeight = document.getElementById("contentPane").clientHeight;
	
	// The total height of the window and the content pane.
	var totalHeight = windowHeight + contentPaneHeight;
	
	// Set the top of the footer to be the window height plus the height of the content pane
	// (places at the bottom of the content pane.)
	footer.style.top = totalHeight + "px";
}

/*
	Fixes the navBar at the top of the screen when the user's screen is 
	in the content section, and at the bottom of the header when it isn't.
*/
function fixNavBar() {
	// The scroll position of the page.
	var scrollTop = document.body.scrollTop;
	
	// The navBar element.
	var navBar = document.getElementById("navBar");
	
	// The height of the window, minus the height of the navBar.
	var windowHeight = window.innerHeight - navBar.clientHeight;
	
	// If the scroll position of the page is greater than the height of the window,
	// fix the nav bar at the top. Otherwise, keep it at the bottom of the header.
	if(scrollTop > windowHeight) {
		navBar.className = "fixed";
	} else {
		navBar.className = "absolute";
	}
}

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

/*
	Gets the top coordinate of the section passed in as the parameter.
*/
function getTopOfSection(el, scroll) {
	
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
