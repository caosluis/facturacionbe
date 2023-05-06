var pubsub = require("../../server/pubsub.js");
module.exports = function (Sifetoken) {
  Sifetoken.cargar_sife_token = (Anio, Mes, Dia, cb) => {
    var ds = Sifetoken.dataSource;
    var sql = `SELECT * 
        FROM sifedb.sife_token
        ORDER BY fechaCreacion desc`;

    ds.connector.query(sql, (err, instance) => {
      if (err) console.error(err);
      // pubsub.publish('/SifeautenticacionEntrante/get', instance);
      cb(err, instance);
    });
  };
  Sifetoken.remoteMethod("cargar_sife_token", {
    http: { verb: "get" },
    accepts: [
      { arg: "Anio", type: ["string"] },
      { arg: "Mes", type: ["string"] },
      { arg: "Dia", type: ["string"] },
    ],
    returns: { arg: "data", type: ["a"], root: true },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifetoken.autenticacion = function (token, cb) {
    var url = global.Docker + "720/mule/autenticacion";
    var body = {
      modulo: token.modulo,
      wsdl: token.wsdl,
      nit: token.nit,
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
  Sifetoken.remoteMethod("autenticacion", {
    accepts: [
      { arg: "autenticacion", type: "object", http: { source: "body" } },
    ],
    returns: [{ arg: "respuesta", type: "array" }],
    http: { verb: "post", path: "/autenticacion" },
    description: "Servicio de autenticacion",
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // remote method before hooks
  Sifetoken.beforeRemote("revEngine", function (context, unused, next) {
    //console.log('Putting in the Sifeautenticacion key, starting the engine.');
    next();
  });

  // afterInitialize is a model hook which is still used in loopback
  Sifetoken.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifetoken.observe("before save", function (ctx, next) {
    // console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
    next();
  });
  Sifetoken.observe("after save", function (ctx, next) {
    //socket.emit('/Sifeautenticacion/POST',ctx.instance);
    pubsub.publish("IngresoToken", ctx.instance || ctx.data);
    // pubsub.publish('/Sifeautenticacion/POST', ctx.where.id);
    // console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    // console.log(ctx.instance || ctx.data)
    next();
  });
  Sifetoken.observe("before delete", function (ctx, next) {
    // console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifetoken.observe("after delete", function (ctx, next) {
    pubsub.publish("/Sifeautenticacion/DELETE", ctx.instance || ctx.where);
    // console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifetoken.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifetoken.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifeautenticacion instance:', ctx.instance);
    } else {
      //console.log('About to update Sifeautenticacions that match the query %j:', ctx.where);
    }
    next();
  });
};
