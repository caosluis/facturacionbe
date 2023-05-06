'use strict';

module.exports = function(Viewsifesubgrupoproductos) {
    //Lista de metodos a ser deshabilitados del Swaguer
    var methodNames = ['findById', 'findOne', 'confirm', 'count', 'exists', 'create', 'upsert',
    'deleteById', 'updateAll', 'prototype.updateAttributes', 'createChangeStream', 'replaceById', 'replaceOrCreate', 'upsertWithWhere'
    ];
    //Llamamos al metodo que realiza el bloqueo de las funciones 
    methodNames.forEach(function(methodName) {
    disableMethods(Viewsifesubgrupoproductos,methodName)
    });
};
// Funcion que realiza un bucle para bloquear los metodos nativos de loopback
function disableMethods(Viewsifesubgrupoproductos,methodName)
{
if(methodName!='updateAttributes')
Viewsifesubgrupoproductos.disableRemoteMethodByName(methodName, true);
else
Viewsifesubgrupoproductos.disableRemoteMethodByName(methodName, false); 
}