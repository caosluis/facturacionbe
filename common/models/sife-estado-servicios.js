'use strict';
var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifeestadoservicios) {

    // afterInitialize is a model hook which is still used in loopback
    Sifeestadoservicios.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifeestadoservicios.observe('before save', function(ctx, next) {
    /* var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') */
     /*  console.log('> before save: '+date, ctx.Model.modelName, ctx.instance || ctx.data); */
      next();
    });
    Sifeestadoservicios.observe('after save', function(ctx, next) {
      //socket.emit('/Sifeestadoservicios/POST',ctx.instance);
      pubsub.publish('Estado Ingresa', ctx.instance);
        //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
        next();
    });
    Sifeestadoservicios.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifeestadoservicios.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifeestadoservicios/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifeestadoservicios.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifeestadoservicios.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifeestadoservicios instance:', ctx.instance);
      } else {
        //console.log('About to update Sifeestadoservicioss that match the query %j:', ctx.where);
      }
      next();
    });
  };

