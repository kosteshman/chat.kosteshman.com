var ready_count = 0;
$(document).ready(function(){
	if(ready_count > 0) return false;
	ready_count++;
	// from here
	var current_jid = '';
	var offline = true;
	typer.type('Соединение с сервером...', $('#texter'));
	setTimeout(function(){typer.type('Проверка статуса...');}, 3000);
	$.post('xmpp/checkstatus.php', {gigi: 'gigi'}, function(status){
		var st = status.split('|');
		switch(st[0]){
		case 'offline':
		    offline = true;
			typer.type('Упс, я в офлайне, но вы можете написать мне по электронной почте на <a href="mailto:k@kosteshman.com">k@kosteshman.com</a>');
			typer.type('Да, можно прямо здесь впечатать. На почту упадет.');
			if(st[1]!=''){
			     typer.type('Статус: '+st[1]);	
			}
			
			break;
			
		case 'online':
		    offline = false;
			typer.type('Я в сети.');
			if(st[1]!=''){
			     typer.type('Статус: '+st[1]);	
			}
			messager.id = current_jid = st[2];
			messager.start();
			messager.getmessage();
			break;	
		default:
			typer.type(status);
			break;		
		}
	});
	

	$('#input').keypress(function(e){
		if(e.which == 13){
			msg = $('#input').val();
			$('#texter').append('<div class="msg">> '+msg+'</div>');
			if(offline){
				messager.email(msg);
			}else{
				messager.sendmessage(msg);
				$(window).scrollTo('max');
			}
			
			
			$('#input').val('').focus();
			return false;
		}
	})
	.focus()
	.autoResize({
		animateDuration: 0,
		extraSpace: 50
	});

	$(window).unload(function(){
		$.post('xmpp/stop.php', {bot: messager.id});
	});
	

	$(window).focus(function(){
		$('#input').focus();
	}).click(function(){
	    $('#input').focus();
	});
	
	$('#input').focus();
	
	flash();
});

var flash = function(){
	
	var light=1;
	while(light>0.14 || light<=0.1){
		light=Math.random();
	}
	$('#holder').css('opacity', light);
	setTimeout(flash, Math.random()*100);
}

var typer = {
	processing: false,
	buffer: [],
	holder: {},
	position: 0,
	buffer_cursor: 0,
	current_line: {},
	speed: 70,
	tag_inserting: false,
	save_line: {},
	
	
	type: function(str, h){
		if(h){
			typer.holder = h;
		}
		
		if(typer.holder.length == 0){
			return false;
		}
		
		if(str){
			typer.buffer.push(str);
		}
		
		if(!typer.buffer[typer.buffer_cursor]){
			typer.buffer = [];
			typer.buffer_cursor = 0;
			
			return false;
		}
		
		if(!typer.processing){
			typer.processing = true;
			var line = $('<div>> </div>');
			typer.holder.append(line);
			typer.current_line = line;
			if(typer.buffer[typer.buffer_cursor]){
				typer.addChar();
			}
			
		}
		
		$(window).scrollTo('max');
	},
	
	addChar: function(){
		var str = typer.buffer[typer.buffer_cursor];
		if(str[typer.position]){
			if(str[typer.position] == '<'){
				if (!typer.tag_inserting) {
					typer.tag_inserting = true;
					var b = '<';
					var tag = '';
					var scan_tag = true;
					typer.position++;
					while (str[typer.position] != '>') {
						if (scan_tag) {
							if (str[typer.position] == ' ') {
								scan_tag = false;
							} else {
								tag += str[typer.position];
							}
						}
						b += str[typer.position];
						typer.position++;
					}
					b += '>';
					var jtag = $(b + '</' + tag + '>');
					typer.current_line.append(jtag);
					typer.save_line = typer.current_line;
					typer.current_line = jtag;
					b=' ';
				}else{
					while (str[typer.position] != '>'){
						typer.position++;
					}
					typer.current_line = typer.save_line;
					typer.tag_inserting = false;
					typer.position++;
					b=' ';
				}
			}else{
				b = str[typer.position];
			}
			
			typer.current_line.html(typer.current_line.html()+b);
			typer.position++;
			setTimeout(typer.addChar, typer.speed);
		}else{
			typer.position = 0;
			typer.buffer_cursor++;
			typer.processing = false;
			typer.type();
			return true;
		}
	}	
}

var messager = {
	timeout: 1000,	
	id: '',
	last_time: 0,
	timeout_process: 0,
	starting: 0,
	stop: function(){
	    $.post('xmpp/stop.php', {bot: messager.id});
    },

    sendmessage: function(msg){
    	$.post('xmpp/sendmessage.php', {message:msg, bot:messager.id}, function(data){ return data;});
    },
    
    getmessage: function(){
    	$.post('xmpp/getmessage.php', {bot:messager.id}, function(data){
    		if (data != '') {
				eval(data);
				if (response && response.length > 0) {
					for ( var i = 0; i < response.length; i++) {
						if (response[i][0] > messager.last_time) {
							typer.type(response[i][1]);
							messager.last_time = response[i][0];
						}
					}
				}
				
				if(messager.timeout_process == 0){
					if(messager.starting == 0)
					    messager.timeout_process = timeout_process;
				}else{
					if(timeout_process && (timeout_process - messager.timeout_process > 10)){
						messager.start();
						messager.timeout_process = 0;
						messager.starting = 1;
					}else{
						messager.timeout_process = timeout_process;
					}
				}
			}
    		setTimeout(messager.getmessage, messager.timeout);
    	});
    },
    
    start: function(){
    	$.ajax({
			url:'xmpp/client.php',
			type:'post',
			cache: false,
			data:{bot: messager.id, referrer: document.referrer, restart: messager.starting}/*,
			success: function(data){
				//messager.start();
				alert(data);
			},
			error: function(obj, error){
				alert(error);
			},
			complete: function(obj, textStatus){
				//messager.start();
				alert(textStatus);
			}*/
		});
		messager.starting = 0;
    },  
    
    email: function(msg){
    	$.post('xmpp/email.php', {message: msg}, function(data){
    	    if(data == 'ok'){
    	    	typer.type('Сообщение отправлено на электронную почту.');
    	    }else{
    	    	typer.type(data);
    	    }
    	});
    }
}