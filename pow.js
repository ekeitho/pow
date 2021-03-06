var express = require('express')
var path = require('path')
var multer = require('multer');
var fs = require('fs');
var app = express();


var EVENTS_FILE = path.join(__dirname, 'events.json');
app.use('/', express.static(path.join(__dirname, 'public')));

var storage = multer.diskStorage({
     destination: function (req, file, cb) {
		 cb(null, './public/uploads/')
     },
     filename: function (req, file, cb) {
		 cb(null, file.originalname.replace(" ", ""))
		}
   });
var upload = multer({dest: './public/uploads/', storage: storage});

app.post('/api/events', upload.single('image'), function(req,res) {	
	console.log(req.file);
	console.log(req.body);
	
	fs.readFile(EVENTS_FILE, function(err, data) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		var events = JSON.parse(data);
		var nextId = events[events.length - 1].id;
		if (nextId == null) {
			nextId = -1;
		}
		var newEvent = {
			id: nextId + 1,
			desc: req.body.desc,
			title: req.body.title,
			date: req.body.date,
			image: req.file.path.replace("public/", "")
		}
		events.push(newEvent);
		fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 4), function(err) {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			res.json(events);
		});
	});

});

app.get('/api/events', function(req,res) {
	fs.readFile(EVENTS_FILE, function(err, data) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		res.json(JSON.parse(data));
	});
});

app.listen(3456, function () {
	console.log("Example app listenin on port 3456!");
});
