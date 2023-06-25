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
        alert('Por favor, ingresa un texto que describa la transaccion y la cantidad de dinero.');
    } else {
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