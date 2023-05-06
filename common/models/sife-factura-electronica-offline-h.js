var pubsub = require('../../server/pubsub.js');
module.exports = function(Sifefacturaelectronicaofflineh) {
    Sifefacturaelectronicaofflineh.sifeOffline = (nit,cb) => {
        var ds = Sifefacturaelectronicaofflineh.dataSource
        var sql = "SELECT Distinct(nit), codigoSucursal, codigoPuntoVenta, cuis, codigoDocumentoSector, codigoClasificadorEvento, codigoRecepcionEventoSignificativo " +
        " FROM sifedb.sife_facturaElectronica_offline_h ";
        
        ds.connector.query(sql, (err, instance) => {
    
            if (err) console.error(err);
            // pubsub.publish('/SifefacturaelectronicaofflinehEntrante/get', instance);
            cb(err, instance);
        })
    }
    Sifefacturaelectronicaofflineh.remoteMethod(
        'sifeOffline',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'nit', type: ['number'] }
            ],
            returns: { arg: 'data', type: ['a'], root: true }
        }
    )
};
