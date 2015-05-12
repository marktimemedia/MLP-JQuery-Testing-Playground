(function( $ ){

/* Feature Image */

	function setHeight() {
		var windowHeight = $(window).innerHeight() - 140;
		var windowMobile = $(window).innerHeight() - 100;

		if($(window).width() > 488 ) { // use height minus tall header
			$('#sample-feature-home').css('height', windowHeight);
		} else { // use height minus short header
			$('#sample-feature-home').css('height', windowMobile);
		}
	}

	$(document).ready(function(){
		setHeight();
	  
		$(window).resize(function() {
	  		setHeight();
  		});

	});

})( jQuery );