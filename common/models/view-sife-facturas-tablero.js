'use strict';

module.exports = function(Viewsifefacturastablero) {
    //Lista de metodos a ser deshabilitados del Swaguer
    var methodNames = ['findById', 'findOne', 'confirm',  'exists', 'create', 'upsert',
    'deleteById', 'updateAll', 'prototype.updateAttributes', 'createChangeStream', 'replaceById', 'replaceOrCreate', 'upsertWithWhere'
    ];
    //Llamamos al metodo que realiza el bloqueo de las funciones 
    methodNames.forEach(function(methodName) {
    disableMethods(Viewsifefacturastablero,methodName)
    });
};
// Funcion que realiza un bucle para bloquear los metodos nativos de loopback
function disableMethods(Viewsifefacturastablero,methodName)
{
if(methodName!='updateAttributes')
Viewsifefacturastablero.disableRemoteMethodByName(methodName, true);
else
Viewsifefacturastablero.disableRemoteMethodByName(methodName, false); 
}