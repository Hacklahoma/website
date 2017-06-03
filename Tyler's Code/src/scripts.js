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
document.body.onscroll = function() {fixNavBar()};

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
