var stage;
var layer;
var group_baraja;
var group_escogidas;

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
    var a = carta;
    var o = carta_escogida;
    var ax = a.getX()-50;
    var ay = a.getY()+81;
    var ox = o.getX();
    var oy = o.getY();



    if (Math.abs(ax - ox) < 50 && Math.abs(ay - oy) < 50) {
        $("footer h1").html(a.attrs.id + " en " + o.attrs.name);
        return true;
    } else {
        return false;
    }
}

function Loadimages(callback) {
    var sources = {
        reverso: '/images/Reverso.jpg',
        carta1: '/images/01.jpg',
        carta2: '/images/02.jpg',
        carta3: '/images/03.jpg',
        carta4: '/images/04.jpg',
        carta5: '/images/05.jpg',
        carta6: '/images/06.jpg',
        carta7: '/images/07.jpg',
        carta8: '/images/08.jpg',
        carta9: '/images/09.jpg',
        carta10: '/images/10.jpg',
        carta11: '/images/11.jpg',
        carta12: '/images/12.jpg',
        carta13: '/images/13.jpg',
        carta14: '/images/14.jpg',
        carta15: '/images/15.jpg',
        carta16: '/images/16.jpg',
        carta17: '/images/17.jpg',
        carta18: '/images/18.jpg',
        carta19: '/images/19.jpg',
        carta20: '/images/20.jpg',
        carta21: '/images/21.jpg',        
        carta1r: '/images/01r.jpg',
        carta2r: '/images/02r.jpg',
        carta3r: '/images/03r.jpg',
        carta4r: '/images/04r.jpg',
        carta5r: '/images/05r.jpg',
        carta6r: '/images/06r.jpg',
        carta7r: '/images/07r.jpg',
        carta8r: '/images/08r.jpg',
        carta9r: '/images/09r.jpg',
        carta10r: '/images/10r.jpg',
        carta11r: '/images/11r.jpg',
        carta12r: '/images/12r.jpg',
        carta13r: '/images/13r.jpg',
        carta14r: '/images/14r.jpg',
        carta15r: '/images/15r.jpg',
        carta16r: '/images/16r.jpg',
        carta17r: '/images/17r.jpg',
        carta18r: '/images/18r.jpg',
        carta19r: '/images/19r.jpg',
        carta20r: '/images/20r.jpg',
        carta21r: '/images/21r.jpg',
    };


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

function Muestra_cartas(images) {

    group_baraja.visible(false);
    group_baraja.destroy();

    var cartas = group_escogidas.find('Image');

    var escala = (stage.getWidth() - 20)/2;

    escala = escala / cartas[0].width();

    var imageObj = new Image();



    //animacion para mostrar carta escogida 1

    var imageObj = images[cartas[0].id()+"r"];
        var imageObj1 = images[cartas[1].id()+"r"];



    var tl = new TimelineLite();
    tl.to(cartas[0], 1, {
        kinetic: {
            x: 0,
            y: (stage.getHeight() - cartas[0].height() * escala) / 2,
            scale: escala
        },
        ease: Power4.easeOut
    })
        .to(cartas[0], 1, {
            kinetic: {
                x: cartas[0].width() * escala,
                scaleX: 0
            },
            onComplete: function() {
                cartas[0].setImage(imageObj);
            }
        })
        .to(cartas[0], 1, {
            kinetic: {
                scaleX: -escala
            }
        });

    // var tl = new TimelineLite();
    // tl.to(cartas[0], 1, {
    //     kinetic: {
    //         x: 0,
    //         y: (stage.getHeight() - cartas[0].height() * escala) / 2,
    //         scale: escala
    //     },
    //     ease: Power4.easeOut
    // })
    //     .to(cartas[0], 1, {
    //         kinetic: {
    //             x: cartas[0].width() * escala,
    //             scaleX: 0
    //         },
    //         onComplete: function() {
    //             cartas[0].setImage(imageObj);
    //         }
    //     })
    //     .to(cartas[0], 1, {
    //         kinetic: {
    //             scaleX: -escala
    //         }
    //     });

    // animacion para mostrar carta escogida 2



    var tl2 = new TimelineLite();
    tl.to(cartas[1], 1, {
        kinetic: {
            x: cartas[1].width() * escala + 20,
            y: (stage.getHeight() - cartas[1].height() * escala) / 2,
            scale: escala
        },
        ease: Power4.easeOut
    })
        .to(cartas[1], 1, {
            kinetic: {
                x: (cartas[1].width() * escala * 2) + 20,
                scaleX: 0
            },
            onComplete: function() {
                cartas[1].setImage(imageObj1);
            }
        })
        .to(cartas[1], 1, {
            kinetic: {
                scaleX: -escala
            }
        });
}



function Inicializa_mesa(images) {

    stage = new Kinetic.Stage({
        container: 'lienzo',
        width: $("#lienzo").width(),
        height: (window.innerHeight / 100) * 80,
    });

    group_baraja = new Kinetic.Group();
    group_escogidas = new Kinetic.Group();
    layer = new Kinetic.Layer();
    var lastcarta;
    var eleccion_activa;
    var last_pos_y;
    var offset = 100;
    var angle_start = 350;
    var angle = 0;
    var radius = 50;

    var lista = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    shuffleArray(lista);

    for (var n = 1; n < 22; n++) {
        (function() {


            var imageObj = new Image();

            // imageObj.src = '/images/Reverso.jpg';
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

            // rectangle.on('mouseover ', function(evt) {
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

            rectangle.on("dragstart", function() {
                rectangle.startingPos = rectangle.position();
                $("footer h1").html("Draggin....");
            })
            rectangle.on('dragmove', function() {
                var posicion = stage.getPointerPosition();
                if (rectangle.getY() > (rectangle.attrs.oy + 100)) {
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

    eleccion_activa = carta_escogida1;
        layer.add(carta_escogida1_shadow);
    layer.add(carta_escogida1);

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
    layer.add(carta_escogida2_shadow);
    layer.add(carta_escogida2);

    layer.add(group_escogidas);
    layer.add(group_baraja);


    stage.add(layer);

    stage.draw();

    return (stage);

}



$(document).ready(function() {
    Loadimages(Inicializa_mesa);
    $("#reset").click(function() {
        Loadimages(Inicializa_mesa);
    });
    $("#info").click(function() {
        Loadimages(Muestra_cartas);
    });




});