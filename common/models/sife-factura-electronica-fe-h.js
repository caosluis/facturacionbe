'use strict';
var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifefacturaelectronicafeh) {
    Sifefacturaelectronicafeh.PanelFacturas = (cb) => {
      Sifefacturaelectronicafeh.getDataSource().connector.connect(function(err, db){
        var collection = db.collection('sife_facturaElectronica_fe_h');
        collection.aggregate([{"$group" : {_id:{"cuis":"$cuis","estado":"$estado"}, count:{$sum:1}}}]).toArray(function(err,data){
          if(err){

          }else{
        cb(null,data);
      }
        })
      })
    }
    

  Sifefacturaelectronicafeh.remoteMethod("PanelFacturas", {
    http: {
      path: "/PanelFacturas",
      verb: "get",
    },
    accepts: [],
    returns: { arg: 'Respuesta', type: 'array'},
  });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Sifefacturaelectronicafeh.IndicadorErrorFacturas = (cb) => {
  Sifefacturaelectronicafeh.getDataSource().connector.connect(function(err, db){
    var collection = db.collection('sife_facturaElectronica_fe_h');
    collection.find({"estado":91}).count().toArray(function(err,data){
      if(err){

      }else{
    cb(null,data);
  }
    })
  })
}


Sifefacturaelectronicafeh.remoteMethod("IndicadorErrorFacturas", {
http: {
  path: "/IndicadorErrorFacturas",
  verb: "get",
},
accepts: [],
returns: { arg: 'Respuesta', type: 'array'},
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // afterInitialize is a model hook which is still used in loopback
    Sifefacturaelectronicafeh.afterInitialize = function() {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifefacturaelectronicafeh.observe('before save', function(ctx, next) {
      //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    });
    Sifefacturaelectronicafeh.observe('after save', function(ctx, next) {
      //socket.emit('/Sifefacturaelectronicafeh/POST',ctx.instance);
      pubsub.publish('/Sifefacturaelectronicafeh/POST', ctx.instance);
        //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
        next();
    });
    Sifefacturaelectronicafeh.observe('before delete', function(ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    });
    Sifefacturaelectronicafeh.observe('after delete', function(ctx, next) {
      pubsub.publish('/Sifefacturaelectronicafeh/DELETE', (ctx.instance || ctx.where));
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    });

    // remote method after hook
    Sifefacturaelectronicafeh.afterRemote('revEngine', function(context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    });

    // model operation hook
    Sifefacturaelectronicafeh.observe('before save', function(ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifefacturaelectronicafeh instance:', ctx.instance);
      } else {
        //console.log('About to update Sifefacturaelectronicafehs that match the query %j:', ctx.where);
      }
      next();
    });
  };
