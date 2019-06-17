/*
Name: Full Screen Feature
Author: Marktime Media
Author URI: http://marktimemedia.com
Version: 0.1
License: GPLv2
 
 This program is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License version 2,
 as published by the Free Software Foundation.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
 GNU General Public License for more details.
 
 The license for this software can likely be found here:
 http://www.gnu.org/licenses/gpl-2.0.html
*/

(function( $ ){

/* Feature Image */

	function setHeight() {
		var windowHeight = $(window).innerHeight() - 140;
		var windowMobile = $(window).innerHeight() - 100;

		if($(window).width() > 488 ) { // use height minus tall header
			$('#sample-feature-home').css('height', windowHeight);
		} else { // use height minus short header
			$('#sample-feature-home').css('height', windowMobile);
		}
	}

	$(document).ready(function(){
		setHeight();
	  
		$(window).resize(function() {
	  		setHeight();
  		});

	});

})( jQuery );