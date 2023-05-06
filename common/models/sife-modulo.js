'use strict';

var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifemodulo) {
    // afterInitialize is a model hook which is still used in loopback
    Sifemodulo.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifemodulo.observe('before save', function(ctx, next) {
      console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    });
    Sifemodulo.observe('after save', function(ctx, next) {
      //socket.emit('/Sifemodulo/POST',ctx.instance);
      pubsub.publish('/Sifemodulo/POST', ctx.instance ||  Object.assign(ctx.data,ctx.where));
      //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
      next();
    });
    Sifemodulo.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifemodulo.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifemodulo/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifemodulo.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifemodulo.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifemodulo instance:', ctx.instance);
      } else {
        //console.log('About to update Sifemodulos that match the query %j:', ctx.where);
      }
      next();
    });
  };

