var pubsub = require('../../server/pubsub.js');
module.exports = function (Sifetokenh) {

    Sifetokenh.cargar_sife_token_historico = (Anio, Mes, Dia,cb) => {
        var ds = Sifetokenh.dataSource
        var sql = `SELECT * 
        FROM sifedb.sife_token_h
        WHERE year(fechaCreacion)='`+Anio+
        `' and month(fechaCreacion)='`+Mes+
        `' and day(fechaCreacion)='`+Dia+
        `' ORDER BY fechaCreacion desc`;
        
        ds.connector.query(sql, (err, instance) => {

            if (err) console.error(err);
            // pubsub.publish('/SifeautenticacionhEntrante/get', instance);
            cb(err, instance);
        })
    }
    Sifetokenh.remoteMethod(
        'cargar_sife_token_historico',
        {
            http: { verb: 'get' },
            accepts: [
                { arg: 'Anio', type: ['string'] },
                { arg: 'Mes', type: ['string'] },
                { arg: 'Dia', type: ['string'] }
            ],
            returns: { arg: 'data', type: ['a'], root: true }
        }
    )
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // remote method before hooks
    Sifetokenh.beforeRemote('revEngine', function (context, unused, next) {
        //console.log('Putting in the Sifetokenh key, starting the engine.');
        next();
    });

    // afterInitialize is a model hook which is still used in loopback
    Sifetokenh.afterInitialize = function () {
        // http://docs.strongloop.com/display/public/LB/Model+hooks#Modelhooks-afterInitialize
        //console.log('> afterInitialize triggered');
    };

    // the rest are all operation hooks
    // - http://docs.strongloop.com/display/public/LB/Operation+hooks
    Sifetokenh.observe('before save', function (ctx, next) {
        // console.log('> before save triggered:', ctx.Model.modelName, ctx.instance || ctx.data);
        next();
    });
    Sifetokenh.observe('after save', function (ctx, next) {
        //socket.emit('/Sifeautenticacionh/POST',ctx.instance);
        pubsub.publish('VisitaEntranteFirebase', ctx.instance || ctx.data);
        // pubsub.publish('/Sifeautenticacionh/POST', ctx.where.id);
        // console.log('> after save triggered:', ctx.Model.modelName, ctx.instance);
        // console.log(ctx.instance || ctx.data)
        next();
    });
    Sifetokenh.observe('before delete', function (ctx, next) {
        // console.log('> before delete triggered:', ctx.Model.modelName, ctx.instance);
        next();
    });
    Sifetokenh.observe('after delete', function (ctx, next) {
        pubsub.publish('/Sifeautenticacionh/DELETE', (ctx.instance || ctx.where));
        // console.log('> after delete triggered:', ctx.Model.modelName, (ctx.instance || ctx.where));
        next();
    });

    // remote method after hook
    Sifetokenh.afterRemote('revEngine', function (context, remoteMethodOutput, next) {
        //console.log('Turning off the engine, removing the key.');
        next();
    });

    // model operation hook
    Sifetokenh.observe('before save', function (ctx, next) {
        if (ctx.instance) {
            //console.log('About to save a Sifeautenticacionh instance:', ctx.instance);
        } else {
            //console.log('About to update Sifeautenticacionhs that match the query %j:', ctx.where);
        }
        next();
    });
};