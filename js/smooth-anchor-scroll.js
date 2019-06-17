/* 
Smooth Scroll to Anchor
From https://css-tricks.com/snippets/jquery/smooth-scrolling/
Modified to work with mobile menu
*/

(function( $ ){

	$('a.smooth-animate[href*="#"]').on('click', function() {

      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        
        if (target.length) {
          
          $('html,body').animate({
            scrollTop: target.offset().top-100
          }, 1000);
          return false;

        }
      }
  
  });
  
})( jQuery );