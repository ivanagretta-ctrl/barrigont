document.addEventListener('DOMContentLoaded', function() {
  // Inicialización de Menús Laterales
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, { edge: 'right' });

  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, { edge: 'left' });

  M.AutoInit();
});

let contenidoLista = '';
let mapInstance = null; // Guardar la referencia del mapa para evitar re-inicialización

// Cargar platillos desde Firestore
db.collection("platillos").onSnapshot((datos) => {
  contenidoLista = '<option value="" disabled selected>Selecciona un platillo</option>';

  datos.docChanges().forEach((registro) => {
    if (registro.type === "added") {
      agregarALista(registro.doc.data(), registro.doc.id);
    }
  });
  
  const elems = document.querySelectorAll('select');
  M.FormSelect.init(elems);
});

function agregarALista(platillo, id) {
  contenidoLista += `<option value='${id}'>${platillo.nombre}</option>`;
  document.getElementById("ListaPlatillos").innerHTML = contenidoLista;
}

// Envío del Pedido
const formPedido = document.querySelector("#form-pedido");

if (formPedido) {
  formPedido.addEventListener("submit", (e) => {
    e.preventDefault();

    const pedidoNuevo = {
      platillo: formPedido.ListaPlatillos.value,
      nombrec: formPedido.nombre.value,
      direccion: formPedido.direccion.value
    };

    db.collection("pedidos")
      .add(pedidoNuevo)
      .then(() => {
        formPedido.reset();

        const select = document.querySelector("#ListaPlatillos");
        select.selectedIndex = 0;
        M.FormSelect.init(select);

        alert("Pedido agregado con éxito");
      })
      .catch((error) => {
        console.error("Error al agregar pedido:", error);
        alert("Error al agregar el pedido");
      });
  });
}

// Geolocalización y Mapa
const btnUbicacion = document.getElementById("obtenerUbicacion");
if (btnUbicacion) {
  btnUbicacion.addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(exito, error);
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  });
}

function exito(posicion) {
  let latitud = posicion.coords.latitude;
  let longitud = posicion.coords.longitude;

  fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`, {
    headers: {
      "User-Agent": "UberEatsCUDECHelheim-k (helheimkika@hotmail.com)"
    }
  })
  .then(respuesta => respuesta.json())
  .then(data => {
    let ciudad = data.address.city || data.address.town || data.address.village || "";
    let pais = data.address.country || "";
    let direccionTexto = `${ciudad}, ${pais}`;
    
    document.getElementById("direccion").value = direccionTexto;

    // Control de re-inicialización del mapa
    if (mapInstance !== null) {
      mapInstance.remove();
    }

    mapInstance = L.map('mapa').setView([latitud, longitud], 13);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    L.marker([latitud, longitud]).addTo(mapInstance);

    // Generar Código QR (si el contenedor existe)
    const qrContainer = document.getElementById("test");
    if (qrContainer) {
      qrContainer.innerHTML = ""; // Limpiar QR previo
      new QRCode(qrContainer, {
        text: direccionTexto,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  })
  .catch(err => {
    console.error("Error obteniendo la dirección:", err);
  });
}

function error(err) {
  alert("No se pudo obtener la ubicación.");
  console.error(err);
}