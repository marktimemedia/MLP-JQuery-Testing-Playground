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



/* Scroll Header */

	var lastScrollTop = $(window).scrollTop(); // reset variable any time it reloads

	$(window).on('scroll', (function(event) {
		var siteHeader = $('.site_header');
		var siteTitle = $('.site_title');
		var contentTop = $('#site-wrapper');
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



/* Read More - Articles */

	$('.read_more').on('click', function() {
		if(!$(this).hasClass('read_less')){
			$(this).addClass('read_less').html
			$(this).html('Read Less');
		} else {
			$(this).removeClass('read_less');
			$(this).html('Read More');
		}
		$(this).parent().siblings('.article_more').slideToggle();
	});


/* Magic Gallery Divs */

	var imgPerRow;
	var rowNumber;

	// assign images to rows
	function calcImgsInRow() {
		 imgPerRow = 0; // number of images per row 
		 rowNumber = 1; // which row we are on

		 $('.gallery_image').each(function(){

		 	if($(this).prev().length > 0){

		 		if($(this).position().top != $(this).prev().position().top) { // if this image is not next to previous image
		 			return false;
		 		}
		 		imgPerRow++;  

	        } else {
	        	imgPerRow++;
	        }
		 });

		$('.gallery_image').each(function(i){
			$(this).addClass("img-row-" + ((i%imgPerRow)+1)); // add descriptive class
		  });

	}

	// add the wrapper div for dynamic rows
	function wrapperRow() {
		var rowImgs = $('.gallery_image');
		var tempRow = $('.gallery_dynamic_row');

		if (tempRow.length > 0) { // get rid of wrapper if it exists
			$('.gallery_image').unwrap();
		}

		for(var i = 0; i < rowImgs.length; i+=imgPerRow) { // create the wrapper div based on images per row
			// console.log('expected images per row ' + imgPerRow);
			rowImgs.slice(i, i+imgPerRow).wrapAll('<div class="gallery_dynamic_row"></div>'); 
		}

		$('.gallery_dynamic_row').each(function(i){ // add data-row attribute
			$(this).attr('data-row', (i+1));
		});

	}

	// remove expanded content on resize so it doesn't jump to the bottom, possibly change this later to dynamically move itself instead
	function contentOnResize() {
		var expandedExists = $('.expanded_gallery_single');

		if(expandedExists.length > 0) {
			expandedExists.remove();
		}
	}


	calcImgsInRow();
	wrapperRow();
	$(window).resize(function(){
		calcImgsInRow();
		wrapperRow();
		contentOnResize();
	});

	// opening content on image click

	var sampleRowNumberOld = 0; // original value for "old" row

	$('.gallery_image').on('click', function() {
		
		var $fullContent = $(this).children('.gallery_full_content').html(); // content in DOM associated with current image
		var $wrapperDiv = $(this).parent('.gallery_dynamic_row'); // current image wrapper row
		var uid = $(this).data('uid'); // current image data-uid attr
		var expandedUid = $('.expanded_gallery_single').data('uid'); // current expanded div data-uid attr
		var sampleRowNumber = $wrapperDiv.data('row'); // current image wrapper row data-row attr

		// clicked the same image twice (close)
		if(uid === expandedUid) { // image data-uid is the same as expanded data-uid

			// console.log('step 2, close and change uid');

			$( '.expanded_gallery_single' ).removeClass( 'animate_show' ).data( 'uid', 0 ); // hide and reset data-uid to 0

		// clicked a different image in same row (switch content)
		} else if(0 < expandedUid && uid !== expandedUid && sampleRowNumber === sampleRowNumberOld) { // expanded data-uid has been set, and is not the same as current, and is in the same row
			
			// console.log('step 3, same row switch content');

			$fullContent = $(this).children('.gallery_full_content').html(); // grab content associated with this image
			$('.expanded_gallery_single').html($fullContent); // switch content
			$( '.expanded_gallery_single' ).data( 'uid', uid ); // change data-uid to match current img

		// clicked a different image in a new row (open)
		} else if( 0 < expandedUid && uid !== expandedUid && sampleRowNumber !== sampleRowNumberOld ) { // expanded data-uid has been set, and is not the same as current, and is in different row
			
			// console.log('step 4, remove, new row, open');

			$( '.expanded_gallery_single' ).removeClass( 'animate_show' ).data( 'uid', 0 ); // hide and reset data-uid to 0
			$('.expanded_gallery_single').remove(); // remove div + content to reset
			$wrapperDiv.after('<div class="expanded_gallery_single" data-uid="' + uid + '">' + $fullContent + '</div>'); // create div and add content
			$('.expanded_gallery_single').slideDown('slow'); // animate
			$('.expanded_gallery_single').addClass('animate_show');
			sampleRowNumberOld = sampleRowNumber; // set old row number to current row number

		// clicked the image (open)
		} else { // expandedUid = 0 or undefined, or all other circumstances 
			
			// console.log('step 1, remove, add, and open');

			$('.expanded_gallery_single').remove(); // remove div + content to reset
			$wrapperDiv.after('<div class="expanded_gallery_single" data-uid="' + uid + '">' + $fullContent + '</div>'); // create div and add content
			$('.expanded_gallery_single').slideDown('slow'); // animate
			$('.expanded_gallery_single').addClass('animate_show');
			sampleRowNumberOld = sampleRowNumber; // set old row number to current row number
		}

	});

})(jQuery);

