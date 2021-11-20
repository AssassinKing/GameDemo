var app = require('http').createServer(handler) 
	, io = require('socket.io').listen(app)
	, fs = require('fs')
	, url = require('url')
	, ua = require('mobile-agent')
	, util = require('util');
app.listen(8080); 
function handler (req, res) {
	var url_string = url.parse(req.url);
	var path = url_string.pathname;
	var platform = ua(req.headers['user-agent']);
	
	if(platform.Mobile === true){
		var m_ext = path.match(/(\.[^.]+|)$/)[0];
		switch(m_ext){
			case ".js":
				fs.readFile("."+req.url, function(err,data){
					if(err) throw err;
					res.writeHead(200,{'Content-Type': 'application/javascript'});
					res.write(data);
                	res.end();
				});
				break;
			case ".jpg":
				fs.readFile("."+req.url, function (err, data) {
           			if (err) throw err;
					res.writeHead(200, {'Content-Type': 'image/jpeg'});
                	res.write(data);
                	res.end();
				});
				break;
			case ".css":
				fs.readFile("."+req.url,function(err,data){
					if(err) throw err;
					res.writeHead(200,{'Content-Type': 'text/css'});
					res.write(data);
                	res.end();
				});
				break;
			case ".png":
				fs.readFile("."+req.url,function(err,data){
					if(err) throw err;
					res.writeHead(200,{'Content-Type': 'image/png'});
					res.write(data);
                	res.end();
				});
				break;
			case ".gif":
				fs.readFile("."+req.url, function (err, data) {
           			if (err) throw err;
					res.writeHead(200, {'Content-Type': 'image/gif'});
                	res.write(data);
                	res.end();
				});
				break;
			default:
				fs.readFile(__dirname + '/mobile.html', function (err, data) {
					if (err) { 
						res.writeHead(500);
						return res.end('Error loading mobile.html'); 
					}
					res.writeHead(200, {"Content-Type": "text/html"});
					res.write(data, "utf8");
					res.end();
				});
		}
		
	}else{
		var pc_ext = path.match(/(\.[^.]+|)$/)[0];
		switch(pc_ext){
			case ".gif":
				fs.readFile("."+req.url, function (err, data) {
           			if (err) throw err;
					res.writeHead(200, {'Content-Type': 'image/gif'});
                	res.write(data);
                	res.end();
				});
				break;
			case ".jpg":
				fs.readFile("."+req.url, function (err, data) {
           			if (err) throw err;
					res.writeHead(200, {'Content-Type': 'image/jpeg'});
                	res.write(data);
                	res.end();
				});
				break;
			case ".png":
				fs.readFile("."+req.url, function (err, data) {
           			if (err) throw err;
					res.writeHead(200, {'Content-Type': 'image/png'});
                	res.write(data);
                	res.end();
				});
				break;
			case ".mp3":
				fs.readFile("."+req.url, function (err, data) {
					if(err) throw err;
					res.writeHead(200,{'Content-Type': 'audio/mpeg'});
					res.write(data);
                	res.end();
				});
				break;
			case ".js":
				fs.readFile("."+req.url, function(err,data){
					if(err) throw err;
					res.writeHead(200,{'Content-Type': 'application/javascript'});
					res.write(data);
                	res.end();
				});
				break;
			case ".css":
				fs.readFile("."+req.url,function(err,data){
					if(err) throw err;
					res.writeHead(200,{'Content-Type': 'text/css'});
					res.write(data);
                	res.end();
				});
				break;
			default:
				fs.readFile(__dirname + '/computer.html', function (err, data) {
				if (err) { 
					res.writeHead(500);
					return res.end('Error loading computer.html'); 
				}
				res.writeHead(200, {"Content-Type": "text/html"});
				res.write(data, "utf8");
				res.end();
				});
		}
	}

}

console.log("電腦端伺服器開啟!");

var users = {};
var rooms = {};
io.sockets.on('connection', function (socket) {
	socket.on('adduser',function(room,callback) {
		console.log("add_ID: " + socket.id);
		socket.username = socket.id;
		socket.room = room;
		users[socket.username] = socket;
		socket.join(room);
		var clients = Object.keys(io.sockets.adapter.rooms[room]).length - 1 ;
		callback(clients);
		users[room].emit('addwaiting',socket.username);
		
	});
	socket.on('check',function(room,callback){
		if(!rooms[room]){
			callback(2);
		}else if(Object.keys(io.sockets.adapter.rooms[room]).length >6){
			callback(3);
		}else{
			callback(1);
		}
	});
	socket.on('gamestart',function(room){
		io.sockets.in(room).emit('gamestart');
	});
	socket.on('moveup', function(pc) { 
		if(!users[pc]||!rooms[pc]){
			return false;
		}else{
			console.log('Room:'+ pc +' ,Player_ID:'+socket.id+', Click_Up');
			users[pc].emit('moveup',socket.id);
		}
	});
	socket.on('moveleft',function(pc){
		if(!users[pc]||!rooms[pc]){
			return false;
		}else{
			console.log('Room:'+ pc +' ,Player_ID:'+ socket.id +', Click_Left');
			users[pc].emit('moveleft',socket.id);
		}
	});
	socket.on('moveright',function(pc){
		if(!users[pc]||!rooms[pc]){
			return false;
		}else{
			console.log('Room:'+ pc +' ,Player_ID:'+ socket.id +', Click_Right');
			users[pc].emit('moveright',socket.id);
		}
	});
	socket.on('create', function(room) {
		if(rooms[room]){
			return false;
		}else{
			rooms[room]=room;
			socket.username = room;
			socket.room = room;
			users[room] = socket;
			socket.join(room);
			console.log("Create the room:" + room);	
		}
    });
	
	socket.on('disconnect', function() {
		console.log("disconnect_username: "+socket.username + " ,room:"+socket.room);
		if(socket.username == socket.room){
			for(var i in users){
				if(users[i].room == socket.room && users[i]!=socket){
					users[i].leave(socket.room);
					users[i].disconnect();
				}	
			}
			delete rooms[socket.room];
			delete users[socket.username];
		}else{
			users[socket.room].emit('delete_player',socket.username);
			delete users[socket.username];
			socket.leave(socket.room);
		}
	});
});