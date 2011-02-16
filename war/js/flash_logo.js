var flash = function(){
	
	var light=1;
	while(light>0.14 || light<=0.1){
		light=Math.random();
	}
	$('#holder').css('opacity', light);
	setTimeout(flash, Math.random()*100);
}

$(document).ready(function(){
	flash();
});