"use strict";
var pubsub = require("../../server/pubsub.js");
module.exports = function (Siferoles) {
  // afterInitialize is a model hook which is still used in loopback
  Siferoles.afterInitialize = function () {
    // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
    //console.log('> afterInitialize triggered');
  };

  // the rest are all operation hooks
  // - http://docs.strongloop.com/display/public/LB/Operation+hooks
  Siferoles.observe("before save", function (ctx, next) {
    var date = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
    console.log(
      "> before save: " + date,
      ctx.Model.modelName,
      ctx.instance || ctx.data
    );
    next();
  });
  Siferoles.observe("after save", function (ctx, next) {
    //socket.emit('/Siferoles/POST',ctx.instance);
    pubsub.publish("Role_Ingresa", ctx.instance);
    //console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Siferoles.observe("before delete", function (ctx, next) {
    //console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
    next();
  });
  Siferoles.observe("after delete", function (ctx, next) {
    pubsub.publish("/Siferoles/DELETE", ctx.instance || ctx.where);
    //console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
    next();
  });

  // remote method after hook
  Siferoles.afterRemote(
    "revEngine",
    function (context, remoteMethodOutput, next) {
      //console.log('Turning off the engine, removing the key.');
      next();
    }
  );

  // model operation hook
  Siferoles.observe("before save", function (ctx, next) {
    if (ctx.instance) {
      //console.log('About to save a Siferoles instance:', ctx.instance);
    } else {
      //console.log('About to update Siferoless that match the query %j:', ctx.where);
    }
    next();
  });
};
