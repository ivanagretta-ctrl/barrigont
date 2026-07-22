db.collection("platillos").onSnapshot((datos) => {
    datos.docChanges().forEach((registro) => {
        if (registro.type === "added") {
            mostrarPlatillo(registro.doc.data(), registro.doc.id);
        }
        if (registro.type === "modified") {
            actualizarPlatillo(registro.doc.data(), registro.doc.id);
        }
        if (registro.type === "removed") {
            borrarPlatillo(registro.doc.id);
        }
    });
});

const formularioAgregar = document.querySelector("form");
formularioAgregar.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const platilloNuevo = {
        nombre: formularioAgregar.title.value,
        ingredients: formularioAgregar.ingredients.value, // Asegúrate de que coincida con el id de tu HTML
        precio: formularioAgregar.price.value
    }
    
    db.collection("platillos").add(platilloNuevo)
    .catch((error) => {
        console.log(error);
        alert("Error al agregar platillo");
    });
    
    formularioAgregar.title.value = "";
    formularioAgregar.ingredients.value = "";
    formularioAgregar.price.value = "";
    alert("Platillo agregado");
});

const platilloBorrar = document.querySelector(".recipes"); 
platilloBorrar.addEventListener("click", (e) => {
    if (e.target.tagName === "I") {
        const id = e.target.getAttribute("data-id");

        if (confirm("¿Estás seguro de que deseas borrar este platillo?")) {
            db.collection("platillos").doc(id).delete();
        }
    }
});