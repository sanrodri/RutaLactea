//con esto rastreamos las partes donde deseamos capturar informacion
const milkQuantityInput = document.querySelector("#milkQuantity");
const milkPriceInput = document.querySelector("#milkPrice");
const totalAmount = document.querySelector("#totalAmount");
const totalDetail = document.querySelector("#totalDetail");
//Escuchadores 
//encargados del texto "input" -> calcula el total
milkQuantityInput.addEventListener("input",calculeTotal);
milkPriceInput.addEventListener("input",calculeTotal);
//encargados  de cuando presionan una tecla "Keydown" -> revisa si hay que bloquearla
milkQuantityInput.addEventListener("keydown",blockInvalidKeys);
milkPriceInput.addEventListener("keydown",blockInvalidKeys);

//Calcula el monto  total 
function calculeTotal() {

    const litros = Number(milkQuantityInput.value);
    const precio = Number(milkPriceInput.value);

    const total = litros * precio ;
    totalAmount.textContent = "$ " + total.toLocaleString("es-CO");

//modificador del "totalDetail" ,este cambia depiendo de los datos ingresados 
    if (litros <= 0 && precio <= 0) {
        // faltan los dos
        totalDetail.textContent = "Ingresa litros y precio";

    } else if (precio <= 0) {
        // hay litros pero falta el precio
        totalDetail.textContent = litros.toLocaleString("es-CO") + " L · falta el precio por litro";

    } else if (litros <= 0) {
        // hay precio pero falta la cantidad
        totalDetail.textContent = "$ " + precio.toLocaleString("es-CO") + " · falta la cantidad de leche";

    } else {
        // estan los dos
        totalDetail.textContent = litros.toLocaleString("es-CO") + " L × $ " + precio.toLocaleString("es-CO");
    }
}

//bloquea las teclas que no sirven para numeros de leche y precio
function blockInvalidKeys(event) {

    const isInvalidKey = ["-", "+", "e", "E"].includes(event.key);

    if (isInvalidKey) {
        event.preventDefault();
    }
}

// Guardar la entrega 
const form = document.querySelector("form");
form.addEventListener("submit", saveDelivery);

async function saveDelivery(event) {
    event.preventDefault(); // que la página no se recargue

    // 1. Armar un objeto con los datos del formulario
    const entrega = {
        ruta: document.querySelector('input[name="routeSelection_name"]:checked').value,
        cliente: document.querySelector("#client").value.trim(),
        litros: Number(milkQuantityInput.value),
        precio: Number(milkPriceInput.value),
        fecha: document.querySelector("#deliveryDate").value
    };

    // 2. Enviarlo al servidor
    const respuesta = await fetch("/api/entregas", {
        method: "POST",                                   // vamos a ENVIAR datos
        headers: { "Content-Type": "application/json" },  // le avisamos que van en JSON
        body: JSON.stringify(entrega)                     // convertimos el objeto a texto JSON
    });

    // 3. Revisar si se guardó
    if (respuesta.ok) {
        alert("Entrega registrada ");
        form.reset();     // limpia el formulario
        calculeTotal();   // el total vuelve a $ 0
    } else {
        alert("No se pudo guardar la entrega ");
    }
}
