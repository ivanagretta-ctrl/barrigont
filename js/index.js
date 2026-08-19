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
    if (platillo && platillo.foto) {
        fotoPlatillo = platillo.foto.startsWith("data:") || platillo.foto.startsWith("http") || platillo.foto.startsWith("img/")
            ? platillo.foto 
            : "data:image/png;base64, " + platillo.foto;
    } else {
        fotoPlatillo = "img/no-image.png";
    }

    contenido = `
        <div class="card-panel recipe white row" id="${id}">
            <img src="${fotoPlatillo}" height="100px" width="100px" alt="${platillo.nombre || 'Platillo'}">
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


// ------------------- CÁMARA -------------------

let streaming = false;
const width = 320;
let height = 0;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const foto = document.getElementById('foto');
const btnCamara = document.getElementById('btnCamara');
const btnCapturar = document.getElementById('btnCapturar');
const btnLimpiar = document.getElementById('btnLimpiar');

// Iniciar cámara
btnCamara.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }, // cámara trasera
            audio: false
        });
        video.srcObject = stream;
        video.play();
    } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        alert("No se pudo abrir la cámara. Verifica permisos y HTTPS.");
    }
});

// Ajustar tamaño cuando el video esté listo
video.addEventListener("canplay", () => {
    if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);
        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
    }
});

// Capturar foto
function tomarFoto() {
    const contexto = canvas.getContext("2d");
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        contexto.drawImage(video, 0, 0, width, height);
        const fotoFinal = canvas.toDataURL("image/png");
        foto.setAttribute("src", fotoFinal);
        document.getElementById("fotoInput").value = fotoFinal;

        // Ocultar cuadro de cámara
        document.getElementById("Camera").style.display = "none";
    } else {
        limpiarFoto();
    }
}

// Limpiar foto y reiniciar cámara
function limpiarFoto() {
    foto.setAttribute("src", "img/default.jpg");
    document.getElementById("fotoInput").value = "img/default.jpg";

    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
    const cameraContainer = document.getElementById("Camera");
    cameraContainer.style.display = "block";
    video.pause();
    video.removeAttribute("src");
    video.load();
}

// Botones
btnCapturar.addEventListener("click", (e) => {
    e.preventDefault();
    tomarFoto();
});

btnLimpiar.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarFoto();
});
