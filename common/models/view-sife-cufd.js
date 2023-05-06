'use strict';

module.exports = function(Viewsifecufd) {

    //Lista de metodos a ser deshabilitados del Swaguer
    var methodNames = ['findById', 'findOne', 'confirm', 'count', 'exists', 'create', 'upsert',
    'deleteById', 'updateAll', 'prototype.updateAttributes', 'createChangeStream', 'replaceById', 'replaceOrCreate', 'upsertWithWhere'
    ];
    //Llamamos al metodo que realiza el bloqueo de las funciones 
    methodNames.forEach(function(methodName) {
    disableMethods(Viewsifecufd,methodName)
    });
};
// Funcion que realiza un bucle para bloquear los metodos nativos de loopback
function disableMethods(Viewsifecufd,methodName)
{
if(methodName!='updateAttributes')
Viewsifecufd.disableRemoteMethodByName(methodName, true);
else
Viewsifecufd.disableRemoteMethodByName(methodName, false); 
}