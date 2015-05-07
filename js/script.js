

///////////////////////////////////////////////////////////////////////////////////////////
//GESION DE LA BBDD
///////////////////////////////////////////////////////////////////////////////////////////

var localDB = null;
 
function onInit(){
    //$("#status").append("</br>" +  "Comprobando DB.");
    try {
            if (!window.openDatabase) {
                //$("#status").append("</br>" +  "Error, su navegador no permite crear BBDD.");
                alert("Error, su navegador no permite crear BBDD.");
            }
            else {
                localDB = window.openDatabase("ResultadosDB", "1.0", "ResultadosDB", 65536);
                CheckDB();
                 //                 $("#status").html(""); 
            };

        }
    catch (exception) {
        alert("Algo salió mal al inicial el programa. Excepción:" + exception.message);
    }

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
                                alert("Las versiones son iguales.");
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
                query = 'CREATE TABLE IF NOT EXISTS predicciones (combinacion , amor, trabajo )';
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

            field = array_resultados[i].split("':'");
            field[0]=field[0].replace('\'','');
            field[1]=field[1].replace('\'','');
            field[2]=field[2].replace('\'','');
            tx.executeSql("INSERT INTO predicciones (combinacion, amor, trabajo) VALUES (?,?,?)", 
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

//    $("#status").html(""); 
}
 
 

function CreateTablesOK (tx, error) {
 //    $("#status").append("</br>" +  "Tabla creada correctamente.");
}

function CreateTablesError (tx, error){
//    $("#status").append("</br>" +  "Error al crear tabla." + error.descripcion);

}

function Recupera_prediccion (){
           localDB.transaction(function(tx) {            
              tx.executeSql("SELECT * FROM predicciones WHERE combinacion = \'" + definicion + "\'", [], function(tx, results) {
                if (results.rows.length > 0){
                    prediccion_amor = results.rows.item(0).amor;
                    prediccion_trabajo = results.rows.item(0).trabajo;
                    if(contexto===1){
                        $("#interpretacion-interpretacion").html(prediccion_amor);
                        $("#interpretacion-contexto").html("Amor");
                    }
                    if(contexto===2){
                        $("#interpretacion-interpretacion").html(prediccion_trabajo);
                        $("#interpretacion-contexto").html("Trabajo");
                    }
                    
                }

              });
            },CheckDBError);
           
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

///////////////////////////////////////////////////////////////////////////////////////////


var contexto;
var stage;
var layer;
var group_baraja;
var group_escogidas;
var container_h;
var container_w;
var carta1, carta2;
var definicion;
var prediccion;



function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function isNearOutline(carta, carta_escogida) {
    var o = carta;
    var a = carta_escogida;
    var ax = a.getX()+ a.width()/2;
    var ay = a.getY()- a.height()/2;
    var ox = o.getX();
    var oy = o.getY();

    if (Math.abs(ax - ox) < 100 && Math.abs(ay - oy) < 163) {
        // $("footer h1").html(a.attrs.id + " en " + o.attrs.name);
        return true;
    } else {
        return false;
    }
}

//**************************************************
//función principal de llamada a las otras funciones
function Loadimages(callback) {

    var images = {};
    var loadedImages = 0;
    var numImages = 0;

    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}


//*****************************************
//animación que meustra las dos cartas escogidas
function Muestra_cartas(images) {

    group_baraja.visible(false);
    group_baraja.destroy();

    var cartas = group_escogidas.find('Image');

    carta1 = cartas[0].getAttr('id').replace("carta", "");
    carta2 = cartas[1].getAttr('id').replace("carta", "");

    definicion = carta1 + "-" + carta2;

    group_baraja = cartas;

    var escala = (stage.getWidth() - 20) / 2;

    escala = escala / cartas[0].width();


    var tween1 = new Kinetic.Tween({
        node: cartas[0],
        duration: 1,
        x: 0,
        y: (stage.getHeight() - cartas[0].height() * escala) / 2,
        scaleY: escala,
        scaleX: escala,
        onFinish: function() {
        },
        easing: Kinetic.Easings.EaseInOut
    });

    // play tween
    tween1.play();

     var tween2 = new Kinetic.Tween({
                node: cartas[1],
                duration: 1,
                x: cartas[1].width() * escala + 20,
                y: (stage.getHeight() - cartas[1].height() * escala) / 2,
                scaleY: escala,
                scaleX: escala,
                onFinish: function() {


                    $("#carta1").css("position", "absolute");
                    $("#carta1").css("left", cartas[0].x() + 17 + "px");
                    $("#carta1").css("top", cartas[0].y() + 16 + "px");
                    $("#carta1").css("width", (cartas[0].width() * cartas[0].scaleX()) + "px");
                    $("#carta1").css("height", (cartas[0].height() * cartas[0].scaleY()) + "px");

                    $("#carta1").show();

                    $("#carta1 .back").css("background", "url('" + sources[group_baraja[0].id()] + "')");
                    $("#carta1 .back").css("background-size", "cover");


                    $("#carta2").css("position", "absolute");
                    $("#carta2").css("left", cartas[1].x() + 17 + "px");
                    $("#carta2").css("top", cartas[1].y() + 16 + "px");
                    $("#carta2").css("width", (cartas[1].width() * cartas[1].scaleX()) + "px");
                    $("#carta2").css("height", (cartas[1].height() * cartas[1].scaleY()) + "px");

                    $("#carta2 .back").css("background", "url('" + sources[group_baraja[1].id()] + "')");
                    $("#carta2 .back").css("background-size", "cover");
                    $("#carta2").show();

                    //stage.destroy();
                    $("#container").hide(0,function(){
                        $("#carta1").addClass("flipped");
                        $("#carta2").addClass("flipped");

                    });



                },

                easing: Kinetic.Easings.EaseInOut
            });

            tween2.play();

}

function Interpreta(){

    Recupera_prediccion();

    $("#carta1").animate({
        left: ($(".container").width()-220)/2,
        top: 10,
        width: 100,
        height: 163
    },500);    
    $("#carta2").animate({
        left: $("#carta1").css("left") + 100 + 20,
        top: 10,
        width: 100,
        height: 163
    },500);

    $("#interpretacion").css("top", "1000px");
    $("#interpretacion").show();
    $("#interpretacion").animate({
        "top": 185
    },500);
    // $("#interpretacion").css("margin-top",parseInt($("#carta1").css("top")) + 168)
}


//**************************************************
//Pone la baraja en la mesa con las cartas barajadas

function Inicializa_mesa(images) {

    if (stage){
         stage.destroy();
    }
    $("#container").show();               
    var lastcarta;
    var eleccion_activa;
    var last_pos_y;
    var offset = 100;
    var angle_start = 350;
    var angle = 0;
    var radius = 50;
    var lista = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    shuffleArray(lista);

    stage = new Kinetic.Stage({
        container: 'container',
        width: $("#container").width(),
        height: (window.innerHeight / 100) * 80,
    });

    container_h = stage.height();
    container_w = stage.width();
 


    group_baraja = new Kinetic.Group();
    group_escogidas = new Kinetic.Group();
    layer = new Kinetic.Layer();

//pone cada una de las cartas encima de la mesa en la posicion de baraja
    for (var n = 1; n < 22; n++) {
        (function() {

            var imageObj = new Image();
            var imageObj = images.reverso;

            var rectangle = new Kinetic.Image({
                x: (stage.getWidth() / 2 - 5),
                y: -200 + Math.random() * 20,
                ox: (stage.getWidth() / 2 - 5),
                oy: -200 + Math.random() * 20,
                width: 100,
                height: 163,
                stroke: 'black',
                strokeWidth: 1,
                name: 'carta',
                id: 'carta' + lista[n-1],
                escogida: false,
                draggable: false,
                image: imageObj,
                offset: {
                    x: 50,
                    y: -225
                },
                rotation: 18 - (1.7 * n),
                or: 18 - (1.7 * n)
            });

            group_baraja.add(rectangle);

            //movimiento de las cartas al pasar el dedo por encima
            //sobresalen un poco
            rectangle.on('mouseover touchmove', function(evt) {
                var posicion = stage.getPointerPosition();

                $("footer h1").html(rectangle.getId() + "x:" + posicion.x + " y:" + posicion.y);
                if (typeof(lastcarta) != "undefined" && lastcarta != rectangle && lastcarta.attrs.escogida === false) {
                    lastcarta.offset({
                        x: 50,
                        y: -225
                    });
                    lastcarta.setDraggable(false);

                }
                if (!rectangle.attrs.escogida) {
                    rectangle.offset({
                        x: 50,
                        y: -270
                    });
                    rectangle.setDraggable(true);

                    lastcarta = rectangle;
                }

                layer.draw();

                if (posicion.y - last_pos_y > 20) {
                    rectangle.fire("touchstart");
                }

                last_pos_y = posicion.y

            });
        
            //arrastre de las cartas 
            rectangle.on("dragstart", function() {
                rectangle.startingPos = rectangle.position();
                $("footer h1").html("Draggin....");
            })
            rectangle.on('dragmove', function() {
                var posicion = stage.getPointerPosition();
                if (rectangle.getY() > (rectangle.attrs.oy + 30)) {
                    rectangle.rotation(0);
                    rectangle.setPosition({
                        x: posicion.x - 25,
                        y: posicion.y - 82
                    });
                    rectangle.offsetY(0);
                } else {
                    rectangle.rotation(rectangle.attrs.or);
                    rectangle.offsetY(-270);
                }
                if (eleccion_activa && isNearOutline(rectangle, eleccion_activa)) {
                    if (eleccion_activa.name() === 'carta_escogida1') {
                        carta_escogida1_shadow.visible(true);
                    }
                    if (eleccion_activa.name() === 'carta_escogida2') {
                        carta_escogida2_shadow.visible(true);
                    }
                } else {
                    carta_escogida1_shadow.visible(false);
                    carta_escogida2_shadow.visible(false);
                }
                layer.draw();
            });

            rectangle.on('dragend', function() {

                if (eleccion_activa && isNearOutline(rectangle, eleccion_activa)) {
                    rectangle.setPosition({
                        x: eleccion_activa.getX(),
                        y: eleccion_activa.getY()
                    });
                    rectangle.offset({
                        x: 0,
                        y: 0
                    });
                    eleccion_activa.visible(false);

                    if (eleccion_activa === carta_escogida1) {
                        eleccion_activa = carta_escogida2;
                    } else {
                        eleccion_activa = undefined;
                        
                            group_baraja.visible(false);
                            Loadimages(Muestra_cartas);
                    }

                    rectangle.setDraggable(false);
                    rectangle.attrs.escogida = true;
                    rectangle.remove();
                    group_escogidas.add(rectangle);
                    //rectangle.moveToBottom();
                } else {
                    rectangle.setPosition({
                        x: rectangle.attrs.ox,
                        y: rectangle.attrs.oy,
                    });
                    rectangle.rotation(rectangle.attrs.or);
                    rectangle.offset({
                        x: 50,
                        y: -225
                    });
                }
                carta_escogida1_shadow.visible(false);
                carta_escogida2_shadow.visible(false);
                layer.draw();
            });


        })();
    }

    //recatangulo que acoge la cartas escogida 1
    var carta_escogida1 = new Kinetic.Rect({
        x: Math.floor((stage.getWidth() - 220) / 2),
        y: Math.floor(stage.getHeight() - 180),
        width: 100,
        height: 163,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 1,
        name: 'carta_escogida1',
        draggable: false,
    })
    //rectangulo de sombra de la posición 1
    var carta_escogida1_shadow = new Kinetic.Rect({
        x: Math.floor((stage.getWidth() - 220) / 2)-5,
        y: Math.floor(stage.getHeight() - 180)-5,
        width: 100,
        height: 163,
        fill: 'red',
        name: 'carta_escogida1_shadow',
        draggable: false,
        scale: {
            x: 1.1,
            y: 1.06
        },
        opacity: 0.5,
        lineCap: 'round',
        cornerRadius: 3,
        visible: false
    })

    //marca la carta escogida por defecto para que el usuario la suelte en la posición 1 primero
    //añade las formas a la layer
    eleccion_activa = carta_escogida1;
    layer.add(carta_escogida1_shadow);
    layer.add(carta_escogida1);

    //definición de la posición de la carta escogida 2
    var carta_escogida2 = new Kinetic.Rect({
        x: carta_escogida1.attrs.x + 100 + 20,
        y: carta_escogida1.attrs.y,
        width: 100,
        height: 163,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 1,
        name: 'carta_escogida2',
        draggable: false,       
    })
    //definición de la sombra de la posición de la carta escogida 2
    var carta_escogida2_shadow = new Kinetic.Rect({
        x: carta_escogida1.attrs.x + 100 + 15,
        y: carta_escogida1.attrs.y-5,
        width: 100,
        height: 163,
        fill: 'red',
        name: 'carta_escogida2_shadow',
        draggable: false,
        scale: {
            x: 1.1,
            y: 1.06
        },
        opacity: 0.5,
        lineCap: 'round',
        cornerRadius: 3,
        visible: false
    })

    //añade las formas de las cartas escogidas 2 a la layer
    layer.add(carta_escogida2_shadow);
    layer.add(carta_escogida2);

    layer.add(group_escogidas);
    layer.add(group_baraja);


    stage.add(layer);

    stage.draw();

    return (stage);

}

//********************************************
//funciones de la página para mostrar la baraja
  function DesplazaCartaIzquierda(event) {

      baraja.push(baraja.shift());
      definiciones_arcanos.push(definiciones_arcanos.shift());
      $("#carta-baraja").fadeOut(500,function(){
            $("#carta-baraja").attr('src', baraja[0]);
      }).fadeIn(500);
      $("#explicacion-arcano-arcano").html(definiciones_arcanos[0][0]);
      $("#explicacion-arcano-claves").html(definiciones_arcanos[0][1]);
      $("#explicacion-arcano-explicacion").html(definiciones_arcanos[0][2]);
      $("#explicacion-arcano-resumen").html(definiciones_arcanos[0][3]);

  }

  function DesplazaCartaDerecha(event) {

      baraja.unshift(baraja.pop());
      definiciones_arcanos.unshift(definiciones_arcanos.pop());

      $("#carta-baraja").fadeOut(500,function(){
            $("#carta-baraja").attr('src', baraja[0]);
      }).fadeIn(500);
      $("#explicacion-arcano-arcano").html(definiciones_arcanos[0][0]);
      $("#explicacion-arcano-claves").html(definiciones_arcanos[0][1]);
      $("#explicacion-arcano-explicacion").html(definiciones_arcanos[0][2]);
      $("#explicacion-arcano-resumen").html(definiciones_arcanos[0][3]);  }



//   $( document ).on( "mobileinit" , function () {

// $(document).on("pagecontainershow", function () {
// var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");

// var activePageId = activePage[0].id;
// switch (activePageId) {
//     case 'tirada':
//     // var current = $(".ui-page-active").attr('id');
//         console.log("current" + activePageId);
//             Loadimages(Inicializa_mesa);
//         break;
//     }
// });
// });





  //funciones de la página para mostrar la baraja

$(document).ready(function() {
    // $("#info").hide();
    // screen.lockOrientation('portrait');
    //cuando jquery está preparado inicializa la mesa colocando la baraja desordenada
    $(document).on("pagecontainerbeforeshow", function(){
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
        var activePageId = activePage[0].id;
        switch (activePageId) {
            case 'baraja':
                $("#explicacion-arcano-arcano").html(definiciones_arcanos[0][0]);
                $("#explicacion-arcano-claves").html(definiciones_arcanos[0][1]);
                $("#explicacion-arcano-explicacion").html(definiciones_arcanos[0][2]);
                $("#explicacion-arcano-resumen").html(definiciones_arcanos[0][3]);

                break;

            case 'tirada':
                // var current = $(".ui-page-active").attr('id');
                console.log("current" + activePageId);
                $("#carta1").hide();
                $("#carta1").removeClass("flipped");
                $("#carta2").hide();
                $("#carta2").removeClass("flipped");
                $("#interpretacion").hide();
                $("#interpretacion").css("margin-top", "0px");

                break;
        }

    })
    $(document).on("pagecontainershow", function(){
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
        var activePageId = activePage[0].id;
        switch (activePageId) {
            case 'tirada':
                // var current = $(".ui-page-active").attr('id');
                console.log("current" + activePageId);

                Loadimages(Inicializa_mesa);

                break;
        }

    })




    //al pulsar info revela las cartas escogidas
    $("#info").click(function() {
        Loadimages(Muestra_cartas);
    });

    $("#significado").click(function() {
        $("#explicacion-arcano-arcano").text()
    });
    //pagina para mostrar la baraja
    $("#carta-baraja").on("swipeleft", DesplazaCartaIzquierda);
    $("#carta-baraja").on("swiperight", DesplazaCartaDerecha);
    //pagina para mostrar la baraja

    $("#heart").click(function(){
        contexto = 1;
    });

    $("#gold").click(function(){
        contexto = 2;
    });

    $("#Interpretacion").click(function(){
        Interpreta();
    });


    $("#comprar_baraja").on("click", ".external", function (e) {
        e.preventDefault();
        var targetURL = $(this).attr("href");
        window.open(targetURL, "_system");
    });

});



