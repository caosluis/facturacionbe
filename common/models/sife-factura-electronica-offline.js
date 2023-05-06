var pubsub = require("../../server/pubsub.js");
module.exports = function (Sifefacturaelectronicaoffline) {
  //1) PUNTO DE VENTA AGRUPADOS POR EL TIPO DE EVENTO SIGNIFICATIVO sin Codigo de evento
  Sifefacturaelectronicaoffline.grupoTipoEvento = (nit, cb) => {
    var ds = Sifefacturaelectronicaoffline.dataSource;
    var sql =
      " SELECT Distinct(nit), codigoSucursal, codigoPuntoVenta, cuis, codigoClasificadorEvento, cafc, cufd " +
      " FROM sifedb.sife_facturaElectronica_offline " +
      " WHERE codigoRecepcionEventoSignificativo = 0 AND estado = 4 " +
      " AND fechaEmision > DATE_SUB(now(), INTERVAL 48 HOUR) " +
      " AND nit = " + nit + ";";

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifefacturaelectronicaofflineEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifefacturaelectronicaoffline.remoteMethod("grupoTipoEvento", {
    http: { verb: "get" },
    accepts: [{ arg: "nit", type: ["number"] }],
    returns: { arg: "data", type: ["a"], root: true },
  });

  //2) RANGO DE FECHAS DE UN GRUPO DE FACTURAS OFFLINE POR TIPO DE EVENTO DE UN PDV
  Sifefacturaelectronicaoffline.rangoFechaTipoEvento = (
    nit,
    codigoSucursal,
    codigoPuntoVenta,
    codigoClasificadorEvento,
    cafc,
    cb
  ) => {
    var ds = Sifefacturaelectronicaoffline.dataSource;
    var sql =
      "SELECT " +
      " DATE_ADD(MAX(fechaEmision), INTERVAL 2 SECOND) as fechaFin, " +
      " DATE_SUB(MIN(fechaEmision), INTERVAL 1 SECOND) as fechaInicio " +
      " FROM sifedb.sife_facturaElectronica_offline " +
      " WHERE nit = " + nit +
      " AND codigoSucursal = " + codigoSucursal +
      " AND codigoPuntoVenta = " + codigoPuntoVenta +
      " AND codigoClasificadorEvento = " + codigoClasificadorEvento +
      " AND cafc = '" + cafc + "'" +
      " AND codigoRecepcionEventoSignificativo = 0 " +
      " AND estado = 4 " +
      " AND fechaEmision > DATE_SUB(now(), INTERVAL 24 HOUR); ";

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifefacturaelectronicaofflineEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifefacturaelectronicaoffline.remoteMethod("rangoFechaTipoEvento", {
    http: { verb: "get" },
    accepts: [
      { arg: "nit", type: ["number"] },
      { arg: "codigoSucursal", type: ["number"] },
      { arg: "codigoPuntoVenta", type: ["number"] },
      { arg: "codigoClasificadorEvento", type: ["number"] },
      { arg: "cafc", type: ["string"] },
    ],
    returns: { arg: "data", type: ["a"], root: true },
  });

  //3) Obteniendo los codigoDocumentoSector de un codigoRecepcionEventoSignificativo
  Sifefacturaelectronicaoffline.codigoDocumentoSectorEvento = (
    nit,
    codigoSucursal,
    codigoPuntoVenta,
    codigoRecepcionEventoSignificativo,
    cafc,
    cb
  ) => {
    var ds = Sifefacturaelectronicaoffline.dataSource;
    var sql =
      "SELECT " +
      " DISTINCT(codigoDocumentoSector) as codigoDocumentoSector, tipoFacturaDocumento  " +
      " FROM sifedb.sife_facturaElectronica_offline " +
      " WHERE nit = " + nit +
      " AND codigoSucursal = " + codigoSucursal +
      " AND codigoPuntoVenta = " + codigoPuntoVenta +
      " AND codigoRecepcionEventoSignificativo = " + codigoRecepcionEventoSignificativo +
      " AND cafc = '" + cafc + "'"
    " AND estado = 5;";

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifefacturaelectronicaofflineEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifefacturaelectronicaoffline.remoteMethod("codigoDocumentoSectorEvento", {
    http: { verb: "get" },
    accepts: [
      { arg: "nit", type: ["number"] },
      { arg: "codigoSucursal", type: ["number"] },
      { arg: "codigoPuntoVenta", type: ["number"] },
      { arg: "codigoRecepcionEventoSignificativo", type: ["number"] },
      { arg: "cafc", type: ["string"] },
    ],
    returns: { arg: "data", type: ["a"], root: true },
  });

  //GRUPO DE FACTURAS POR  codigoEvento = (codigoRecepcionEventoSignificativo)
  Sifefacturaelectronicaoffline.sifeOffline = (nit, cb) => {
    var ds = Sifefacturaelectronicaoffline.dataSource;
    var sql =
      "SELECT Distinct(nit), codigoSucursal, codigoPuntoVenta, cuis, codigoDocumentoSector, codigoClasificadorEvento, codigoRecepcionEventoSignificativo " +
      " FROM sifedb.sife_facturaElectronica_offline WHERE estado = 5 ";

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifefacturaelectronicaofflineEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifefacturaelectronicaoffline.remoteMethod("sifeOffline", {
    http: { verb: "get" },
    accepts: [{ arg: "nit", type: ["number"] }],
    returns: { arg: "data", type: ["a"], root: true },
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function Factura_Entrante() {
    pubsub.publish("Factura Offline Ingresa", "");
  }
  var t = setInterval(Factura_Entrante, 15000);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Sifefacturaelectronicaoffline.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifefacturaelectronicaoffline.observe("before save", function (ctx, next) {
    /* console.log(
      "> before save triggered:",
      ctx.Model.modelName,
      ctx.instance || ctx.data
    ); */
    next();
  });
  Sifefacturaelectronicaoffline.observe("after save", function (ctx, next) {
    //socket.emit('/Sifefacturaelectronicaoffline/POST',ctx.instance);
    pubsub.publish(
      "Factura Offline Ingresa",
      ctx.instance || Object.assign(ctx.data, ctx.where)
    );
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
    next();
  });
  Sifefacturaelectronicaoffline.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifefacturaelectronicaoffline.observe("after delete", function (ctx, next) {
    pubsub.publish(
      "/Sifefacturaelectronicaoffline/DELETE",
      ctx.instance || ctx.where
    );
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifefacturaelectronicaoffline.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifefacturaelectronicaoffline.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifefacturaelectronicaoffline instance:', ctx.instance);
    } else {
      //console.log('About to update Sifefacturaelectronicaofflines that match the query %j:', ctx.where);
    }
    next();
  });
};
