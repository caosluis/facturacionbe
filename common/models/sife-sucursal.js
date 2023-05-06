const axios = require("axios");
const https = require("https");
("use strict");
var pubsub = require("../../server/pubsub.js");
module.exports = function (Sifesucursal) {
  Sifesucursal.cargar_sife_pdv = (cb) => {
    var ds = Sifesucursal.dataSource;
    var sql = `SELECT * 
    FROM sifedb.sife_sucursal as ss,sifedb.sife_pdv as sp
    WHERE ss.codigoSucursal = sp.codigoSucursal`;

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifeautenticacionEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifesucursal.remoteMethod("cargar_sife_pdv", {
    http: { verb: "get" },
    accepts: [],
    returns: { arg: "data", type: ["a"], root: true },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifesucursal.cargar_sife_cuis_empresa_sucursal = (cb) => {
    var ds = Sifesucursal.dataSource;
    var sql = `SELECT ss.id,ss.nit,se.razonSocial,ss.descripcion,ss.codigoSucursal,ss.direccion,ss.departamento,ss.muncipio,ss.vigencia,ss.estado
  FROM sifedb.sife_empresa as se,sifedb.sife_sucursal as ss
  WHERE se.nit = ss.nit;`;

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifeautenticacionEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifesucursal.remoteMethod("cargar_sife_cuis_empresa_sucursal", {
    http: { verb: "get" },
    accepts: [],
    returns: { arg: "data", type: ["a"], root: true },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifesucursal.cierreoperacionessistemas = function (Sucursal, cb) {
    var objeto = {
      id: Sucursal.id,
      nit: Sucursal.nit,
      cuis: Sucursal.cuis,
      codigoSucursal: Sucursal.codigoSucursal,
      codigoPuntoVenta: "0",
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
  Sifesucursal.remoteMethod("cierreoperacionessistemas", {
    http: {
      path: "/cierreoperacionessistemas",
      verb: "post",
    },
    accepts: [{ arg: "Sucursal", type: "object" }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifesucursal.solicitacuissucursal = function (Sucursal, cb) {
    var objeto = {
      nit: Sucursal.nit,
      codigoSucursal: Sucursal.codigoSucursal,
    };
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    instance
      .post(
        global.Docker + "721/mule/solicitacuissucursal",
        objeto
      )
      .then((res) => {
        cb(null, res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Sifesucursal.remoteMethod("solicitacuissucursal", {
    http: {
      path: "/solicitacuissucursal",
      verb: "post",
    },
    accepts: [{ arg: "Sucursal", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifesucursal.solicitacuissucursalmasivo = function (Sucursal, cb) {
    var url =
      global.Docker + "721/mule/solicitacuissucursalmasivo";
    var objeto = {
      nit: Sucursal.nit,
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
  Sifesucursal.remoteMethod("solicitacuissucursalmasivo", {
    http: {
      path: "/solicitacuissucursalmasivo",
      verb: "post",
    },
    accepts: [{ arg: "Sucursal", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Sifesucursal.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifesucursal.observe("before save", function (ctx, next) {
    var date = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
    console.log(
      "> before save: " + date,
      ctx.Model.modelName,
      ctx.instance || ctx.data
    );
    next();
  });
  Sifesucursal.observe("after save", function (ctx, next) {
    //socket.emit('/Sifesucursal/POST',ctx.instance);
    pubsub.publish("Sucursal_Ingresa", ctx.instance);
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifesucursal.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifesucursal.observe("after delete", function (ctx, next) {
    pubsub.publish("/Sifesucursal/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifesucursal.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifesucursal.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifesucursal instance:', ctx.instance);
    } else {
      //console.log('About to update Sifesucursals that match the query %j:', ctx.where);
    }
    next();
  });
};
