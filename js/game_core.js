var game_status = false;

var socket;
var room;
var player = new Array();
var stop=1;


$("#target_url").html(document.URL);

function start(){
	document.getElementById("menu").style.display="none";
	document.getElementById("connect").style.display="";
}

function nextstep(){
	document.getElementById("connect").style.display="none";
	document.getElementById("ready").style.display="";
	init_websocket();
}

function init_websocket(){
	socket = io.connect(document.URL);
	socket.on('connect', function() {
		room = createCode();
		socket.emit('create',room);
		var qrcode = new QRCode(document.getElementById("qrcode"), {
			width : 100,
			height : 100
		});
		qrcode.makeCode(document.URL + "?room=" + room );
		$("#gamecode").html(room);
	});
	
	socket.on('disconnect',function(){
	});
	
	socket.on('addwaiting',function(name){
		player.push(name);
		var p = player.length;
		$('#player' + p).css("opacity","1");
	});
	
	socket.on('gamestart',function(name){
		document.getElementById("ready").style.display="none";
		document.getElementById("gamestage").style.display="";
		document.getElementById("myCanvas").style.display="";
		stop=0;
		setInterval(timer_stop,100000);	
		setInterval(timer_fourth,100);
		setInterval(timer_third,1000);
		setInterval(timer_second,10000);
		
		bgm.play();
	});
	
	socket.on('moveup',function(user){
		var j = player.indexOf(user);
		if(j == 0){
			player1.applyImpulse(75, 0);
			if(p1_sprite_jump==3){
				player1.sprite(2,0);
				p1_sprite_jump++;
			}else if(p1_sprite_jump==4){
				player1.sprite(3,0);
				p1_sprite_jump++;
			}else{
				player1.sprite(4,0);
				p1_sprite_jump=3;
			}	
		}else if(j==1){
			player2.applyImpulse(75, 0);
			if(p2_sprite_jump==3){
				player2.sprite(2,0);
				p2_sprite_jump++;
			}else if(p2_sprite_jump==4){
				player2.sprite(3,0);
				p2_sprite_jump++;
			}else{
				player2.sprite(4,0);
				p2_sprite_jump=3;
			}	
		}else if(j==2){
			player3.applyImpulse(75, 0);
			if(p3_sprite_jump==3){
				player3.sprite(2,0);
				p3_sprite_jump++;
			}else if(p3_sprite_jump==4){
				player3.sprite(3,0);
				p3_sprite_jump++;
			}else{
				player3.sprite(4,0);
				p3_sprite_jump=3;
			}	
		}else if(j==3){
			player4.applyImpulse(75, 0);
			if(p4_sprite_jump==3){
				player4.sprite(2,0);
				p4_sprite_jump++;
			}else if(p4_sprite_jump==4){
				player4.sprite(3,0);
				p4_sprite_jump++;
			}else{
				player4.sprite(4,0);
				p4_sprite_jump=3;
			}	
		}
	});
	
	socket.on('moveright',function(user){
		var j = player.indexOf(user);
		if(j == 0){
			player1.applyImpulse(75, 90);
			if(p1_sprite_walk==0){
				player1.sprite(0,0);
				p1_sprite_walk++;
			}else{
				player1.sprite(1,0);
				p1_sprite_walk=0;
			}	
		}else if(j==1){
			player2.applyImpulse(75, 90);
			if(p2_sprite_walk==0){
				player2.sprite(0,0);
				p2_sprite_walk++;
			}else{
				player2.sprite(1,0);
				p2_sprite_walk=0;
			}	
		}else if(j==2){
			player3.applyImpulse(75, 90);
			if(p3_sprite_walk==0){
				player3.sprite(0,0);
				p3_sprite_walk++;
			}else{
				player3.sprite(1,0);
				p3_sprite_walk=0;
			}	
		}else if(j==3){
			player4.applyImpulse(75, 90);
			if(p4_sprite_walk==0){
				player4.sprite(0,0);
				p4_sprite_walk++;
			}else{
				player4.sprite(1,0);
				p4_sprite_walk=0;
			}	
		}	
	});
	
	socket.on('moveleft',function (user){
		var j = player.indexOf(user);
		if(j == 0){
			player1.applyImpulse(75, 270);
			if(p1_sprite_walk==0){
				player1.sprite(0,0);
				p1_sprite_walk++;
			}else{
				player1.sprite(1,0);
				p1_sprite_walk=0;
			}		
		}else if(j==1){
			player2.applyImpulse(75, 270);
			if(p2_sprite_walk==0){
				player2.sprite(0,0);
				p2_sprite_walk++;
			}else{
				player2.sprite(1,0);
				p2_sprite_walk=0;
			}		
		}else if(j==2){
			player3.applyImpulse(75, 270);
			if(p3_sprite_walk==0){
				player3.sprite(0,0);
				p3_sprite_walk++;
			}else{
				player3.sprite(1,0);
				p3_sprite_walk=0;
			}		
		}else if(j==3){
			player4.applyImpulse(75, 270);
			if(p4_sprite_walk==0){
				player4.sprite(0,0);
				p4_sprite_walk++;
			}else{
				player4.sprite(1,0);
				p4_sprite_walk=0;
			}		
		}	
	});
	
	socket.on('delete_player',function(name){
		if(player.indexOf(name) != -1){
			var p = player.indexOf(name);
			var delete_p = p+1;
			if(game_status == false){
				player.splice(p,1);
				$('#player' + delete_p).css("opacity","0");
			}else{
				$('#score_' + delete_p + '_s').text('中斷連線')
				$('#score_' + delete_p).css("color","red");
			}
		}
	});
	
}
