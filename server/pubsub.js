var app = require('express')();
var http = require('http').Server(app);
var Request = require("request");
var socket = require('socket.io')(http,{
    cors: {
        origins: ['http://docker-qas.hansa.com.bo:38']
    }
});
module.exports = {
    //Publishing a event..
    publish: function(name, data ){
        socket.emit(name, data);
    }, //End Publish..

    isEmpty:function (obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        if (obj == null) return true;
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;
        for (var key in obj) {
            if (this.hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }, //isEmpty function..
    serviceConsumer: function(url,body,res){
        let r = "";
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": url,
            "body": JSON.stringify(body)
        }, (error, response, body) => {
            if(error) {
                res(null,error)
            }
            try {
              res(body,null)
            } catch (e) {
              var err = {error:body}
              res(null,err)
            }
            
            r = body;
        });
        return r;
    }
}

http.listen(4444, () => {
    console.log('Listening on port 4444');
});