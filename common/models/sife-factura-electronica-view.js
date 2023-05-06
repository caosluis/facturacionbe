const axios = require("axios");
const https = require("https");

("use strict");
var pubsub = require("../../server/pubsub.js");
var global = require("../../global/global")
module.exports = function (Sifefacturaelectronicaview) {
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  Sifefacturaelectronicaview.anulacionfactura = function (Factura, cb) {
    var objeto = {
      codigoDocumentoSector: Factura.codigoDocumentoSector.toString(),
      codigoMotivo: Factura.codigoMotivo.toString(),
      codigoPuntoVenta: Factura.codigoPuntoVenta.toString(),
      codigoSucursal: Factura.codigoSucursal.toString(),
      cuf: Factura.cuf.toString(),
      nit: Factura.nit.toString(),
    };
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    instance
      .post(
        global.Docker + "704/mule/anulacionfactura",
        JSON.stringify(objeto)
      )
      .then((res) => {
        cb(null, res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Sifefacturaelectronicaview.remoteMethod("anulacionfactura", {
    http: {
      path: "/anulacionfactura",
      verb: "post",
    },
    accepts: [{ arg: "Factura", type: "object" }],
    returns: { arg: "Respuesta", type: "array" },
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  Sifefacturaelectronicaview.reversionanulacionfactura = function (
    Factura,
    cb
  ) {
    var url =
      global.Docker + "704/mule/reversionanulacionfactura";

    var objeto = {
      codigoDocumentoSector: Factura.codigoDocumentoSector.toString(),
      codigoPuntoVenta: Factura.codigoPuntoVenta.toString(),
      codigoSucursal: Factura.codigoSucursal.toString(),
      cuf: Factura.cuf.toString(),
      nit: Factura.nit.toString(),
    };

    pubsub.serviceConsumer(url, objeto, function (data, err) {
      if (data != null) {
        var json = JSON.parse(data);
        cb(null, json);
      }
      if (err != null) {
        cb(null, err);
      }
    });
  };
  Sifefacturaelectronicaview.remoteMethod("reversionanulacionfactura", {
    http: {
      path: "/reversionanulacionfactura",
      verb: "post",
    },
    accepts: [{ arg: "Factura", type: "object", http: { source: "body" } }],
    returns: [{ arg: "Respuesta", type: "string" }],
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifefacturaelectronicaview.registroFacturasRegularizacion = function (
    Factura,
    cb
  ) {
    var objeto = {
      codigoDocumentoSector: Factura.codigoDocumentoSector.toString(),
      actividadEconomica: Factura.actividadEconomica.toString(),
      direccion: Factura.direccion.toString(),
      codigoPuntoVenta: Factura.codigoPuntoVenta.toString(),
      codigoSucursal: Factura.codigoSucursal.toString(),
      cuf: Factura.cuf.toString(),
      nit: Factura.nit.toString(),
    };

    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    instance
      .post(
        global.Docker + "704/mule/registroFacturasRegularizacion",
        objeto
      )
      .then((res) => {
        cb(null, res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Sifefacturaelectronicaview.remoteMethod("registroFacturasRegularizacion", {
    http: {
      path: "/registroFacturasRegularizacion",
      verb: "post",
    },
    accepts: [{ arg: "Factura", type: "object" }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifefacturaelectronicaview.verificacionestadofactura = function (
    Factura,
    cb
  ) {
    console.log(Factura);
    var objeto = {
      codigoPuntoVenta: Factura.codigoPuntoVenta.toString(),
      codigoSucursal: Factura.codigoSucursal.toString(),
      nit: Factura.nit.toString(),
      codigoDocumentoSector: Factura.codigoDocumentoSector.toString(),
      cuf: Factura.cuf.toString(),
      tipoFacturaDocumento: Factura.tipoFacturaDocumento.toString(),
    };

    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    instance
      .post(
        global.Docker + "705/mule/verificacionestadofactura",
        objeto
      )
      .then((res) => {
        cb(null, res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Sifefacturaelectronicaview.remoteMethod("verificacionestadofactura", {
    http: {
      path: "/verificacionestadofactura",
      verb: "post",
    },
    accepts: [{ arg: "Factura", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////

  // afterInitialize is a model hook which is still used in loopback
  Sifefacturaelectronicaview.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifefacturaelectronicaview.observe("before save", function (ctx, next) {
    /* console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data); */
    next();
  });
  Sifefacturaelectronicaview.observe("after save", function (ctx, next) {
    //socket.emit('/Sifefacturaelectronicaview/POST',ctx.instance);
    pubsub.publish(
      "Factura View Entrante",
      ctx.instance || Object.assign(ctx.data, ctx.where)
    );
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
    next();
  });
  Sifefacturaelectronicaview.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifefacturaelectronicaview.observe("after delete", function (ctx, next) {
    pubsub.publish(
      "/Sifefacturaelectronicaview/DELETE",
      ctx.instance || ctx.where
    );
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifefacturaelectronicaview.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifefacturaelectronicaview.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifefacturaelectronicaview instance:', ctx.instance);
    } else {
      //console.log('About to update Sifefacturaelectronicaviews that match the query %j:', ctx.where);
    }
    next();
  });
};
