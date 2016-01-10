(function($){
	  	
/* Scroll Header */

	var lastScrollTop = $(window).scrollTop(); // reset variable any time it reloads
	//var siteHeader = $('.site_header');
	var siteTitle = $('.site_title');
	//var contentTop = $('#site-wrapper');
	var changeDirection = -1; // base comparitive variable

	$(window).on('scroll', (function(event) {
		var scrollPosition = $(this).scrollTop();

		if($(window).width() > 488 ) { // we're mobile first so this is anything larger than our mobile breakpoint

			if (scrollPosition > 180) { // once you get far enough down, shrink the header
		    	
		        siteTitle.addClass('site_title_small'); 

		    } else { // bring it back up again when we get back to the top

		    	siteTitle.removeClass('site_title_small');
		    }

		} else { // this is mobile breakpoint or smaller

			if (scrollPosition > 120 && scrollPosition > lastScrollTop) { // once you get far enough down, hide the header
		    	
		    	changeDirection = -1; // reset changeDirection
		        siteTitle.addClass('site_title_small'); 

		    } else { // bring it back up again if we scroll up at all

		    	if ( -1 == changeDirection) {
		    		changeDirection = scrollPosition; // only set changeDirection once
		    	}

		    	console.log(changeDirection + ' ' + scrollPosition);

		    	if ( scrollPosition < (changeDirection - 100) ) { // only add after you've scrolled up a bit

			    	siteTitle.removeClass('site_title_small');
			    	changeDirection = -1; // reset changeDirection
				}

		    }

		    lastScrollTop = scrollPosition;

		}

	}));


})(jQuery);