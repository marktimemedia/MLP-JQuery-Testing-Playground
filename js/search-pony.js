(function($){	

/* Expanding Search Bar */

	function switchToggle() {
		var bodyWrap = $('#site-wrapper'); // body
		var headerWrap = $('.site_title'); // only because header is outside of site wrap
		var searchToggle = $('.sample_search_toggle'); // button
		var searchBar = $('#sample-searchbar'); // search

	    $(document).on('click', '.run_toggle', function(){ // if toggle is closed, click button or to open
	    	bodyWrap.addClass('search_open');
	    	headerWrap.addClass('search_open');
	    	searchToggle.removeClass('run_toggle');
	    	searchBar.addClass('search_expanded');
	    });

	    $(document).on('click', '.search_open', function(){ // if toggle is open, close by clicking anywhere on the body
	    	bodyWrap.removeClass('search_open');
	    	headerWrap.removeClass('search_open');
	    	searchToggle.addClass('run_toggle');
	    	searchBar.removeClass('search_expanded');
	    });
   }

	switchToggle();

})(jQuery);