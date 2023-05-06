var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifecufdh) {
    Sifecufdh.cargar_sife_cufd_historico = (Anio, Mes, Dia,Empresa,Sucursal,PDV,cb) => {
    var ds = Sifecufdh.dataSource
    var sql = "SELECT *"+ 
    " FROM sifedb.sife_cufd_H"+
    " WHERE nit in ('"+ Empresa +"')"+  
    " and codigoSucursal in ('"+ Sucursal +"')"+ 
    " and codigoPDV in ('"+ PDV +"')"+ 
    " and year(fechaCreacion)="+Anio+
    " and month(fechaCreacion)="+Mes+
    " and day(fechaCreacion)="+Dia+
    " ORDER BY fechaVigencia";

    ds.connector.query(sql, (err, instance) => {

        if (err) console.error(err);
        // pubsub.publish('/SifecufdEntrante/get', instance);
        cb(err, instance);
    })
}
Sifecufdh.remoteMethod(
    'cargar_sife_cufd_historico',
    {
        http: { verb: 'get' },
        accepts: [
            { arg: 'Anio', type: ['string'] },
            { arg: 'Mes', type: ['string'] },
            { arg: 'Dia', type: ['string'] },
            { arg: 'Empresa', type: ['string'] },
            { arg: 'Sucursal', type: ['string'] },
            { arg: 'PDV', type: ['string'] }
        ],
        returns: { arg: 'data', type: ['a'], root: true }
    }
)
/////////////////////////////////////////////////////////////////////////////////////////////////
    // afterInitialize is a model hook which is still used in loopback
    Sifecufdh.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifecufdh.observe('before save', function(ctx, next) {
      console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    });
    Sifecufdh.observe('after save', function(ctx, next) {
      //socket.emit('/Sifecufdh/POST',ctx.instance);
      pubsub.publish('/Sifecufdh/POST', ctx.instance ||  Object.assign(ctx.data,ctx.where));
      //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
      next();
    });
    Sifecufdh.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifecufdh.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifecufdh/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifecufdh.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifecufdh.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifecufdh instance:', ctx.instance);
      } else {
        //console.log('About to update Sifecufdhs that match the query %j:', ctx.where);
      }
      next();
    });
  };

