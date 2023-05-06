'use strict';
// var http = require('http');
// var options = {
//   host: '192.168.1.204',
//   port: '8081',
//   path: '/',
//   method: 'POST',
//   encoding: null
// };
// http.request(options,function(res){
//   var body = '{"id":"hola mundo"}';
//   res.on('data',function(chunk){
//     body+= chunk;
//   });
//   res.on('end', function(){
//     var price = JSON.parse(body);
//     console.log(price);
//   })
// }).end();
module.exports = function(Test) {
Test.observe('before save', function(ctx, next) {
      //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
      
    //   invocarServicio(options, ctx.instance, function (test, err) {
    //     if (err) {  
    //         next(null, err);
    //     } else {
    //         next(test, null);
    //     }
    // });
    
      ctx.instance.test = "hola mundo";
      next();
    });
      
};
