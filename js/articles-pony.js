(function($){
	  	
/* Read More - Articles */

	$('.read_more').on('click', function() {
		if(!$(this).hasClass('read_less')){
			$(this).addClass('read_less').html('Read Less');
		} else {
			$(this).removeClass('read_less').html('Read More');
		}
		$(this).parent().siblings('.article_more').slideToggle();
	});


})(jQuery);