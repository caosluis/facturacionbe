'use strict';


var pubsub = require('../../server/pubsub.js');
module.exports = function(Siferecepcionsolicitudnuevovalorproducto) {
    // afterInitialize is a model hook which is still used in loopback
    Siferecepcionsolicitudnuevovalorproducto.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Siferecepcionsolicitudnuevovalorproducto.observe('before save', function(ctx, next) {
      /* console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data); */
      next();
    });
    Siferecepcionsolicitudnuevovalorproducto.observe('after save', function(ctx, next) {
      //socket.emit('/Siferecepcionsolicitudnuevovalorproducto/POST',ctx.instance);
      pubsub.publish('/Siferecepcionsolicitudnuevovalorproducto/POST', ctx.instance ||  Object.assign(ctx.data,ctx.where));
      //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
      next();
    });
    Siferecepcionsolicitudnuevovalorproducto.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Siferecepcionsolicitudnuevovalorproducto.observe('after delete', function(ctx, next) {
      pubsub.publish('/Siferecepcionsolicitudnuevovalorproducto/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Siferecepcionsolicitudnuevovalorproducto.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Siferecepcionsolicitudnuevovalorproducto.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Siferecepcionsolicitudnuevovalorproducto instance:', ctx.instance);
      } else {
        //console.log('About to update Siferecepcionsolicitudnuevovalorproductos that match the query %j:', ctx.where);
      }
      next();
    });
  };

