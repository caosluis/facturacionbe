const axios = require("axios");
const https = require("https");
("use strict");
var pubsub = require("../../server/pubsub.js");
var global = require("../../global/global")
module.exports = function (Sifedimproducto) {
  Sifedimproducto.respuestadiaria = function (Productos, cb) {
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    instance
      .post(
        global.Docker + "707/mule/respuestadiaria",
        Productos
      )
      .then((res) => {
        cb(null, res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  Sifedimproducto.remoteMethod("respuestadiaria", {
    http: {
      path: "/respuestadiaria",
      verb: "post",
    },
    accepts: [{ arg: "Productos", type: "object", http: { source: "body" } }],
    returns: { arg: "Respuesta", type: "array" },
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////

  Sifedimproducto.observe("before save", function (ctx, next) {
    //const utf8 = require('utf8');
    //console.log('> before save triggered:', ctx.Model.modelName, ctx.instance );
    //if(ctx.instance.Producto != null){
    //    ctx.instance.Producto = utf8.encode(ctx.instance.Producto.trim());
    //}
    //if(ctx.instance.IdProdFabrica != null){
    //    ctx.instance.IdProdFabrica = utf8.encode(ctx.instance.IdProdFabrica.trim());
    //}
    //if(ctx.instance.IdProdConso != null){
    //   ctx.instance.IdProdConso = utf8.encode(ctx.instance.IdProdConso.trim());
    //}
    //if(ctx.instance.IdProdSBO != null){
    //    ctx.instance.IdProdSBO = utf8.encode(ctx.instance.IdProdSBO.trim());
    //}
    next();
  });
  Sifedimproducto.observe("after save", function (ctx, next) {
    //socket.emit('/Sifedimproducto/POST',ctx.instance);
    pubsub.publish("Producto_Ingresa", ctx.instance);
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifedimproducto.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Sifedimproducto.observe("after delete", function (ctx, next) {
    pubsub.publish("/Sifedimproducto/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Sifedimproducto.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Sifedimproducto.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Sifedimproducto instance:', ctx.instance);
    } else {
      //console.log('About to update Sifedimproductos that match the query %j:', ctx.where);
    }
    next();
  });
};
