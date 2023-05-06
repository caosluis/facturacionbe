var pubsub = require("../../server/pubsub.js");
var global = require("../../global/global")
module.exports = function (Sifecufd) {
  Sifecufd.cargar_sife_cufd = (Anio, Mes, Dia, Empresa, Sucursal, PDV, cb) => {
    var ds = Sifecufd.dataSource;
    var sql =
      "SELECT *" +
      " FROM sifedb.sife_cufd" +
      " WHERE nit in ('" +
      Empresa +
      "')" +
      " and codigoSucursal in ('" +
      Sucursal +
      "')" +
      " and codigoPDV in ('" +
      PDV +
      "')" +
      " ORDER BY fechaVigencia";

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifecufdEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifecufd.remoteMethod("cargar_sife_cufd", {
    http: { verb: "get" },
    accepts: [
      { arg: "Anio", type: ["string"] },
      { arg: "Mes", type: ["string"] },
      { arg: "Dia", type: ["string"] },
      { arg: "Empresa", type: ["string"] },
      { arg: "Sucursal", type: ["string"] },
      { arg: "PDV", type: ["string"] },
    ],
    returns: { arg: "data", type: ["a"], root: true },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifecufd.nitSifeCufd = (nit, cb) => {
    var ds = Sifecufd.dataSource;
    var sql = "DELETE" + " FROM sifedb.sife_cufd" + " WHERE nit='" + nit + "' ";

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifecufdEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifecufd.remoteMethod("nitSifeCufd", {
    http: { verb: "delete" },
    accepts: [{ arg: "nit", type: ["number"] }],
    returns: { arg: "data", type: ["number"], root: true },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifecufd.solicitacufdmasivo = function (nit, cb) {
    var url = global.Docker + "722/mule/solicitacufdmasivo";
    var objeto = {
      nit: nit.nit,
    };
    console.log(objeto);
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
  Sifecufd.remoteMethod("solicitacufdmasivo", {
    accepts: [{ arg: "nit", type: "object", http: { source: "body" } }],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/solicitacufdmasivo" },
    description:
      "Servicio request para solicitar la Renovacion de todos los CUFD de PDV",
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifecufd.enviarcufdSAP = function (cufd, cb) {
    var url = global.Docker + "707/mule/respuestadiaria";
    var objeto = {
      cuis: cufd.cuis,
      cufd: cufd.cufd,
      nit: cufd.nit,
      codigoSucursal: cufd.codigoSucursal,
      codigoPDV: cufd.codigoPDV,
      fechaVigencia: cufd.fechaVigencia,
      fechaCreacion: cufd.fechaCreacion,
      codigoControl: cufd.codigoControl,
      direccion: cufd.direccion,
      tipo: cufd.tipo
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
  Sifecufd.remoteMethod("enviarcufdSAP", {
    accepts: [{ arg: "cufd", type: "object", http: { source: "body" } }],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/enviarcufdSAP" },
    description:
      "Servicio request para enviar los CUFD de PDV a SAP",
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Sifecufd.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifecufd.observe("before save", function (ctx, next) {
    /*  console.log(
      "> before save triggered:",
      ctx.Model.modelName,
      ctx.instance || ctx.data
    ); */
    next();
  });
  Sifecufd.observe("after save", function (ctx, next) {
    //socket.emit('/Sifecufd/POST',ctx.instance);
    pubsub.publish(
      "Ingresa_Cufd",
      ctx.instance || Object.assign(ctx.data, ctx.where)
    );
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance || Object.assign(ctx.data,ctx.where));
    next();
  });
  Sifecufd.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifecufd.observe("after delete", function (ctx, next) {
    pubsub.publish("/Sifecufd/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifecufd.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifecufd.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifecufd instance:', ctx.instance);
    } else {
      //console.log('About to update Sifecufds that match the query %j:', ctx.where);
    }
    next();
  });
};
