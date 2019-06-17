/*
Name: Toggle Searchbar
Author: Marktime Media
Author URI: http://marktimemedia.com
Version: 0.2
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

(function($){	

/* Expanding Search Bar */

	function switchToggle() {
		var bodyWrap = $('#site-wrapper'); // body
		var headerWrap = $('.site-title'); // only use if header is outside of site wrap
		var searchToggle = $('.sample-search-toggle'); // button
		var searchBar = $('#sample-searchbar'); // search
		var search = $('#sample-searchbar .search-input'); // search input

	    $(document).on('click', '.run-toggle', function(){ // if toggle is closed, click button or to open
	    	bodyWrap.addClass('search-open');
	    	headerWrap.addClass('search-open'); // only use if header is outside of site wrap
	    	searchToggle.removeClass('run-toggle').addClass('search-open');
	    	searchBar.addClass('search-expanded');
	    	search.focus();
	    });

	    $(document).on('click', '.search-open', function(){ // if toggle is open, close by clicking anywhere on the body
	    	bodyWrap.removeClass('search-open');
	    	headerWrap.removeClass('search-open');
	    	searchToggle.addClass('run-toggle').removeClass('search-open');
	    	searchBar.removeClass('search-expanded');
	    });
   }

	switchToggle();

})(jQuery);