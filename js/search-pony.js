(function($){	

/* Expanding Search Bar */

	function switchToggle() {
		var bodyWrap = $('#site-wrapper'); // body
		var headerWrap = $('.site-title'); // only because header is outside of site wrap
		var searchToggle = $('.sample-search-toggle'); // button
		var searchBar = $('#sample-searchbar'); // search

	    $(document).on('click', '.run-toggle', function(){ // if toggle is closed, click button or to open
	    	bodyWrap.addClass('search-open');
	    	headerWrap.addClass('search-open');
	    	searchToggle.removeClass('run-toggle');
	    	searchBar.addClass('search-expanded');
	    });

	    $(document).on('click', '.search-open', function(){ // if toggle is open, close by clicking anywhere on the body
	    	bodyWrap.removeClass('search-open');
	    	headerWrap.removeClass('search-open');
	    	searchToggle.addClass('run-toggle');
	    	searchBar.removeClass('search-expanded');
	    });
   }

	switchToggle();

})(jQuery);