var express = require('express');
var app = express();
var path = require('path');
app.use(express.static('public'))
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/memorizer.html'));
});
var port = Number(process.env.PORT || 5000);
app.listen(port, function() { 
    console.log('Server running on port ' + port)
});