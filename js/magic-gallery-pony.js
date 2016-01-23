(function( $ ){

/* Magic Gallery Divs */

	var imgPerRow;
	var rowNumber;

	var rowImgString = '.gallery-image';
	var tempRowClass = 'gallery-dynamic-row';
	var existsClass = 'expanded-gallery-single'

	var tempRowString = '.' + tempRowClass;
	var expandedExistsString = '.' + existsClass;

	var $rowImgs = $(rowImgString);
	var $tempRow = $(tempRowString);
	var $expandedExists = $(expandedExistsString);

	// assign images to rows
    function calcImgsInRow() {
         imgPerRow = 0; // number of images per row 
         rowNumber = 1; // which row we are on
         var $rowImgs = $(rowImgString);

         $rowImgs.each(function(){

            var $calcThis = $(this);

            if($calcThis.prev().length > 0){

                if($calcThis.offset().top !== $calcThis.prev().offset().top) { // if this image is not next to previous image
                    return false;
                }
                imgPerRow++;  

            } else {
                imgPerRow++;
            }
         });

        $rowImgs.each(function(i){

            var $calcThis = $(this);

            $calcThis.removeClass (function (index, css) {
                return (css.match (/(^|\s)img-row-\S+/g) || []).join(' ');
            });
            $calcThis.addClass("img-row-" + ((i%imgPerRow)+1)); // add descriptive class
          });

        // console.log('expected images per row ' + imgPerRow);

    }


	// add the wrapper div on click for dynamic rows
	function wrapperRow() {

		var $rowImgs = $(rowImgString);

		if ($rowImgs.parent().is(tempRowString)) { // get rid of wrapper if it exists
			$rowImgs.unwrap();
		}

		for(var i = 0; i < $rowImgs.length; i+=imgPerRow) { // create the wrapper div based on images per row
			$rowImgs.slice(i, i+imgPerRow).wrapAll('<div class="' + tempRowClass +'"></div>'); 
		}

		$(tempRowString).each(function(i){ // add data-row attribute
			$(this).attr('data-row', (i+1));
		});

	}


// unwrap on resize
	function unWrapRow() { 
		var $rowImgs = $(rowImgString);

		$rowImgs.unwrap();
		$rowImgs.wrapAll('<div class="' + tempRowClass +'"></div>'); 

	}

	// remove expanded content on resize so it doesn't jump to the bottom, possibly change this later to dynamically move itself instead
	function contentOnResize() {
		var $expandedExists = $(expandedExistsString);

		if($expandedExists.length > 0) {

			$expandedExists.remove();
		}
	}

// run immediately
	calcImgsInRow();



	var oldWidth = 0;

// run on window load
	$(window).load(function(){ // get window width on load and save
		oldWidth = $(window).width();
		
		//console.log('starting width= ' + oldWidth);
	});



	var resizeTimer;

// run on window resize	
	$(window).on('resize', function(e){

		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){ 	// wait until we're done resizing to do these things

			newWidth = $(window).width(); 		// get current window width

			if(oldWidth != newWidth){ 			// only do these things if width has changed (not height)

				calcImgsInRow(); 	// recalc images per row
				contentOnResize(); 	// hide content
				unWrapRow(); 		// kill wrapper and wrap all images together
				
				// console.log('resized width=' + oldWidth + ' new width= '+ newWidth );
			}

			oldWidth = newWidth;

		}, 300);

	});


// magic function for opening content on image click
	var sampleRowNumberOld = 0; // original value for "old" row
	
	function do_the_magic($thisObj) {

		var expandedExistsString = '.expanded-gallery-single';					// needs to be reset here
		var contentString = '.gallery-full-content';							// the class of the DOM object that contains the content
		
		var $fullContent = $thisObj.children(contentString).html(); 			// content in DOM associated with current image
		var $wrapperDiv = $thisObj.parent(tempRowString); 						// current image wrapper row
		var uid = $thisObj.data('uid'); 										// current image data-uid attr
		var expandedUid = $(expandedExistsString).data('uid'); 					// current expanded div data-uid attr
		var sampleRowNumber = $wrapperDiv.data('row'); 							// current image wrapper row data-row attr

	// clicked the same image twice (close)
		if(uid === expandedUid) { // image data-uid is the same as expanded data-uid

			$( expandedExistsString ).removeClass( 'animate_show' ).data( 'uid', 0 ); // hide and reset data-uid to 0
			// console.log('step 1');

	// clicked a different image in same row (switch content)
		} else if(0 < expandedUid && uid !== expandedUid && sampleRowNumber === sampleRowNumberOld) { // expanded data-uid has been set, and is not the same as current, and is in the same row

			$fullContent = $thisObj.children(contentString).html(); // grab content associated with this image, right now a child of the object clicked
			$(expandedExistsString).html($fullContent); // switch content
			$( expandedExistsString ).data( 'uid', uid ); // change data-uid to match current img
			// console.log('step 2');

	// clicked a different image in a new row (open)
		} else if( 0 < expandedUid && uid !== expandedUid && sampleRowNumber !== sampleRowNumberOld ) { // expanded data-uid has been set, and is not the same as current, and is in different row

			$( expandedExistsString ).slideUp().data( 'uid', 0 ); // hide and reset data-uid to 0
			$(expandedExistsString).remove(); // remove div + content to reset
			$wrapperDiv.after('<div class="' + existsClass +'" data-uid="' + uid + '">' + $fullContent + '</div>'); // create div and add content
			$(expandedExistsString).slideDown('slow'); // animate
			$(expandedExistsString).addClass('animate_show');
			sampleRowNumberOld = sampleRowNumber; // set old row number to current row number
			// console.log('step 3');

	// clicked the image (open)
		} else { // expandedUid = 0 or undefined, or all other circumstances 

			$(expandedExistsString).remove(); // remove div + content to reset
			$wrapperDiv.after('<div class="'+ existsClass +'" data-uid="' + uid + '">' + $fullContent + '</div>'); // create div and add content
			$(expandedExistsString).slideDown('slow'); // animate
			$(expandedExistsString).addClass('animate_show');
			sampleRowNumberOld = sampleRowNumber; // set old row number to current row number
			// console.log('step 4');
		}

	}


// Ajax for See More Work content in WordPress
	// $count = 2;
	// var $rowImgs = $(rowImgString);
	// var gethref = $('#seeMoreWork').attr('href');
	// var container = $('.work_container');
	// var clicktrigger = $('#seeMoreWork');
	// var totalposts = clicktrigger.attr('data-posts'); 
	// var paged = 8; // how many posts per page (defined in php)
	// var remainingposts = totalposts - paged; // how many posts remain after loading the next page

	// clicktrigger.attr('href', gethref + $count); // create paged url with jquery


	// clicktrigger.on('click', function(e){
		
	// 	e.preventDefault();

	// 	var geturl = $(this).attr('href'); // url of selected button
		

	// 	$.ajax({
	// 		url: geturl, 
	// 		dataType: 'html',
	// 		beforeSend: function(){
	// 			container.addClass('tempload');
	// 		},
	// 		success: function(data){
	// 			$rowImgs.unwrap(); // unwrap everything to make sure it loads inline
	// 			$(expandedExistsString).remove(); // in case this content exists, get rid of it
	// 			container.removeClass('tempload');
	// 			var newload = $(data).find('#gallery-paged').html(); // find the div within the loaded data
	// 			container.append(newload); // add div content to the end of the content in this div
	// 			$rowImgs.wrapAll('<div class="gallery-dynamic-row"></div>'); // rewrap it all so it works
	// 			calcImgsInRow();

	// 			totalposts = remainingposts;

	// 			$count++;

	// 			if( remainingposts < paged ){ // if there is less than a page full of posts left, hide the more button
	// 				clicktrigger.addClass('hide');
	// 			}

	// 			remainingposts = totalposts - paged; // reset totalposts to remainingposts

	// 			clicktrigger.attr('href', gethref + $count); // new paged url

	// 		}
	// 	});


	// });


// run the magic function on click

	$(document).on('click', rowImgString, function() { 
		wrapperRow( tempRowClass );
		do_the_magic($(this));
		
	});

})( jQuery );