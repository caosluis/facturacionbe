'use strict';

module.exports = function(Viewsifefamiliaproductos) {
    //Lista de metodos a ser deshabilitados del Swaguer
    var methodNames = ['findById', 'findOne', 'confirm', 'count', 'exists', 'create', 'upsert',
    'deleteById', 'updateAll', 'prototype.updateAttributes', 'createChangeStream', 'replaceById', 'replaceOrCreate', 'upsertWithWhere'
    ];
    //Llamamos al metodo que realiza el bloqueo de las funciones 
    methodNames.forEach(function(methodName) {
    disableMethods(Viewsifefamiliaproductos,methodName)
    });
};
// Funcion que realiza un bucle para bloquear los metodos nativos de loopback
function disableMethods(Viewsifefamiliaproductos,methodName)
{
if(methodName!='updateAttributes')
Viewsifefamiliaproductos.disableRemoteMethodByName(methodName, true);
else
Viewsifefamiliaproductos.disableRemoteMethodByName(methodName, false); 
}