/*
Name: Magic Gallery
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
    "use strict";
    
    if ( typeof $ === "undefined" ) {
        // If jQuery isn't defined, we can exit rather than attempt to do anything against an interface that doesn't exist.
        return;
    }
    
    // Set up behaviors and leave the definitions for later, which makes this code a bit easier to read.
    // By waiting until document ready, we can ensure that even if this script is loaded in the header, the selectors for body content will be in place before the code is executed.
    $(document).ready( initMagicGallery );

    // Function definitions
    /* Magic Gallery Divs */

    function initMagicGallery() {
        var imgPerRow,
            rowNumber,
            resizeTimer,
            rowImgClass = 'gallery-image', // must be a unique class, not used elsewhere on the page
            tempRowClass = 'gallery-dynamic-row',
            existsClass = 'expanded-gallery-single',
            rowImgSelector = '.' + rowImgClass,
            tempRowSelector = '.' + tempRowClass,
            expandedExistsSelector = '.' + existsClass,
            // Preserve our jQuery objects that we reuse rather than rebuilding them regularly.
            $rowImgs = $(rowImgSelector), // We should only need to recalculate the jQuery objects when we know they could have changed, don't recalculate more often for better performance.
            $tempRow = $(tempRowSelector),
            $expandedExists = $('<div class="' + existsClass +'"></div>'),
            $window = $(window),
            $document = $(document),
            $body = $("body"),
            windowWidth,
            sampleRowNumberOld = 0; // original value for "old" row
            
        // Run our initial setup and calculations immediately.
        calculatePositions();

        $window.on( 'resize', debouncedResize );
            
        $document.on( 'click', rowImgSelector, rowImageClicked );
        
        // Run the setup and calculation of positions and data for the gallery.
        function calculatePositions() {
            var newWidth = $(window).width();
            
            if ( windowWidth !== newWidth ) {
                calcImgsInRow();
                contentOnResize();
                unWrapRow();
                windowWidth = newWidth;
                //console.log('new width= ' + windowWidth);
            }
        
        }

        // assign images to rows
        function calcImgsInRow() {
            imgPerRow = 0; // number of images per row 
            
            if ( $rowImgs.length > 0 ) {
                $rowImgs.each( setupRowImage );
                // console.log('expected images per row ' + imgPerRow);
            }
        }
        
        function setupRowImage( index, element ) {
            var $element = $(element),
                $prevElement = $element.prev();
                
            // Reset on the first item
            if ( index === 0 ) {
                imgPerRow = 0;
                rowNumber = 1;
            }

            // If this element is not next to the previous image, skip ahead.
            if ( $prevElement.length > 0 && $element.offset().top !== $prevElement.offset().top ) {
                rowNumber ++;
                imgPerRow = 0;
            }
            else {
                imgPerRow++;
            }
            
            setImgRowClass( $element, rowNumber );
        }
        
        function setImgRowClass( $rowImage, rowNum ) {
            $rowImage
                .removeClass( removeImgRowClasses )
                .addClass( "img-row-" + rowNum );
        }
        
        function removeImgRowClasses( index, css ) {
            return ( css.match( /(^|\s)img-row-\S+/g ) || []).join( ' ' );
        }

        // remove expanded content on resize so it doesn't jump to the bottom
        // possibly change this later to dynamically move itself instead
        function contentOnResize() {
            if($expandedExists.length > 0) {
                $expandedExists.remove();
                $expandedExists = $(expandedExistsSelector );
            }
        }

        // add the wrapper div on click for dynamic rows
        function wrapperRow() {
            if ( $rowImgs.parent().is( tempRowSelector ) ) {
                // get rid of wrapper if it exists
                $rowImgs.unwrap();
            }

            for( var i = 0; i < $rowImgs.length; i += imgPerRow ) { // create the wrapper div based on images per row
                $rowImgs.slice( i, i + imgPerRow).wrapAll( '<div class="' + tempRowClass +'"></div>' ); 
            }

            $( tempRowSelector ).each( setRowData );
        }
        
        function setRowData( index, element ) {
            // add data-row attribute
            $(element).data('row', ( index + 1 ) );
        }

        // unwrap on resize
        function unWrapRow() { 
            // this will unwrap all elements with the class matching rowImgSelector
            // so make sure this is a unique class not being used elsewhere
            
            $rowImgs.unwrap();
            $rowImgs.wrapAll('<div class="' + tempRowClass +'"></div>'); 

        }
        
        function debouncedResize( windowResizeEvent ) {
            var debouncedResizeTimeoutMs = 300;
            
            if ( resizeTimer ) {
                // If we've already set a timeout, clear it first.
                clearTimeout(resizeTimer);
            }
            
            // Debounce this so we have a maximum frequency on calls to check our resize behavior.
            resizeTimer = setTimeout( calculatePositions, debouncedResizeTimeoutMs );
        }

        function rowImageClicked( clickEvent ) {
            var $clickedImg = $(this);
            
            wrapperRow();
            
            updateExpanderState( $clickedImg );
        }

        function updateExpanderState( $clickedImage ) {
            var $wrapperDiv = $clickedImage.parent(tempRowSelector), // current image wrapper row
                uid = $clickedImage.data('uid'), // current image data-uid attr
                expandedUid = $expandedExists.data('uid'), // current expanded div data-uid attr
                sampleRowNumber = $wrapperDiv.data('row'); // current image wrapper row data-row attr

            if ( uid === expandedUid || sampleRowNumber !== sampleRowNumberOld ) {
                // Clicked the same image again, or clicked an image in a different row (close the expander)
                // clicked the same image twice (close)
                closeExpander();
                // console.log('step 1');
            }
            
            if ( uid !== expandedUid ) {
                // Clicked an image that is not already expanded
                openExpander( $clickedImage );
            }
        }
        
        function closeExpander() {
            $expandedExists
                .slideUp()
                .removeClass( "animate_show" )
                .data( 'uid', 0 )
                .empty();
        }
        
        function openExpander( $clickedImage ) {
            var $wrapperDiv = $clickedImage.parent( tempRowSelector ),
                contentSelector = ".gallery-full-content",
                rowNumber = $wrapperDiv.data( "row" );
                
            if ( rowNumber !== sampleRowNumberOld ) {
                $wrapperDiv.after( $expandedExists );
                sampleRowNumberOld = rowNumber;
            }
            
            $expandedExists
                .html( $clickedImage.children( contentSelector ).html() )
                .data( 'uid', $clickedImage.data( 'uid' ) );
            
            if ( ! $expandedExists.hasClass( "animate_show" ) ) {
                $expandedExists
                    .slideDown( 'slow' )
                    .addClass( 'animate_show' );
            }
        }
        
        /** This content preserved as existed, unmodified, from original source. Moved to bottom to better expose functioning code above. **/
        // Ajax for See More Work content in WordPress
        // $count = 2;
        // var $rowImgs = $(rowImgSelector);
        // var gethref = $('#seeMoreWork').attr('href');
        // var container = $('.work_container');
        // var clicktrigger = $('#seeMoreWork');
        // var totalposts = clicktrigger.attr('data-posts'); 
        // var paged = 8; // how many posts per page (defined in php)
        // var remainingposts = totalposts - paged; // how many posts remain after loading the next page

        // clicktrigger.attr('href', gethref + $count); // create paged url with jquery


        // clicktrigger.on('click', function(e){
        
        //     e.preventDefault();

        //     var geturl = $(this).attr('href'); // url of selected button
        

        //     $.ajax({
        //         url: geturl, 
        //         dataType: 'html',
        //         beforeSend: function(){
        //             container.addClass('tempload');
        //         },
        //         success: function(data){
        //             $rowImgs.unwrap(); // unwrap everything to make sure it loads inline
        //             $(expandedExistsSelector).remove(); // in case this content exists, get rid of it
        //             container.removeClass('tempload');
        //             var newload = $(data).find('#gallery-paged').html(); // find the div within the loaded data
        //             container.append(newload); // add div content to the end of the content in this div
        //             $rowImgs.wrapAll('<div class="gallery-dynamic-row"></div>'); // rewrap it all so it works
        //             calcImgsInRow();

        //             totalposts = remainingposts;

        //             $count++;

        //             if( remainingposts < paged ){ // if there is less than a page full of posts left, hide the more button
        //                 clicktrigger.addClass('hide');
        //             }

        //             remainingposts = totalposts - paged; // reset totalposts to remainingposts

        //             clicktrigger.attr('href', gethref + $count); // new paged url

        //         }
        //     });


        // });
    }

})( jQuery );