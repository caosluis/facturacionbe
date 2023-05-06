var pubsub = require('../../server/pubsub.js');
module.exports = function(Siferangoscontingencias) {
  Siferangoscontingencias.DeleteSiferangoscontingencias = (cb) => {
    var ds = Siferangoscontingencias.dataSource
    var sql = "DELETE FROM sifedb.sife_rangos_contingencias;";
    
    ds.connector.query(sql, (err, instance) => {

        if (err) console.error(err);
        // pubsub.publish('/SiferangoscontingenciasEntrante/get', instance);
        cb(err, instance);
    })
}
Siferangoscontingencias.remoteMethod(
    'DeleteSiferangoscontingencias',
    {
        http: { verb: 'delete' },
        accepts: [
        ],
        returns: { arg: 'data', type: ['a'], root: true }
    }
)
/////////////////////////////////////////////////////////////////////////////////////////////////
    // afterInitialize is a model hook which is still used in loopback
    Siferangoscontingencias.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Siferangoscontingencias.observe('before save', function(ctx, next) {
      /* console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data); */
      next();
    });
    Siferangoscontingencias.observe('after save', function(ctx, next) {
      //socket.emit('/Siferangoscontingencias/POST',ctx.instance);
      pubsub.publish('/Siferangoscontingencias/POST', ctx.instance ||  Object.assign(ctx.data,ctx.where));
      //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
      next();
    });
    Siferangoscontingencias.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Siferangoscontingencias.observe('after delete', function(ctx, next) {
      pubsub.publish('/Siferangoscontingencias/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Siferangoscontingencias.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Siferangoscontingencias.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Siferangoscontingencias instance:', ctx.instance);
      } else {
        //console.log('About to update Siferangoscontingenciass that match the query %j:', ctx.where);
      }
      next();
    });
  };

