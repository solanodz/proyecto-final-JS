// Declaracion de variables
const dineroActual = document.getElementById("dinero-actual");
const dineroMas = document.getElementById("dinero-plus");
const dineroMenos = document.getElementById("dinero-minus");
const lista = document.getElementById('lista');
const form = document.getElementById('form');
const text = document.getElementById('text');
const cantidad = document.getElementById('cantidad');

const LSTransaction = JSON.parse(localStorage.getItem('transacciones'));

let transacciones = localStorage.getItem('transacciones') != null ? LSTransaction : [];

// Agregar transaccion
function agregarTransaccion(e) {
    e.preventDefault();

    if (text.value.trim() === '' || cantidad.value.trim() === '') {
        Swal.fire({
            icon: 'error',
            iconColor: '#FF4444',
            color: 'white',
            title: '¡Error!',
            text: 'Recuerda ingresar un nombre para la transacción y un valor.',
            background: '#343434',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3592FF'
        });
    } else {
        Toastify({
            text: 'Nueva transacción agregada',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            style: {
                background: '#3592ff',
            }
        }).showToast();
        const transaccion = {
            id: generarID(),
            text: text.value,
            cantidad: +cantidad.value
        };

        transacciones.push(transaccion);
        agregarTransaccionAlDOM(transaccion);
        actualizarValores();
        actualizarLS();
        text.value = '';
        cantidad.value = '';
    }
}

// Generar un ID random
function generarID() {
    return Math.floor(Math.random() * 100000000);
}
// Agregar transaccion a la lista del DOM
function agregarTransaccionAlDOM(transaccion) {
    const signo = transaccion.cantidad < 0 ? '-' : '+';

    const item = document.createElement('li');

    // Agregar una clase basada en un valor
    item.classList.add(transaccion.cantidad < 0 ? 'minus' : 'plus');

    item.innerHTML = `
    ${transaccion.text} <span>${signo}${Math.abs(transaccion.cantidad)} <div class="cantidad-boton"></span>
    <button class='boton-borrar' onclick='borrarTransaccion(${transaccion.id})'>x</button></div>
    `;

    lista.appendChild(item);
}

// Actualizar dinero actual, ingresos y gastos
function actualizarValores() {
    const cantidades = transacciones.map(transaccion => transaccion.cantidad);

    const total = cantidades.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const ingresos = cantidades
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0);

    const gastos = (
        cantidades.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1);

    dineroActual.innerText = `$${total}`;
    dineroMas.innerText = `$${ingresos}`;
    dineroMenos.innerText = `$${gastos}`;

}

// Borrar transacciones por ID
function borrarTransaccion(id) {
    transacciones = transacciones.filter(transaccion => transaccion.id !== id);

    actualizarLS();

    iniciar();
}

// Actualizar transacciones del Local Storage
function actualizarLS() {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
}

// iniciar aplicacion
function iniciar() {
    lista.innerHTML = '';
    transacciones.forEach(agregarTransaccionAlDOM);
    actualizarValores();
}

iniciar();

form.addEventListener('submit', agregarTransaccion);

// Cotizacion del dolar y euro con API
function obtenerDolar() {
    const URLDOLAR = "https://api.bluelytics.com.ar/v2/latest";
    fetch(URLDOLAR)
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
            const cotizacionesBlue = datos.blue;
            const ultimaActualizacion = datos.last_update;
            document.getElementById('actualizacion').innerText = `(última actualización: ${ultimaActualizacion})`;
            document.getElementById('cotizaciones').innerText = `
            Dolar promedio: $${cotizacionesBlue.value_avg}
            Dolar compra: $${cotizacionesBlue.value_buy}
            Dolar venta: $${cotizacionesBlue.value_sell}
            `;
        })
}
obtenerDolar()

// fucnion para cambiar de peso a dolar blue
function convertirPesosADolarBlue() {
    const pesosInput = document.getElementById('pesos-input');
    const pesos = parseFloat(pesosInput.value);

    fetch('https://api.bluelytics.com.ar/v2/latest')
        .then(response => response.json())
        .then(data => {
            const dolarBlue = data.blue.value_buy;
            const conversion = pesos / dolarBlue;
            const resultado = document.getElementById('resultado');
            resultado.textContent = `AR$${pesos} equivalen a aproximadamente $${conversion.toFixed(2)} dólares blue.`;
        })
        .catch(error => {
            console.error('Ocurrió un error al obtener los datos:', error);
        });
}

// Obtener referencia al botón de conversión
const convertirBtn = document.getElementById('comprar-btn');
convertirBtn.addEventListener('click', convertirPesosADolarBlue);






// funcion para convertir de dolar blue a peso
function convertirDolarAPeso() {
    const dolaresInput = document.getElementById('dolares-input');
    const dolares = parseFloat(dolaresInput.value);

    fetch('https://api.bluelytics.com.ar/v2/latest')
        .then(response => response.json())
        .then(data => {
            const dolarBlue = data.blue.value_sell;
            const conversion = dolares * dolarBlue;
            const resultado = document.getElementById('resultado2');
            resultado.textContent = `$${dolares} dólares equivalen a aproximadamente AR$${conversion.toFixed(2)} pesos argentinos (dólar blue).`;
        })
        .catch(error => {
            console.error('Ocurrió un error al obtener los datos:', error);
        });
}

// Obtener referencia al botón de conversión
const convertirBtn2 = document.getElementById('vender-btn');
convertirBtn2.addEventListener('click', convertirDolarAPeso);





/* // Obtener el div
var div = document.getElementById('miDiv');

// Función para verificar y ajustar el scroll
function ajustarScroll() {
    // Obtener la altura del contenido del div
    var alturaContenido = div.scrollHeight;

    // Verificar si el contenido supera la altura máxima
    if (alturaContenido > parseInt(getComputedStyle(div).maxHeight)) {
        div.classList.add('scrollable'); // Aplicar la clase CSS para mostrar el scroll
    } else {
        div.classList.remove('scrollable'); // Remover la clase CSS si no es necesario el scroll
    }
}

// Ejecutar la función cuando se agreguen elementos al div
// Aquí debes agregar tu lógica para agregar elementos al div
// Después de agregar los elementos, llama a la función ajustarScroll()
ajustarScroll(); */