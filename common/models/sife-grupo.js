'use strict';

var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifegrupo) {
    // afterInitialize is a model hook which is still used in loopback
    Sifegrupo.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifegrupo.observe('before save', function(ctx, next) {
      console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    });
    Sifegrupo.observe('after save', function(ctx, next) {
      //socket.emit('/Sifegrupo/POST',ctx.instance);
      pubsub.publish('/Sifegrupo/POST', ctx.instance ||  Object.assign(ctx.data,ctx.where));
      //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
      next();
    });
    Sifegrupo.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifegrupo.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifegrupo/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifegrupo.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifegrupo.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifegrupo instance:', ctx.instance);
      } else {
        //console.log('About to update Sifegrupos that match the query %j:', ctx.where);
      }
      next();
    });
  };