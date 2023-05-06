'use strict';
var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifeproductos) {

    // afterInitialize is a model hook which is still used in loopback
    Sifeproductos.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifeproductos.observe('before save', function(ctx, next) {
    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      console.log('> before save: '+date, ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    });
    Sifeproductos.observe('after save', function(ctx, next) {
      //socket.emit('/Sifeproductos/POST',ctx.instance);
      pubsub.publish('Producto_Ingresa', ctx.instance);
        //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
        next();
    });
    Sifeproductos.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifeproductos.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifeproductos/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifeproductos.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifeproductos.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifeproductos instance:', ctx.instance);
      } else {
        //console.log('About to update Sifeproductoss that match the query %j:', ctx.where);
      }
      next();
    });
  };

