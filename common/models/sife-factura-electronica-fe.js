"use strict";
var pubsub = require("../../server/pubsub.js");
module.exports = function (Sifefacturaelectronicafe) {
  var count = 0;
  Sifefacturaelectronicafe.PanelFacturas = (FechaInicial, FechaFinal, cb) => {
    Sifefacturaelectronicafe.getDataSource().connector.connect(function (
      err,
      db
    ) {
      var collection = db.collection("sife_facturaElectronica_fe");
      collection
        .aggregate([
          {
            $match: { fechaEmision: { $gte: FechaInicial, $lt: FechaFinal } },
          },
          {
            $group: {
              _id: { cuis: "$cuis", estado: "$estado" },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(function (err, data) {
          if (err) {
          } else {
            cb(null, data);
          }
        });
    });
  };

  Sifefacturaelectronicafe.remoteMethod("PanelFacturas", {
    http: {
      path: "/PanelFacturas",
      verb: "get",
    },
    accepts: [
      { arg: "FechaInicial", type: "string" },
      { arg: "FechaFinal", type: "string" },
    ],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  Sifefacturaelectronicafe.IndicadorErrorFacturas = (cb) => {
    Sifefacturaelectronicafe.getDataSource().connector.connect(function (
      err,
      db
    ) {
      var collection = db.collection("sife_facturaElectronica_fe");
      collection
        .find({ estado: 91 })
        .count()
        .toArray(function (err, data) {
          if (err) {
          } else {
            cb(null, data);
          }
        });
    });
  };

  Sifefacturaelectronicafe.remoteMethod("IndicadorErrorFacturas", {
    http: {
      path: "/IndicadorErrorFacturas",
      verb: "get",
    },
    accepts: [],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function Factura_Entrante() {
    pubsub.publish("Factura_Entrante", "");
  }
  var t = setInterval(Factura_Entrante, 15000);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // afterInitialize is a model hook which is still used in loopback
  Sifefacturaelectronicafe.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifefacturaelectronicafe.observe("before save", function (ctx, next) {
    //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
    next();
  });
  Sifefacturaelectronicafe.observe("after save", function (ctx, next) {
    //socket.emit('/Sifefacturaelectronicafe/POST',ctx.instance);
    /*  count = count + 1;
    if (count == 10) {
      pubsub.publish("Factura Entrante",'');
      count = 0;
    } */
    /* pubsub.publish("Factura Entrante", ctx.instance); */
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifefacturaelectronicafe.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifefacturaelectronicafe.observe("after delete", function (ctx, next) {
    pubsub.publish(
      "/Sifefacturaelectronicafe/DELETE",
      ctx.instance || ctx.where
    );
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifefacturaelectronicafe.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifefacturaelectronicafe.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifefacturaelectronicafe instance:', ctx.instance);
    } else {
      //console.log('About to update Sifefacturaelectronicafes that match the query %j:', ctx.where);
    }
    next();
  });
};
