'use strict';

module.exports = function(Viewsifefacturas) {
    //Lista de metodos a ser deshabilitados del Swaguer
    var methodNames = ['findById', 'findOne', 'confirm',  'exists', 'create', 'upsert',
    'deleteById', 'updateAll', 'prototype.updateAttributes', 'createChangeStream', 'replaceById', 'replaceOrCreate', 'upsertWithWhere'
    ];
    //Llamamos al metodo que realiza el bloqueo de las funciones 
    methodNames.forEach(function(methodName) {
    disableMethods(Viewsifefacturas,methodName)
    });
};
// Funcion que realiza un bucle para bloquear los metodos nativos de loopback
function disableMethods(Viewsifefacturas,methodName)
{
if(methodName!='updateAttributes')
Viewsifefacturas.disableRemoteMethodByName(methodName, true);
else
Viewsifefacturas.disableRemoteMethodByName(methodName, false); 
}