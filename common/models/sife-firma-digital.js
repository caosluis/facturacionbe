'use strict';

var pubsub = require('../../server/pubsub.js');
var global = require("../../global/global")
module.exports = function (Sifefirmadigital) {
  //1) ENVIO DE NOTIFICACION DE CERTIFICADO REVOCADOA A IMPUESTOS NACIONALES MEDIANE MULE
  Sifefirmadigital.remoteMethod("notificaCertificadoRevocado", {
    accepts: [
      { arg: "nit", type: "string" },
      { arg: "id", type: "string" },
      { arg: "razonRevocacion", type: "string" },
    ],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/notificaCertificadoRevocado" },
    description:
      "Servicio de notificacertificadorevocado desde MULE",
  });
  Sifefirmadigital.notificaCertificadoRevocado = function (nit, id, razonRevocacion, cb) {
    var url = global.Docker + "721/mule/notificacertificadorevocado";
    var body = {
      nit: nit,
      id: id,
      razonRevocacion: razonRevocacion,
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

  //2) VALIDACION DE VIGENCIA DE FIRMA VALIDADA
  Sifefirmadigital.validaFirma = (nit, fechaEmision, cb) => {
    var ds = Sifefirmadigital.dataSource;
    var sql =
      "SELECT TIMESTAMPDIFF(DAY, '" + fechaEmision + "', (SELECT fechaVigencia " +
      " FROM sifedb.sife_firmaDigital " +
      " WHERE estado = 1 " +
      " AND tipo = 'Firma validada'  " +
      " AND empresa = " + nit +
      " limit 1 )) AS diasVigencia;";

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifefirmadigitalEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifefirmadigital.remoteMethod("validaFirma", {
    http: { verb: "get" },
    accepts: [
      { arg: "nit", type: ["string"] },
      { arg: "fechaEmision", type: ["string"] },
    ],
    returns: { arg: "diasVigencia", type: ["string"], root: true },
    description:
      "Vigencia de firma contra la fecha de emision",
  });
  // afterInitialize is a model hook which is still used in loopback
  Sifefirmadigital.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifefirmadigital.observe('before save', function (ctx, next) {
    //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
    next();
  });
  Sifefirmadigital.observe('after save', function (ctx, next) {
    //socket.emit('/Sifefirmadigital/POST',ctx.instance);
    pubsub.publish('/Sifefirmadigital/POST', ctx.instance || Object.assign(ctx.data, ctx.where));
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifefirmadigital.observe('before delete', function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifefirmadigital.observe('after delete', function (ctx, next) {
    pubsub.publish('/Sifefirmadigital/DELETE', (ctx.instance || ctx.where));
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifefirmadigital.afterRemote('revEngine', function (context, remoteMethodOutput, next) {
    //console.log('Turning off the engine, removing the key.');
    next();
  });

  // model operation hook
  Sifefirmadigital.observe('before save', function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifefirmadigital instance:', ctx.instance);
    } else {
      //console.log('About to update Sifefirmadigitals that match the query %j:', ctx.where);
    }
    next();
  });
};
