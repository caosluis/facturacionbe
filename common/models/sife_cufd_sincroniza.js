'use strict';

module.exports = function(sifeCufdSincroniza) {
    // Elimina registros de la tabla sife_cufd_sincroniza de una determinada empresa
    sifeCufdSincroniza.eliminaCufdSincroniza = (nit, cb) => {
        var ds = sifeCufdSincroniza.dataSource;
        var sql = "DELETE" + " FROM sifedb.sife_cufd_sincroniza" + " WHERE nit='" + nit + "' ";
    
        ds.connector.query(sql, (err, instance) => {
          if (err) console.error(err);
          // pubsub.publish('/sifeCufdSincronizaEntrante/get', instance);
          cb(err, instance);
        });
      };
      sifeCufdSincroniza.remoteMethod("eliminaCufdSincroniza", {
        http: { verb: "delete" },
        accepts: [{ arg: "nit", type: ["number"] }],
        returns: { arg: "data", type: ["number"], root: true },
      });
};
