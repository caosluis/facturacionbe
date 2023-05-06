'use strict';
var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifeuserdata) {
    // afterInitialize is a model hook which is still used in loopback
    Sifeuserdata.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifeuserdata.observe('before save', function(ctx, next) {
      /* console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data); */
      next();
    });
    Sifeuserdata.observe('after save', function(ctx, next) {
      //socket.emit('/Sifeuserdata/POST',ctx.instance);
      pubsub.publish('/Sifeuserdata/POST', ctx.instance ||  Object.assign(ctx.data,ctx.where));
      //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
      next();
    });
    Sifeuserdata.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifeuserdata.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifeuserdata/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifeuserdata.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifeuserdata.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifeuserdata instance:', ctx.instance);
      } else {
        //console.log('About to update Sifeuserdatas that match the query %j:', ctx.where);
      }
      next();
    });
  };

