(function($){
	  	
/* Read More - Articles */

	$('.read_more').on('click', function() {
		if(!$(this).hasClass('read-less')){
			$(this).addClass('read-less').html('Read Less');
		} else {
			$(this).removeClass('read-less').html('Read More');
		}
		$(this).parent().siblings('.article-more').slideToggle();
	});


})(jQuery);