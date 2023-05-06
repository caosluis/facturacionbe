var pubsub = require('../../server/pubsub.js');
module.exports = function(Persona) {
    // remote method
    Persona.revEngine = function(sound, cb) {
      cb(null, sound + ' ' + sound + ' ' + sound);
    };
    Persona.remoteMethod(
      'revEngine',
      {
        accepts: [{arg: 'sound', type: 'string'}],
        returns: {arg: 'engineSound', type: 'string'},
        http: {path:'/rev-engine', verb: 'post'}
      }
    );
  
    // remote method before hooks
    Persona.beforeRemote('revEngine', function(context, unused, next) {
      //console.log('Putting in the Persona key, starting the engine.');
      next();
    });
  
    // afterInitialize is a model hook which is still used in loopback
    Persona.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };
  
    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Persona.observe('before save', function(ctx, next) {
      //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    });
    Persona.observe('after save', function(ctx, next) {
      //socket.emit('/Persona/POST',ctx.instance);
      pubsub.publish('/Persona/POST', ctx.instance);
        //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
        next();
    });
    Persona.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Persona.observe('after delete', function(ctx, next) {
      pubsub.publish('/Persona/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });
  
    // remote method after hook
    Persona.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });
  
    // model operation hook
    Persona.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Persona instance:', ctx.instance);
      } else {
        //console.log('About to update Personas that match the query %j:', ctx.where);
      }
      next();
    });
  };