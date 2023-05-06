'use strict';

module.exports = function(Viewcontadorestadosfactura) {

    //Lista de metodos a ser deshabilitados del Swaguer
    var methodNames = ['findById', 'findOne', 'confirm', 'count', 'exists', 'create', 'upsert',
    'deleteById', 'updateAll', 'prototype.updateAttributes', 'createChangeStream', 'replaceById', 'replaceOrCreate', 'upsertWithWhere'
    ];
    //Llamamos al metodo que realiza el bloqueo de las funciones 
    methodNames.forEach(function(methodName) {
    disableMethods(Viewcontadorestadosfactura,methodName)
    });
};
// Funcion que realiza un bucle para bloquear los metodos nativos de loopback
function disableMethods(Viewcontadorestadosfactura,methodName)
{
    if(methodName!='updateAttributes')
    Viewcontadorestadosfactura.disableRemoteMethodByName(methodName, true);
    else
    Viewcontadorestadosfactura.disableRemoteMethodByName(methodName, false); 
}
