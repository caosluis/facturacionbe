var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifeglobal) {
  
    // afterInitialize is a model hook which is still used in loopback
    Sifeglobal.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };
  
    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifeglobal.observe('before save', function(ctx, next) {
      //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    });
    Sifeglobal.observe('after save', function(ctx, next) {
      //socket.emit('/Sifeglobal/POST',ctx.instance);
      pubsub.publish('/Sifeglobal/POST', ctx.instance);
        //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
        next();
    });
    Sifeglobal.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifeglobal.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifeglobal/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });
  
    // remote method after hook
    Sifeglobal.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });
  
    // model operation hook
    Sifeglobal.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifeglobal instance:', ctx.instance);
      } else {
        //console.log('About to update Sifeglobals that match the query %j:', ctx.where);
      }
      next();
    });
  };