"use strict";
var global = require("../../global/global")
var pubsub = require("../../server/pubsub.js");
module.exports = function (Elasticrest) {
  //Consumir Nuevo valor Producto
  Elasticrest._search = function (elastic_query, cb) {
    var url =
      global.Docker + "39/_search";
    /* var body = { descripcion: descripcion, idUsuario: idUsuario }; */
    pubsub.serviceConsumer(url, elastic_query, function (data, err) {
      if (data != null) {
        var json = JSON.parse(data);
        cb(null, json);
      }
      if (err != null) {
        cb(null, err);
      }
    });
  };
  Elasticrest.remoteMethod("_search", {
    accepts: [
      { arg: "descripcion", type: "object", http: { source: "body" } }
    ],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/_search" },
    description:
      "Servicio request para cargar los estados cargados en elastic que esten en estado Down",
  });
};
