var pubsub = require('../../server/pubsub.js');
module.exports = function(Curso) {
    // remote method
    Curso.revEngine = function(sound, cb) {
      cb(null, sound + ' ' + sound + ' ' + sound);
    };
    Curso.remoteMethod(
      'revEngine',
      {
        accepts: [{arg: 'sound', type: 'string'}],
        returns: {arg: 'engineSound', type: 'string'},
        http: {path:'/rev-engine', verb: 'post'}
      }
    );
  
    // remote method before hooks
    Curso.beforeRemote('revEngine', function(context, unused, next) {
      //console.log('Putting in the Curso key, starting the engine.');
      next();
    });
  
    // afterInitialize is a model hook which is still used in loopback
    Curso.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };
  
    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Curso.observe('before save', function(ctx, next) {
      //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance ||  ctx.data);
      next();
    });
    Curso.observe('after save', function(ctx, next) {
      //socket.emit('/Curso/POST',ctx.instance);
      pubsub.publish('/Curso/POST', ctx.instance);
        //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
        next();
    });
    Curso.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Curso.observe('after delete', function(ctx, next) {
      //console.log('> after delete triggered:',ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });
  
    // remote method after hook
    Curso.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });
  
    // model operation hook
    Curso.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Curso instance:', ctx.instance);
      } else {
        //console.log('About to update Cursos that match the query %j:', ctx.where);
      }
      next();
    });
  };