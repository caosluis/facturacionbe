("use strict");
var pubsub = require("../../server/pubsub.js");
var global = require("../../global/global")
module.exports = function (Sifefacturaelectronicalote) {
  Sifefacturaelectronicalote.validapaquete = function (Lote, cb) {
    var url = global.Docker + "709/mule/validapaquete";
    var body = Lote;
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
  Sifefacturaelectronicalote.remoteMethod("validapaquete", {
    accepts: [{ arg: "Lote", type: "object", http: { source: "body" } }],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/validapaquete" },
    description:
      "Servicio de verificación de Lotes",
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifefacturaelectronicalote.remoteMethod("asignaEventoSignificativo", {
    accepts: [
      { arg: "nit", type: "string" },
    ],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/mule/offlineregistraeventos" },
    description:
      "Servicio que solicita asignacion de Codigo de eventos, empaquetado de lotes, envio a SIN y verifica lote exitoso o rechazado.",
  });
  Sifefacturaelectronicalote.asignaEventoSignificativo = function (
    nit,
    cb
  ) {
    var url = global.Docker + "716/mule/offlineregistraeventos";
    var body = {
      nit: nit,
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
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifefacturaelectronicalote.remoteMethod("reenvioLote", {
    accepts: [
      { arg: "nit", type: "string" },
      { arg: "codigoSucursal", type: "string" },
      { arg: "codigoPuntoVenta", type: "string" },
      { arg: "tipoFacturaDocumento", type: "string" },
      { arg: "codigoDocumentoSector", type: "string" },
      { arg: "archivo", type: "string" },
      { arg: "hashArchivo", type: "string" },
      { arg: "cantidadFacturas", type: "string" },
      { arg: "codigoEvento", type: "string" },
      { arg: "codigoEmision", type: "string" },
      { arg: "idlote", type: "string" },
      { arg: "cafc", type: "string" },
    ],
    returns: [
      { arg: "transaccion", type: "string" },
      { arg: "descripcion", type: "string" }
    ],
    http: { verb: "post", path: "/mule/offlineenviopaquete" },
    description:
      "Reenvio del lote que tuvo problema de conexion con los servicios de SIN.",
  });
  Sifefacturaelectronicalote.reenvioLote = function (
    nit,
    codigoSucursal,
    codigoPuntoVenta,
    tipoFacturaDocumento,
    codigoDocumentoSector,
    archivo,
    hashArchivo,
    cantidadFacturas,
    codigoEvento,
    codigoEmision,
    idlote,
    cafc,
    cb
  ) {
    var url = global.Docker + "718/mule/offlineenviopaquete";
    var body = {
      nit: nit,
      codigoSucursal: codigoSucursal,
      codigoPuntoVenta: codigoPuntoVenta,
      tipoFacturaDocumento: tipoFacturaDocumento,
      codigoDocumentoSector: codigoDocumentoSector,
      archivo: archivo,
      hashArchivo: hashArchivo,
      cantidadFacturas: cantidadFacturas,
      codigoEvento: codigoEvento,
      codigoEmision: codigoEmision,
      idlote: idlote,
      cafc: cafc,
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
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Sifefacturaelectronicalote.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifefacturaelectronicalote.observe("before save", function (ctx, next) {
    var date = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
    console.log(
      "> before save: " + date,
      ctx.Model.modelName,
      ctx.instance || ctx.data
    );
    next();
  });
  Sifefacturaelectronicalote.observe("after save", function (ctx, next) {
    //socket.emit('/Sifefacturaelectronicalote/POST',ctx.instance);
    pubsub.publish("Lote_Ingresa", ctx.instance);
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifefacturaelectronicalote.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifefacturaelectronicalote.observe("after delete", function (ctx, next) {
    pubsub.publish(
      "/Sifefacturaelectronicalote/DELETE",
      ctx.instance || ctx.where
    );
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifefacturaelectronicalote.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifefacturaelectronicalote.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifefacturaelectronicalote instance:', ctx.instance);
    } else {
      //console.log('About to update Sifefacturaelectronicalotes that match the query %j:', ctx.where);
    }
    next();
  });
};
