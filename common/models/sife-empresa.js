'use strict';
var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifeempresa) {

    // afterInitialize is a model hook which is still used in loopback
    Sifeempresa.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifeempresa.observe('before save', function(ctx, next) {
    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      console.log('> before save: '+date, ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    });
    Sifeempresa.observe('after save', function(ctx, next) {
      //socket.emit('/Sifeempresa/POST',ctx.instance);
      pubsub.publish('Empresa_Ingresa', ctx.instance);
        //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
        next();
    });
    Sifeempresa.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifeempresa.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifeempresa/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifeempresa.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifeempresa.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifeempresa instance:', ctx.instance);
      } else {
        //console.log('About to update Sifeempresas that match the query %j:', ctx.where);
      }
      next();
    });
  };

