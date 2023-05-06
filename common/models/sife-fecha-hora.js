var pubsub = require("../../server/pubsub.js");
var global = require("../../global/global")
module.exports = function (Sifefechahora) {
  Sifefechahora.solicitafecha = function (datos_sincronizar, cb) {
    var url = global.Docker + "710/mule/solicitafecha";
    var body = {
      nit: datos_sincronizar.nit.toString(),
      codigoSucursal: datos_sincronizar.codigoSucursal.toString(),
      codigoPDV: datos_sincronizar.codigoPDV.toString(),
    };

    pubsub.serviceConsumer(url, body, function (data, err) {
      if (data != null) {
        var json = JSON.parse(data);
        cb(null, json);
      }

      if (err != null) {
        cb(null, err);
      }
    });
  };
  Sifefechahora.remoteMethod("solicitafecha", {
    accepts: [
      { arg: "datos_sincronizar", type: "object", http: { source: "body" } },
    ],
    returns: [{ arg: "respuesta", type: "array" }],
    http: { verb: "post", path: "/solicitafecha" },
  });
  ////////////////////////////////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Sifefechahora.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifefechahora.observe("before save", function (ctx, next) {
    //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
    next();
  });
  Sifefechahora.observe("after save", function (ctx, next) {
    //socket.emit('/Sifefechahora/POST',ctx.instance);
    pubsub.publish("/Sifefechahora/POST", ctx.instance);
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifefechahora.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifefechahora.observe("after delete", function (ctx, next) {
    pubsub.publish("/Sifefechahora/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifefechahora.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifefechahora.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifefechahora instance:', ctx.instance);
    } else {
      //console.log('About to update Sifefechahoras that match the query %j:', ctx.where);
    }
    next();
  });
};
