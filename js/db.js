var localDB = null;
 
function onInit(){
    $("#status").append("</br>" +  "Comprobando DB.");
    try {
            if (!window.openDatabase) {
                $("#status").append("</br>" +  "Error, su navegador no permite crear BBDD.");
                alert("Error, su navegador no permite crear BBDD.");
            }
            else {
                localDB = window.openDatabase("ResultadosDB", "1.0", "ResultadosDB", 65536);
                CheckDB();
                                  $("#status").html(""); 
            };

        }
    catch (exception) {
        $("#status").append("</br>" +  "Algo salió mal al inicial el programa. Excepción:" + exception.message)
    }

$("#status").html(""); 

}

function CheckDBError(error)
{
    InicializaDB();
    
}
 
function CheckDBSuccess()
{
    $("#status").append("</br>" +  "La tabla existe");
}

//Comprueba si la DB existe
function CheckDB() 
{
            localDB.transaction(function(tx) {            
              tx.executeSql("SELECT * FROM info WHERE parametro = 'version'", [], function(tx, results) {
                if (results.rows.length > 0){
                    var dbversion = results.rows.item(0).valor;
                }
                            var last_version = $.getResults("aurictarot.json");
                            if (last_version['version'] === dbversion) {
                                $("#status").append("</br>" +  "Las versiones son iguales.");
                                return;
                            }else{
                                InicializaDB();
                            }
              });
            },CheckDBError);
            // Si las versiones no son iguales o no existe la tabla -> dbversion = null entonces inicializa la DB


};
function CreaTablas_OnSuccess(tx, results, query){
    // $("#status").append("</br>" + tx);
}

function CreaTablas_OnError(Err){
    alert("Error al crear las tablas:" + Err.message);
    $("#status").append("</br>" + Err.message);
}

function CreaTablas(){
        var query = null;
        localDB.transaction(function(tx){
                query = 'DROP TABLE IF EXISTS info';
                tx.executeSql(query, [],CreaTablas_OnSuccess,CreaTablas_OnError);
                query = 'DROP TABLE IF EXISTS predicciones';
                tx.executeSql(query, [],CreaTablas_OnSuccess,CreaTablas_OnError);
                query = 'DROP TABLE IF EXISTS historico';
                tx.executeSql(query, [],CreaTablas_OnSuccess,CreaTablas_OnError);

                query = 'CREATE TABLE IF NOT EXISTS info (id , parametro , valor )';
                tx.executeSql(query, [],CreaTablas_OnSuccess,CreaTablas_OnError);
                query = 'CREATE TABLE IF NOT EXISTS predicciones (contexto , combinacion , prediccion )';
                tx.executeSql(query, [],CreaTablas_OnSuccess,CreaTablas_OnError);
                query = 'CREATE TABLE IF NOT EXISTS historico (fecha , pregunta , prediccion , puntuacion )';
                tx.executeSql(query, [],CreaTablas_OnSuccess,CreaTablas_OnError);  
            },CreaTablas_OnError);

}


function InsertaValores_onSuccess(tx,results){
    // $("#status").append("</br>" +  "valor insertado.");
}
function InsertaValores_onError(Error){
    $("#status").append("</br>" +  "Error al insertar:" + Error.message);
}
function InsertaValoresP_onSuccess(tx,results){
    // $("#status").append("</br>" +  "valores insertados en predicciones.");
}
function InsertaValoresP_onError(Error){
    $("#status").append("</br>" +  "Error al insertar en predicciones:" + Error.message);
}
function InsertaValores(){
    var field = null;
    var res = $.getResults("resultados.txt");
    var array_resultados = res.split("\n");

    localDB.transaction(function(tx){

        for (var i = 0; i < array_resultados.length -1; i++) {

            field = array_resultados[i].split(":");
            tx.executeSql("INSERT INTO predicciones (contexto, combinacion, prediccion) VALUES (?,?,?)", 
            [field[0], field[1], field[2]],
            InsertaValoresP_onSuccess,
            InsertaValoresP_onError);
        };

            tx.executeSql('INSERT INTO info VALUES(1, "version", "1.0.0.1")', 
            [], 
            InsertaValores_onSuccess,
            InsertaValores_onError);
    });        
     

}

function InicializaDB(){

    CreaTablas();

    InsertaValores();
    console.log("ya esta");  

    $("#status").html(""); 
}
 
 

function CreateTablesOK (tx, error) {
     $("#status").append("</br>" +  "Tabla creada correctamente.");
}

function CreateTablesError (tx, error){
    $("#status").append("</br>" +  "Error al crear tabla." + error.descripcion);

}


jQuery.extend({
    getResults: function(url) {
        var result = null;
        $.ajax({
            url: url,
            type: 'get',
//            dataType: 'text',
            async: false,
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

$.ajaxSetup({ cache: false });








$( document ).ready(function() {
    console.log( "ready!" );

    $('.owl-carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:true,
        navigationText: [
      "<i class='icon-chevron-left icon-white'></i>",
      "<i class='icon-chevron-right icon-white'></i>"
      ],
        responsive:{
            0:{
                items:5
            },
            600:{
                items:5
            },
            1000:{
                items:5
            }
        }
    });


    $( "#two" ).click(function() {
        var results;

        function two_clickSuccess(tx, results){
            alert("twoclick" + tx);
        }

        function two_clickOnError(err){
            alert("twoclick error transaccion:" +err.message );
        }
        try {
            localDB = window.openDatabase("ResultadosDB", "1.0", "ResultadosDB", 65536);
  
            localDB.transaction(function(tx) {
                tx.executeSql("SELECT * FROM info WHERE parametro = 'version'", [], function(tx, results) {
                        alert( "Versión de la DB:" + results.rows.item(0).valor);
                });
            },two_clickOnError);
        }
        catch (exception){
            alert("Se ha producido la exception:" + exception);
        }

    });

    // $( ".item > img" ).draggable({
    //   appendTo: "body",
    //   helper: "clone"
    // });

var owl = $('.owl-carousel');
              owl.on('drag.owl.carousel dragged.owl.carousel ', function(e) {
                    console.log( "evento:" + e.type + " elemento:" + $(this).text);
                  $('.' + e.type)
                    .removeClass('secondary')
                    .addClass('success');
                  window.setTimeout(function() {
                    $('.' + e.type)
                      .removeClass('success')
                      .addClass('secondary');
                  }, 500);
                });
























    $( "#eleccion1" ).droppable({
      activeClass: "ui-state-default",
      hoverClass: "ui-state-hover",
      accept: ":not(.ui-sortable-helper)",
      drop: function( event, ui ) {
        $( this ).find( ".placeholder" ).remove();
        $( "<li></li>" ).text( ui.draggable.text() ).appendTo( this );
      }
  });
        $( "#eleccion2" ).droppable({
      drop: function( event, ui ) {
        $( this ).html( "Dropped!" );
      }
    });




});
