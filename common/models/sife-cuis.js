'use strict';
var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifecuis) {
    // remote method
    Sifecuis.revEngine = function(sound, cb) {
      cb(null, sound + ' ' + sound + ' ' + sound);
    };
    Sifecuis.remoteMethod(
      'revEngine',
      {
        accepts: [{arg: 'sound', type: 'string'}],
        returns: {arg: 'engineSound', type: 'string'},
        http: {path:'/rev-engine', verb: 'post'}
      }
    );

    // remote method before hooks
    Sifecuis.beforeRemote('revEngine', function(context, unused, next) {
      //console.log('Putting in the Sifecuis key, starting the engine.');
      next();
    });

    // afterInitialize is a model hook which is still used in loopback
    Sifecuis.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifecuis.observe('before save', function(ctx, next) {
      //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    });
    Sifecuis.observe('after save', function(ctx, next) {
      //socket.emit('/Sifecuis/POST',ctx.instance);
      pubsub.publish('/Sifecuis/POST', ctx.instance);
        //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
        next();
    });
    Sifecuis.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifecuis.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifecuis/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifecuis.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifecuis.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifecuis instance:', ctx.instance);
      } else {
        //console.log('About to update Sifecuiss that match the query %j:', ctx.where);
      }
      next();
    });
  };
