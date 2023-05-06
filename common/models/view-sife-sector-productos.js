'use strict';

module.exports = function(Viewsifesectorproductos) {
    //Lista de metodos a ser deshabilitados del Swaguer
    var methodNames = ['findById', 'findOne', 'confirm', 'count', 'exists', 'create', 'upsert',
    'deleteById', 'updateAll', 'prototype.updateAttributes', 'createChangeStream', 'replaceById', 'replaceOrCreate', 'upsertWithWhere'
    ];
    //Llamamos al metodo que realiza el bloqueo de las funciones 
    methodNames.forEach(function(methodName) {
    disableMethods(Viewsifesectorproductos,methodName)
    });
};
// Funcion que realiza un bucle para bloquear los metodos nativos de loopback
function disableMethods(Viewsifesectorproductos,methodName)
{
if(methodName!='updateAttributes')
Viewsifesectorproductos.disableRemoteMethodByName(methodName, true);
else
Viewsifesectorproductos.disableRemoteMethodByName(methodName, false); 
}