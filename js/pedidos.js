document.addEventListener('DOMContentLoaded', function() {

  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, { edge: 'right' });

  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, { edge: 'left' });

});

let contenidoLista = '';

db.collection("platillos").onSnapshot((datos) => {
    // Se inicializa el contenido con la opción por defecto en cada cambio
    contenidoLista = '<option value="" disabled selected>Selecciona un platillo</option>';

    datos.docChanges().forEach((registro) => {
        if (registro.type === "added") {
            agregarALista(registro.doc.data(), registro.doc.id);
        }
    });
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
});

function agregarALista(platillo, id) {
    contenidoLista += `<option value='${id}'>
        ${platillo.nombre}
    </option>`;
    // Se corrigió el ID a 'ListaPlatillos' para que coincida con el formulario
    document.getElementById("ListaPlatillos").innerHTML = contenidoLista;
}

// --- SE AGREGÓ LA LOGÍSTICA DEL ENVÍO DEL PEDIDO ---
const formPedido = document.querySelector("#form-pedido");

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

            alert("Pedido agregado");
        })
        .catch((error) => {
            console.error("Error al agregar pedido:", error);
            alert("Error al agregar pedido");
        });
});

// --- CÓDIGO DE GEOLOCALIZACIÓN IMPLEMENTADO ---

M.AutoInit();

document.getElementById("obtenerUbicacion").addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(exito, error);
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }
});

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
        document.getElementById("direccion").value = `${ciudad}, ${pais}`;
        
        var map = L.map('mapa').setView([latitud, longitud], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        var marker = L.marker([latitud, longitud]).addTo(map);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function error(err) {
    alert("No se pudo obtener la ubicación.");
    console.error(err);
}