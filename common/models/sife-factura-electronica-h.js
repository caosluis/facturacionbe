'use strict';

module.exports = function(Sifefacturaelectronicah) {
    //1) VALIDA 5 DIAS DE ANULACION DE UNA FACTURA ONLINE
    Sifefacturaelectronicah.diasAnulacion = (fechaEmision, cb) => {
        var ds = Sifefacturaelectronicah.dataSource;
        var sql =
        "SELECT TIMESTAMPDIFF(DAY, '" + fechaEmision + "', NOW()) AS diasTransacurridos;";

        ds.connector.query(sql, (err, instance) => {
        if (err) console.error(err);
        // pubsub.publish('/SifefacturaelectronicahEntrante/get', instance);
        cb(err, instance);
        });
    };
    Sifefacturaelectronicah.remoteMethod("diasAnulacion", {
        http: { verb: "get" },
        accepts: [{ arg: "fechaEmision", type: ["string"] }],
        returns: { arg: "fechaEmision", type: ["string"], root: true },
        description:
        "Diferencia de fecha emision contra fecha actual",
    });
    //1.1) SUMA 1 MES SIGUIENTE A LA FECHA EMISION DE LA FACTURA CON LOS PRIMEROS DIAS DEL MES
    Sifefacturaelectronicah.fechaFinAnulacion = (fechaEmision,cantidadDias, cb) => {
        var ds = Sifefacturaelectronicah.dataSource;
        var sql =
        " SELECT " +
        " DATE_ADD(DATE(DATE_ADD('" + fechaEmision + "', INTERVAL 1 MONTH)), interval - day(DATE(DATE_ADD('" + fechaEmision + "', INTERVAL 1 MONTH))) + " + cantidadDias + " day) as fechaFinAnulacion; ";

        ds.connector.query(sql, (err, instance) => {
        if (err) console.error(err);
        // pubsub.publish('/SifefacturaelectronicahEntrante/get', instance);
        cb(err, instance);
        });
    };
    Sifefacturaelectronicah.remoteMethod("fechaFinAnulacion", {
        http: { verb: "get" },
        accepts: [{ arg: "fechaEmision", type: ["string"] },{ arg: "cantidadDias", type: ["string"] }],
        returns: { arg: "fechaFinAnulacion", type: ["string"], root: true },
        description:
        "Calculo de una fecha X sumandole 1 mes con el primer dia y el dia 5 del mes",
    });
     //1.2) CANTIDAD EN DIAS DE FechaFinAnulacion vs FechaEmisionFactura
     Sifefacturaelectronicah.cantidadDiasAnulacion = (fechaFinAnulacion, fechaEmision, cb) => {
        var ds = Sifefacturaelectronicah.dataSource;
        var sql =        
        " SELECT DATEDIFF('"+fechaFinAnulacion+"','" + fechaEmision + "')as cantidadDiasAnulacion; ";

        ds.connector.query(sql, (err, instance) => {
        if (err) console.error(err);
        // pubsub.publish('/SifefacturaelectronicahEntrante/get', instance);
        cb(err, instance);
        });
    };
    Sifefacturaelectronicah.remoteMethod("cantidadDiasAnulacion", {
        http: { verb: "get" },
        accepts: [{ arg: "fechaFinAnulacion", type: ["string"] },{ arg: "fechaEmision", type: ["string"] }],
        returns: { arg: "cantidadDiasAnulacion", type: ["string"], root: true },
        description:
        "Calculo de una fecha X sumandole 1 mes con el primer dia y el dia 5 del mes",
    });
    //2) FACTURAS NCD 
    Sifefacturaelectronicah.mesVigenciaNC = (fechaEmisionFactura, fechaEmision, cb) => {
        var ds = Sifefacturaelectronicah.dataSource;
        var sql =
        "SELECT TIMESTAMPDIFF(MONTH, '" + fechaEmisionFactura + "', '" + fechaEmision + "') AS mesVigencia;";

        ds.connector.query(sql, (err, instance) => {
        if (err) console.error(err);
        // pubsub.publish('/SifefacturaelectronicahEntrante/get', instance);
        cb(err, instance);
        });
    };
    Sifefacturaelectronicah.remoteMethod("mesVigenciaNC", {
        http: { verb: "get" },
        accepts: [
            { arg: "fechaEmisionFactura", type: ["string"] },
            { arg: "fechaEmision", type: ["string"] }],
        returns: { arg: "mesVigencia", type: ["string"], root: true },
        description:
        "Diferencia de fecha emision de Nota Credito Debito vs fecha emision factura, plazo de envio 18 meses",
    });


};
