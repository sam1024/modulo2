let in_storage = true, _itemsInCar = 0;
var articulos = [
  {
    id: 1,
    foto: "img/alien.jpeg",
    descripcion: "DELL Alienware LAP15 Ci5-7300 8GB 1TB",
    precio: "45664.56"
  },
  {
    id: 2,
    foto: "img/pc.jpg",
    descripcion: "Lanix TITAN Ci5-7300 8GB 1TB",
    precio: "25664.56"
  },
  {
    id: 3,
    foto: "img/lap.jpg",
    descripcion: "LAP15 Ci5-7300 8GB 1TB",
    precio: "15664.56"
  },
  {
    id: 4,
    foto: "img/imac.jpg",
    descripcion:"iMAC Apple Ci5-7300 8GB 1TB",
    precio: "65664.56"
  },
  {
    id: 5,
    foto: "img/dimm.jpg",
    descripcion: "Memoria RAM DDR4 8GB",
    precio: "664.56"
  },
  {
    id: 6,
    foto: "img/sodimm.jpg",
    descripcion: "Memoria SODIMM DDR3 4GB",
    precio: "454.56"
  },
  {
    id: 7,
    foto: "img/ssd.jpg",
    descripcion: "SSD Kingston 1TB",
    precio: "5664.56"
  },
  {
    id: 8,
    foto: "img/tablets.jpg",
    descripcion: "Tablet 16GB",
    precio: "8664.56"
  }
];

/************************************************************************************************/
/************* ESTA FUNCION ANONIMA ES LA QUE SE EJECUTA CUANDO SE CARGA LA PAGINA **************/
/************************************************************************************************/
$(function() {
  /**** ESTE FOR ES PARA CARGAR LOS DATOS DEL ARREGLO articulos EN LA PAGINA ****/
  for(i = 0; i < articulos.length; i++) {
    let precio = parseFloat(articulos[i].precio);
    $("#lst_articulos").append(
      `<div class="card">
        <img src=${articulos[i].foto} alt="">
        <p class="descripcion">${articulos[i].descripcion}</p>
        <p class="precio">$ ${precio.toLocaleString()}</p>
        <button class="btn_addcart" id="add" onClick=addCart(${articulos[i].id}); >Agregar al carrito</button>
      </div>`
    );
  }

  /**** ESTA CONDICION COMPRUEBA SI TENEMOS DATOS ALMACENADOS EN EL localStorage ****/
  if (localStorage.getItem("articulo") === null) {
      $("#num_items_cart").html("0");
      in_storage = false;
  } else {
    $("#num_items_cart").html(JSON.parse(localStorage.getItem("articulo")).length);
  }

});
/**************************************************************************************************/
/************************* LLAVE DE CIERRE DE LA FUNCION PRINCIPAL ********************************/
/**************************************************************************************************/

/**** ESTA FUNCION AGREGA LOS ELEMENTOS AL CARRITO ****/
function addCart(id_articulo) {
  $("#contenido").empty();
  let _arrArtTmp = [], art;

  /* CON EL METODO find DEL ARREGLO BUSCAMOS EL ARTICULO, ESTE METODO RECIBE COMO PARAMETRO UNA FUNCION,
  EN ESTE CASO LE ESTAMOS PASANDO UNA FUNCION DE FLECHA Y LE PASMOS UN PARAMETRO (id_find)
  ESTE METODO GUARDARA EN FORMATO JSON LOS DATOS ENCONTRADOS EN LA CONSTANTE resultado, ESTA BUSQUEDA
  SE HARA MEDIANTE EL ID (VARIABLE id_articulo), EN CASO DE QUE EL ID QUE BUSQUEMOS NO EXISTA NOS REGRESARÁ
  EL VALOR DE undefined */
  const resultado = articulos.find(id_find => id_find.id == id_articulo );

  /**** ANTES DE AGREGAR AL ARREGLO EL CONTENIDO DE LA CONSTANT resultado USA UN IF PARA COMPROBAR
  QUE ESTA NO SEA undefined ****/
  console.log(resultado);
  if (resultado !== undefined) {

    /**** BUSCAR EN AL _arrArtTmp SI EL PRODUCTO YA EXISTE EN EL localStorage ****/
    if(in_storage) {
      /**** SI YA TENEMOS DATOS EN EL localStorage, LOS ALMACENAMOS EN UNA VARIABEL TIPO ARRAY Y
      BUSCAMOS EL ELEMENTO DENTRO DEL ARREGLO ****/
      _arrArtTmp = JSON.parse(localStorage.getItem("articulo"));
      let exist = _arrArtTmp.find(element => element.id == resultado.id);
      /**** SI EL ELEMENTO YA EXISTE EN EL CARRITO NO LO AGREGAMOS, SOLO ACTUALIZAMOS LA CANTIDAD ****/
      if (exist !== undefined) {
        let cant = parseInt(exist.cant += 1);
        let total = parseFloat(exist.precio) * cant;
        exist.cant = cant;
        exist.total = total;
      } else {
        /**** SI EL ELEMENTO NO EXISTE EN EL CARRITO LO AGREGAMOS ****/
        _arrArtTmp.push(stringToJson(resultado.id, resultado.foto, resultado.descripcion, 1, resultado.precio));
      }
    } else {
      /**** SI EL CARRITO ESTA VACIO AGREGAMOS EL ELEMENTO ****/
      _arrArtTmp.push(stringToJson(resultado.id, resultado.foto, resultado.descripcion, 1, resultado.precio));
      location.reload();
    }

  }

  localStorage.setItem("articulo", JSON.stringify(_arrArtTmp));
  $("#num_items_cart").html(JSON.parse(localStorage.getItem("articulo")).length);
}

let stringToJson = (id, foto, desc, cant, precio) => {
  _objJson = {
      id: id,
      foto: foto,
      desc: desc,
      cant: cant,
      precio: precio,
      total: precio
    }
  return _objJson;
}

/**************************************************************************************************/
/************ ESTO MUESTRA LA VENTANA MODAL Y CARGA LOS DATOS EN LA MISMA *************************/
/**************************************************************************************************/
$("#num_items_cart").on("click", function() {
  let _articulosTmp = JSON.parse(localStorage.getItem("articulo")), total = parseFloat("0");
  for(let art of _articulosTmp) {
    //total = parseFloat(art.total);
    $("#contenido").append(
      `<div class="card" id="${art.id}">
        <img src=${art.foto} />
        <p>${art.desc}</p>
        <p class="precio" id="total_art">$ ${parseFloat(art.total).toLocaleString()}</p>
        <div id="cantydel">
        <input class="cantidad" id="cant${art.id}" type="number" value="${art.cant}" onchange="newCant(${art.id}, ${art.total})"/>
        <button class="btn_delete" onClick="removeItem(${art.id})">Eliminar</button>
      </div>
      </div>`
    );
    total += parseFloat(art.total);
  }
  $("#contenido").append(
    `<div class="footer_modal">
      <p id="total">Total: $ <span class="precio">${total.toLocaleString()}</span></p>
    </div>
    <button type="button" id="btn_close" onClick="closeModal();">Cerrar</button>`
  )
  $("#modal").css({"visibility": "visible", "opacity": "1", "transition": "2s"});
});

function closeModal() {
  $("#modal").css({"visibility": "hidden", "opacity": "0"});
}

function removeItem(id) {
  console.log(`voy a quitar el id: ${id}`);
  $(`#${id}`).css("display", "none");
}

function newCant(id, total) {
  console.log("Cantidad: " + $("#cant" + id).val() + " Total: " + total);
}
