const axios = require("axios");
const https = require("https");

("use strict");
var pubsub = require("../../server/pubsub.js");
var global = require("../../global/global")
module.exports = function (Sifepdv) {
  Sifepdv.cargar_sife_pdv = (cb) => {
    var ds = Sifepdv.dataSource;
    var sql = `SELECT sp.cuis,sp.codigoSucursal,sp.codigoTipoPuntoVenta,sp.descripcion,sp.nit,sp.nombrePuntoVenta,sp.codigoPDV,sp.cuis,ss.descripcion,ss.vigencia
    FROM sifedb.sife_sucursal as ss,sifedb.sife_pdv as sp
    WHERE ss.codigoSucursal = sp.codigoSucursal`;

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifeautenticacionEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifepdv.remoteMethod("cargar_sife_pdv", {
    http: { verb: "post" },
    accepts: [],
    returns: { arg: "data", type: ["a"], root: true },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifepdv.sife_get_pdv_cufd = (cuis, cb) => {
    var ds = Sifepdv.dataSource;
    var sql =
      `SELECT sp.cuis,sp.codigoSucursal,sc.cufd,sc.cufd as cufdEvento,sp.codigoPDV,sp.nit FROM sifedb.sife_pdv sp, sifedb.sife_cufd sc
    WHERE sp.cuis= '` +
      cuis +
      `'
    AND sp.cuis = sc.cuis;`;

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifeautenticacionEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifepdv.remoteMethod("sife_get_pdv_cufd", {
    http: { verb: "get" },
    accepts: [{ arg: "cuis", type: ["string"] }],
    returns: { arg: "data", type: ["a"], root: true },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifepdv.registropdv = function (PDV, cb) {
    var objeto = {
      codigoSucursal: PDV.codigoSucursal,
      codigoTipoPuntoVenta: PDV.codigoTipoPuntoVenta,
      valorTipoPuntoVenta: PDV.valorTipoPuntoVenta,
      cuis: PDV.cuis,
      descripcion: PDV.descripcion,
      nit: PDV.nit,
      nombrePuntoVenta: PDV.nombrePuntoVenta,
      solicitudCuis: PDV.solicitudCuis,
      telefono: PDV.telefono,
    };
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    instance
      .post(global.Docker + "723/mule/registropdv", objeto)
      .then((res) => {
        cb(null, res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Sifepdv.remoteMethod("registropdv", {
    http: {
      path: "/registropdv",
      verb: "post",
    },
    accepts: [{ arg: "PDV", type: "object" }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifepdv.consultapdv = function (PDV, cb) {
    var objeto = {
      nit: PDV.nit,
      codigoSucursal: PDV.codigoSucursal,
      cuis: PDV.cuis,
    };
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    instance
      .post(global.Docker + "723/mule/consultapdv", objeto)
      .then((res) => {
        cb(null, res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Sifepdv.remoteMethod("consultapdv", {
    http: {
      path: "/consultapdv",
      verb: "post",
    },
    accepts: [{ arg: "PDV", type: "object" }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifepdv.cierrepdv = function (PDV, CuisSucursal, cb) {
    var objeto = {
      id: PDV.id,
      nit: PDV.nit,
      codigoSucursal: PDV.codigoSucursal,
      cuis: CuisSucursal,
      codigoPuntoVenta: PDV.codigoPDV,
    };

    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    instance
      .post(global.Docker + "723/mule/cierrepdv", objeto)
      .then((res) => {
        cb(null, res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Sifepdv.remoteMethod("cierrepdv", {
    http: {
      path: "/cierrepdv",
      verb: "post",
    },
    accepts: [
      { arg: "PDV", type: "object" },
      { arg: "CuisSucursal", type: "string" },
    ],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifepdv.cierreoperacionessistemas = function (PDV, cb) {
    var objeto = {
      id: PDV.id,
      nit: PDV.nit,
      cuis: PDV.cuis,
      codigoSucursal: PDV.codigoSucursal,
      codigoPuntoVenta: PDV.codigoPDV,
    };
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    instance
      .post(
        global.Docker + "723/mule/cierreoperacionessistemas",
        objeto
      )
      .then((res) => {
        cb(null, res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Sifepdv.remoteMethod("cierreoperacionessistemas", {
    http: {
      path: "/cierreoperacionessistemas",
      verb: "post",
    },
    accepts: [{ arg: "PDV", type: "object" }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifepdv.solicitacuispdv = function (PDV, cb) {
    var objeto = {
      nit: PDV.nit,
      codigoSucursal: PDV.codigoSucursal,
      codigoPuntoVenta: PDV.codigoPDV,
    };
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    instance
      .post(global.Docker + "721/mule/solicitacuispdv", objeto)
      .then((res) => {
        cb(null, res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Sifepdv.remoteMethod("solicitacuispdv", {
    http: {
      path: "/solicitacuispdv",
      verb: "post",
    },
    accepts: [{ arg: "PDV", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifepdv.solicitacufd = function (PDV, cb) {
    var url = global.Docker + "722/mule/solicitacufd";
    var objeto = {
      nit: PDV.nit,
      cuis: PDV.cuis,
      codigoSucursal: PDV.codigoSucursal,
      codigoPuntoVenta: PDV.codigoPDV,
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
  Sifepdv.remoteMethod("solicitacufd", {
    http: {
      path: "/solicitacufd",
      verb: "post",
    },
    accepts: [{ arg: "PDV", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifepdv.solicitacuispdvmasivo = function (PDV, cb) {
    var url = global.Docker + "721/mule/solicitacuispdvmasivo";
    var objeto = {
      nit: PDV.nit,
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
  Sifepdv.remoteMethod("solicitacuispdvmasivo", {
    http: {
      path: "/solicitacuispdvmasivo",
      verb: "post",
    },
    accepts: [{ arg: "PDV", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Sifepdv.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifepdv.observe("before save", function (ctx, next) {
    //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
    next();
  });
  Sifepdv.observe("after save", function (ctx, next) {
    //socket.emit('/Sifepdv/POST',ctx.instance);
    pubsub.publish("PDV_Ingresa", ctx.instance);
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifepdv.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifepdv.observe("after delete", function (ctx, next) {
    pubsub.publish("/Sifepdv/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifepdv.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifepdv.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifepdv instance:', ctx.instance);
    } else {
      //console.log('About to update Sifepdvs that match the query %j:', ctx.where);
    }
    next();
  });
};
