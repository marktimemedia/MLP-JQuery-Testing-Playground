(function($){
	  	
/* Scroll Header */

	var lastScrollTop = $(window).scrollTop(); // reset variable any time it reloads
	var siteHeader = $('.site_header');
	var siteTitle = $('.site_title');
	var contentTop = $('#site-wrapper');

	$(window).on('scroll', (function() {
		var scrollPosition = $(this).scrollTop();

		if($(window).width() > 488 ) { // we're mobile first so this is anything larger than our mobile breakpoint

			if (scrollPosition > 180) { // once you get far enough down, shrink the header
		    	
		        siteTitle.addClass('site_title_small'); 

		    } else { // bring it back up again when we get back to the top

		    	siteTitle.removeClass('site_title_small');
		    }

		} else { // this is mobile breakpoint or smaller

			if (scrollPosition > 50 && scrollPosition > lastScrollTop) { // once you get far enough down, hide the header
		    	
		        siteTitle.addClass('site_title_small'); 

		    } else { // bring it back up again if we scroll up at all

		    	siteTitle.removeClass('site_title_small');
		    }

		    lastScrollTop = scrollPosition;

		}

	}));


})(jQuery);