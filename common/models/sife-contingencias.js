"use strict";
var pubsub = require("../../server/pubsub.js");
module.exports = function (Sifecontingencias) {
  Sifecontingencias.getCodigoContingencia = (cuis, fecha, cb) => {
    var ds = Sifecontingencias.dataSource;
    var sql =
      "SELECT  id, cuis, codigoMotivoEvento, codigoRecepcionEventoSignificativo, fechaHoraInicioEvento, fechaHoraFinEvento " +
      " FROM sifedb.sife_contingencias" +
      " WHERE" +
      " TIMESTAMP('" +
      fecha +
      "') BETWEEN TIMESTAMP(fechaHoraInicioEvento) AND TIMESTAMP(fechaHoraFinEvento)" +
      " AND cuis = '" +
      cuis +
      "';";

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifecontingenciasEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifecontingencias.remoteMethod("getCodigoContingencia", {
    http: { verb: "get" },
    accepts: [
      { arg: "cuis", type: ["string"] },
      { arg: "fecha", type: ["string"] },
    ],
    returns: { arg: "data", type: "object", root: true },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifecontingencias.cantidadContingencias = (Year, Month, Day, cb) => {
    var ds = Sifecontingencias.dataSource;
    var sql =
      "SELECT count(*) as count FROM sifedb.sife_contingencias " +
      "WHERE YEAR(fechaHoraInicioEvento)='" +
      Year +
      "'AND " +
      "MONTH(fechaHoraInicioEvento)='" +
      Month +
      "' AND " +
      "DAY(fechaHoraInicioEvento)='" +
      Day +
      "' ;";

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifecontingenciashEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifecontingencias.remoteMethod("cantidadContingencias", {
    http: { verb: "get" },
    accepts: [
      { arg: "Year", type: ["number"] },
      { arg: "Month", type: ["number"] },
      { arg: "Day", type: ["number"] },
    ],
    returns: { arg: "data", type: ["number"], root: true },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Sifecontingencias.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifecontingencias.observe("before save", function (ctx, next) {
    //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
    next();
  });
  Sifecontingencias.observe("after save", function (ctx, next) {
    //socket.emit('/Sifecontingencias/POST',ctx.instance);
    pubsub.publish("Evento_Significativo", "");
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifecontingencias.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifecontingencias.observe("after delete", function (ctx, next) {
    pubsub.publish("/Sifecontingencias/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifecontingencias.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifecontingencias.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifecontingencias instance:', ctx.instance);
    } else {
      //console.log('About to update Sifecontingenciass that match the query %j:', ctx.where);
    }
    next();
  });
};
