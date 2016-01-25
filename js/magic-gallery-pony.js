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
            $rowImgs = $(rowImgSelector),
            $tempRow = $(tempRowSelector),
            $expandedExists = $(expandedExistsSelector),
            $window = $(window),
            $document = $(document),
            $body = $("body"),
            oldWidth = 0,
            sampleRowNumberOld = 0; // original value for "old" row
            
        // run immediately
        calcImgsInRow();
        
        // run on window load
        $window.load(function(){ // get window width on load and save
            oldWidth = $(window).width();
        
            //console.log('starting width= ' + oldWidth);
        });
        
        // run on window resize    
        $window.on('resize', function(e){

            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function(){     // wait until we're done resizing to do these things
                var newWidth = $(window).width();         // get current window width

                if(oldWidth != newWidth){             // only do these things if width has changed (not height)

                    calcImgsInRow();     // recalc images per row
                    contentOnResize();     // hide content
                    unWrapRow();         // kill wrapper and wrap all images together

                    // console.log('resized width=' + oldWidth + ' new width= '+ newWidth );
                }

                oldWidth = newWidth;

            }, 300);

        });
        
        // run the magic function on click
        $document.on('click', rowImgSelector, function() { 
            wrapperRow( tempRowClass );
            do_the_magic($(this));
        });

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

        // assign images to rows
        function calcImgsInRow() {
            
            imgPerRow = 0; // number of images per row 
            rowNumber = 1; // which row we are on
            var $rowImgs = $(rowImgSelector);

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

            var $rowImgs = $(rowImgSelector);

            if ($rowImgs.parent().is(tempRowSelector)) { // get rid of wrapper if it exists
                $rowImgs.unwrap();
            }

            for(var i = 0; i < $rowImgs.length; i+=imgPerRow) { // create the wrapper div based on images per row
                $rowImgs.slice(i, i+imgPerRow).wrapAll('<div class="' + tempRowClass +'"></div>'); 
            }

            $(tempRowSelector).each(function(i){ // add data-row attribute
                $(this).attr('data-row', (i+1));
            });

        }

        // unwrap on resize
        function unWrapRow() { 
            // this will unwrap all elements with the class matching rowImgSelector
            // so make sure this is a unique class not being used elsewhere
            var $rowImgs = $(rowImgSelector); 

            $rowImgs.unwrap();
            $rowImgs.wrapAll('<div class="' + tempRowClass +'"></div>'); 

        }

        // remove expanded content on resize so it doesn't jump to the bottom
        // possibly change this later to dynamically move itself instead
        function contentOnResize() {
            var $expandedExists = $(expandedExistsSelector);

            if($expandedExists.length > 0) {

                $expandedExists.remove();
            }
        }
    
        function do_the_magic($thisObj) {

            var expandedExistsSelector = '.expanded-gallery-single';                // needs to be reset here
            var contentString = '.gallery-full-content';                        // the class of the DOM object that contains the content
        
            var $fullContent = $thisObj.children(contentString).html();         // content in DOM associated with current image
            var $wrapperDiv = $thisObj.parent(tempRowSelector);                     // current image wrapper row
            var uid = $thisObj.data('uid');                                     // current image data-uid attr
            var expandedUid = $(expandedExistsSelector).data('uid');                 // current expanded div data-uid attr
            var sampleRowNumber = $wrapperDiv.data('row');                         // current image wrapper row data-row attr

        // clicked the same image twice (close)
            if(uid === expandedUid) { // image data-uid is the same as expanded data-uid

                $( expandedExistsSelector ).removeClass( 'animate_show' ).data( 'uid', 0 ); // hide and reset data-uid to 0
                // console.log('step 1');

        // clicked a different image in same row (switch content)
            } else if(0 < expandedUid && uid !== expandedUid && sampleRowNumber === sampleRowNumberOld) { // expanded data-uid has been set, and is not the same as current, and is in the same row

                $fullContent = $thisObj.children(contentString).html(); // grab content associated with this image, right now a child of the object clicked
                $(expandedExistsSelector).html($fullContent); // switch content
                $( expandedExistsSelector ).data( 'uid', uid ); // change data-uid to match current img
                // console.log('step 2');

        // clicked a different image in a new row (open)
            } else if( 0 < expandedUid && uid !== expandedUid && sampleRowNumber !== sampleRowNumberOld ) { // expanded data-uid has been set, and is not the same as current, and is in different row

                $( expandedExistsSelector ).slideUp().data( 'uid', 0 ); // hide and reset data-uid to 0
                $(expandedExistsSelector).remove(); // remove div + content to reset
                $wrapperDiv.after('<div class="' + existsClass +'" data-uid="' + uid + '">' + $fullContent + '</div>'); // create div and add content
                $(expandedExistsSelector).slideDown('slow'); // animate
                $(expandedExistsSelector).addClass('animate_show');
                sampleRowNumberOld = sampleRowNumber; // set old row number to current row number
                // console.log('step 3');

        // clicked the image (open)
            } else { // expandedUid = 0 or undefined, or all other circumstances 

                $(expandedExistsSelector).remove(); // remove div + content to reset
                $wrapperDiv.after('<div class="'+ existsClass +'" data-uid="' + uid + '">' + $fullContent + '</div>'); // create div and add content
                $(expandedExistsSelector).slideDown('slow'); // animate
                $(expandedExistsSelector).addClass('animate_show');
                sampleRowNumberOld = sampleRowNumber; // set old row number to current row number
                // console.log('step 4');
            }

        }

    }

})( jQuery );