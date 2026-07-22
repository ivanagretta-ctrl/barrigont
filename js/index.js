let contenido = "";

document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

function mostrarPlatillo(platillo, id) {
    let fotoPlatillo;
    if (platillo.foto) {
        fotoPlatillo = "data:image/png;base64, " + platillo.foto;
    } else {
        fotoPlatillo = "img/no-image.png";
    }

    // CORRECCIÓN: Usamos un '=' simple en lugar de '+=' para evitar la duplicación
    contenido = `
        <div class="card-panel recipe white row" id="${id}">
        <img src="${fotoPlatillo}" height="100px" width="100px">
            <div class="recipe-details">
                <div class="recipe-title">
                    ${platillo.nombre}
                </div>
                <div class="recipe-ingredients">
                    ${platillo.ingredientes}
                </div>
                <div class="recipe-price">
                    ${platillo.precio}
                </div>
            </div>
            <div class="recipe-delete">
                <i class="material-icons" data-id="${id}">delete_outline</i>
            </div>
        </div>
    `;
    document.querySelector(".recipes").innerHTML += contenido;
}

function actualizarPlatillo(platillo, id) {
    let tarjeta = document.getElementById(`${id}`);
    tarjeta.querySelector('.recipe-title').innerHTML = platillo.nombre;
    tarjeta.querySelector('.recipe-ingredients').innerHTML = `ingredientes: ${platillo.ingredientes}`;
    tarjeta.querySelector('.recipe-title').innerHTML = `$${platillo.precio}`;
}

const borrarPlatillo = (id) => {
    const platillo = document.querySelector(`.recipe[data-id='${id}']`);
    platillo.remove();
};

function agregarLista(platillo, id) {
    contenidoLista = `
        <option value="${id}">${platillo.nombre} ${platillo.precio}</option>
    `;
    document.getElementById("listaPlatillos").innerHTML += contenidoLista;
}


// Camara - VARIABLES DECLARADAS PARA CORREGIR EL ERROR

let streaming = false;
const width = 320;
let height = 0;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const foto = document.getElementById('foto');
const bntFoto = document.getElementById('btnFoto');

video.setAttribute("height", height);
streaming = true;

function tomarFoto() {
    const contexto = canvas.getContext("2d");
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        contexto.drawImage(video, 0, 0, width, height);
        const fotoFinal = canvas.toDataURL("image/png");
        foto.setAttribute("src", fotoFinal);
    } else {
        limpiarFoto();
    }
}

function limpiarFoto() {
    
}