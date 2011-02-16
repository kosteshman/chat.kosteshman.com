var ready_count = 0;
$(document).ready(function(){
	// Проверяю что функция не исполнилась почему-то несколько раз подряд
	if(ready_count > 0) return false;
	ready_count++;
	var migalka = $('<img src="images/migalka.gif" width="9" height="13" style="position:relative; top: 1px; margin-left:2px;" />');
	var offline = true;
	var ref = window.location.hash;
	window.location.hash = '';
	typer.type('Соединение с сервером...', $('#texter'));
	setTimeout(function(){typer.type('Проверка статуса...');}, 3000);
	setTimeout(function(){
		$.get('/getstatus', {'tratata':Math.round(Math.random(100000)),'referrer':ref},  function(status){
			switch(status){
			case 'offline':
			    offline = true;
				typer.type('Упс, я в офлайне, но вы можете написать мне по электронной почте на <a href="mailto:k@kosteshman.com">k@kosteshman.com</a>');
				break;
			
			case 'online':
			    offline = false;
				typer.type('Я в сети.');
				messager.get();
				break;	
			default:
				typer.type(status);
				break;		
			}
		});
	}, 3000);
	if(ref=='#cpeople'){
		typer.type('О! Я вижу тег cpeople. Не многие о нем знают. <a href="aboutme.html" target="_blank">Жмакай</a>, чтобы почитать обо мне.');
	}
	
	$(window).unload(function(){
		messager.send('Пользователь свалил ((');
	});
	
	$(window).blur(function(){
		announcer.blur();
	});
	
	$(document).click(function(){
		$('#input').focus();
	});
	
	$(window).focus(function(){
		$('#input').focus();
		announcer.focus();
	});
	
	$('#input').focus();
	$('#typer').append(migalka);
	
	messager.afterget = function(){
		announcer.message();
	}
	
	var ctrl = false;
	var ctrlv = false;
	$("#input").keypress(function (e) {
	  migalka.remove();
      if (e.which != 8){
	  	
		if(e.which == 13){
			var txt = $('#typer').text();
			var str = $('<div class="msg" />').append('<span>> </span>').append(txt);
			$('#texter').append(str);
			$('#typer').html('').append(migalka); 
			$('#input').val('');
			$(window).scrollTo('max');
			messager.send(txt, function(message_status){
				switch(message_status){
					case 'mail':
						typer.type("Сообщение отправленно на почту.");
						break;
					case 'nobot':
						typer.type("Сообщение не отправленно. Перезагрузите страницу и попробуйте еще раз.");
						break;
					case 'ok':
						break;
					default:
						alert(message_status);
				}
				
			});
			
			
		}else{
			
			var c = String.fromCharCode(e.which);
        	$("#typer").append($("<span/>")).children(":last").append(c);
			$("#typer").append(migalka);
			
		}
        
      }
	  
	  
	  
    }).keydown(function(e){
		if(e.which == 8){
			migalka.remove();
			$("#typer").children(":last").remove();
			$("#typer").append(migalka);
		}
		
		if(e.metaKey || e.ctrlKey){
			ctrl = true;
		}
		
		if(ctrl && e.which == 86){
			$('#input').val('');
			ctrlv = true;
		}else{
			ctrl = false;
		}
	}).keyup(function(){
		if(ctrlv){
			migalka.remove();
			var insert = $('#input').val();
			var insert_l = insert.length;
			var typer = $('#typer');
			for(var i=0; i<insert_l; i++){
				typer.append('<span/>').children(':last').append(insert[i]);
			}
			typer.append(migalka);
			ctrlv = false;
		}
	});
	
});


var messager = {
	
	lastMessage: 0,
	afterget: false,
	
	send: function(txt, callback){
		var response = "";
		$.post('/send', {'message':txt}, function(data){
			if(callback){
				callback(data);
			}
		});
	},
	
	get: function(){
		$.post('/getmessages',{'id':'dsad'}, function(data){
			var messages = [];
			var error = false;
			try{
				eval(data);
				if(error){
					alert(error);
				}else{
					var ml = messages.length;
					for(var i=0; i<ml; i++){
						var m = messages[i];
						if(m[1] > messager.lastMessage)
						{
							messager.lastMessage = m[1];
							typer.type(m[0]);
							if(messager.afterget){
								messager.afterget();
							}
						}
					}
				}
			}catch(e){
				alert(e.getMessage());
			}
		});
		
		setTimeout(function(){
						messager.get();
					}, 3000);
	}
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

var announcer = {
	
	focused: true,
	delay: 500,
	state: 1,
	title: false,
	inprocess: false,
	
	default_icon: function(){
		return $('<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" id="fi" />');
	},
	
	message_icon: function(){
		return $('<link rel="shortcut icon" href="message.ico" type="image/x-icon" id="fi" />');
	},	
	
	message: function(){
		if(!announcer.inprocess){
			announcer.inprocess = true;
			announcer.blink();
		}
	},
	
	blink: function(){
		if(!announcer.focused || announcer.state == 2){
			$('#fi').remove();
			if(announcer.state == 1){
				if(!announcer.title){
					announcer.title = $('title').text();
				}
				$('head').append(announcer.message_icon());
				announcer.state = 2;
				$('title').text('Сообщение!');
			}else{
				$('head').append(announcer.default_icon());
				announcer.state = 1;
				$('title').text(announcer.title);
			}
			setTimeout(function(){
				announcer.blink();
			}, announcer.delay);
		}
	},
	
	focus: function(){
		announcer.focused = true;
		announcer.inprocess = false;
	}, 
	
	blur: function(){
		announcer.focused = false;
	}
}
