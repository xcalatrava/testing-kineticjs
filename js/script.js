function isNearOutline(carta, carta_escogida) {
        var a = carta;
        var o = carta_escogida;
        var ax = a.getX();
        var ay = a.getY();
        var ox = o.getX();
        var oy = o.getY();

        
        
        if(ax > ox - 50 && ax < ox + 50 && ay > oy - 50 && ay < oy + 50) {
          $("footer h1").html(a.attrs.id + " en " + o.attrs.name);
          return true;
        }
        else {
          return false;
        }
}

function Loadimages(){
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
    };


        var images = {};
        var loadedImages = 0;
        var numImages = 0;
        for(var src in sources) {
          numImages++;
        }
        for(var src in sources) {
          images[src] = new Image();
          images[src].src = sources[src]; 
        }
        return(images);
}



function Inicializa_mesa(mesa) {
	if(mesa){
		mesa.destroy();
	}

      var stage = new Kinetic.Stage({
        container: 'lienzo',
        width: $("#lienzo").width(),
        height: (window.innerHeight/100 )* 80,
      });

      var group = new Kinetic.Group();
      var layer = new Kinetic.Layer();
      var lastcarta;
      var eleccion_activa;
      var last_pos_y;
      var offset = 100;
      var angle_start = 350;
      var angle = 0;
      var radius = 50;

      for(var n = 1; n < 22; n++) {
      	(function() {

      		var imageObj = new Image();
			    imageObj.src = '/images/Reverso.jpg';


			  var rectangle = new Kinetic.Image({
		          // x: Math.floor(((stage.getWidth() - 100) / 22) * n),
		          // y: Math.floor(17 + Math.random() * 20),
		          // ox: Math.floor(((stage.getWidth() - 100) / 22) * n),
		          // oy:  Math.floor(17 + Math.random() * 20),
              x: (stage.getWidth()/2- 5),
              y:  -200 + Math.random() * 20,
              ox: (stage.getWidth()/2- 5),
              oy:  -200 + Math.random() * 20,
		          width: 100,
		          height: 163,
              stroke: 'black',
              strokeWidth: 1,
		          // fill: 'red',
		          name: 'carta',
		          id: 'carta' + n,
		          escogida: false,
		          draggable: false,
			        image: imageObj,
              offset: {x:50, y: -225},
              rotation: 18 - (1.7 * n),
              or: 18 - (1.7 * n)


			  });

            // rectangle.rotate(18 - (1.7 * n));

	  //       var rectangle = new Kinetic.Rect({
	  //         x: Math.floor(((stage.getWidth() - 100) / 22) * n),
	  //         y: Math.floor(17 + Math.random() * 20),
	  //         ox: Math.floor(((stage.getWidth() - 100) / 22) * n),
	  //         oy:  Math.floor(17 + Math.random() * 20),
	  //         width: 100,
	  //         height: 163,
	  //         // fill: 'red',
	  //         stroke: 'black',
	  //         strokeWidth: 1,
	  //         name: 'carta',
	  //         id: 'carta' + n,
	  //         escogida: false,
	  //         draggable: false,
	  //         fillPriority: 'pattern',
	  //         fillPatternImage: imageObj,
	  //       });
	  //       rectangle.fillPatternScale({
			// 	  x: 1/6,
			// 	  y: 1/6
			// });
      // rectangle.on('mouseover ', function(evt) {
			rectangle.on('mouseover touchmove', function(evt) {
			    var posicion = stage.getPointerPosition();

			    $("footer h1").html(rectangle.getId() + "x:" + posicion.x + " y:" + posicion.y);
			    if (typeof(lastcarta) != "undefined" && lastcarta != rectangle && lastcarta.attrs.escogida === false){
			    	// lastcarta.setPosition({
			    	// 	x: lastcarta.attrs.ox,
			    	// 	y: lastcarta.attrs.oy,
			    	// })
            lastcarta.offset({x:50, y: -225});
			    	lastcarta.setDraggable(false);

			    }
			    if(!rectangle.attrs.escogida){
    					// rectangle.setPosition({
    					// 	x: rectangle.attrs.ox,
    					// 	y: rectangle.attrs.oy + 50,
    					// });
              rectangle.offset({x:50, y: -270});
    					rectangle.setDraggable(true);

    					lastcarta = rectangle;
				  }

          // if (posicion.y - last_pos_y > 30){
          //   rectangle.dispatchEvent('dragstart');
          // }
                      layer.draw();
                      last_pos_y = posicion.y


			    // }
			});
      rectangle.on('dragmove', function(){
        var posicion = stage.getPointerPosition();
        if (rectangle.getY()> (rectangle.attrs.oy + 100)){
            rectangle.rotation(0);
            rectangle.setPosition({
                x:posicion.x - 25,
                y:posicion.y  - 82
              });
            rectangle.offsetY(0);
        } else{
          rectangle.rotation(rectangle.attrs.or);
          rectangle.offsetY(-270);
        }
        layer.draw();
      });

			rectangle.on('dragend', function() {

              if(eleccion_activa && isNearOutline(rectangle, eleccion_activa)) {
                rectangle.setPosition({
                	x:eleccion_activa.getX(), 
                	y:eleccion_activa.getY()
                });
                rectangle.offset({x:0,y:0});

                if(eleccion_activa === carta_escogida1){
                	eleccion_activa = carta_escogida2;
                } else {
                	eleccion_activa = undefined;
                }

                rectangle.setDraggable(false);
                rectangle.attrs.escogida = true;
                rectangle.moveToBottom();
              }else{
	              rectangle.setPosition({
	                	x:rectangle.attrs.ox, 
	                	y:rectangle.attrs.oy,
	                });	
                rectangle.rotation(rectangle.attrs.or);
                rectangle.offset({x:50,y:-225});
              }

              layer.draw();
            });

        group.add(rectangle);
     	})();
     }


			// group.on('mouseout touchstop', function(evt){
			// 	for()
			// })

      var carta_escogida1 = new Kinetic.Rect({
          x: Math.floor((stage.getWidth() - 220) / 2),
          y: Math.floor(stage.getHeight() - 180),
          width: 100,
          height: 163,
          fill: 'blue',
          stroke: 'black',
          strokeWidth: 3,
          name: 'carta_escogida1',
          draggable: false
      })

      eleccion_activa = carta_escogida1;
      layer.add(carta_escogida1);

      var carta_escogida2 = new Kinetic.Rect({
          x: carta_escogida1.attrs.x + 100 + 20,
          y: carta_escogida1.attrs.y,
          width: 100,
          height: 163,
          fill: 'grey',
          stroke: 'black',
          strokeWidth: 3,
          name: 'carta_escogida2',
          draggable: false
      })

      layer.add(carta_escogida2);

      layer.add(group);

      stage.add(layer);

      stage.draw();

      return (stage);

}



$(document).ready(function() {
	var mesa = Inicializa_mesa(mesa);
	$("#reset").click(function(){
		Inicializa_mesa(mesa);
		});




});