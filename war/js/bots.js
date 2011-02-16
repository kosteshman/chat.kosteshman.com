$(document).ready(function(){
	$('#add').click(function(){
		var jid = $('#jid').val();
		if(jid == ''){
			alert("Необходимо ввести адрес бота");
		}else{
			var preloader = $('<img src="images/ajax-loader.gif" width="16" height="16" />');
			$('#addform').append(preloader);
			$.post('/newbot',{'jid':jid}, function(data){
				preloader.remove();
				var new_bot_id = parseInt(data);
				if(new_bot_id){
					addbot(new_bot_id, jid, new Date(), true);
				}else{
					alert(data);
				}
			});
		}
	});
	
	
	$(".delete").live('click', function(){
		var preloader = $('<img src="images/ajax-loader.gif" width="16" height="16" />');
		var elm = $(this);
		elm.after(preloader);
		$.post('/removebot', {'id':elm.attr('botid')}, function(data){
			preloader.remove();
			if(data == "ok"){
				elm.parent().parent().css('background','#ff0000').fadeOut('slow');
			}else{
				alert(data);
			}
		});
	});
	
	$(".free").live('click', function(){
		var preloader = $('<img src="images/ajax-loader.gif" width="16" height="16" />');
		var elm = $(this);
		elm.after(preloader);
		$.post('/freebot', {'id':elm.attr('botid')}, function(data){
			preloader.remove();
			if(data == "ok"){
				elm.css("background", "#006600").fadeOut('slow', function(){
					elm.parent().html("Свободен");
				});
				
			}else{
				alert(data);
			}
		});
	});
	
	
	$('#send').click(function(){
		$.post('/_ah/xmpp/message/chat/', {'from':$('#from').val(), 'to':$('#to').val(), 'body':$('#body').val() }, function(data){
			alert(data);
		});
	});
	
	
	var preloader = $('<tr><td><img src="images/ajax-loader.gif" width="16" height="16" /></td></tr>');
	$('#bots').append(preloader);
	var bots = [];
	$.get('/getbots', function(data){
		preloader.remove();
		try{
			eval(data);
			var l = bots.length;
			for(var i=0; i<l; i++){
				addbot(bots[i][0], bots[i][1], bots[i][2], bots[i][3]);
			}
		}catch(e){
			alert(data);
		}
	});	
});

var addbot = function(id, jid, date, accessibility){
	if(accessibility){
		var ac = "Свободен";
	}else{
		var ac = "<span class=\"free\" botid=\""+id+"\">Освободить</span>";
	}
	$('#bots').append("<tr><td>"+id+"</td><td>"+jid+"</td><td>"+date+"</td><td>"+ac+"</td><td><span class=\"delete\" botid=\""+id+"\">Удалить</span></td></tr>");
}
