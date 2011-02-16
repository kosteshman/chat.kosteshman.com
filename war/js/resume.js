$(document).ready(function(){
	var selected = $('#n1');
	var positions = [];
	
	$(window).scroll(function(e){
		var i = 0;
		$('.content h2').each(function(){
			positions[i] = $(this).offset().top;
			i++;
		});
		
		var scroll = $(window).scrollTop();
		for(var i=0; i<positions.length; i++){
			if(scroll >= positions[i]){
				selected.css({'background':'none'});
				selected = $('.navigation li:eq('+i+')');
				selected.css({'background':'#FFF url(../images/arr.jpg) 0 -3px no-repeat'});
			}
		}
	});
});
