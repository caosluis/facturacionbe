'use strict';

var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifelistasdesplegable) {
    
    // afterInitialize is a model hook which is still used in loopback
    Sifelistasdesplegable.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifelistasdesplegable.observe('before save', function(ctx, next) {
      //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    });
    Sifelistasdesplegable.observe('after save', function(ctx, next) {
      //socket.emit('/Sifelistasdesplegable/POST',ctx.instance);
      pubsub.publish('/Sifelistasdesplegable/POST', ctx.instance ||  Object.assign(ctx.data,ctx.where));
      //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
      next();
    });
    Sifelistasdesplegable.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifelistasdesplegable.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifelistasdesplegable/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifelistasdesplegable.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifelistasdesplegable.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifelistasdesplegable instance:', ctx.instance);
      } else {
        //console.log('About to update Sifelistasdesplegables that match the query %j:', ctx.where);
      }
      next();
    });
  };


