const axios = require("axios");
const https = require("https");
var pubsub = require("../../server/pubsub.js");
var global = require("../../global/global")
module.exports = function (Sifesincronizarparametricaeventossignificativos) {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifesincronizarparametricaeventossignificativos.registroEventoSignificativo =
    function (EventoSignificativo, cb) {
      const instance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      instance
        .post(global.Docker + "706/registra", EventoSignificativo)
        .then((res) => {
          cb(null, res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };
  Sifesincronizarparametricaeventossignificativos.remoteMethod(
    "registroEventoSignificativo",
    {
      http: {
        path: "/registroEventoSignificativo",
        verb: "post",
      },
      accepts: [
        {
          arg: "EventoSignificativo",
          type: "object",
          http: { source: "body" },
        },
      ],
      returns: { arg: "Respuesta", type: "array" },
    }
  );
  /////////////////////////////////////////////////////////////////////////////////////////////////
  Sifesincronizarparametricaeventossignificativos.consultaEventoSignificativo =
    function (EventoSignificativo, cb) {
      const instance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      instance
        .post(global.Docker + "706/consulta", EventoSignificativo)
        .then((res) => {
          cb(null, res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };
  Sifesincronizarparametricaeventossignificativos.remoteMethod(
    "consultaEventoSignificativo",
    {
      http: {
        path: "/consultaEventoSignificativo",
        verb: "post",
      },
      accepts: [
        {
          arg: "EventoSignificativo",
          type: "object",
          http: { source: "body" },
        },
      ],
      returns: { arg: "Respuesta", type: "array" },
    }
  );
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // afterInitialize is a model hook which is still used in loopback
  Sifesincronizarparametricaeventossignificativos.afterInitialize =
    function () {
      // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
      //console.log('> afterInitialize triggered');
    };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Sifesincronizarparametricaeventossignificativos.observe(
    "before save",
    function (ctx, next) {
      //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
      next();
    }
  );
  Sifesincronizarparametricaeventossignificativos.observe(
    "after save",
    function (ctx, next) {
      //socket.emit('/Sifesincronizarparametricaeventossignificativos/POST',ctx.instance);
      pubsub.publish("Evento_Significativo", ctx.instance);
      //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
      next();
    }
  );
  Sifesincronizarparametricaeventossignificativos.observe(
    "before delete",
    function (ctx, next) {
      //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
      next();
    }
  );
  Sifesincronizarparametricaeventossignificativos.observe(
    "after delete",
    function (ctx, next) {
      pubsub.publish(
        "/Sifesincronizarparametricaeventossignificativos/DELETE",
        ctx.instance || ctx.where
      );
      //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
      next();
    }
  );

  // remote method after hook
  Sifesincronizarparametricaeventossignificativos.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifesincronizarparametricaeventossignificativos.observe(
    "before save",
    function (ctx, next) {
      if (ctx.instance) {
        //console.log('About to save a Sifesincronizarparametricaeventossignificativos instance:', ctx.instance);
      } else {
        //console.log('About to update Sifesincronizarparametricaeventossignificativoss that match the query %j:', ctx.where);
      }
      next();
    }
  );
};
