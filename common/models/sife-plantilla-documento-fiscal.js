'use strict';

var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifeplantilladocumentofiscal) {
    // afterInitialize is a model hook which is still used in loopback
    Sifeplantilladocumentofiscal.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifeplantilladocumentofiscal.observe('before save', function(ctx, next) {
      /* console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data); */
      next();
    });
    Sifeplantilladocumentofiscal.observe('after save', function(ctx, next) {
      //socket.emit('/Sifeplantilladocumentofiscal/POST',ctx.instance);
      pubsub.publish('/Sifeplantilladocumentofiscal/POST', ctx.instance ||  Object.assign(ctx.data,ctx.where));
      //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
      next();
    });
    Sifeplantilladocumentofiscal.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifeplantilladocumentofiscal.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifeplantilladocumentofiscal/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifeplantilladocumentofiscal.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifeplantilladocumentofiscal.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifeplantilladocumentofiscal instance:', ctx.instance);
      } else {
        //console.log('About to update Sifeplantilladocumentofiscals that match the query %j:', ctx.where);
      }
      next();
    });
  };

