(function( $ ){

/* Feature Image */

	function setHeight() {
		var windowHeight = $(window).innerHeight() - 140;
		$('#sample-feature-home').css('height', windowHeight);
	}

	$(document).ready(function(){
		setHeight();
	  
		$(window).resize(function() {
	  		setHeight();
  		});

	});

})( jQuery );