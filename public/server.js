/**
 * Created by Suguna on 23-03-2016.
 */

var http=require('http');
//var io = require('socket.io')(http);
aimlHigh = require('aiml-high');
var interpreter = new aimlHigh({name:'Search Bot', age:'42'}, 'Goodbye');
interpreter.loadFiles(['./test.aiml.xml']);

function navigate() {
    io.on('connection', function(socket){
        socket.on('chat message', function(msg){
            io.emit('query',msg);
            //console.log(msg);
            interpreter.findAnswer(msg,search);

        });
    });
}


var search = function(answer, wildCardArray, input){

    //io.emit('query',input + '\\n' + answer);
    console.log(answer + '|' + wildCardArray+ '|'+ input);
    var request = require('request');
    var headers = {
        'Content-Type': 'application/json'
    };

    var dataString = '{"methodName": "searchPersons", "parameters": ["72a3b74f897488e7a192fead1999e411", ' + '"' + wildCardArray[0] + '"' + '], "serviceName": "com.avinashi.meraCRM.services.search.SearchService"}';

    var options = {
        url: 'http://client.meracrm.com',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            io.emit('result',body);
           // console.log("hi");
        }
        else
        {
            console.log(error);
        }
    }

    request(options, callback);
};

module.exports= {
    nav: navigate
};