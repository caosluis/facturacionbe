"use strict";
var global = require("../../global/global")
var pubsub = require("../../server/pubsub.js");
module.exports = function (Mulerest) {
  //Bloque de metodos repmotos para consumir API REST

  //Consumir Nuevo valor Producto
  Mulerest.remoteMethod("NuevoValorProducto", {
    accepts: [
      { arg: "descripcion", type: "string" },
      { arg: "idUsuario", type: "string" },
    ],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/NuevoValorProducto" },
    description:
      "Servicio de recepcion Solicitud Nuevo Valor Producto en hanlpzdk01.hansa.com.bo:702",
  });
  Mulerest.NuevoValorProducto = function (descripcion, idUsuario, cb) {
    var url =
      global.Docker + "702/recepcionSolicitudNuevoValorProducto";
    var body = { descripcion: descripcion, idUsuario: idUsuario };
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
  //Consumir Verificar codigo nuevo valor producto
  Mulerest.remoteMethod("VerificarNuevoValorProducto", {
    accepts: [
      { arg: "codigoSolicitud", type: "string" },
      { arg: "idUsuario", type: "string" },
    ],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/validacionSolicitudNuevoValorProducto" },
    description:
      "Servicio que valida el codigo de Nuevo Valor Producto en hanlpzdk01.hansa.com.bo:702",
  });
  Mulerest.VerificarNuevoValorProducto = function (
    codigoSolicitud,
    idUsuario,
    cb
  ) {
    var url =
      "http://hanlpzdk01.hansa.com.bo:702/validacionSolicitudNuevoValorProducto";
    var body = { codigoSolicitud: codigoSolicitud, idUsuario: idUsuario };
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

  //Consumir Sincronizar catalogos
  Mulerest.remoteMethod("sincronizar", {
    accepts: [{ arg: "datos_sincronizar", type: "object", http: { source: "body" } }],
    returns: [{ arg: "respuesta", type: "array" }],
    http: { verb: "post", path: "/sincronizar" },
    description: "Servicio de sincronizacion docker-qas.hansa.com.bo:701",
  });
  Mulerest.sincronizar = function (datos_sincronizar, cb) {
    var url =
      global.Docker + "701/sincronizar" +
      datos_sincronizar.ServicioWeb;
    var body = {
      nit: datos_sincronizar.nit.toString(),
      codigoSucursal: datos_sincronizar.codigoSucursal.toString(),
      codigoPDV: datos_sincronizar.codigoPDV.toString(),
      id: datos_sincronizar.id.toString(),
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

  //Consumir Sincronizar catalogos sincronizarTodo
  Mulerest.remoteMethod("sincronizarTodo", {
    accepts: [{ arg: "PDV", type: "object", http: { source: "body" } }],
    returns: [{ arg: "respuesta", type: "array" }],
    http: { verb: "post", path: "/sincronizarTodo" },
    description: "Servicio de sincronizar Todo docker-qas.hansa.com.bo:701",
  });
  Mulerest.sincronizarTodo = function (datos_sincronizar, cb) {
    var url = global.Docker + "701/sincronizar";
    var body = {
      nit: datos_sincronizar.nit.toString(),
      codigoSucursal: datos_sincronizar.codigoSucursal.toString(),
      codigoPDV: datos_sincronizar.codigoPDV.toString(),
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
  //Consumir CUIS (Empresa)
  Mulerest.remoteMethod("solicitudCuis", {
    accepts: [
      { arg: "codigoSistema", type: "string" },
      { arg: "codigoSucursal", type: "string" },
      { arg: "nit", type: "string" },
    ],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/solicitudCuis" },
    description:
      "Servicio de creacion de cuis empresa hanlpzdk01.hansa.com.bo:700",
  });
  Mulerest.solicitudCuis = function (codigoSistema, codigoSucursal, nit, cb) {
    var url = "http://hanlpzdk01.hansa.com.bo:700/solicitudCuis";
    var body = {
      codigoSistema: codigoSistema,
      codigoSucursal: codigoSucursal,
      nit: nit,
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
  //Registro punto de venta
  Mulerest.remoteMethod("registroPuntoVenta", {
    accepts: [
      { arg: "codigoSucursal", type: "string" },
      { arg: "codigoTipoPuntoVenta", type: "string" },
      { arg: "cuis", type: "string" },
      { arg: "descripcion", type: "string" },
      { arg: "nit", type: "string" },
      { arg: "nombrePuntoVenta", type: "string" },
    ],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/registroPuntoVenta" },
    description:
      "Servicio de registro de punto de venta hanlpzdk01.hansa.com.bo:700",
  });
  Mulerest.registroPuntoVenta = function (
    codigoSucursal,
    codigoTipoPuntoVenta,
    cuis,
    descripcion,
    nit,
    nombrePuntoVenta,
    cb
  ) {
    var url = "http://hanlpzdk01.hansa.com.bo:700/registroPuntoVenta";
    var body = {
      codigoSistemaProveedor: "",
      codigoSucursal: String(codigoSucursal),
      codigoTipoPuntoVenta: String(codigoTipoPuntoVenta),
      cuis: String(cuis),
      descripcion: String(descripcion),
      nit: String(nit),
      nombrePuntoVenta: String(nombrePuntoVenta),
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
  //Cierre punto de venta
  Mulerest.remoteMethod("cierrePuntoVenta", {
    accepts: [{ arg: "codigoPDV", type: "string" }],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/cierrePuntoVenta" },
    description:
      "Servicio de cierre de punto de venta hanlpzdk01.hansa.com.bo:700",
  });
  Mulerest.cierrePuntoVenta = function (codigoPDV, cb) {
    var url = "http://hanlpzdk01.hansa.com.bo:700/cierrePuntoVenta";
    var body = { codigoPDV: String(codigoPDV) };
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
  //Estato de conección
  Mulerest.remoteMethod("sife_coneccionLoopback", {
    accepts: [],
    returns: [{ arg: "estado", type: "string" }],
    http: { verb: "get", path: "/sife_coneccionLoopback" },
    description: "Servicio de estado de servidor",
  });
  Mulerest.sife_coneccionLoopback = function (cb) {
    // var body = {coneccion:true};
    cb(null, true);
  };
  //Cierre punto de venta
  Mulerest.remoteMethod("facturaElectronicaEstandarAnulacion", {
    accepts: [
      { arg: "codigoDocumentoSector", type: "integer" },
      { arg: "codigoMotivo", type: "integer" },
      { arg: "codigoPuntoVenta", type: "integer" },
      { arg: "codigoSucursal", type: "integer" },
      { arg: "cuf", type: "string" },
      { arg: "cufd", type: "string" },
      { arg: "cuis", type: "string" },
      { arg: "nit", type: "integer" },
      { arg: "numeroDocumentoFiscal", type: "integer" },
      { arg: "codigoDocumentoFiscal", type: "integer" },
    ],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/facturaElectronicaEstandarAnulacion" },
    description: "Servicio de anulación de factura hanlpzdk01.hansa.com.bo:705",
  });
  Mulerest.facturaElectronicaEstandarAnulacion = function (
    codigoDocumentoSector,
    codigoMotivo,
    codigoPuntoVenta,
    codigoSucursal,
    cuf,
    cufd,
    cuis,
    nit,
    numeroDocumentoFiscal,
    codigoDocumentoFiscal,
    cb
  ) {
    var url =
      "http://docker.hansa.com.bo:704/facturaElectronicaEstandarAnulacion";
    var body = {
      codigoDocumentoSector,
      codigoMotivo,
      codigoPuntoVenta,
      codigoSucursal,
      cuf,
      cufd,
      cuis,
      nit,
      numeroDocumentoFiscal,
      codigoDocumentoFiscal,
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
  //Lista de metodos a ser deshabilitados del Swaguer
  var methodNames = [
    "findById",
    "findOne",
    "confirm",
    "count",
    "exists",
    "create",
    "upsert",
    "deleteById",
    "updateAll",
    "prototype.updateAttributes",
    "createChangeStream",
    "replaceById",
    "find",
    "replaceOrCreate",
    "upsertWithWhere",
  ];
  //Llamamos al metodo que realiza el bloqueo de las funciones
  methodNames.forEach(function (methodName) {
    disableMethods(Mulerest, methodName);
  });

  //Consumir servicio de validador de NIT de SIN
  Mulerest.remoteMethod("validaNit", {
    accepts: [
      { arg: "nitEmisor", type: "number" },
      { arg: "nitCliente", type: "number" },
    ],
    returns: [{ arg: "respuesta", type: "string" }],
    http: { verb: "post", path: "/verificarnit" },
    description:
      "Servicio que valida el nit del cliente o empresa contra impuestos nacionales.",
  });
  Mulerest.validaNit = function (
    nitEmisor,
    nitCliente,
    cb
  ) {
    var url = global.Docker + "724/verificarnit";
    var body = {
      nitEmisor: nitEmisor,
      nitCliente: nitCliente
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
};
// Funcion que realiza un bucle para bloquear los metodos nativos de loopback
function disableMethods(Mulerest, methodName) {
  if (methodName != "updateAttributes")
    Mulerest.disableRemoteMethodByName(methodName, true);
  else Mulerest.disableRemoteMethodByName(methodName, false);
}
